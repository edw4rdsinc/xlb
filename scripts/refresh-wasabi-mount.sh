#!/bin/bash

# Refresh Wasabi Mount Script
# This script unmounts and remounts the Wasabi storage to ensure all buckets are visible

echo "🔄 Refreshing Wasabi mount..."

# Kill existing mount
echo "Stopping current mount..."
pkill -f "rclone mount wasabi:" 2>/dev/null
sleep 2

# Check if unmounted
if mountpoint -q /home/sam/wasabi-mount; then
    echo "⚠️  Mount still active, forcing unmount..."
    fusermount -u /home/sam/wasabi-mount 2>/dev/null
    sleep 1
fi

# Remount with fresh cache
echo "Starting fresh mount..."
rclone mount wasabi: /home/sam/wasabi-mount \
    --vfs-cache-mode writes \
    --vfs-cache-max-age 24h \
    --vfs-read-chunk-size 128M \
    --vfs-read-chunk-size-limit off \
    --buffer-size 64M \
    --dir-cache-time 72h \
    --poll-interval 15s \
    --daemon

sleep 3

# Verify mount
if mountpoint -q /home/sam/wasabi-mount; then
    BUCKET_COUNT=$(ls -d /home/sam/wasabi-mount/*/ 2>/dev/null | wc -l)
    echo "✅ Mount successful! Found $BUCKET_COUNT buckets:"
    ls -la /home/sam/wasabi-mount/
else
    echo "❌ Mount failed! Please check your rclone configuration."
    exit 1
fi