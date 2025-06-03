const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME types untuk berbagai file
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.php': 'text/plain' // PHP files akan ditampilkan sebagai text
};

// Fungsi untuk mendapatkan IP lokal
function getLocalIP() {
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

// Membuat server HTTP
const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default ke index.html jika root
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Path file lengkap
    const filePath = path.join(__dirname, pathname);
    
    // Cek apakah file ada
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File tidak ditemukan
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - File Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                        a { color: #3498db; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <h1>404 - File Not Found</h1>
                    <p>File <strong>${pathname}</strong> tidak ditemukan.</p>
                    <a href="/">← Kembali ke Beranda</a>
                </body>
                </html>
            `);
            return;
        }
        
        // Baca file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
                return;
            }
            
            // Tentukan MIME type
            const ext = path.extname(filePath).toLowerCase();
            const mimeType = mimeTypes[ext] || 'application/octet-stream';
            
            // Set headers
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            // Kirim file
            res.statusCode = 200;
            res.end(data);
        });
    });
});

// Port server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Bind ke semua interface

// Start server
server.listen(PORT, HOST, () => {
    const localIP = getLocalIP();
    console.log('\n🚀 TV Global Server Started!');
    console.log('================================');
    console.log(`📱 Local Access:     http://localhost:${PORT}`);
    console.log(`🌐 Network Access:   http://${localIP}:${PORT}`);
    console.log('================================');
    console.log('\n📋 Cara Akses:');
    console.log('• Dari komputer ini: buka http://localhost:' + PORT);
    console.log('• Dari HP/device lain di jaringan yang sama: buka http://' + localIP + ':' + PORT);
    console.log('\n⚠️  Pastikan firewall mengizinkan koneksi pada port ' + PORT);
    console.log('\n🛑 Tekan Ctrl+C untuk menghentikan server\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Server dihentikan. Terima kasih!');
    process.exit(0);
});