"""
Pydantic Models for AV Calculator API

Request and response models for API endpoints.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List, Any


class CalculateRequest(BaseModel):
    """Request model for AV calculation."""

    # Core parameters (required)
    deductible_individual: float = Field(
        ...,
        ge=0,
        le=15000,
        description="Individual deductible amount ($0-$15,000)"
    )
    deductible_family: float = Field(
        ...,
        ge=0,
        le=30000,
        description="Family deductible amount ($0-$30,000)"
    )
    moop_individual: float = Field(
        ...,
        ge=0,
        le=10600,
        description="Individual maximum out-of-pocket ($0-$10,600)"
    )
    moop_family: float = Field(
        ...,
        ge=0,
        le=21200,
        description="Family maximum out-of-pocket ($0-$21,200)"
    )
    coinsurance_medical: float = Field(
        ...,
        ge=0,
        le=1,
        description="Medical coinsurance rate (0.0-1.0, e.g., 0.20 = 20%)"
    )

    # Copays (optional, default to 0)
    primary_care_copay: float = Field(
        default=0.0,
        ge=0,
        le=1000,
        description="Primary care visit copay ($0-$1,000)"
    )
    specialist_copay: float = Field(
        default=0.0,
        ge=0,
        le=1000,
        description="Specialist visit copay ($0-$1,000)"
    )
    er_copay: float = Field(
        default=0.0,
        ge=0,
        le=1000,
        description="Emergency room copay ($0-$1,000)"
    )
    urgent_care_copay: float = Field(
        default=0.0,
        ge=0,
        le=1000,
        description="Urgent care copay ($0-$1,000)"
    )
    inpatient_copay: float = Field(
        default=0.0,
        ge=0,
        le=5000,
        description="Inpatient hospital copay per admission ($0-$5,000)"
    )
    outpatient_surgery_copay: float = Field(
        default=0.0,
        ge=0,
        le=2000,
        description="Outpatient surgery copay ($0-$2,000)"
    )

    # Prescription drug copays
    generic_copay: float = Field(
        default=0.0,
        ge=0,
        le=200,
        description="Generic drug copay ($0-$200)"
    )
    preferred_brand_copay: float = Field(
        default=0.0,
        ge=0,
        le=500,
        description="Preferred brand drug copay ($0-$500)"
    )
    non_preferred_copay: float = Field(
        default=0.0,
        ge=0,
        le=500,
        description="Non-preferred brand drug copay ($0-$500)"
    )
    specialty_drug_copay: float = Field(
        default=0.0,
        ge=0,
        le=1000,
        description="Specialty drug copay ($0-$1,000)"
    )

    # Other service copays
    lab_work_copay: float = Field(
        default=0.0,
        ge=0,
        le=500,
        description="Lab work copay ($0-$500)"
    )
    imaging_copay: float = Field(
        default=0.0,
        ge=0,
        le=1000,
        description="Imaging (X-ray, MRI, CT) copay ($0-$1,000)"
    )
    physical_therapy_copay: float = Field(
        default=0.0,
        ge=0,
        le=500,
        description="Physical therapy copay per session ($0-$500)"
    )

    # Plan classification
    metal_tier: str = Field(
        default="Silver",
        description="Target metal tier (Bronze, Silver, Gold, Platinum)"
    )

    # Optional parameters
    hsa_contribution: Optional[float] = Field(
        default=0.0,
        ge=0,
        le=10000,
        description="Employer HSA/HRA contribution ($0-$10,000)"
    )

    # Service-specific coinsurance overrides
    drug_coinsurance: Optional[float] = Field(
        default=None,
        ge=0,
        le=1,
        description="Drug-specific coinsurance (if different from medical)"
    )

    # Subject to deductible flags (optional)
    primary_care_std: Optional[bool] = Field(
        default=None,
        description="Primary care subject to deductible (None = default behavior)"
    )
    specialist_std: Optional[bool] = Field(
        default=None,
        description="Specialist subject to deductible"
    )
    er_std: Optional[bool] = Field(
        default=None,
        description="ER subject to deductible"
    )
    drugs_std: Optional[bool] = Field(
        default=None,
        description="Prescription drugs subject to deductible"
    )

    @validator('metal_tier')
    def validate_metal_tier(cls, v):
        """Validate metal tier value."""
        valid_tiers = ['Bronze', 'Silver', 'Gold', 'Platinum']
        if v not in valid_tiers:
            raise ValueError(f"metal_tier must be one of {valid_tiers}")
        return v

    @validator('moop_individual')
    def validate_moop_individual(cls, v, values):
        """Validate MOOP is >= deductible."""
        if 'deductible_individual' in values:
            if v < values['deductible_individual']:
                raise ValueError(
                    "moop_individual must be >= deductible_individual"
                )
        return v

    @validator('moop_family')
    def validate_moop_family(cls, v, values):
        """Validate family MOOP is >= family deductible."""
        if 'deductible_family' in values:
            if v < values['deductible_family']:
                raise ValueError(
                    "moop_family must be >= deductible_family"
                )
        return v

    class Config:
        schema_extra = {
            "example": {
                "deductible_individual": 4000,
                "deductible_family": 10000,
                "moop_individual": 9100,
                "moop_family": 18200,
                "coinsurance_medical": 0.20,
                "primary_care_copay": 45,
                "specialist_copay": 45,
                "er_copay": 350,
                "generic_copay": 10,
                "preferred_brand_copay": 50,
                "non_preferred_copay": 75,
                "metal_tier": "Silver"
            }
        }


class CalculateResponse(BaseModel):
    """Response model for AV calculation."""

    success: bool = Field(
        ...,
        description="Whether calculation was successful"
    )
    av_percentage: float = Field(
        ...,
        description="Calculated actuarial value as percentage (e.g., 72.27)"
    )
    metal_tier: str = Field(
        ...,
        description="Calculated metal tier classification"
    )
    calculation_time_ms: float = Field(
        ...,
        description="Time taken to calculate in milliseconds"
    )
    details: Dict[str, Any] = Field(
        ...,
        description="Detailed breakdown of calculation"
    )
    warnings: Optional[List[str]] = Field(
        default=None,
        description="Any warnings generated during calculation"
    )

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "av_percentage": 72.27,
                "metal_tier": "Silver",
                "calculation_time_ms": 245.67,
                "details": {
                    "plan_pays": 2485.67,
                    "member_pays": 955.33,
                    "total_expected_cost": 3441.00,
                    "breakdown": {
                        "below_deductible": 125.45,
                        "deductible_to_moop": 875.22,
                        "above_moop": 1485.00
                    }
                }
            }
        }


class ErrorResponse(BaseModel):
    """Error response model."""

    success: bool = Field(
        default=False,
        description="Always false for errors"
    )
    error: str = Field(
        ...,
        description="Error code"
    )
    message: str = Field(
        ...,
        description="Human-readable error message"
    )
    details: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional error details"
    )

    class Config:
        schema_extra = {
            "example": {
                "success": False,
                "error": "INVALID_DEDUCTIBLE",
                "message": "Deductible must be between $0 and $15,000",
                "details": {
                    "field": "deductible_individual",
                    "value": 20000,
                    "max_allowed": 15000
                }
            }
        }


class ValidationError(BaseModel):
    """Single validation error."""

    field: str = Field(..., description="Field that failed validation")
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")


class ValidateResponse(BaseModel):
    """Response model for validation endpoint."""

    is_valid: bool = Field(
        ...,
        description="Whether plan parameters are valid"
    )
    errors: List[ValidationError] = Field(
        default_factory=list,
        description="List of validation errors (empty if valid)"
    )
    warnings: List[str] = Field(
        default_factory=list,
        description="Non-critical warnings"
    )

    class Config:
        schema_extra = {
            "example": {
                "is_valid": False,
                "errors": [
                    {
                        "field": "deductible_individual",
                        "error": "VALUE_TOO_HIGH",
                        "message": "Deductible exceeds maximum of $15,000"
                    }
                ],
                "warnings": []
            }
        }


class HealthCheckResponse(BaseModel):
    """Health check response model."""

    status: str = Field(..., description="API status")
    timestamp: str = Field(..., description="Current timestamp (ISO format)")
    version: str = Field(..., description="API version")

    class Config:
        schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2025-11-07T12:34:56.789Z",
                "version": "1.0.0"
            }
        }
