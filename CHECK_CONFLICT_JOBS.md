# Conflict Analyzer Job Diagnostics

## Check Pending Jobs
Visit this URL to see the status of all conflict analysis jobs:
```
https://xlb.vercel.app/api/employee/process-pending-jobs
```

This will show:
- Number of pending jobs
- Number of processing jobs
- Recent completed jobs
- Recent failed jobs
- Email recipients for each job

## Manually Reset a Stuck Job
If a job is stuck in "processing" status, you can reset it:

```bash
curl -X POST https://xlb.vercel.app/api/employee/process-pending-jobs \
  -H "Content-Type: application/json" \
  -d '{"jobId": "YOUR_JOB_ID", "forceProcess": true}'
```

## Vercel Cron Job Setup
The cron job runs every minute to process pending jobs.

### Required Environment Variables:
1. **CRON_SECRET** - Set this in Vercel environment variables to secure the cron endpoint
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add: `CRON_SECRET` with a random secure value

2. Verify cron is configured:
   - Check Vercel Dashboard > Functions > Crons
   - Should show `/api/cron/process-conflict-jobs` running every minute

### Check Vercel Logs:
1. Go to Vercel Dashboard > Functions
2. Click on `process-conflict-jobs`
3. Check logs for any errors

## Common Issues:

### 1. Jobs Stay Pending
- **Cause**: Cron job not running
- **Fix**: Check CRON_SECRET is set in Vercel

### 2. Jobs Fail with PDF Extraction Error
- **Cause**: Wasabi S3 credentials not configured
- **Fix**: Ensure these env vars are set:
  - WASABI_ACCESS_KEY
  - WASABI_SECRET_KEY
  - WASABI_BUCKET
  - WASABI_ENDPOINT

### 3. Emails Not Sending
- **Cause**: Resend API not configured
- **Fix**: Ensure RESEND_API_KEY is set

### 4. Jobs Complete but No Email
- **Cause**: Email sending failed silently
- **Fix**: Check Resend dashboard for bounced emails

## Test the Cron Job Locally
```bash
# Without CRON_SECRET (for testing)
curl https://xlb.vercel.app/api/cron/process-conflict-jobs

# With CRON_SECRET
curl https://xlb.vercel.app/api/cron/process-conflict-jobs \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```