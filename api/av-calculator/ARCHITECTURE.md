# AV Calculator API - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js Frontend                        │
│                     (xlb.vercel.app)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTPS POST/GET
                          │ (CORS enabled)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Application                          │
│                  (main.py - Entry Point)                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Middleware Stack                        │ │
│  │  • CORS Middleware (origin validation)                    │ │
│  │  • Request Logging (timing, status)                       │ │
│  │  • Rate Limiter (100/min per IP)                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   Route Handlers                           │ │
│  │  • GET  /health          (health check)                   │ │
│  │  • GET  /validate        (TEST-001 validation)            │ │
│  │  • POST /calculate       (AV calculation)                 │ │
│  │  • GET  /docs            (Swagger UI)                     │ │
│  │  • GET  /openapi.json    (OpenAPI schema)                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Pydantic Models (models.py)                   │ │
│  │  • CalculateRequest    (input validation)                 │ │
│  │  • CalculateResponse   (output formatting)                │ │
│  │  • ErrorResponse       (error handling)                   │ │
│  │  • ValidationError     (validation details)               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │            Validation Layer (validation.py)                │ │
│  │  • Deductible validation                                  │ │
│  │  • MOOP validation                                        │ │
│  │  • Coinsurance validation                                 │ │
│  │  • Copay validation                                       │ │
│  │  • Logical consistency checks                             │ │
│  │  • Federal limit enforcement                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │       Integration Layer (calculator.py)                    │ │
│  │  • Request → PlanDesign conversion                        │ │
│  │  • Service parameter mapping                              │ │
│  │  • Continuance table selection                            │ │
│  │  • Result → Response conversion                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Agent 5: Calculation Engine                        │
│                (xlb/lib/av-calculator/)                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Core Calculator (calculator.py)               │ │
│  │  • Iterative AV calculation algorithm                     │ │
│  │  • Deductible/MOOP adjustment loops                       │ │
│  │  • Coinsurance convergence                                │ │
│  │  • Service-level cost sharing                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         Continuance Tables (continuance.py)                │ │
│  │  • Bronze/Silver/Gold/Platinum tables                     │ │
│  │  • Medical/Drug/Combined tables                           │ │
│  │  • Statistical spending distributions                      │ │
│  │  • Service-level utilization data                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           Service Processing (services.py)                 │ │
│  │  • 17 service types (ER, IP, PC, SP, etc.)                │ │
│  │  • Cost-sharing logic                                     │ │
│  │  • Deductible/coinsurance application                     │ │
│  │  • MOOP calculation                                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Utilities (utils.py)                          │ │
│  │  • Table interpolation                                    │ │
│  │  • Row lookups                                            │ │
│  │  • Metal tier determination                               │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Request Flow (POST /calculate)

