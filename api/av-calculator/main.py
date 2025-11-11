"""
FastAPI Backend for AV Calculator

REST API endpoints for calculating Actuarial Values of health insurance plans.
Integrates with Agent 5's calculation engine.
"""

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
from datetime import datetime
import logging
from typing import Optional

from .models import (
    CalculateRequest,
    CalculateResponse,
    ErrorResponse,
    HealthCheckResponse,
    ValidateResponse,
)
from .calculator import calculate_av_from_request
from .validation import validate_plan_parameters

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="AV Calculator API",
    description="REST API for calculating Actuarial Values of health insurance plans",
    version="1.0.0",
    docs_url="/api/av-calculator/docs",
    openapi_url="/api/av-calculator/openapi.json",
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://xlb.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Middleware for logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all API requests with timing."""
    start_time = time.time()

    response = await call_next(request)

    duration = (time.time() - start_time) * 1000  # Convert to milliseconds

    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Duration: {duration:.2f}ms"
    )

    return response


# Health check endpoint
@app.get(
    "/api/av-calculator/health",
    response_model=HealthCheckResponse,
    tags=["Health"],
)
async def health_check():
    """
    Health check endpoint.

    Returns API status and current timestamp.
    """
    return HealthCheckResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0",
    )


# Main calculation endpoint
@app.post(
    "/api/av-calculator/calculate",
    response_model=CalculateResponse,
    responses={
        400: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    tags=["Calculator"],
)
@limiter.limit("100/minute")
async def calculate_av(request: Request, plan: CalculateRequest):
    """
    Calculate Actuarial Value for a health insurance plan.

    This endpoint accepts plan parameters and returns the calculated AV percentage,
    metal tier classification, and detailed breakdown of plan payments.

    **Rate Limit:** 100 requests per minute per IP address

    **Parameters:**
    - deductible_individual: Individual deductible ($0-$15,000)
    - deductible_family: Family deductible ($0-$30,000)
    - moop_individual: Individual MOOP ($0-$10,600)
    - moop_family: Family MOOP ($0-$21,200)
    - coinsurance_medical: Medical coinsurance (0.0-1.0)
    - copays: Service-specific copays
    - And more...

    **Returns:**
    - av_percentage: Calculated AV as percentage (e.g., 72.27)
    - metal_tier: Metal tier classification (Bronze/Silver/Gold/Platinum)
    - calculation_time_ms: Time taken to calculate
    - details: Detailed breakdown of plan payments

    **Example:**
    ```json
    {
      "deductible_individual": 4000,
      "moop_individual": 9100,
      "coinsurance_medical": 0.20,
      "primary_care_copay": 45
    }
    ```
    """
    try:
        start_time = time.time()

        # Validate input parameters
        validation_result = validate_plan_parameters(plan)
        if not validation_result.is_valid:
            logger.warning(f"Validation failed: {validation_result.errors}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "error": "VALIDATION_ERROR",
                    "message": "Invalid plan parameters",
                    "errors": validation_result.errors,
                }
            )

        # Calculate AV
        result = calculate_av_from_request(plan)

        calculation_time_ms = (time.time() - start_time) * 1000

        logger.info(
            f"AV calculated: {result.av_percent:.2f}% "
            f"({result.metal_tier}) in {calculation_time_ms:.2f}ms"
        )

        # Build response
        response = CalculateResponse(
            success=True,
            av_percentage=result.av_percent,
            metal_tier=result.metal_tier,
            calculation_time_ms=calculation_time_ms,
            details={
                "plan_pays": result.total_plan_payment,
                "member_pays": result.total_allowed_cost - result.total_plan_payment,
                "total_expected_cost": result.total_allowed_cost,
                "breakdown": {
                    "below_deductible": result.plan_pay_below_deduct,
                    "deductible_to_moop": result.plan_pay_deduct_to_moop,
                    "above_moop": result.plan_pay_above_moop,
                },
                "adjusted_values": {
                    "deductible": result.adjusted_deductible,
                    "moop": result.adjusted_moop,
                },
                "performance": {
                    "iterations_outer": result.iterations_outer,
                    "iterations_inner": result.iterations_inner,
                },
            },
            warnings=result.warnings if result.warnings else None,
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Calculation error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": "CALCULATION_ERROR",
                "message": f"Failed to calculate AV: {str(e)}",
            }
        )


# Validation endpoint
@app.get(
    "/api/av-calculator/validate",
    response_model=CalculateResponse,
    tags=["Testing"],
)
@limiter.limit("100/minute")
async def validate_with_test_001(request: Request):
    """
    Test endpoint that validates the calculator using TEST-001 parameters.

    This endpoint runs a validation test using the SLI-SBC-4000 test plan,
    which should return 72.27% ± 0.01%.

    **Expected Result:**
    - AV: 72.27%
    - Metal Tier: Silver

    Use this endpoint to verify the calculator is working correctly.
    """
    try:
        # TEST-001: SLI-SBC-4000 parameters
        test_plan = CalculateRequest(
            deductible_individual=4000.0,
            deductible_family=10000.0,
            moop_individual=9100.0,
            moop_family=18200.0,
            coinsurance_medical=0.20,
            primary_care_copay=45.0,
            specialist_copay=45.0,
            er_copay=350.0,
            urgent_care_copay=0.0,
            generic_copay=10.0,
            preferred_brand_copay=50.0,
            non_preferred_copay=75.0,
            specialty_drug_copay=0.0,
            lab_work_copay=30.0,
            imaging_copay=0.0,
            inpatient_copay=0.0,
            metal_tier="Silver",
        )

        # Calculate
        start_time = time.time()
        result = calculate_av_from_request(test_plan)
        calculation_time_ms = (time.time() - start_time) * 1000

        # Check result
        expected_av = 72.27
        tolerance = 0.01
        is_valid = abs(result.av_percent - expected_av) <= tolerance

        logger.info(
            f"TEST-001 validation: {result.av_percent:.2f}% "
            f"(expected: {expected_av}% ± {tolerance}%) - "
            f"{'PASS' if is_valid else 'FAIL'}"
        )

        response = CalculateResponse(
            success=is_valid,
            av_percentage=result.av_percent,
            metal_tier=result.metal_tier,
            calculation_time_ms=calculation_time_ms,
            details={
                "plan_pays": result.total_plan_payment,
                "member_pays": result.total_allowed_cost - result.total_plan_payment,
                "total_expected_cost": result.total_allowed_cost,
                "breakdown": {
                    "below_deductible": result.plan_pay_below_deduct,
                    "deductible_to_moop": result.plan_pay_deduct_to_moop,
                    "above_moop": result.plan_pay_above_moop,
                },
                "expected_av": expected_av,
                "difference": abs(result.av_percent - expected_av),
                "test_status": "PASS" if is_valid else "FAIL",
            },
        )

        return response

    except Exception as e:
        logger.error(f"Validation error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": "VALIDATION_ERROR",
                "message": f"TEST-001 validation failed: {str(e)}",
            }
        )


# Error handler for validation errors
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Handle validation errors."""
    logger.warning(f"Validation error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "error": "INVALID_INPUT",
            "message": str(exc),
        }
    )


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """API root endpoint."""
    return {
        "name": "AV Calculator API",
        "version": "1.0.0",
        "docs": "/api/av-calculator/docs",
        "health": "/api/av-calculator/health",
    }


# For Vercel deployment
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
