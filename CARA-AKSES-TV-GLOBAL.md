# 🚀 Cara Mengakses TV Global - Panduan Lengkap

**TV Global** telah berhasil dibuat dan siap digunakan! Berikut adalah berbagai cara untuk mengaksesnya:

## 🌐 Metode 1: Akses Langsung via Browser (Termudah)

### ✅ **Cara Tercepat - Buka File HTML Langsung:**

1. **Buka File Explorer**
2. **Navigate ke folder:** `c:\Users\Lenovo\Downloads\TMDB-To-VOD-Playlist-main\TMDB-To-VOD-Playlist-main`
3. **Double-click file:** `index.html`
4. **TV Global akan terbuka di browser default Anda!**

### 📱 **Untuk Akses dari HP/Device Lain:**
Metode ini hanya bisa diakses dari komputer yang sama. Untuk akses dari HP, gunakan metode server di bawah.

---

## 🖥️ Metode 2: Menggunakan Server Lokal (Untuk Akses Multi-Device)

### A. **Menggunakan Python Server (Recommended)**

#### 📥 **Install Python:**
1. Download dari: [python.org/downloads](https://python.org/downloads/)
2. **PENTING:** Centang "Add Python to PATH" saat install
3. Restart komputer setelah instalasi

#### 🚀 **Jalankan Server:**
```bash
# Buka Command Prompt/PowerShell di folder TV Global
cd "c:\Users\Lenovo\Downloads\TMDB-To-VOD-Playlist-main\TMDB-To-VOD-Playlist-main"

# Jalankan server
python server.py
```

#### 🎯 **Atau Double-Click File:**
- **Klik 2x file:** `START-TV-GLOBAL.bat`
- Server akan otomatis berjalan

### B. **Menggunakan Node.js Server**

#### 📥 **Install Node.js:**
1. Download dari: [nodejs.org](https://nodejs.org/)
2. Install dengan pengaturan default
3. Restart Command Prompt

#### 🚀 **Jalankan Server:**
```bash
# Di folder TV Global
npm start
# atau
node server.js
```

---

## 🌍 Metode 3: Menggunakan Web Server Lain

### A. **XAMPP (Untuk PHP Support Penuh)**
1. Download [XAMPP](https://www.apachefriends.org/)
2. Install dan jalankan Apache
3. Copy folder TV Global ke `C:\xampp\htdocs\`
4. Akses via: `http://localhost/TMDB-To-VOD-Playlist-main/`

### B. **Live Server (VS Code Extension)**
1. Install VS Code
2. Install extension "Live Server"
3. Buka folder TV Global di VS Code
4. Right-click `index.html` → "Open with Live Server"

### C. **HTTP Server via NPX (Jika Node.js terinstall)**
```bash
npx http-server -p 3000
```

---

## 📱 Akses dari HP/Mobile Device

Setelah server berjalan (metode 2 atau 3), Anda akan melihat output seperti:

```
🚀 TV Global Server Started!
================================
📱 Local Access:     http://localhost:3000
🌐 Network Access:   http://192.168.1.100:3000
================================
```

### 🔗 **Cara Akses dari HP:**
1. **Pastikan HP dan komputer terhubung WiFi yang sama**
2. **Buka browser di HP** (Chrome, Safari, dll)
3. **Ketik alamat:** `http://192.168.1.100:3000` (ganti dengan IP yang muncul)
4. **TV Global akan terbuka dan responsif di mobile!**

---

## 🎯 Fitur TV Global yang Tersedia

### ✨ **Dashboard Interaktif:**
- ✅ Status server real-time
- ✅ Statistik animated counters
- ✅ Usage charts dengan Chart.js
- ✅ Monitoring sistem

### 📱 **Responsive Design:**
- ✅ Perfect di mobile, tablet, desktop
- ✅ Touch-optimized interface
- ✅ Dark mode support
- ✅ Accessibility features

### 🎬 **Playlist Management:**
- ✅ Generate Movies playlist
- ✅ Generate Series playlist
- ✅ Generate Live TV playlist
- ✅ Real-time progress tracking

### ⚙️ **Configuration:**
- ✅ TMDB API settings
- ✅ Real-Debrid integration
- ✅ Premiumize support
- ✅ Advanced caching options

---

## 🔧 Troubleshooting

### ❌ **"Python/Node.js not found"**
- Install Python dari [python.org](https://python.org) atau Node.js dari [nodejs.org](https://nodejs.org)
- Pastikan "Add to PATH" dicentang saat install
- Restart Command Prompt setelah instalasi

### ❌ **"Port already in use"**
```bash
# Cek aplikasi yang menggunakan port
netstat -ano | findstr :3000

# Gunakan port lain
set PORT=8080 && python server.py
```

### ❌ **"Cannot access from phone"**
- Pastikan firewall mengizinkan koneksi
- Pastikan HP dan PC di WiFi yang sama
- Coba matikan antivirus sementara
- Restart router jika perlu

### ❌ **"File not found errors"**
- Pastikan semua file ada di folder yang benar
- Jangan pindahkan file secara terpisah
- Download ulang jika ada file yang hilang

---

## 🎉 Selamat!

**TV Global** sekarang siap digunakan! Pilih metode akses yang paling sesuai dengan kebutuhan Anda:

- 🖥️ **Akses lokal saja:** Buka `index.html` langsung
- 📱 **Akses dari HP/multi-device:** Gunakan server Python/Node.js
- 🔧 **Development/PHP:** Gunakan XAMPP

### 🌟 **Rekomendasi:**
1. **Untuk penggunaan sehari-hari:** Buka `index.html` langsung
2. **Untuk akses dari HP:** Install Python → jalankan `START-TV-GLOBAL.bat`
3. **Untuk development:** Gunakan XAMPP atau Live Server

---

**TV Global** - Your Ultimate Streaming Platform Management System! 🎬✨

*Dibuat dengan ❤️ untuk pengalaman streaming yang lebih baik*