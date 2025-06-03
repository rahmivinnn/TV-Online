// TV Global - Enhanced Interactive Features
// Real-time dashboard with advanced functionality

class TVGlobal {
    constructor() {
        this.apiEndpoint = 'api.php';
        this.refreshInterval = 30000; // 30 seconds
        this.websocket = null;
        this.charts = {};
        this.notifications = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.loadUserPreferences();
        this.checkSystemHealth();
        
        // Initialize service worker for offline support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshDashboard();
                        break;
                    case 'g':
                        e.preventDefault();
                        this.showGenerateModal();
                        break;
                    case 's':
                        e.preventDefault();
                        this.showSettingsModal();
                        break;
                }
            }
        });

        // Touch gestures for mobile
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe up - refresh
                    this.refreshDashboard();
                } else {
                    // Swipe down - show menu
                    this.toggleMobileMenu();
                }
            }
        });

        // Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadCardContent(entry.target);
                }
            });
        });

        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    }

    async refreshDashboard() {
        this.showLoadingState();
        
        try {
            const [status, stats] = await Promise.all([
                this.fetchAPI('status'),
                this.fetchAPI('stats')
            ]);
            
            this.updateServerStatus(status);
            this.updateStats(stats);
            this.updateCharts(stats);
            
            this.showNotification('Dashboard refreshed successfully', 'success');
        } catch (error) {
            this.showNotification('Failed to refresh dashboard', 'error');
            console.error('Refresh error:', error);
        } finally {
            this.hideLoadingState();
        }
    }

    async fetchAPI(action, data = null) {
        const url = `${this.apiEndpoint}?action=${action}`;
        const options = {
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        
        return await response.json();
    }

    updateServerStatus(status) {
        const statusElement = document.getElementById('serverStatus');
        const statusTextElement = document.getElementById('serverStatusText');
        
        if (status.server === 'online') {
            statusElement.className = 'status-indicator status-online';
            statusTextElement.textContent = 'Online';
        } else {
            statusElement.className = 'status-indicator status-offline';
            statusTextElement.textContent = 'Offline';
        }
        
        // Update service status indicators
        Object.entries(status.services || {}).forEach(([service, isOnline]) => {
            const serviceElement = document.getElementById(`${service}Status`);
            if (serviceElement) {
                serviceElement.className = `status-indicator ${isOnline ? 'status-online' : 'status-offline'}`;
            }
        });
    }

    updateStats(stats) {
        this.animateCounter('movieCount', stats.movies || 0);
        this.animateCounter('seriesCount', stats.series || 0);
        this.animateCounter('channelCount', stats.channels || 0);
        
        // Update additional metrics
        this.updateMetric('cacheSize', this.formatBytes(stats.cache_size || 0));
        this.updateMetric('lastUpdate', this.formatTime(stats.last_update || 0));
    }

    animateCounter(elementId, targetValue, duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatTime(timestamp) {
        if (!timestamp) return 'Never';
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    async generatePlaylist(type) {
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        const button = event.target;
        
        // Disable button and show loading
        button.disabled = true;
        button.innerHTML = `<span class="loading"></span> Generating...`;
        
        progressBar.style.display = 'block';
        progressFill.style.width = '0%';
        
        try {
            // Start generation
            const response = await this.fetchAPI('generate', { type });
            
            if (response.success) {
                // Poll for progress
                await this.pollProgress(response.progress_file, progressFill);
                this.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} playlist generated successfully!`, 'success');
                
                // Refresh stats
                setTimeout(() => this.refreshDashboard(), 1000);
            } else {
                throw new Error(response.error || 'Generation failed');
            }
        } catch (error) {
            this.showNotification(`Failed to generate ${type} playlist: ${error.message}`, 'error');
        } finally {
            // Reset button
            button.disabled = false;
            button.innerHTML = button.getAttribute('data-original-text') || `Generate ${type}`;
            
            setTimeout(() => {
                progressBar.style.display = 'none';
            }, 2000);
        }
    }

    async pollProgress(progressFile, progressElement) {
        return new Promise((resolve) => {
            const poll = async () => {
                try {
                    const response = await fetch(progressFile);
                    const data = await response.json();
                    
                    progressElement.style.width = data.progress + '%';
                    
                    if (data.progress >= 100 || data.status === 'complete') {
                        resolve();
                    } else {
                        setTimeout(poll, 1000);
                    }
                } catch (error) {
                    // Fallback: simulate progress
                    let progress = 0;
                    const simulate = () => {
                        progress += Math.random() * 10;
                        if (progress > 100) progress = 100;
                        progressElement.style.width = progress + '%';
                        
                        if (progress < 100) {
                            setTimeout(simulate, 500);
                        } else {
                            resolve();
                        }
                    };
                    simulate();
                }
            };
            poll();
        });
    }

    showNotification(message, type = 'success', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
        
        // Add to notifications array
        this.notifications.unshift({
            message,
            type,
            timestamp: Date.now()
        });
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
    }

    showLoadingState() {
        document.body.classList.add('loading');
    }

    hideLoadingState() {
        document.body.classList.remove('loading');
    }

    startRealTimeUpdates() {
        // Update dashboard every 30 seconds
        setInterval(() => {
            this.refreshDashboard();
        }, this.refreshInterval);
        
        // Try to establish WebSocket connection for real-time updates
        this.initWebSocket();
    }

    initWebSocket() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws`;
            
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('WebSocket connected');
                this.showNotification('Real-time updates enabled', 'success', 3000);
            };
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };
            
            this.websocket.onclose = () => {
                console.log('WebSocket disconnected');
                // Retry connection after 5 seconds
                setTimeout(() => this.initWebSocket(), 5000);
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.log('WebSocket not available, using polling instead');
        }
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'stats_update':
                this.updateStats(data.stats);
                break;
            case 'generation_progress':
                this.updateGenerationProgress(data.progress);
                break;
            case 'notification':
                this.showNotification(data.message, data.level);
                break;
        }
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('tvGlobalPreferences') || '{}');
        
        // Apply theme
        if (preferences.theme) {
            document.body.setAttribute('data-theme', preferences.theme);
        }
        
        // Apply refresh interval
        if (preferences.refreshInterval) {
            this.refreshInterval = preferences.refreshInterval * 1000;
        }
    }

    saveUserPreferences(preferences) {
        const current = JSON.parse(localStorage.getItem('tvGlobalPreferences') || '{}');
        const updated = { ...current, ...preferences };
        localStorage.setItem('tvGlobalPreferences', JSON.stringify(updated));
    }

    async checkSystemHealth() {
        try {
            const health = await this.fetchAPI('health');
            
            if (health.warnings && health.warnings.length > 0) {
                health.warnings.forEach(warning => {
                    this.showNotification(warning, 'warning', 10000);
                });
            }
            
            if (health.errors && health.errors.length > 0) {
                health.errors.forEach(error => {
                    this.showNotification(error, 'error', 15000);
                });
            }
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    initializeCharts() {
        // Initialize Chart.js charts for analytics
        if (typeof Chart !== 'undefined') {
            this.createUsageChart();
            this.createPerformanceChart();
        }
    }

    createUsageChart() {
        const ctx = document.getElementById('usageChart');
        if (!ctx) return;
        
        this.charts.usage = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Movies', 'Series', 'Live TV'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    updateCharts(stats) {
        if (this.charts.usage) {
            this.charts.usage.data.datasets[0].data = [
                stats.movies || 0,
                stats.series || 0,
                stats.channels || 0
            ];
            this.charts.usage.update();
        }
    }
}

// Initialize TV Global when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tvGlobal = new TVGlobal();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TVGlobal;
}