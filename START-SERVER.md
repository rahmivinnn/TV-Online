# 🚀 TV Global - Local Server Setup

Panduan lengkap untuk menjalankan TV Global di server lokal tanpa perlu hosting eksternal seperti Vercel atau Netlify.

## 📋 Persyaratan

- **Node.js** (versi 12 atau lebih baru)
- **NPM** (biasanya sudah termasuk dengan Node.js)

## 🔧 Instalasi Node.js

### Windows:
1. Download Node.js dari [nodejs.org](https://nodejs.org/)
2. Jalankan installer dan ikuti petunjuk
3. Restart Command Prompt/PowerShell

### Verifikasi Instalasi:
```bash
node --version
npm --version
```

## 🚀 Cara Menjalankan Server

### Metode 1: Menggunakan NPM (Recommended)
```bash
# Buka terminal/command prompt di folder ini
cd "c:\Users\Lenovo\Downloads\TMDB-To-VOD-Playlist-main\TMDB-To-VOD-Playlist-main"

# Jalankan server
npm start
```

### Metode 2: Langsung dengan Node.js
```bash
# Buka terminal/command prompt di folder ini
cd "c:\Users\Lenovo\Downloads\TMDB-To-VOD-Playlist-main\TMDB-To-VOD-Playlist-main"

# Jalankan server
node server.js
```

## 🌐 Mengakses TV Global

Setelah server berjalan, Anda akan melihat output seperti ini:

```
🚀 TV Global Server Started!
================================
📱 Local Access:     http://localhost:3000
🌐 Network Access:   http://192.168.1.100:3000
================================

📋 Cara Akses:
• Dari komputer ini: buka http://localhost:3000
• Dari HP/device lain di jaringan yang sama: buka http://192.168.1.100:3000

⚠️  Pastikan firewall mengizinkan koneksi pada port 3000

🛑 Tekan Ctrl+C untuk menghentikan server
```

### Akses dari Berbagai Device:

#### 🖥️ **Dari Komputer yang Sama:**
- Buka browser dan kunjungi: `http://localhost:3000`

#### 📱 **Dari HP/Tablet di Jaringan yang Sama:**
- Buka browser dan kunjungi: `http://[IP_ADDRESS]:3000`
- Ganti `[IP_ADDRESS]` dengan IP yang ditampilkan di terminal

#### 💻 **Dari Komputer Lain di Jaringan yang Sama:**
- Buka browser dan kunjungi: `http://[IP_ADDRESS]:3000`

## 🔧 Konfigurasi Port

Jika port 3000 sudah digunakan, Anda bisa mengubah port:

```bash
# Windows
set PORT=8080 && npm start

# Linux/Mac
PORT=8080 npm start
```

## 🛡️ Firewall Settings

### Windows Firewall:
1. Buka **Windows Security** → **Firewall & network protection**
2. Klik **Allow an app through firewall**
3. Klik **Change Settings** → **Allow another app**
4. Browse dan pilih `node.exe` (biasanya di `C:\Program Files\nodejs\node.exe`)
5. Centang **Private** dan **Public**

### Atau buka port secara manual:
```bash
# Buka Command Prompt sebagai Administrator
netsh advfirewall firewall add rule name="TV Global Server" dir=in action=allow protocol=TCP localport=3000
```

## 📱 Akses dari HP/Mobile

1. Pastikan HP dan komputer terhubung ke WiFi yang sama
2. Di HP, buka browser (Chrome, Safari, dll)
3. Ketik alamat: `http://[IP_KOMPUTER]:3000`
4. TV Global akan terbuka dan responsif di mobile

## 🔍 Troubleshooting

### Server tidak bisa diakses dari device lain:
- ✅ Pastikan firewall mengizinkan koneksi
- ✅ Pastikan semua device di jaringan WiFi yang sama
- ✅ Coba matikan antivirus sementara
- ✅ Restart router jika perlu

### Port sudah digunakan:
```bash
# Cek aplikasi yang menggunakan port 3000
netstat -ano | findstr :3000

# Gunakan port lain
set PORT=8080 && npm start
```

### Node.js tidak ditemukan:
- Download dan install Node.js dari [nodejs.org](https://nodejs.org/)
- Restart terminal setelah instalasi
- Verifikasi dengan `node --version`

## 🎯 Fitur TV Global

- ✅ **Dashboard Interaktif**: Status server real-time
- ✅ **Responsive Design**: Optimal di semua device
- ✅ **Playlist Management**: Kelola film, series, live TV
- ✅ **Real-time Statistics**: Monitoring penggunaan
- ✅ **Mobile Optimized**: Perfect di HP dan tablet
- ✅ **Dark Mode**: Tema gelap otomatis
- ✅ **Offline Ready**: Bekerja tanpa internet

## 🆘 Bantuan

Jika mengalami masalah:
1. Pastikan Node.js terinstall dengan benar
2. Cek firewall dan antivirus
3. Pastikan port tidak digunakan aplikasi lain
4. Restart komputer jika perlu

---

**TV Global** - Your Ultimate Streaming Platform Management System 🎬✨