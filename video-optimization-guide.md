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
