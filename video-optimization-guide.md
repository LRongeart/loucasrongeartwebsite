# Video Optimization Guide for Web Background

## Recommended Settings for Background Video:

### Resolution & Quality:
- **Resolution**: 1280x720 (720p) - Perfect for background use
- **Frame Rate**: 30fps maximum
- **Duration**: 30-60 seconds (loop the best parts)
- **Codec**: H.264/AVC
- **Container**: MP4

### Compression Settings:
- **Bitrate**: 2-4 Mbps (balance quality vs file size)
- **Audio**: Remove completely (not needed for background)
- **Target File Size**: Under 15-20MB

### Export Instructions:

#### Using Adobe Media Encoder/Premiere:
1. Format: H.264
2. Preset: YouTube 720p HD
3. Video tab:
   - Bitrate: VBR, 1 pass, Target 3 Mbps, Max 4 Mbps
   - Profile: High, Level: 4.1
4. Audio: Delete audio track
5. Effects: 
   - Crop to 16:9 if needed
   - Color correction for web viewing

#### Using HandBrake (Free):
1. Preset: "Web Optimized"
2. Video tab:
   - Codec: H.264
   - Quality: RF 23-25
   - Framerate: 30fps constant
3. Audio: Remove all audio tracks
4. Dimensions: 1280x720

#### Using FFmpeg (Command Line):
```bash
ffmpeg -i input.mp4 -ss 15 -to 126 -vf "scale=1280:720" -c:v libx264 -crf 25 -preset medium -an background_showreel.mp4
```

## File Structure:
```
/img/reel/
├── LR_showreel_2023_12.mp4 (original)
└── LR_showreel_background_optimized.mp4 (new optimized version)
```

This will create a smooth, web-optimized background video that won't stutter.

# Higher Quality Background Video Settings

## Premium Quality Web Background (Recommended):

### Resolution & Quality:
- **Resolution**: 1280x720 (720p) - Perfect match for your source
- **Frame Rate**: 30fps 
- **Duration**: 30-60 seconds (your best showcase moments)
- **Codec**: H.264/AVC
- **Container**: MP4

### Compression Settings (Higher Quality for 720p):
- **Bitrate**: 3-5 Mbps (optimized for 720p source)
- **Audio**: Remove completely
- **Target File Size**: 15-25MB (perfect balance for 720p)

### Export Instructions for Higher Quality:

#### Using Adobe Media Encoder/Premiere (High Quality):
1. Format: H.264
2. Preset: Custom
3. Video tab:
   - Bitrate: VBR, 2 pass, Target 6 Mbps, Max 8 Mbps
   - Profile: High, Level: 4.2
   - Quality: 100 (maximum)
4. Audio: Delete audio track
5. Effects: 
   - Preserve original 720p resolution
   - Color correction for web viewing
   - Slight sharpening for web display

#### Using HandBrake (High Quality):
1. Preset: "Web Optimized" as base
2. Video tab:
   - Codec: H.264
   - Quality: RF 18-20 (higher quality than 23-25)
   - Framerate: 30fps constant
3. Audio: Remove all audio tracks
4. Dimensions: 1280x720 (preserve source resolution)
5. Filters: Unsharp mask (light sharpening)

#### Using FFmpeg (High Quality Command for 720p):
```bash
# Higher quality 720p version (optimized for your source resolution)
ffmpeg -i "LR_showreel_2023_12.mp4" -ss 15 -to 126 -vf "scale=1280:720" -c:v libx264 -crf 18 -preset medium -profile:v high -level 4.1 -an "LR_showreel_background_HQ.mp4"

# Alternative: Bitrate-controlled 720p version (recommended)
ffmpeg -i "LR_showreel_2023_12.mp4" -ss 15 -to 126 -vf "scale=1280:720" -c:v libx264 -b:v 4M -maxrate 5M -bufsize 7M -preset medium -an "LR_showreel_background_HQ.mp4"
```

## File Comparison:
```
/img/reel/
├── LR_showreel_2023_12.mp4 (original - large)
├── LR_showreel_2023_12_background.mp4 (current - small but low quality)
└── LR_showreel_background_HQ.mp4 (new - balanced quality/size)
```

## Quality vs Performance Balance:

### Low Quality (Current):
- File size: ~5-10MB
- Quality: Basic, pixelated
- Performance: Excellent

### **High Quality 720p (Recommended for your source):**
- File size: ~15-25MB  
- Quality: Professional, crisp (no upscaling artifacts)
- Performance: Excellent (optimized for source resolution)

### Premium Quality (If needed):
- File size: ~50-80MB
- Quality: Broadcast level
- Performance: Good (for high-end showcases)

The "High Quality" option is the sweet spot for professional portfolios!
