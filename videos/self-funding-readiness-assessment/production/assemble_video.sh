#!/bin/bash
# Assemble Self-Funding Readiness Assessment Video
# Total duration: 90 seconds

set -e

DIR="/home/sam/Documents/github-repos/xlb/xlb/videos/self-funding-readiness-assessment/production"
OG_IMAGE="/home/sam/Documents/github-repos/xlb/xlb/public/images/og/self-funding-readiness-assessment.png"

echo "Assembling 92-second video (2s intro + 90s content)..."

# Create individual scene videos with proper timing
# Scene 0: Silent Intro - XL Logo (2 seconds)
ffmpeg -y -loop 1 -i "/home/sam/Documents/github-repos/xlb/xlb/public/images/logos/xl-logo-full.png" -t 2 \
    -vf "scale=600:-1,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#003366,fade=in:0:15" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s00.mp4"

# Scene 1: Hook (8 seconds)
ffmpeg -y -loop 1 -i "$DIR/scene-01-hook.png" -t 8 -vf "fade=in:0:30,fade=out:210:30" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s01.mp4"

# Scene 2: Challenge (8 seconds)
ffmpeg -y -loop 1 -i "$DIR/scene-02-challenge.png" -t 8 -vf "fade=in:0:30,fade=out:210:30" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s02.mp4"

# Scene 3-5: OG Image full reveal with zoom (30 seconds: 16-46s)
# Slow zoom in effect
ffmpeg -y -loop 1 -i "$OG_IMAGE" -t 30 \
    -vf "scale=2200:-1,zoompan=z='min(zoom+0.001,1.15)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080,fade=in:0:30,fade=out:870:30" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s03-05.mp4"

# Scene 6: Co-branding (8 seconds)
ffmpeg -y -loop 1 -i "$DIR/scene-06-cobranding.png" -t 8 -vf "fade=in:0:30,fade=out:210:30" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s06.mp4"

# Scene 7-8: OG Image return (18 seconds: 54-72s)
# Slight pull back effect
ffmpeg -y -loop 1 -i "$OG_IMAGE" -t 18 \
    -vf "scale=2000:-1,zoompan=z='if(lte(on,1),1.1,max(1.0,zoom-0.002))':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080,fade=in:0:30,fade=out:510:30" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s07-08.mp4"

# Scene 9: Call to Action (10 seconds)
ffmpeg -y -loop 1 -i "$DIR/scene-09-cta.png" -t 10 -vf "fade=in:0:30,fade=out:270:30" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s09.mp4"

# Scene 10: Closing (8 seconds)
ffmpeg -y -loop 1 -i "$DIR/scene-10-closing.png" -t 8 -vf "fade=in:0:30,fade=out:210:30" \
    -c:v libx264 -pix_fmt yuv420p "$DIR/s10.mp4"

# Create concat file
cat > "$DIR/concat.txt" << EOF
file 's00.mp4'
file 's01.mp4'
file 's02.mp4'
file 's03-05.mp4'
file 's06.mp4'
file 's07-08.mp4'
file 's09.mp4'
file 's10.mp4'
EOF

# Concatenate all scenes
ffmpeg -y -f concat -safe 0 -i "$DIR/concat.txt" -c copy "$DIR/video-no-audio.mp4"

echo "✓ Video assembled: $DIR/video-no-audio.mp4"
echo "  Duration: 92 seconds (2s silent intro + 90s content)"
echo "  Resolution: 1920x1080"
echo "  Ready for ElevenLabs voiceover overlay"
echo ""
echo "Next steps:"
echo "1. Generate voiceover with ElevenLabs using the script (starts at 2s mark)"
echo "2. Overlay audio: ffmpeg -i video-no-audio.mp4 -i voiceover.mp3 -c:v copy -c:a aac -shortest final-video.mp4"
