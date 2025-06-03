#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TV Global - Local Server
Server HTTP sederhana untuk menjalankan TV Global secara lokal
"""

import http.server
import socketserver
import os
import socket
import webbrowser
from urllib.parse import urlparse
import mimetypes
import sys

# Konfigurasi
PORT = 3000
HOST = '0.0.0.0'  # Bind ke semua interface

class TVGlobalHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP Request Handler untuk TV Global"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Tambahkan CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_GET(self):
        # Redirect root ke index.html
        if self.path == '/':
            self.path = '/index.html'
        
        # Handle PHP files (tampilkan sebagai text)
        if self.path.endswith('.php'):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            try:
                with open(self.path[1:], 'r', encoding='utf-8') as f:
                    content = f.read()
                    self.wfile.write(content.encode('utf-8'))
            except FileNotFoundError:
                self.send_error(404, "File not found")
            return
        
        # Handle file lainnya
        super().do_GET()
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.address_string()}] {format % args}")

def get_local_ip():
    """Mendapatkan IP lokal"""
    try:
        # Connect ke Google DNS untuk mendapatkan IP lokal
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "localhost"

def find_available_port(start_port=3000):
    """Mencari port yang tersedia"""
    port = start_port
    while port < start_port + 100:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            port += 1
    return None

def main():
    """Fungsi utama untuk menjalankan server"""
    
    # Cek apakah index.html ada
    if not os.path.exists('index.html'):
        print("❌ Error: File index.html tidak ditemukan!")
        print("   Pastikan Anda menjalankan server dari folder yang benar.")
        input("\nTekan Enter untuk keluar...")
        return
    
    # Cari port yang tersedia
    available_port = find_available_port(PORT)
    if not available_port:
        print(f"❌ Error: Tidak dapat menemukan port yang tersedia mulai dari {PORT}")
        input("\nTekan Enter untuk keluar...")
        return
    
    # Setup server
    try:
        with socketserver.TCPServer((HOST, available_port), TVGlobalHTTPRequestHandler) as httpd:
            local_ip = get_local_ip()
            
            print("\n" + "="*50)
            print("🚀 TV GLOBAL SERVER STARTED!")
            print("="*50)
            print(f"📱 Local Access:     http://localhost:{available_port}")
            print(f"🌐 Network Access:   http://{local_ip}:{available_port}")
            print("="*50)
            print("\n📋 Cara Akses:")
            print(f"• Dari komputer ini: http://localhost:{available_port}")
            print(f"• Dari HP/device lain: http://{local_ip}:{available_port}")
            print("\n⚠️  Pastikan firewall mengizinkan koneksi")
            print("\n🛑 Tekan Ctrl+C untuk menghentikan server")
            print("\n📂 Serving files from:", os.getcwd())
            print("\n" + "-"*50)
            
            # Buka browser otomatis (opsional)
            try:
                webbrowser.open(f'http://localhost:{available_port}')
                print("🌐 Browser dibuka otomatis...")
            except:
                pass
            
            print("\n⏳ Server berjalan... (log akses akan muncul di bawah)")
            print("-"*50)
            
            # Jalankan server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server dihentikan oleh pengguna.")
        print("   Terima kasih telah menggunakan TV Global!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        input("\nTekan Enter untuk keluar...")

if __name__ == "__main__":
    # Set working directory ke lokasi script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("\n🎬 TV Global - Local Server")
    print("   Interactive Streaming Platform Management")
    
    # Cek versi Python
    if sys.version_info < (3, 6):
        print("\n❌ Error: Python 3.6 atau lebih baru diperlukan")
        print(f"   Versi Python Anda: {sys.version}")
        input("\nTekan Enter untuk keluar...")
        sys.exit(1)
    
    main()