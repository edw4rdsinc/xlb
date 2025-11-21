#!/usr/bin/env python3
"""
Generate text scene images for Self-Funding Readiness Assessment video
"""
from PIL import Image, ImageDraw, ImageFont
import os

# XL Benefits Brand Colors
COLORS = {
    'xl_dark_blue': '#003366',
    'xl_bright_blue': '#0099CC',
    'white': '#FFFFFF',
    'gray': '#F0F0F0',
}

# Video dimensions
WIDTH = 1920
HEIGHT = 1080

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_text_scene(text, bg_color, text_color, filename, font_size=80, max_width=1400):
    """Create a centered text scene"""
    img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(bg_color))
    draw = ImageDraw.Draw(img)

    # Try to use a nice font, fallback to default
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except:
        font = ImageFont.load_default()

    # Word wrap text
    words = text.split()
    lines = []
    current_line = []

    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]

    if current_line:
        lines.append(' '.join(current_line))

    # Calculate total height and draw centered text
    line_height = font_size * 1.3
    total_height = len(lines) * line_height
    y = (HEIGHT - total_height) / 2

    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) / 2
        draw.text((x, y), line, fill=hex_to_rgb(text_color), font=font)
        y += line_height

    img.save(filename)
    print(f"Created: {filename}")

def create_cta_scene(url, bg_color, filename):
    """Create call-to-action scene with large URL"""
    img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(bg_color))
    draw = ImageDraw.Draw(img)

    try:
        font_large = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 120)
        font_small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 60)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Draw main URL
    bbox = draw.textbbox((0, 0), url, font=font_large)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) / 2
    y = HEIGHT / 2 - 80
    draw.text((x, y), url, fill=hex_to_rgb(COLORS['white']), font=font_large)

    # Draw button text below
    button_text = "Try It Free Today"
    bbox = draw.textbbox((0, 0), button_text, font=font_small)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) / 2
    y = HEIGHT / 2 + 100

    # Draw button background
    padding = 40
    draw.rounded_rectangle(
        [x - padding, y - 20, x + text_width + padding, y + 80],
        radius=10,
        fill=hex_to_rgb(COLORS['xl_bright_blue'])
    )
    draw.text((x, y), button_text, fill=hex_to_rgb(COLORS['white']), font=font_small)

    img.save(filename)
    print(f"Created: {filename}")

def create_logo_scene(logo_path, tagline, bg_color, filename):
    """Create closing logo scene"""
    img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(bg_color))

    # Load and paste XL Benefits logo (centered)
    try:
        logo = Image.open(logo_path)
        # Resize logo to reasonable size
        logo.thumbnail((600, 300), Image.Resampling.LANCZOS)
        logo_x = (WIDTH - logo.width) // 2
        logo_y = (HEIGHT - logo.height) // 2 - 100
        img.paste(logo, (logo_x, logo_y), logo if logo.mode == 'RGBA' else None)
    except Exception as e:
        print(f"Warning: Could not load logo: {e}")

    # Add tagline below logo
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 50)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), tagline, font=font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) / 2
    y = HEIGHT / 2 + 150
    draw.text((x, y), tagline, fill=hex_to_rgb(COLORS['white']), font=font)

    img.save(filename)
    print(f"Created: {filename}")

# Generate all scenes
output_dir = '/home/sam/Documents/github-repos/xlb/xlb/videos/self-funding-readiness-assessment/production'

print("Generating video scenes...")

# Scene 1: Opening Hook
create_text_scene(
    "You didn't get into health insurance to push the same policies year after year.",
    COLORS['xl_dark_blue'],
    COLORS['white'],
    f'{output_dir}/scene-01-hook.png',
    font_size=70
)

# Scene 2: The Challenge
create_text_scene(
    "But here's the challenge: You know self-funding could be transformational for some of your clients, but you're not sure who's ready.",
    COLORS['xl_dark_blue'],
    COLORS['white'],
    f'{output_dir}/scene-02-challenge.png',
    font_size=60
)

# Scene 6: Co-Branding
create_text_scene(
    "Co-branded with your logo + client logo",
    COLORS['xl_bright_blue'],
    COLORS['white'],
    f'{output_dir}/scene-06-cobranding.png',
    font_size=80
)

# Scene 9: Call to Action
create_cta_scene(
    'xlbenefits.com',
    COLORS['xl_dark_blue'],
    f'{output_dir}/scene-09-cta.png'
)

# Scene 10: Closing
create_logo_scene(
    '/home/sam/Documents/github-repos/xlb/xlb/public/images/logos/xl-logo-full.png',
    'Empowering you to serve with excellence.',
    COLORS['xl_dark_blue'],
    f'{output_dir}/scene-10-closing.png'
)

print("\nAll scenes generated successfully!")
