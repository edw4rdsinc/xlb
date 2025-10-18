#!/usr/bin/env python3
"""
Upload Cost Containment Vendor Directory to Wasabi S3
"""
import boto3
import os
from datetime import datetime

# Wasabi configuration
WASABI_ACCESS_KEY = os.environ.get('WASABI_ACCESS_KEY', '')
WASABI_SECRET_KEY = os.environ.get('WASABI_SECRET_KEY', '')
WASABI_REGION = 'us-east-1'  # Wasabi default region
WASABI_ENDPOINT = 'https://s3.us-east-1.wasabisys.com'

# Bucket configuration
BUCKET_NAME = 'xlb-cost-containment-directory'
FILE_PATH = '/home/sam/Documents/github-repos/xlb/xlb/cost-containment-vendor-directory.csv'
OBJECT_KEY = f'vendor-directory-{datetime.now().strftime("%Y-%m-%d")}.csv'

def upload_to_wasabi():
    """Upload the vendor directory CSV to Wasabi"""

    if not WASABI_ACCESS_KEY or not WASABI_SECRET_KEY:
        print("ERROR: Wasabi credentials not found in environment variables.")
        print("Please set WASABI_ACCESS_KEY and WASABI_SECRET_KEY")
        return False

    try:
        # Create Wasabi S3 client
        s3_client = boto3.client(
            's3',
            endpoint_url=WASABI_ENDPOINT,
            aws_access_key_id=WASABI_ACCESS_KEY,
            aws_secret_access_key=WASABI_SECRET_KEY,
            region_name=WASABI_REGION
        )

        # Check if bucket exists, create if it doesn't
        try:
            s3_client.head_bucket(Bucket=BUCKET_NAME)
            print(f"✓ Bucket '{BUCKET_NAME}' already exists")
        except:
            print(f"Creating new bucket: {BUCKET_NAME}")
            s3_client.create_bucket(Bucket=BUCKET_NAME)
            print(f"✓ Bucket '{BUCKET_NAME}' created successfully")

        # Upload the file
        print(f"\nUploading {FILE_PATH} to {BUCKET_NAME}/{OBJECT_KEY}")

        with open(FILE_PATH, 'rb') as file_data:
            s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=OBJECT_KEY,
                Body=file_data,
                ContentType='text/csv',
                Metadata={
                    'upload-date': datetime.now().isoformat(),
                    'description': 'Healthcare Cost Containment Vendor Directory'
                }
            )

        print(f"✓ File uploaded successfully!")
        print(f"\nWasabi URL: {WASABI_ENDPOINT.replace('https://s3.', 'https://s3.console.')}/buckets/{BUCKET_NAME}")
        print(f"Object Key: {OBJECT_KEY}")

        # Get file info
        file_size = os.path.getsize(FILE_PATH)
        print(f"File Size: {file_size:,} bytes ({file_size/1024:.2f} KB)")

        return True

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("XL Benefits - Cost Containment Vendor Directory Upload")
    print("=" * 60)
    success = upload_to_wasabi()
    if success:
        print("\n✓ Upload completed successfully!")
    else:
        print("\n✗ Upload failed. Please check errors above.")
