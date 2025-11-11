# AV Calculator API - Deployment Guide

## Overview

This guide covers deploying the AV Calculator API to production on Vercel.

## Prerequisites

- Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- Python 3.11+ locally for testing
- Access to XL Benefits Vercel project

## Local Testing

### 1. Install Dependencies

```bash
cd /home/sam/Documents/github-repos/xlb/xlb/api/av-calculator
pip install -r requirements.txt
```

### 2. Run Development Server

```bash
# From the API directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or from project root
cd /home/sam/Documents/github-repos/xlb
python -m uvicorn xlb.api.av-calculator.main:app --reload
```

### 3. Test Endpoints

```bash
# Health check
curl http://localhost:8000/api/av-calculator/health

# Validation test (TEST-001)
curl http://localhost:8000/api/av-calculator/validate

# Calculate AV
curl -X POST http://localhost:8000/api/av-calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### 4. Run Tests

```bash
cd /home/sam/Documents/github-repos/xlb
pytest xlb/api/av-calculator/test_api.py -v

# Or run with coverage
pytest xlb/api/av-calculator/test_api.py -v --cov=xlb/api/av-calculator
```

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

```bash
cd /home/sam/Documents/github-repos/xlb

# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Option 2: Deploy via Git (Recommended)

1. **Commit Changes:**
```bash
git add xlb/api/av-calculator/
git add vercel.json
git commit -m "Add AV Calculator API endpoints"
git push
```

2. **Vercel Auto-Deploy:**
Vercel will automatically deploy when changes are pushed to the repository.

### Deployment Configuration

The `vercel.json` file is configured to:

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
  ],
  "functions": {
    "xlb/api/av-calculator/main.py": {
      "maxDuration": 10
    }
  }
}
```

**Key Points:**
- Uses `@vercel/python` builder
- Routes all `/api/av-calculator/*` requests to the FastAPI app
- 10-second timeout (sufficient for calculations)

## Environment Variables

No environment variables are required for basic operation.

Optional (for future enhancements):
- `API_KEY`: For authentication
- `LOG_LEVEL`: Logging level (INFO, DEBUG, etc.)
- `RATE_LIMIT_PER_MINUTE`: Override default rate limit

Set in Vercel dashboard under Project Settings → Environment Variables.

## Post-Deployment Verification

### 1. Health Check

```bash
curl https://xlb.vercel.app/api/av-calculator/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-07T12:34:56.789Z",
  "version": "1.0.0"
}
```

### 2. Validation Test

```bash
curl https://xlb.vercel.app/api/av-calculator/validate
```

Expected response:
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

### 3. Sample Calculation

```bash
curl -X POST https://xlb.vercel.app/api/av-calculator/calculate \
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

### 4. API Documentation

Visit: https://xlb.vercel.app/api/av-calculator/docs

This will open the Swagger UI with interactive API documentation.

## Monitoring

### Vercel Dashboard

1. Go to https://vercel.com/
2. Select the XL Benefits project
3. Navigate to "Functions" tab
4. Monitor:
   - Function invocations
   - Execution duration
   - Error rates
   - Bandwidth usage

### Application Logs

View logs in Vercel:
```bash
vercel logs https://xlb.vercel.app
```

Or via dashboard:
1. Project → Deployments
2. Click on deployment
3. View "Functions" → "Logs"

### Custom Monitoring (Future)

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- DataDog for metrics
- New Relic for APM

## Troubleshooting

### Issue: Import errors on Vercel

**Problem:** `ModuleNotFoundError: No module named 'av_calculator'`

**Solution:** Check `PYTHONPATH` in vercel.json:
```json
"env": {
  "PYTHONPATH": "/var/task/xlb"
}
```

### Issue: Calculation timeout

**Problem:** Function times out after 10 seconds

**Solution:** Increase timeout in vercel.json:
```json
"functions": {
  "xlb/api/av-calculator/main.py": {
    "maxDuration": 30
  }
}
```

### Issue: CORS errors

**Problem:** Browser blocks requests from frontend

**Solution:** Verify allowed origins in `main.py`:
```python
allow_origins=[
  "http://localhost:3000",
  "https://xlb.vercel.app",
  "https://*.vercel.app",
]
```

### Issue: Rate limiting too aggressive

**Problem:** Getting 429 errors during testing

**Solution:** Temporarily increase limit in `main.py`:
```python
@limiter.limit("1000/minute")  # Increased for testing
```

### Issue: Validation failing

**Problem:** TEST-001 validation not returning 72.27%

**Solution:** Check:
1. Continuance table data is loaded correctly
2. Service parameters are configured properly
3. Calculation engine is returning expected values

Debug command:
```bash
curl https://xlb.vercel.app/api/av-calculator/validate | jq .
```

## Performance Optimization

### Cold Starts

Vercel serverless functions have cold starts. First request may take longer.

**Optimization:**
- Keep function warm with periodic health checks
- Minimize dependencies
- Use lazy loading for heavy imports

### Calculation Caching (Future)

For identical plans, cache results:

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def calculate_av_cached(plan_hash):
    # ... calculation
    pass
```

### Database for Continuance Tables (Future)

Instead of loading from files, store in:
- Vercel KV (key-value store)
- Supabase (already in use)
- Redis

## Security Considerations

### Rate Limiting

Current: 100 requests/minute per IP

For production, consider:
- API key authentication
- JWT tokens
- OAuth 2.0

### Input Sanitization

All inputs are validated via Pydantic models. No SQL injection risk as we don't use databases for calculations.

### CORS

Only allow trusted origins. Don't use `*` in production.

### Secrets

Never commit:
- API keys
- Database credentials
- OAuth secrets

Use Vercel environment variables instead.

## Scaling

### Current Capacity

- Vercel free tier: 100 GB-hours/month
- Pro tier: 1000 GB-hours/month
- Each calculation: ~200-300ms execution time

**Capacity estimate:**
- Free: ~200,000 calculations/month
- Pro: ~2,000,000 calculations/month

### If Scaling Needed

1. **Upgrade Vercel tier**
2. **Add caching layer** (Redis)
3. **Batch processing** for multiple plans
4. **Pre-calculate** common plans
5. **CDN caching** for identical requests

## Rollback Procedure

If deployment fails:

### Via Vercel Dashboard
1. Go to Project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Via CLI
```bash
vercel rollback
```

### Via Git
```bash
git revert HEAD
git push
```

## CI/CD Pipeline (Future)

Consider setting up:

### GitHub Actions

```yaml
name: Test and Deploy

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install -r xlb/api/av-calculator/requirements.txt
      - run: pytest xlb/api/av-calculator/test_api.py

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Maintenance

### Regular Tasks

- **Weekly:** Check error logs
- **Monthly:** Review performance metrics
- **Quarterly:** Update dependencies
- **Annually:** Review continuance tables

### Dependency Updates

```bash
cd xlb/api/av-calculator
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

Test thoroughly after updates.

## Support & Documentation

- **API Docs:** https://xlb.vercel.app/api/av-calculator/docs
- **README:** `/xlb/api/av-calculator/README.md`
- **Tests:** `/xlb/api/av-calculator/test_api.py`
- **Issues:** GitHub Issues

## Changelog

### v1.0.0 (2025-11-07)
- Initial deployment
- POST /calculate endpoint
- GET /validate endpoint
- GET /health endpoint
- Rate limiting (100/min)
- CORS configuration
- Input validation
- OpenAPI documentation
