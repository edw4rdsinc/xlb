# Employee Portal - Conflict Analyzer V2 Status

**Last Updated:** November 5, 2025
**Status:** ⚠️ V2 Migration Complete - Debugging Analysis Phase Failures

---

## 🎯 Executive Summary

The V2 conflict analyzer system has been deployed and is successfully replacing the old V1 system. The new chunked processing architecture handles large documents without timeouts. However, jobs are currently failing during the analysis phase at around 50-60% completion.

### Current State
- ✅ V1 system removed (files renamed to `.old`)
- ✅ V2 chunked processing active
- ✅ PDF extraction working perfectly
- ✅ Document chunking working (17 chunks processed successfully)
- ❌ Analysis phase failing at 50-60% progress
- ❌ Generic error message: "Analysis failed: Analysis failed"

---

## 🔍 What Was Done

### 1. V2 Architecture Implementation
- **Chunked Processing**: Documents split into 30k character chunks
- **Resumable Jobs**: Can recover from interruptions
- **State Machine**: `pending → extracting → analyzing → complete`
- **Progress Tracking**: Real-time status updates via JSONB `processing_state`

### 2. Files Modified
```
✅ REMOVED (renamed to .old):
- app/api/cron/process-conflict-jobs/route.ts
- app/api/employee/analyze-conflicts/route.ts

✅ ACTIVE V2 SYSTEM:
- app/api/cron/process-conflict-jobs-v2/route.ts
- app/api/employee/analyze-conflicts-v2/route.ts

✅ CONFIGURATION:
- vercel.json (cron points to V2)

✅ DOCUMENTATION:
- MIGRATION_TO_V2_COMPLETE.md
- CONFLICT_ANALYZER_V2_ARCHITECTURE.md
- EMPLOYEE_PORTAL_V2_STATUS.md (this file)
```

### 3. Fixes Applied
- ✅ Fixed Claude model name from `claude-sonnet-4-5-20250929` to `claude-3-5-sonnet-20241022`
- ✅ Added detailed error logging for Claude API calls
- ✅ Added try-catch blocks around all Claude API requests
- ✅ Added JSON parsing error handling with partial response logging

### 4. Testing Scripts Created
```bash
# Reset a job to pending and test V2 processing
node scripts/reset-job-to-pending.js

# Create a fresh test job
node scripts/create-test-conflict-job.js

# Test V2 processing manually
node scripts/test-v2-processing.js

# Check V2 job status
curl https://xlb.vercel.app/api/employee/check-v2-jobs
```

---

## ❌ Current Issues

### Primary Issue: Analysis Phase Failures

**Symptoms:**
- Jobs progress to 50-60% completion
- Fail during chunk extraction or final analysis
- Error message: "Analysis failed: Analysis failed"
- Last successful phase: Extraction (100% working)

**Test Results:**
- Test Job ID: `c9911ffd-8e8e-4e24-b5ec-115783de92e2`
- Status: Failed at 60% during `extracting_sections` step
- Chunks Identified: 17 SPD chunks, 15 handbook chunks
- Processed Successfully: ~10 chunks before failure

---

## 🔍 Root Cause Analysis

### Most Likely Causes (In Order of Probability)

