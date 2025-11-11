# AV Calculator API

FastAPI backend for calculating Actuarial Values (AV) of health insurance plans based on CMS methodology.

## Overview

This API provides REST endpoints for calculating the Actuarial Value of health insurance plans. It integrates with the calculation engine developed by Agent 5 and provides a production-ready interface for the Next.js frontend.

## Features

- **REST API**: Clean, RESTful endpoints for AV calculation
- **Input Validation**: Comprehensive validation of plan parameters
- **Rate Limiting**: 100 requests/minute per IP to prevent abuse
- **CORS Support**: Configured for Next.js frontend integration
- **Error Handling**: Detailed error messages and validation feedback
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Health Checks**: Monitoring endpoint for deployment health
- **Logging**: Structured logging of all requests and calculations

## API Endpoints

### POST /api/av-calculator/calculate

Calculate Actuarial Value for a health insurance plan.

**Request Body:**
```json
{
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
```

**Response:**
```json
{
  "success": true,
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
    },
    "adjusted_values": {
      "deductible": 4125.30,
      "moop": 9250.15
    },
    "performance": {
      "iterations_outer": 3,
      "iterations_inner": 2
    }
  }
}
```

### GET /api/av-calculator/validate

Test endpoint that validates the calculator using TEST-001 parameters (SLI-SBC-4000).

**Response:**
```json
{
  "success": true,
  "av_percentage": 72.27,
  "metal_tier": "Silver",
  "calculation_time_ms": 187.45,
  "details": {
    "expected_av": 72.27,
    "difference": 0.0015,
    "test_status": "PASS"
  }
}
```

### GET /api/av-calculator/health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-07T12:34:56.789Z",
  "version": "1.0.0"
}
```

## Installation

### Local Development

1. **Install Dependencies:**
```bash
cd /home/sam/Documents/github-repos/xlb/xlb/api/av-calculator
pip install -r requirements.txt
```

2. **Run Development Server:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. **Access API Documentation:**
- Swagger UI: http://localhost:8000/api/av-calculator/docs
- ReDoc: http://localhost:8000/api/av-calculator/redoc
- OpenAPI Schema: http://localhost:8000/api/av-calculator/openapi.json

### Production Deployment (Vercel)

The API is configured for deployment on Vercel using serverless functions.

1. **Vercel Configuration** (`vercel.json` in project root):
```json
{
  "builds": [
    {
      "src": "xlb/api/av-calculator/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/av-calculator/(.*)",
      "dest": "xlb/api/av-calculator/main.py"
    }
  ]
}
```

2. **Deploy:**
```bash
vercel deploy
```

## Input Validation

The API validates all input parameters:

### Deductibles
- Individual: $0 - $15,000
- Family: $0 - $30,000
- Family >= Individual

### MOOP (Maximum Out-of-Pocket)
- Individual: $0 - $10,600 (2026 federal limit)
- Family: $0 - $21,200 (2026 federal limit)
- MOOP >= Deductible
- Family >= Individual

### Coinsurance
- Medical: 0% - 100%
- Drug: 0% - 100% (optional override)

### Copays
- Primary Care: $0 - $1,000
- Specialist: $0 - $1,000
- Emergency Room: $0 - $1,000
- Urgent Care: $0 - $1,000
- Inpatient: $0 - $5,000
- Generic Drugs: $0 - $200
- Brand Drugs: $0 - $500
- Specialty Drugs: $0 - $1,000

### Metal Tier
- Must be one of: Bronze, Silver, Gold, Platinum

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid plan parameters",
  "errors": [
    {
      "field": "deductible_individual",
      "error": "VALUE_TOO_HIGH",
      "message": "Deductible exceeds maximum of $15,000"
    }
  ]
}
```

### Calculation Errors (500)
```json
{
  "success": false,
  "error": "CALCULATION_ERROR",
  "message": "Failed to calculate AV: Continuance table not found"
}
```

### Rate Limit Exceeded (429)
```json
{
  "error": "Rate limit exceeded: 100 per 1 minute"
}
```

## Rate Limiting

- **100 requests per minute** per IP address
- **1000 requests per day** per IP address (configured at infrastructure level)

Rate limits can be adjusted in `main.py`:
```python
@limiter.limit("100/minute")
async def calculate_av(request: Request, plan: CalculateRequest):
    ...
```

## CORS Configuration

