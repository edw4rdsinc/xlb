# AV Calculator API - Documentation Index

Welcome to the AV Calculator API documentation. This index will help you find the information you need.

## Quick Navigation

### Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
  - Installation steps
  - Basic testing
  - Example usage

### Core Documentation
- **[README.md](README.md)** - Complete API documentation (450+ lines)
  - Overview and features
  - All endpoints specifications
  - Input validation rules
  - Error handling
  - Frontend integration examples
  - Testing procedures
  - Troubleshooting

### Architecture & Design
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture diagrams
  - Component diagrams
  - Data flow diagrams
  - Service architecture
  - Error handling flow
  - Performance characteristics
  - Security layers
  - Scalability options

### Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide (400+ lines)
  - Local testing
  - Vercel deployment
  - Environment variables
  - Post-deployment verification
  - Monitoring setup
  - Troubleshooting
  - Performance optimization
  - CI/CD recommendations

### Implementation Details
- **[IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)** - Detailed implementation report
  - Deliverables completed
  - Success criteria validation
  - Integration with Agent 5
  - Testing instructions
  - Performance benchmarks
  - Files created

## Code Files

### Core API Files
- **main.py** (365 lines) - FastAPI application entry point
  - Route handlers
  - Middleware configuration
  - CORS setup
  - Rate limiting
  - Error handlers

- **models.py** (370 lines) - Pydantic request/response models
  - CalculateRequest
  - CalculateResponse
  - ErrorResponse
  - ValidationError
  - HealthCheckResponse

- **calculator.py** (180 lines) - Integration with calculation engine
  - Request translation
  - Service parameter mapping
  - Result conversion

- **validation.py** (235 lines) - Input validation logic
  - Comprehensive validation rules
  - Federal limit checks
  - Logical consistency validation

### Supporting Files
- **requirements.txt** - Python dependencies
- **__init__.py** - Package initialization
- **test_api.py** (322 lines) - Comprehensive test suite
- **verify_integration.py** (150 lines) - Integration verification script

## Usage by Role

### Frontend Developer
Start here:
1. [QUICKSTART.md](QUICKSTART.md) - Run the API locally
2. [README.md](README.md) → "Integration with Frontend" section
3. Test endpoints at http://localhost:8000/api/av-calculator/docs

### Backend Developer
Start here:
1. [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the system
2. [main.py](main.py) - Review the code
3. [test_api.py](test_api.py) - Run the tests

### DevOps Engineer
Start here:
1. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment procedures
2. [vercel.json](../../vercel.json) - Deployment configuration
3. [DEPLOYMENT.md](DEPLOYMENT.md) → "Monitoring" section

### Product Manager
Start here:
1. [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) - What was built
2. [README.md](README.md) → "API Endpoints" section
3. Interactive docs: http://localhost:8000/api/av-calculator/docs

## Key Concepts

### Actuarial Value (AV)
The percentage of total allowed costs that a health plan is expected to pay.
- Bronze: 60% ± 2%
- Silver: 70% ± 2%
- Gold: 80% ± 2%
- Platinum: 90% ± 2%

### Continuance Tables
Statistical distributions of healthcare spending used in AV calculations.
- Separate tables for each metal tier
- Combined medical + drug tables
- Based on CMS data

### Service Parameters
Cost-sharing configuration for each of 17 service types:
- Copay amount
- Coinsurance rate
- Subject to deductible flag
- Subject to coinsurance flag

## API Endpoints Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/av-calculator/health` | GET | Health check |
| `/api/av-calculator/validate` | GET | Test with TEST-001 |
| `/api/av-calculator/calculate` | POST | Calculate AV |
| `/api/av-calculator/docs` | GET | Interactive documentation |
| `/api/av-calculator/openapi.json` | GET | OpenAPI schema |

## Testing

### Local Testing
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload

# Run tests
pytest test_api.py -v
```

### Integration Testing
```bash
# Health check
curl http://localhost:8000/api/av-calculator/health

# Validation test
curl http://localhost:8000/api/av-calculator/validate

# Calculate AV
curl -X POST http://localhost:8000/api/av-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{"deductible_individual": 2000, ...}'
```

## Common Tasks

### Calculate AV for a Plan
1. Prepare request body with plan parameters
2. POST to `/api/av-calculator/calculate`
3. Receive AV percentage and metal tier
4. Use response data in frontend

### Validate Input Before Calculation
1. Create CalculateRequest model
2. Call `validate_plan_parameters(request)`
3. Check `is_valid` flag
4. Review `errors` list if invalid

### Test Against Known Plans
1. Use `/api/av-calculator/validate` endpoint
2. Returns TEST-001 result (72.27% expected)
3. Verify calculation engine is working

### Deploy to Production
1. Commit changes to git
2. Push to main branch
3. Vercel auto-deploys
4. Verify with health check

## Support & Troubleshooting

### Installation Issues
See: [QUICKSTART.md](QUICKSTART.md) → "Common Issues"

### Deployment Issues
See: [DEPLOYMENT.md](DEPLOYMENT.md) → "Troubleshooting"

### API Errors
See: [README.md](README.md) → "Error Handling"

### Performance Issues
See: [ARCHITECTURE.md](ARCHITECTURE.md) → "Performance Characteristics"

## Additional Resources

### Interactive Documentation
When the API is running, visit:
- Swagger UI: http://localhost:8000/api/av-calculator/docs
- ReDoc: http://localhost:8000/api/av-calculator/redoc

### Related Documentation
- Agent 5 Calculator: `/xlb/lib/av-calculator/`
- Test Plans: `/test-cases/test-plans-inventory.json`
- Continuance Tables: `/data/continuance-tables/`

## Version Information

- **API Version:** 1.0.0
- **Created:** November 7, 2025
- **Agent:** Agent 6 (API Builder)
- **Status:** Production Ready ✅

## Quick Links

- [Start Here](QUICKSTART.md) - Get running in 5 minutes
- [Full Documentation](README.md) - Complete API reference
- [Architecture](ARCHITECTURE.md) - System design
- [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- [Implementation Report](IMPLEMENTATION_REPORT.md) - What was built

---

**Need help?** Start with [QUICKSTART.md](QUICKSTART.md) or browse the full documentation above.
