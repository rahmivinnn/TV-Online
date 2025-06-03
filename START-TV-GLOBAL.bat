@echo off
chcp 65001 >nul
color 0A
title TV Global Server - Local Access

echo.
echo ████████╗██╗   ██╗     ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     
echo ╚══██╔══╝██║   ██║    ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     
echo    ██║   ██║   ██║    ██║  ███╗██║     ██║   ██║██████╔╝███████║██║     
echo    ██║   ╚██╗ ██╔╝    ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     
echo    ██║    ╚████╔╝     ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗
echo    ╚═╝     ╚═══╝       ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
echo.
echo                    Interactive Streaming Platform Management
echo                              Local Server Launcher
echo.
echo ================================================================================
echo.

REM Cek apakah Python tersedia
echo 🔍 Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Python tidak ditemukan!
    echo.
    echo 📥 Silakan install Python terlebih dahulu:
    echo    1. Kunjungi: https://www.python.org/downloads/
    echo    2. Download Python 3.7 atau lebih baru
    echo    3. Install dengan mencentang "Add Python to PATH"
    echo    4. Restart komputer setelah instalasi
    echo.
    echo 🔄 Atau coba gunakan 'py' command:
    py --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo    ❌ 'py' command juga tidak tersedia
        echo.
        echo 💡 Alternatif lain:
        echo    • Install Node.js dan jalankan: npm start
        echo    • Gunakan XAMPP/WAMP untuk PHP server
        echo.
        pause
        exit /b 1
    ) else (
        echo    ✅ 'py' command tersedia, menggunakan 'py' sebagai gantinya...
        set PYTHON_CMD=py
        goto :start_server
    )
) else (
    echo ✅ Python ditemukan!
    set PYTHON_CMD=python
)

:start_server
echo.
echo 🚀 Starting TV Global Server...
echo.

REM Pindah ke direktori script
cd /d "%~dp0"

REM Cek apakah file server.py ada
if not exist "server.py" (
    echo ❌ Error: File server.py tidak ditemukan!
    echo    Pastikan file ini berada di folder yang sama dengan server.py
    echo.
    pause
    exit /b 1
)

REM Cek apakah file index.html ada
if not exist "index.html" (
    echo ❌ Error: File index.html tidak ditemukan!
    echo    Pastikan Anda berada di folder TV Global yang benar
    echo.
    pause
    exit /b 1
)

echo 📂 Working directory: %CD%
echo 🐍 Python command: %PYTHON_CMD%
echo.
echo ⏳ Launching server...
echo.
echo ================================================================================

REM Jalankan server Python
%PYTHON_CMD% server.py

REM Jika server berhenti
echo.
echo ================================================================================
echo.
echo 🛑 TV Global Server telah dihentikan.
echo.
echo 💡 Tips:
echo    • Untuk menjalankan lagi, double-click file ini
echo    • Untuk akses dari HP, gunakan IP yang ditampilkan tadi
echo    • Pastikan firewall mengizinkan koneksi
echo.
echo 🆘 Jika ada masalah:
echo    • Cek apakah port 3000 sudah digunakan aplikasi lain
echo    • Restart komputer jika perlu
echo    • Baca file START-SERVER.md untuk panduan lengkap
echo.
pause