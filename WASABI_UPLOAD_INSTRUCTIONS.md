# Cost Containment Vendor Directory - Wasabi Upload Instructions

## Overview
This directory contains the comprehensive healthcare cost containment vendor directory with 250+ companies across 8 tiers and 40+ subcategories.

## Files
- `cost-containment-vendor-directory.csv` - The complete vendor directory in CSV format
- `wasabi-upload.sh` - Bash script to upload to Wasabi S3
- `upload-to-wasabi.py` - Python script alternative (requires boto3)

## Vendor Directory Contents
The CSV includes:
- **Tier 1**: Pricing & Claims Optimization (RBP, Claims Repricing, Bill Review, Payment Integrity, OON Negotiation)
- **Tier 2**: Pharmacy & Specialty Rx (PBMs, Specialty Drug Management, Gene Therapy, International Sourcing, PAPs, 340B)
- **Tier 3**: Condition-Specific Management (Diabetes, MSK, Cancer, Dialysis, Transplant, Fertility, CKD)
- **Tier 4**: Care Delivery & Access (Telemedicine, Advanced Primary Care, COE, Bundled Payments, Home Health)
- **Tier 5**: Navigation & Advocacy (Patient Navigation, Care Coordination, Second Opinions, Surgical Support, Provider Quality)
- **Tier 6**: Behavioral Health & Wellness (Mental Health Platforms, SUD Programs, EAP, Lifestyle Management)
- **Tier 7**: Compliance & Administration (Benefits Admin, COBRA, HSA, FSA)
- **Tier 8**: Data & Analytics (Predictive Analytics, Population Health, Cost Transparency, ROI Measurement)

## Upload to Wasabi

### Step 1: Get Your Wasabi Credentials
1. Log into your Wasabi account at https://console.wasabisys.com
2. Go to "Access Keys" in the top menu
3. Create a new access key or use existing one
4. Note your Access Key and Secret Key

### Step 2: Set Environment Variables
```bash
export WASABI_ACCESS_KEY='your-access-key-here'
export WASABI_SECRET_KEY='your-secret-key-here'
```

### Step 3: Run the Upload Script
```bash
cd /home/sam/Documents/github-repos/xlb/xlb
./wasabi-upload.sh
```

### What the Script Does
1. Creates a new bucket named `xlb-cost-containment-directory` (if it doesn't exist)
2. Uploads the CSV file with today's date: `vendor-directory-YYYY-MM-DD.csv`
3. Sets appropriate metadata and content type
4. Provides the Wasabi console URL for accessing the file

## Alternative: Python Script
If you prefer using Python:
```bash
export WASABI_ACCESS_KEY='your-access-key-here'
export WASABI_SECRET_KEY='your-secret-key-here'
python3 upload-to-wasabi.py
```

## Accessing the File
After upload, access your file at:
- **Wasabi Console**: https://console.wasabisys.com/#/file_manager/xlb-cost-containment-directory
- **S3 Endpoint**: https://s3.us-east-1.wasabisys.com/xlb-cost-containment-directory/vendor-directory-YYYY-MM-DD.csv

## CSV Format
The CSV has the following columns:
- `Tier` - Tier number (1-8)
- `Category` - Main category name
- `Sub-Category` - Specific subcategory
- `Company Name` - Vendor company name
- `Description` - Brief description of services
- `Website` - Company website (where available)
- `Notes` - Source (Original example or Web search 2025)

## Data Sources
All vendor information was gathered from:
- Original XL Benefits research
- Industry publications and reports (2024-2025)
- Company websites and press releases
- Healthcare technology market analyses
- Independent evaluation organizations (Peterson Health Technology Institute, etc.)

## Next Steps
Consider integrating this directory into the XL Benefits website at:
- `/resources/vendor-directory` - Public searchable directory
- Interactive filtering by tier, category, and subcategory
- Company profiles with detailed information
- Rating and review system for brokers

## Questions?
Contact the XL Benefits team for more information about the vendor directory or Wasabi setup.