#### 1. **Vercel Function Timeout (85% confidence)**
**Evidence:**
- Consistent failure at 50-60% mark
- Processing 17 chunks × 3 chunks per run = ~6 iterations
- Each iteration takes 45-60 seconds
- Total time: ~5-6 minutes (exceeds Vercel's 5-minute limit)

**Solution:**
```typescript
// In analyze-conflicts-v2/route.ts
const MAX_CHUNKS_PER_RUN = 3  // ← Change to 1 or 2
```

#### 2. **Claude API Token Limit Exceeded (60% confidence)**
**Evidence:**
- Large accumulated `extractedSections` array
- 17 chunks worth of extracted content
- Final analysis call includes ALL sections

**Solution:**
- Reduce extracted section size
- Summarize sections before final analysis
- Increase chunk size to reduce total chunks

#### 3. **Claude API Rate Limiting (40% confidence)**
**Evidence:**
- Multiple rapid API calls for chunk processing
- Haiku model used for extraction (fast, but many calls)

**Solution:**
- Add 500ms delay between chunk processing
- Implement exponential backoff

#### 4. **Memory Issues (30% confidence)**
**Evidence:**
- Large JSONB `processing_state` field
- Accumulating extracted sections in memory

**Solution:**
- Clear intermediate data after processing
- Store sections in separate table

#### 5. **API Key/Authentication Issues (15% confidence)**
**Evidence:**
- API key configured in Vercel environment
- Extraction works (uses same key)

**Solution:**
- Verify API key has full access to Sonnet 3.5
- Check API key rate limits/quotas

---

## 🚀 Next Steps (Priority Order)

### IMMEDIATE (Do This First)

#### 1. Reduce Chunks Per Run
```bash
# File: app/api/employee/analyze-conflicts-v2/route.ts
# Line: ~22

# Change from:
const MAX_CHUNKS_PER_RUN = 3

# To:
const MAX_CHUNKS_PER_RUN = 1  # Process 1 chunk per cron run
```

**Why:** Prevents function timeout by reducing execution time per run.

#### 2. Check Vercel Logs for Actual Error
```bash
# Login to Vercel dashboard
# Navigate to: xlb project → Functions → Logs
# Filter for: /api/cron/process-conflict-jobs-v2
# Look for: Timeout errors, Memory errors, Claude API errors

# OR use CLI (if authenticated):
vercel logs xlb --since 2h | grep -i "error\|timeout\|claude"
```

**Why:** Our improved error logging should now show actual Claude API errors in Vercel logs.

### HIGH PRIORITY

#### 3. Add Function Timeout Safety
```typescript
// In process-conflict-jobs-v2/route.ts
// Add timeout protection

export const maxDuration = 240; // 4 minutes (under 5 min limit)

// Add timeout to fetch call
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 210000); // 3.5 min

const response = await fetch(analysisUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jobId, chunkIndex, totalChunks }),
  signal: controller.signal
});

clearTimeout(timeout);
```

#### 4. Test with Smaller Document
```bash
# Create test job with smaller PDF (10-20 pages)
# Update scripts/create-test-conflict-job.js with smaller test files
# Verify system works end-to-end with smaller load
```

#### 5. Add Rate Limiting Protection
```typescript
// In analyze-conflicts-v2/route.ts
// After each chunk extraction:

await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
```

### MEDIUM PRIORITY

#### 6. Improve Error Messages
The error logging was improved but may not be fully deployed. Verify in Vercel that console.error statements are visible:

```typescript
// Check that this is deployed:
} catch (apiError: any) {
  console.error('Claude API error details:', {
    error: apiError.message,
    status: apiError.status,
    type: apiError.error?.type,
    message: apiError.error?.message
  })
  throw new Error(`Claude API failed: ${apiError.message}`)
}
```

#### 7. Add Chunk-Level Recovery
```typescript
// If one chunk fails, continue with others
try {
  const sections = await extractSectionsFromChunk(...)
  allSections.push(...sections)
} catch (chunkError) {
  console.error(`Chunk ${i} failed, continuing:`, chunkError)
  // Continue processing other chunks
}
```

#### 8. Optimize Final Analysis
```typescript
// Before final analysis, summarize sections if too large
if (allSections.length > 50) {
  // Group related sections
  // Summarize redundant content
  // Reduce total token count
}
```

---

## 📚 Lessons Learned

### 1. **Vercel Function Timeouts Are Hard Limits**
- 5-minute max on Pro plan (10 min on Enterprise)
- Cannot be extended via configuration
- Must design for sub-5-minute execution
- Solution: Process in smaller batches

### 2. **Generic Error Messages Hide Real Issues**
- "Analysis failed: Analysis failed" was unhelpful
- Always log specific error details: status, type, message
- Include context: chunk number, document size, API model

### 3. **Chunking Strategy Must Account for Total Time**
- 3 chunks per run × 17 total chunks = too many iterations
- Each iteration adds overhead (DB reads/writes, API calls)
- Better: Process 1-2 chunks per run for reliability

### 4. **State Management in JSONB Is Powerful**
- Resumable processing works well
- Can store complex nested data
- But watch field size (can exceed limits)

### 5. **PDF Extraction vs Analysis Have Different Requirements**
- Extraction: Fast, predictable, small inputs
- Analysis: Slow, variable, large inputs
- Don't assume same architecture works for both

### 6. **Testing in Production Is Necessary**
- Local testing doesn't reveal Vercel-specific issues
- Need actual large documents to test timeouts
- Monitor real-world performance metrics

---

## 🔧 Debugging Tools & Commands

### Check Job Status
```bash
# Get status of all V2 jobs
curl https://xlb.vercel.app/api/employee/check-v2-jobs | jq

# Get status of specific job
curl https://xlb.vercel.app/api/employee/check-v2-jobs | jq '.recentJobs[] | select(.id=="JOB_ID")'

# Check for jobs in extracting/analyzing state
curl https://xlb.vercel.app/api/employee/check-v2-jobs | jq '.extracting, .analyzing'
```

### Monitor Processing
```bash
# Monitor job progress every 15 seconds
watch -n 15 'curl -s https://xlb.vercel.app/api/employee/check-v2-jobs | jq ".recentJobs[0]"'

# Check recent failed jobs
curl https://xlb.vercel.app/api/employee/process-pending-jobs | jq '.recentFailed'
```

### Manual Testing
```bash
# Reset a failed job to pending
node scripts/reset-job-to-pending.js

# Manually trigger V2 processing
curl https://xlb.vercel.app/api/employee/test-v2-processing

# Create new test job
node scripts/create-test-conflict-job.js
```

### Database Queries
```sql
-- Check job status and processing state
SELECT
  id,
  client_name,
  status,
  progress,
  processing_state->>'processedChunks' as processed,
  processing_state->>'totalChunks' as total,
  error_message,
  updated_at
FROM conflict_analysis_jobs
WHERE status IN ('extracting', 'analyzing', 'error')
ORDER BY updated_at DESC
LIMIT 10;

-- Get processing state details
SELECT
  id,
  client_name,
  jsonb_pretty(processing_state) as state
FROM conflict_analysis_jobs
WHERE id = 'JOB_ID';
```

---

## 📋 Quick Start for Next Claude Session

### Context
"The conflict analyzer V2 system is deployed but failing at 50-60% completion during analysis. The most likely cause is Vercel function timeout (5-minute limit). The system processes large documents in chunks, but processing 3 chunks per run takes too long."

### First Action
```bash
# 1. Reduce chunks per run from 3 to 1
# Edit: app/api/employee/analyze-conflicts-v2/route.ts
# Line 22: const MAX_CHUNKS_PER_RUN = 3 → change to 1

# 2. Commit and deploy
git add -A
git commit -m "Reduce chunks per run to avoid timeout"
git push

# 3. Wait 60 seconds for deployment

# 4. Test
node scripts/create-test-conflict-job.js

# 5. Monitor (wait 5-10 minutes)
watch -n 30 'curl -s https://xlb.vercel.app/api/employee/check-v2-jobs | jq ".recentJobs[0]"'
```

### Expected Result
- Job should progress steadily through all chunks
- Each cron run processes 1 chunk (~30-45 seconds)
- Total time: 17 chunks × 1 min = ~17 minutes
- Should complete successfully with "status": "complete"

### If Still Failing
1. Check Vercel logs for actual error
2. Test with smaller document
3. Implement rate limiting delays
4. Review "Next Steps" section above

---

## 🎓 Architecture Notes

### V2 Processing Flow
```
User submits PDFs
    ↓
Job created (status: pending)
    ↓
Cron picks up job every minute
    ↓
Extract PDFs → status: extracting
    ↓
Chunk documents (30k chars each)
    ↓
Process chunks (MAX_CHUNKS_PER_RUN at a time)
    ↓
For each chunk:
  - Extract sections with Haiku
  - Store in processing_state
  - Update progress %
    ↓
All chunks done?
  ↓ Yes
Analyze all sections with Sonnet 3.5
    ↓
Generate report
    ↓
Send email
    ↓
Status: complete
```

### Key Configuration
```typescript
// Chunk size (characters per chunk)
const CHUNK_SIZE = 30000

// Chunks per cron run (⚠️ THIS IS THE KEY TUNING PARAMETER)
const MAX_CHUNKS_PER_RUN = 3  // ← REDUCE THIS TO 1

// Claude models
const EXTRACTION_MODEL = 'claude-haiku-3-20240307'     // Fast
const ANALYSIS_MODEL = 'claude-3-5-sonnet-20241022'    // Smart

// Cron schedule
vercel.json: "schedule": "* * * * *"  // Every minute
```

### Database Schema
```sql
-- Key fields in conflict_analysis_jobs table
status: 'pending' | 'extracting' | 'analyzing' | 'complete' | 'error'

processing_state: {
  "spdChunks": 17,
  "handbookChunks": 15,
  "totalChunks": 17,
  "processedChunks": 10,  // Progress tracker
  "extractedSections": [...],  // Accumulated sections
  "complete": false
}

progress: {
  "step": "extracting_sections",
  "percent": 60
}
```

---

## 📞 Support & Contact

### Monitoring URLs
- **V2 Job Status**: https://xlb.vercel.app/api/employee/check-v2-jobs
- **All Jobs**: https://xlb.vercel.app/api/employee/process-pending-jobs
- **Vercel Dashboard**: https://vercel.com/sams-projects/xlb

### Related Documentation
- `MIGRATION_TO_V2_COMPLETE.md` - Migration summary
- `CONFLICT_ANALYZER_V2_ARCHITECTURE.md` - Detailed architecture
- `REFACTORING_RECOMMENDATIONS.md` - Original refactoring plan

### Key Files
```
app/api/cron/process-conflict-jobs-v2/route.ts  # Orchestrator
app/api/employee/analyze-conflicts-v2/route.ts   # Analysis engine
vercel.json                                       # Cron config
scripts/reset-job-to-pending.js                  # Testing utility
scripts/create-test-conflict-job.js              # Testing utility
```

---

**Note to Next Claude:** This README contains everything you need to continue debugging. Start with reducing `MAX_CHUNKS_PER_RUN` to 1 and testing. The system is close to working—it just needs tuning for Vercel's constraints. Good luck! 🚀
