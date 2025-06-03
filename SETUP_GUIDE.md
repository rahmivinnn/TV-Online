# 🎬 TV Global Setup Guide

## Quick Start Guide

### 1. Get Your TMDB API Key (Required)

**TV Global needs a TMDB API key to generate movies and series. Follow these steps:**

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account or login
3. Go to [API Settings](https://www.themoviedb.org/settings/api)
4. Click "Create" and fill out the form:
   - **Application Name**: TV Global
   - **Application URL**: Your website or GitHub repo
   - **Application Summary**: Personal streaming platform
5. Copy your **API Key (v3 auth)**

### 2. Configure TV Global

**Method 1: Using the Web Interface (Recommended)**
1. Open TV Global in your browser
2. Click the "⚙️ Configuration" button
3. Paste your TMDB API key in the "TMDB API Key" field
4. Click "Save Configuration"

**Method 2: Edit config.php directly**
1. Open `config.php` in a text editor
2. Find the line: `$apiKey = 'YOUR_API_KEY_HERE';`
3. Replace `YOUR_API_KEY_HERE` with your actual API key
4. Save the file

### 3. Generate Your Content

1. Click "Generate Movies" to create your movie playlist
2. Click "Generate Series" to create your TV series playlist
3. Wait for the generation to complete (this may take a few minutes)

### 4. Access Your Playlists

- **Movies**: `playlist.m3u8`
- **TV Series**: `tv_playlist.m3u8`
- **Live TV**: `live_playlist.m3u8`

## Troubleshooting

### ❌ "TMDB API Key required" Error
- Make sure you've entered a valid TMDB API key
- Check that the key is correctly formatted (32 characters)
- Verify your TMDB account is active

### ❌ Generation Fails
- Check your internet connection
- Verify your TMDB API key is working
- Try refreshing the page and generating again

### ❌ Empty Playlists
- Make sure `$userCreatePlaylist = true;` in config.php
- Check that the generation process completed successfully
- Verify your server has write permissions

## Features

✅ **Netflix-Style Interface** - Modern, dark theme UI
✅ **Real-time Progress** - Watch generation progress live
✅ **Smart Notifications** - Clear error messages and status updates
✅ **Mobile Responsive** - Works on all devices
✅ **Easy Configuration** - Web-based settings panel

## Support

If you need help:
1. Check this guide first
2. Verify your TMDB API key is valid
3. Check the browser console for error messages
4. Make sure all files have proper permissions

---

**Enjoy your personal Netflix-style streaming platform! 🍿**