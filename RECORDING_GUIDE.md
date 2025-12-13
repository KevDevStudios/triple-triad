# Gameplay Recording Feature - User Guide

## Overview
The Triple Triad game now includes a built-in gameplay recording feature that allows you to capture your matches and save them as video files.

## How It Works
The recording feature uses the browser's **MediaRecorder API** along with **getDisplayMedia** to capture screen content. This is a standard web API supported by modern browsers (Chrome, Edge, Firefox, Safari).

## Using the Recording Feature

### 1. Starting a Recording
- When you're in a game, look for the **🎥 Record** button in the top-left corner
- Click the button to start recording
- Your browser will prompt you to select what to share:
  - **Tab**: Share just the game tab (recommended)
  - **Window**: Share the entire browser window
  - **Entire Screen**: Share your full screen
- Select your preference and click "Share"

### 2. During Recording
- The button changes to **⏹️ Recording...** with a pulsing animation
- Play your game normally - all actions are being captured
- You can play multiple rounds if you want

### 3. Stopping the Recording
- Click the **⏹️ Recording...** button to stop
- The recording will be processed automatically

### 4. Downloading Your Video
- After stopping, a **💾 Download** button appears
- Click it to save your gameplay video
- The file will be saved as `triple-triad-gameplay-[timestamp].webm`
- You can also click **🎥 New** to start another recording

## Technical Details

### Supported Browsers
- ✅ Chrome/Chromium (v72+)
- ✅ Edge (v79+)
- ✅ Firefox (v66+)
- ✅ Safari (v13+)

### Video Format
- **Format**: WebM (VP9 codec)
- **Quality**: Up to 1080p (based on your screen resolution)
- **File Size**: Varies based on length and content (typically 1-5 MB per minute)

### Playback
WebM files can be played in:
- Modern web browsers
- VLC Media Player
- Windows Media Player (with codec pack)
- macOS QuickTime (with plugins)
- Online converters can convert to MP4 if needed

## Troubleshooting

### Browser Permission Denied
If you see a permission error:
1. Check your browser settings
2. Allow screen sharing for the site
3. Try refreshing the page

### No Video/Audio
- The current implementation captures video only (no audio)
- To include game audio, enable system audio sharing in the browser prompt

### Video Won't Download
- Try a different browser
- Check your browser's download settings
- Ensure you have disk space available

## Privacy & Security
- Recording happens entirely in your browser
- No data is sent to external servers
- Videos are stored locally on your device
- You have full control over what gets recorded and saved

## Tips for Best Results
1. **Close unnecessary tabs** for better performance
2. **Use "Tab" sharing** for cleaner recordings
3. **Start recording before the coin flip** to capture the full game
4. **Keep the game tab active** during recording
5. **Don't switch tabs** while recording for best quality

Enjoy recording and sharing your Triple Triad victories! 🎮🎥