Allowed origins:
- `http://localhost:3000` (Next.js development)
- `http://localhost:3001` (Alternative dev port)
- `https://xlb.vercel.app` (Production)
- `https://*.vercel.app` (Preview deployments)

## Logging

All requests are logged with:
- Request method and path
- Response status code
- Calculation duration
- Error details (if any)

Example log output:
```
2025-11-07 12:34:56 - INFO - POST /api/av-calculator/calculate - Status: 200 - Duration: 245.67ms
2025-11-07 12:34:56 - INFO - AV calculated: 72.27% (Silver) in 245.67ms
```

## Testing

### Run Tests
```bash
cd /home/sam/Documents/github-repos/xlb
pytest xlb/tests/av-calculator/test_api.py -v
```

### Test Coverage
The test suite includes:
- ✅ Valid calculation requests
- ✅ Invalid input validation
- ✅ Missing required fields
- ✅ Edge cases (zero deductible, deductible=MOOP, etc.)
- ✅ Rate limiting
- ✅ CORS headers
- ✅ Error response formats
- ✅ Health check endpoint

## Performance

- **Target Response Time:** < 500ms
- **Typical Response Time:** 200-300ms
- **Calculation Time:** 150-250ms (varies by plan complexity)

Performance metrics are included in every response:
```json
{
  "calculation_time_ms": 245.67,
  "details": {
    "performance": {
      "iterations_outer": 3,
      "iterations_inner": 2
    }
  }
}
```

## Integration with Frontend

### Next.js Example

```typescript
// app/lib/av-calculator.ts
export async function calculateAV(planParams: PlanParams) {
  const response = await fetch('/api/av-calculator/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planParams),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

### React Hook

```typescript
// app/hooks/useAVCalculator.ts
import { useState } from 'react';
import { calculateAV } from '@/lib/av-calculator';

export function useAVCalculator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);

  const calculate = async (planParams: PlanParams) => {
    setLoading(true);
    setError(null);

    try {
      const data = await calculateAV(planParams);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { calculate, loading, error, result };
}
```

## Monitoring

### Health Check
```bash
curl https://xlb.vercel.app/api/av-calculator/health
```

### Validation Test
```bash
curl https://xlb.vercel.app/api/av-calculator/validate
```

Expected output:
```json
{
  "success": true,
  "av_percentage": 72.27,
  "metal_tier": "Silver",
  "details": {
    "test_status": "PASS"
  }
}
```

## Troubleshooting

### ImportError: No module named 'av_calculator'
The API needs access to the calculation engine in `xlb/lib/av-calculator/`.
Make sure the path configuration in `calculator.py` is correct:
```python
lib_path = Path(__file__).parent.parent.parent / 'lib'
sys.path.insert(0, str(lib_path))
```

### CORS Errors in Browser
Check that your origin is in the allowed origins list in `main.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "https://xlb.vercel.app",
]
```

### Rate Limit Errors
If you're hitting rate limits during development, you can temporarily increase them:
```python
@limiter.limit("1000/minute")  # Increased for development
```

### Calculation Errors
Check the logs for detailed error messages. Common issues:
- Missing continuance table data
- Invalid metal tier specification
- Convergence failures (rare)

## API Versioning

Current version: **1.0.0**

Version is included in:
- Health check response
- OpenAPI schema
- Error responses (future)

## Security

- **Rate Limiting**: Prevents abuse
- **Input Validation**: All inputs validated before processing
- **CORS**: Restricts origins that can access API
- **Error Sanitization**: No sensitive data in error messages
- **No Authentication**: Public API (add auth if needed)

## Future Enhancements

Potential additions:
- [ ] Batch calculation endpoint (multiple plans)
- [ ] Async calculation for very large batches
- [ ] Caching of results for identical plans
- [ ] Authentication/API keys
- [ ] Enhanced analytics and monitoring
- [ ] WebSocket support for real-time updates
- [ ] GraphQL endpoint (alternative to REST)

## Support

For issues or questions:
1. Check API documentation: `/api/av-calculator/docs`
2. Review test suite: `xlb/tests/av-calculator/test_api.py`
3. Check calculation engine: `xlb/lib/av-calculator/`
4. Review logs for error details

## License

Part of XL Benefits project. All rights reserved.

## Changelog

### v1.0.0 (2025-11-07)
- Initial release
- POST /calculate endpoint
- GET /validate endpoint
- GET /health endpoint
- Comprehensive input validation
- Rate limiting
- CORS configuration
- OpenAPI documentation