```
1. Client Request
   ↓
   {
     "deductible_individual": 4000,
     "moop_individual": 9100,
     "coinsurance_medical": 0.20,
     "primary_care_copay": 45,
     ...
   }

2. CORS Check
   ↓
   Origin: http://localhost:3000
   ✓ Allowed

3. Rate Limit Check
   ↓
   Requests from 192.168.1.1: 45/100
   ✓ Under limit

4. Pydantic Validation
   ↓
   ✓ All fields present
   ✓ Types correct
   ✓ Ranges valid

5. Custom Validation (validation.py)
   ↓
   ✓ Deductible ≤ MOOP
   ✓ MOOP ≤ Federal limits
   ✓ Logical consistency

6. Request Translation (calculator.py)
   ↓
   CalculateRequest → PlanDesign
   {
     deductible: 4000,
     moop: 9100,
     coinsurance: 0.20,
     service_params: {
       'PC': ServiceParams(copay=45, std=False, stc=False),
       'SP': ServiceParams(copay=45, std=False, stc=False),
       ...
     }
   }

7. Table Selection
   ↓
   metal_tier="Silver" → ContinuanceTable(Silver, Combined)

8. AV Calculation (calculate_av)
   ↓
   • Initialize variables
   • Outer loop: Deductible/MOOP adjustment
     ├─ Inner loop: Coinsurance convergence
     │  ├─ Process all 17 services
     │  ├─ Calculate cost sharing
     │  └─ Update accumulators
     └─ Check convergence
   • Calculate plan payments by range
   • Compute final AV

9. Result Creation
   ↓
   AVResult {
     av: 0.7227,
     av_percent: 72.27,
     metal_tier: "Silver",
     total_plan_payment: 2485.67,
     ...
   }

10. Response Translation
    ↓
    AVResult → CalculateResponse
    {
      "success": true,
      "av_percentage": 72.27,
      "metal_tier": "Silver",
      "calculation_time_ms": 245.67,
      "details": { ... }
    }

11. Logging
    ↓
    "POST /calculate - 200 - 245.67ms - AV: 72.27%"

12. Client Response
    ↓
    Status: 200 OK
    Content-Type: application/json
    {
      "success": true,
      "av_percentage": 72.27,
      ...
    }
```

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          API Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  main.py          FastAPI app initialization                   │
│  ├─ CORS          Cross-origin resource sharing                │
│  ├─ Limiter       Rate limiting (slowapi)                      │
│  ├─ Middleware    Request logging                              │
│  └─ Routes        Endpoint handlers                            │
│                                                                 │
│  models.py        Pydantic data models                         │
│  ├─ CalculateRequest      Input schema                         │
│  ├─ CalculateResponse     Output schema                        │
│  ├─ ErrorResponse         Error schema                         │
│  └─ ValidationError       Validation details                   │
│                                                                 │
│  validation.py    Input validation logic                       │
│  ├─ validate_plan_parameters()                                 │
│  ├─ validate_av_result()                                       │
│  └─ ValidationResponse                                         │
│                                                                 │
│  calculator.py    Integration with calculation engine          │
│  ├─ calculate_av_from_request()                                │
│  ├─ validate_calculation_inputs()                              │
│  └─ Service parameter mapping                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ imports
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Calculation Engine Layer                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  calculator.py    Core AV calculation algorithm                │
│  ├─ calculate_av()                Main calculation             │
│  ├─ calculate_av_combined()       Combined med+drug            │
│  ├─ hsa_adjustment()              HSA contribution             │
│  └─ determine_metal_tier()        Metal tier classification    │
│                                                                 │
│  models.py        Data structures                              │
│  ├─ PlanDesign                    Plan parameters              │
│  ├─ ContinuanceTable              Statistical data             │
│  ├─ AVResult                      Calculation result           │
│  ├─ ServiceParams                 Service cost sharing         │
│  └─ Accumulators                  Running totals               │
│                                                                 │
│  continuance.py   Continuance table management                 │
│  ├─ load_continuance_tables()     Load from files              │
│  ├─ get_continuance_table()       Get specific table           │
│  └─ Table caching                                              │
│                                                                 │
│  services.py      Service-level processing                     │
│  ├─ process_service_cost_share()  Individual service           │
│  ├─ process_all_services()        All 17 services              │
│  └─ Service definitions                                        │
│                                                                 │
│  utils.py         Helper functions                             │
│  ├─ get_continuance_table_row()   Table lookup                 │
│  ├─ compute_row_value()           Interpolation                │
│  ├─ deductible_adjustment()       Deductible calc              │
│  └─ effective_coinsurance_numerator()                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Edge Network (CDN)                                            │
│  ├─ Static assets (docs, schema)                              │
│  ├─ Response caching (future)                                  │
│  └─ DDoS protection                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Serverless Functions                        │  │
│  │                                                           │  │
│  │  /api/av-calculator/*                                    │  │
│  │  ├─ Runtime: Python 3.11                                 │  │
│  │  ├─ Memory: 1024 MB                                      │  │
│  │  ├─ Timeout: 10 seconds                                  │  │
│  │  └─ Cold start: ~1-2s, Warm: ~200ms                      │  │
│  │                                                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Monitoring & Logs                                             │
│  ├─ Function invocations                                       │
│  ├─ Execution duration                                         │
│  ├─ Error rates                                                │
│  └─ Bandwidth usage                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Repository                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  main branch                                                   │
│  ├─ xlb/api/av-calculator/                                     │
│  ├─ xlb/lib/av-calculator/                                     │
│  └─ vercel.json                                                │
│                                                                 │
│  On push to main → Automatic deployment to Vercel              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Service Architecture (17 Services)

```
Medical Services (14):
├─ ER    Emergency Room
├─ IP    Inpatient Hospital
├─ PC    Primary Care
├─ SP    Specialist
├─ PSY   Psychiatry
├─ IMG   Imaging (X-ray, MRI, CT)
├─ ST    Speech Therapy / Physical Therapy
├─ OT    Occupational Therapy
├─ PREV  Preventive Care
├─ LAB   Laboratory Tests
├─ XRAY  X-ray (basic)
├─ SNF   Skilled Nursing Facility
├─ OPFAC Outpatient Facility
└─ OPPROF Outpatient Professional

Drug Services (4):
├─ RXGEN      Generic Drugs
├─ RXFORM     Preferred Brand (Formulary)
├─ RXNONFORM  Non-Preferred Brand
└─ RXSPCLTY   Specialty Drugs

Each service has:
├─ Copay amount
├─ Coinsurance rate
├─ Subject to Deductible flag
├─ Subject to Coinsurance flag
└─ Utilization distribution
```

## Error Handling Flow

```
Request
  ↓
┌─────────────────┐
│ Pydantic Model  │
│ Validation      │
└────┬────────────┘
     │
     ├─ Type Error → 422 Unprocessable Entity
     ├─ Missing Field → 422 Unprocessable Entity
     └─ Range Error → 422 Unprocessable Entity
     ↓
┌─────────────────┐
│ Custom          │
│ Validation      │
└────┬────────────┘
     │
     ├─ MOOP > Federal Limit → 400 Bad Request
     ├─ MOOP < Deductible → 400 Bad Request
     └─ Invalid Relationship → 400 Bad Request
     ↓
┌─────────────────┐
│ Calculation     │
│ Engine          │
└────┬────────────┘
     │
     ├─ Table Not Found → 500 Internal Server Error
     ├─ Convergence Failure → 500 Internal Server Error
     └─ Unknown Error → 500 Internal Server Error
     ↓
┌─────────────────┐
│ Error Response  │
└─────────────────┘
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "details": { ... }
}
```

## Performance Characteristics

```
Request Processing Time Breakdown:

Total: ~245ms
├─ Network latency: 10-50ms
├─ CORS/Middleware: 1-2ms
├─ Pydantic validation: 1-2ms
├─ Custom validation: 1-2ms
├─ Request translation: 1-2ms
├─ AV calculation: 150-250ms
│  ├─ Table lookup: 5-10ms
│  ├─ Outer loop iterations: 3-5 iterations
│  ├─ Inner loop iterations: 2-3 iterations per outer
│  └─ Service processing: 17 services × iterations
├─ Response formatting: 1-2ms
└─ Logging: 1-2ms

Cold Start: +1000-2000ms (first request)
```

## Security Layers

```
1. Edge (Vercel)
   ├─ DDoS protection
   ├─ SSL/TLS encryption
   └─ Request filtering

2. Application (FastAPI)
   ├─ CORS (origin validation)
   ├─ Rate limiting (100/min per IP)
   └─ Request size limits

3. Input Validation (Pydantic)
   ├─ Type checking
   ├─ Range validation
   └─ Required fields

4. Business Logic (validation.py)
   ├─ Federal limit enforcement
   ├─ Logical consistency
   └─ HSA eligibility

5. Calculation (calculation engine)
   ├─ No database access
   ├─ No file system writes
   └─ Pure computation
```

## Scalability

```
Current Capacity:
├─ Vercel Free: ~200,000 calculations/month
├─ Vercel Pro: ~2,000,000 calculations/month
└─ Enterprise: Custom

Scaling Options:
1. Vertical: Increase function memory/timeout
2. Horizontal: Automatic (Vercel handles)
3. Caching: Add Redis for identical plans
4. CDN: Cache OpenAPI schema, docs
5. Database: Store continuance tables in DB
```

This architecture provides a robust, scalable, and maintainable API for AV calculations.
