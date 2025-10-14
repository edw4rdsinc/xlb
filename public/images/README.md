# Image Directory Structure

This directory contains all images for the XL Benefits website.

## Directory Structure

### `/logos`
- `xl-logo-icon.png` - Small logo for header
- `xl-logo-full.png` - Full logo for footer

### `/other-images`
- `xlb-hero.png` - Homepage hero image (Superboy)

### `/team` (Awaiting Upload)
Upload team member professional photos here with the following naming convention:
- `daron-pitts.jpg`
- `jennifer-baird.jpg`
- `steve-caler.jpg`
- `samuel-edwards.jpg`
- `joe-landziak.jpg`
- `christine-childs.jpg`
- `erin-maurer.jpg`

Optionally, add baby pictures with `-baby` suffix:
- `daron-pitts-baby.jpg`
- etc.

### `/parallax` (Awaiting Upload)
Parallax background images for various pages:
- `waiter.jpg` - For "How We Help" page
- `chocolate.jpg` - For Toolkit page
- `lightbulb.jpg` - For Resources page
- `football.jpg` - For Fantasy Football page
- `phone.jpg` - For Contact Us navbar link
- Add any other parallax images with descriptive names

### `/icons` (Awaiting Upload)
Icon graphics for page headers and features

## Image Guidelines

### Recommended Specifications
- **Team Photos**: 400x400px, square, professional headshots
- **Baby Photos**: 400x400px, square
- **Parallax Images**: Minimum 1920x1080px, landscape orientation
- **Icons**: SVG preferred, or PNG 512x512px
- **Format**: JPG for photos, PNG for graphics with transparency, SVG for icons
- **Optimization**: Compress images before upload (use tools like TinyPNG, ImageOptim)

### File Naming
- Use lowercase
- Use hyphens instead of spaces
- Be descriptive: `waiter-serving-food.jpg` not `img1.jpg`

## Adding New Images

1. Place images in the appropriate directory
2. Follow naming conventions
3. Update relevant React components to reference the new images
4. Test images load correctly in development before deploying

## Image Usage in Components

```tsx
// Static import (recommended for critical images)
import Image from 'next/image'
<Image src="/images/team/daron-pitts.jpg" alt="Daron Pitts" width={400} height={400} />

// Dynamic path (for user-uploaded or variable images)
<img src="/images/parallax/waiter.jpg" alt="Description" className="..." />
```
