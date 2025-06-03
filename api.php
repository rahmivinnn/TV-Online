<?php
// TV Global API Handler
// Enhanced API for interactive features

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {
    case 'status':
        handleStatus();
        break;
    case 'config':
        handleConfig($method);
        break;
    case 'generate':
        handleGenerate();
        break;
    case 'stats':
        handleStats();
        break;
    case 'logs':
        handleLogs();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

function handleStatus() {
    $status = [
        'server' => 'online',
        'timestamp' => time(),
        'php_version' => PHP_VERSION,
        'memory_usage' => memory_get_usage(true),
        'disk_space' => disk_free_space('.'),
        'services' => [
            'tmdb' => checkTMDBConnection(),
            'headless_vidx' => checkHeadlessVidX(),
            'real_debrid' => checkRealDebrid(),
            'premiumize' => checkPremiumize()
        ]
    ];
    
    echo json_encode($status);
}

function handleConfig($method) {
    if ($method === 'GET') {
        // Return current configuration (sanitized)
        global $apiKey, $totalPages, $maxResolution, $language, $useRealDebrid, $usePremiumize;
        
        $config = [
            'apiKey' => !empty($apiKey) ? str_repeat('*', strlen($apiKey) - 4) . substr($apiKey, -4) : '',
            'totalPages' => $totalPages,
            'maxResolution' => $maxResolution,
            'language' => $language,
            'useRealDebrid' => $useRealDebrid,
            'usePremiumize' => $usePremiumize
        ];
        
        echo json_encode($config);
    } elseif ($method === 'POST') {
        // Update configuration
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (updateConfig($input)) {
            echo json_encode(['success' => true, 'message' => 'Configuration updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update configuration']);
        }
    }
}

function handleGenerate() {
    $type = $_POST['type'] ?? $_GET['type'] ?? '';
    $progress_file = 'progress_' . $type . '.json';
    
    // Initialize progress tracking
    file_put_contents($progress_file, json_encode(['progress' => 0, 'status' => 'starting']));
    
    switch ($type) {
        case 'movies':
            generateMoviesAsync($progress_file);
            break;
        case 'series':
            generateSeriesAsync($progress_file);
            break;
        case 'live':
            generateLiveAsync($progress_file);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid generation type']);
            return;
    }
    
    echo json_encode(['success' => true, 'message' => 'Generation started', 'progress_file' => $progress_file]);
}

function handleStats() {
    $stats = [
        'movies' => countPlaylistItems('playlist.m3u8', 'movie'),
        'series' => countPlaylistItems('tv_playlist.m3u8', 'series'),
        'channels' => countPlaylistItems('live_playlist.m3u8', 'live'),
        'cache_size' => getCacheSize(),
        'last_update' => getLastUpdate()
    ];
    
    echo json_encode($stats);
}

function handleLogs() {
    $logs = [];
    $log_files = ['error.log', 'access.log', 'generation.log'];
    
    foreach ($log_files as $file) {
        if (file_exists($file)) {
            $logs[$file] = array_slice(file($file, FILE_IGNORE_NEW_LINES), -50); // Last 50 lines
        }
    }
    
    echo json_encode($logs);
}

// Helper functions
function checkTMDBConnection() {
    global $apiKey;
    if (empty($apiKey)) return false;
    
    $url = "https://api.themoviedb.org/3/configuration?api_key={$apiKey}";
    $response = @file_get_contents($url);
    return $response !== false;
}

function checkHeadlessVidX() {
    return file_exists('HeadlessVidX/index.js') && is_dir('HeadlessVidX');
}

function checkRealDebrid() {
    global $PRIVATE_TOKEN, $useRealDebrid;
    return $useRealDebrid && !empty($PRIVATE_TOKEN);
}

function checkPremiumize() {
    global $premiumizeApiKey, $usePremiumize;
    return $usePremiumize && !empty($premiumizeApiKey);
}

function updateConfig($input) {
    $config_file = 'config.php';
    $config_content = file_get_contents($config_file);
    
    if (!$config_content) return false;
    
    // Update specific configuration values
    foreach ($input as $key => $value) {
        switch ($key) {
            case 'apiKey':
                $config_content = preg_replace(
                    '/\$apiKey\s*=\s*[^;]+;/',
                    "\$apiKey = '" . addslashes($value) . "';",
                    $config_content
                );
                break;
            case 'totalPages':
                $config_content = preg_replace(
                    '/\$totalPages\s*=\s*[^;]+;/',
                    "\$totalPages = " . intval($value) . ";",
                    $config_content
                );
                break;
            case 'maxResolution':
                $config_content = preg_replace(
                    '/\$maxResolution\s*=\s*[^;]+;/',
                    "\$maxResolution = " . intval($value) . ";",
                    $config_content
                );
                break;
            case 'language':
                $config_content = preg_replace(
                    '/\$language\s*=\s*[^;]+;/',
                    "\$language = '" . addslashes($value) . "';",
                    $config_content
                );
                break;
        }
    }
    
    return file_put_contents($config_file, $config_content) !== false;
}

function generateMoviesAsync($progress_file) {
    // Run in background
    if (function_exists('exec')) {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            exec('start /B php create_playlist.php > nul 2>&1');
        } else {
            exec('php create_playlist.php > /dev/null 2>&1 &');
        }
    } else {
        // Fallback: include the file directly (blocking)
        include 'create_playlist.php';
    }
}

function generateSeriesAsync($progress_file) {
    if (function_exists('exec')) {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            exec('start /B php create_tv_playlist.php > nul 2>&1');
        } else {
            exec('php create_tv_playlist.php > /dev/null 2>&1 &');
        }
    } else {
        include 'create_tv_playlist.php';
    }
}

function generateLiveAsync($progress_file) {
    if (function_exists('exec')) {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            exec('start /B php generate_live_playlist.php > nul 2>&1');
        } else {
            exec('php generate_live_playlist.php > /dev/null 2>&1 &');
        }
    } else {
        include 'generate_live_playlist.php';
    }
}

function countPlaylistItems($file, $type) {
    if (!file_exists($file)) return 0;
    
    $content = file_get_contents($file);
    return substr_count($content, '#EXTINF');
}

function getCacheSize() {
    $cache_dir = 'cache';
    if (!is_dir($cache_dir)) return 0;
    
    $size = 0;
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($cache_dir));
    
    foreach ($files as $file) {
        if ($file->isFile()) {
            $size += $file->getSize();
        }
    }
    
    return $size;
}

function getLastUpdate() {
    $files = ['playlist.m3u8', 'tv_playlist.m3u8', 'live_playlist.m3u8'];
    $latest = 0;
    
    foreach ($files as $file) {
        if (file_exists($file)) {
            $mtime = filemtime($file);
            if ($mtime > $latest) {
                $latest = $mtime;
            }
        }
    }
    
    return $latest;
}

// Log access for debugging
function accessLog() {
    $log_entry = date('Y-m-d H:i:s') . ' - ' . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'] . ' - ' . $_SERVER['REMOTE_ADDR'] . "\n";
    file_put_contents('access.log', $log_entry, FILE_APPEND | LOCK_EX);
}

accessLog();
?>