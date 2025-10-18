#!/bin/bash
# Upload Cost Containment Vendor Directory to Wasabi S3
# Usage: ./wasabi-upload.sh

# Configuration
BUCKET_NAME="xlb-cost-containment-directory"
FILE_PATH="/home/sam/Documents/github-repos/xlb/xlb/cost-containment-vendor-directory.csv"
WASABI_ENDPOINT="https://s3.us-east-1.wasabisys.com"
WASABI_REGION="us-east-1"
TIMESTAMP=$(date +%Y-%m-%d)
OBJECT_KEY="vendor-directory-${TIMESTAMP}.csv"

echo "============================================================"
echo "XL Benefits - Cost Containment Vendor Directory Upload"
echo "============================================================"
echo ""

# Check if Wasabi credentials are set
if [ -z "$WASABI_ACCESS_KEY" ] || [ -z "$WASABI_SECRET_KEY" ]; then
    echo "ERROR: Wasabi credentials not found in environment variables."
    echo ""
    echo "Please set your Wasabi credentials:"
    echo "  export WASABI_ACCESS_KEY='your-access-key'"
    echo "  export WASABI_SECRET_KEY='your-secret-key'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Create temporary AWS credentials file for Wasabi
mkdir -p ~/.aws
cat > ~/.aws/credentials.wasabi << EOF
[wasabi]
aws_access_key_id = ${WASABI_ACCESS_KEY}
aws_secret_access_key = ${WASABI_SECRET_KEY}
EOF

cat > ~/.aws/config.wasabi << EOF
[profile wasabi]
region = ${WASABI_REGION}
output = json
EOF

echo "✓ Wasabi credentials configured"
echo ""

# Create bucket if it doesn't exist
echo "Checking if bucket exists..."
aws s3api head-bucket \
    --bucket ${BUCKET_NAME} \
    --endpoint-url ${WASABI_ENDPOINT} \
    --profile wasabi \
    --region ${WASABI_REGION} \
    2>/dev/null

if [ $? -ne 0 ]; then
    echo "Creating bucket: ${BUCKET_NAME}"
    aws s3api create-bucket \
        --bucket ${BUCKET_NAME} \
        --endpoint-url ${WASABI_ENDPOINT} \
        --profile wasabi \
        --region ${WASABI_REGION}
    echo "✓ Bucket created successfully"
else
    echo "✓ Bucket already exists"
fi

echo ""

# Upload the file
echo "Uploading ${FILE_PATH}"
echo "  to bucket: ${BUCKET_NAME}"
echo "  as object: ${OBJECT_KEY}"
echo ""

aws s3 cp ${FILE_PATH} \
    s3://${BUCKET_NAME}/${OBJECT_KEY} \
    --endpoint-url ${WASABI_ENDPOINT} \
    --profile wasabi \
    --region ${WASABI_REGION} \
    --content-type "text/csv" \
    --metadata "upload-date=$(date -Iseconds),description=Healthcare Cost Containment Vendor Directory"

if [ $? -eq 0 ]; then
    FILE_SIZE=$(wc -c < ${FILE_PATH})
    FILE_SIZE_KB=$(echo "scale=2; ${FILE_SIZE}/1024" | bc)

    echo ""
    echo "============================================================"
    echo "✓ Upload completed successfully!"
    echo "============================================================"
    echo ""
    echo "Bucket:     ${BUCKET_NAME}"
    echo "Object Key: ${OBJECT_KEY}"
    echo "File Size:  ${FILE_SIZE} bytes (${FILE_SIZE_KB} KB)"
    echo ""
    echo "Wasabi Console: https://console.wasabisys.com/#/file_manager/${BUCKET_NAME}"
    echo ""

    # Clean up temp credentials
    rm -f ~/.aws/credentials.wasabi ~/.aws/config.wasabi

    exit 0
else
    echo ""
    echo "✗ Upload failed. Please check errors above."

    # Clean up temp credentials
    rm -f ~/.aws/credentials.wasabi ~/.aws/config.wasabi

    exit 1
fi
