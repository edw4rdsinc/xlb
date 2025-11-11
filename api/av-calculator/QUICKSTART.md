# AV Calculator API - Quick Start Guide

Get the AV Calculator API up and running in 5 minutes.

## Prerequisites

- Python 3.11+
- pip (Python package manager)

## Installation

### Step 1: Navigate to API Directory

```bash
cd /home/sam/Documents/github-repos/xlb/xlb/api/av-calculator
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- Pydantic (data validation)
- SlowAPI (rate limiting)
- NumPy & Pandas (for calculations)

### Step 3: Start Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Verify Installation

### 1. Health Check

```bash
curl http://localhost:8000/api/av-calculator/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-07T12:34:56.789Z",
  "version": "1.0.0"
}
```

### 2. Test Validation (TEST-001)

```bash
curl http://localhost:8000/api/av-calculator/validate
```

Expected response:
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

If you see `"test_status": "PASS"`, you're all set! ✅

### 3. Calculate a Plan

```bash
curl -X POST http://localhost:8000/api/av-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "deductible_individual": 2000,
    "deductible_family": 4000,
    "moop_individual": 6000,
    "moop_family": 12000,
    "coinsurance_medical": 0.20,
    "metal_tier": "Silver"
  }'
```

Expected response:
```json
{
  "success": true,
  "av_percentage": 70.45,
  "metal_tier": "Silver",
  "calculation_time_ms": 245.67,
  "details": {
    "plan_pays": 2485.67,
    "member_pays": 955.33,
    "total_expected_cost": 3441.00,
    ...
  }
}
```

## Interactive Documentation

Open your browser to:

**Swagger UI (recommended):**
http://localhost:8000/api/av-calculator/docs

**ReDoc:**
http://localhost:8000/api/av-calculator/redoc

Here you can:
- See all available endpoints
- View request/response schemas
- Try out the API interactively
- See example requests and responses

## Example Usage

### Minimal Plan (Bronze)

```bash
curl -X POST http://localhost:8000/api/av-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "deductible_individual": 7000,
    "deductible_family": 14000,
    "moop_individual": 9450,
    "moop_family": 18900,
    "coinsurance_medical": 0.40,
    "metal_tier": "Bronze"
  }'
```

### Plan with Copays (Silver)

```bash
curl -X POST http://localhost:8000/api/av-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "deductible_individual": 3000,
    "deductible_family": 6000,
    "moop_individual": 8000,
    "moop_family": 16000,
    "coinsurance_medical": 0.20,
    "primary_care_copay": 30,
    "specialist_copay": 60,
    "er_copay": 250,
    "generic_copay": 10,
    "preferred_brand_copay": 40,
    "metal_tier": "Silver"
  }'
```

### Gold Plan with HSA

```bash
curl -X POST http://localhost:8000/api/av-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "deductible_individual": 2000,
    "deductible_family": 4000,
    "moop_individual": 6000,
    "moop_family": 12000,
    "coinsurance_medical": 0.10,
    "hsa_contribution": 1000,
    "metal_tier": "Gold"
  }'
```

## Common Issues

### Module Not Found Error

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### Port Already in Use

**Problem:** `OSError: [Errno 48] Address already in use`

**Solution:** Use a different port:
```bash
uvicorn main:app --reload --port 8001
```

Or kill the process using port 8000:
```bash
lsof -ti:8000 | xargs kill -9
```

### Import Error: av_calculator

**Problem:** Can't import calculation engine

**Solution:** Check that Agent 5's calculator is installed:
```bash
ls /home/sam/Documents/github-repos/xlb/xlb/lib/av-calculator/
```

You should see:
- calculator.py
- models.py
- continuance.py
- etc.

## Next Steps

1. **Read the full README:**
   `/xlb/api/av-calculator/README.md`

2. **Run the test suite:**
   ```bash
   pytest test_api.py -v
   ```

3. **Deploy to Vercel:**
   ```bash
   cd /home/sam/Documents/github-repos/xlb
   vercel deploy
   ```

4. **Integrate with Next.js frontend:**
   - Create API client in `/app/lib/av-calculator.ts`
   - Use `fetch()` to call endpoints
   - Handle responses and errors

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/av-calculator/health` | GET | Health check |
| `/api/av-calculator/validate` | GET | Test with TEST-001 |
| `/api/av-calculator/calculate` | POST | Calculate AV for a plan |
| `/api/av-calculator/docs` | GET | Swagger UI documentation |
| `/api/av-calculator/openapi.json` | GET | OpenAPI schema |

## Support

- **Full Documentation:** `README.md`
- **Deployment Guide:** `DEPLOYMENT.md`
- **Implementation Report:** `IMPLEMENTATION_REPORT.md`
- **Test Suite:** `test_api.py`

## That's It!

You now have a fully functional AV Calculator API running locally.

Try it out in the browser: http://localhost:8000/api/av-calculator/docs
