/**
 * Website Performance Monitor and Optimizer
 * Monitors performance metrics and provides optimization recommendations
 */

class WebsitePerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            fcp: 0,
            lcp: 0,
            cls: 0,
            fid: 0,
            resources: []
        };
        
        this.init();
    }
    
    init() {
        // Wait for page to load before starting monitoring
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
        } else {
            this.startMonitoring();
        }
    }
    
    startMonitoring() {
        this.measureLoadTime();
        this.measureCoreWebVitals();
        this.monitorResources();
        this.trackUserInteractions();
        
        // Report metrics after 3 seconds
        setTimeout(() => this.generateReport(), 3000);
    }
    
    measureLoadTime() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
        }
    }
    
    measureCoreWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.fcp = entry.startTime;
                        }
                    }
                }).observe({ entryTypes: ['paint'] });
                
                // Largest Contentful Paint
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.startTime;
                }).observe({ entryTypes: ['largest-contentful-paint'] });
                
                // Cumulative Layout Shift
                let clsValue = 0;
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.metrics.cls = clsValue;
                }).observe({ entryTypes: ['layout-shift'] });
                
            } catch (e) {
                console.warn('Performance Observer not fully supported');
            }
        }
    }
    
    monitorResources() {
        if (window.performance && window.performance.getEntriesByType) {
            const resources = window.performance.getEntriesByType('resource');
            this.metrics.resources = resources.map(resource => ({
                name: resource.name.split('/').pop(),
                type: resource.initiatorType,
                size: resource.transferSize || 0,
                loadTime: resource.duration,
                cached: resource.transferSize === 0 && resource.decodedBodySize > 0
            }));
        }
    }
    
    trackUserInteractions() {
        let interactionCount = 0;
        const trackInteraction = () => interactionCount++;
        
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, trackInteraction, { passive: true, once: false });
        });
        
        // Track scroll performance
        let isScrolling = false;
        document.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    isScrolling = false;
                });
            }
        }, { passive: true });
    }
    
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            metrics: this.metrics,
            recommendations: this.generateRecommendations()
        };
        
        // Log report in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.group('🚀 Performance Report');
            console.log('Load Time:', this.metrics.loadTime + 'ms');
            console.log('First Contentful Paint:', this.metrics.fcp + 'ms');
            console.log('Largest Contentful Paint:', this.metrics.lcp + 'ms');
            console.log('Cumulative Layout Shift:', this.metrics.cls);
            console.log('Resources:', this.metrics.resources.length);
            console.log('Recommendations:', report.recommendations);
            console.groupEnd();
        }
        
        return report;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Load time recommendations
        if (this.metrics.loadTime > 3000) {
            recommendations.push('Consider optimizing images and reducing bundle size');
        }
        
        // FCP recommendations
        if (this.metrics.fcp > 1500) {
            recommendations.push('Optimize above-the-fold content loading');
        }
        
        // LCP recommendations
        if (this.metrics.lcp > 2500) {
            recommendations.push('Optimize largest contentful element (likely images)');
        }
        
        // CLS recommendations
        if (this.metrics.cls > 0.1) {
            recommendations.push('Prevent layout shifts by setting image dimensions');
        }
        
        // Resource recommendations
        const largeResources = this.metrics.resources.filter(r => r.size > 100000);
        if (largeResources.length > 0) {
            recommendations.push(`Consider compressing large resources: ${largeResources.map(r => r.name).join(', ')}`);
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Performance looks good! 🎉');
        }
        
        return recommendations;
    }
}

/**
 * Mobile-specific optimizations
 */
class MobileOptimizer {
    static init() {
        if (this.isMobile()) {
            this.optimizeForMobile();
        }
    }
    
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768;
    }
    
    static optimizeForMobile() {
        // Reduce image quality on mobile
        this.optimizeImages();
        
        // Enhance touch interactions
        this.enhanceTouchInteractions();
        
        // Optimize scrolling
        this.optimizeScrolling();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }
    
    static optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" if not already set
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Add proper error handling
            img.addEventListener('error', function() {
                this.style.background = 'linear-gradient(45deg, #333 25%, transparent 25%)';
                this.style.backgroundSize = '20px 20px';
                this.alt = '[Image not available]';
            });
        });
    }
    
    static enhanceTouchInteractions() {
        const touchElements = document.querySelectorAll('a, button, .course-card, [onclick]');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transition = 'transform 0.1s ease';
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }
    
    static optimizeScrolling() {
        // Enable momentum scrolling on iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Throttle scroll events for better performance
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Scroll-specific optimizations
            }, 16); // ~60fps
        }, { passive: true });
    }
    
    static preloadCriticalResources() {
        const criticalResources = [
            'css/mobile-optimized.css',
            'js/performance.js'
        ];
        
        criticalResources.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = href.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
}

/**
 * Progressive Web App features
 */
class PWAFeatures {
    static init() {
        this.registerServiceWorker();
        this.handleInstallPrompt();
        this.setupOfflineDetection();
    }
    
    static registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                this.showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }
    
    static handleInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or banner
            this.showInstallOption(deferredPrompt);
        });
    }
    
    static setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('Back online! 🌐', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('You\'re offline. Some features may be limited. 📡', 'warning');
        });
    }
    
    static showUpdateNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #007acc; color: white; padding: 1rem; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <p>New version available!</p>
                <button onclick="window.location.reload()" style="background: white; color: #007acc; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    Update
                </button>
                <button onclick="this.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;">
                    Later
                </button>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
    
    static showInstallOption(deferredPrompt) {
        // Could show an install banner or button
        console.log('PWA installation available');
    }
    
    static showNotification(message, type = 'info') {
        const colors = {
            info: '#007acc',
            success: '#4CAF50',
            warning: '#ff9800',
            error: '#f44336'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 0.9rem;
            max-width: 90vw;
            text-align: center;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize all optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Start performance monitoring
    new WebsitePerformanceMonitor();
    
    // Initialize mobile optimizations
    MobileOptimizer.init();
    
    // Initialize PWA features
    PWAFeatures.init();
    
    console.log('🚀 All performance optimizations loaded!');
});

// Export for global access
window.PerformanceOptimizations = {
    WebsitePerformanceMonitor,
    MobileOptimizer,
    PWAFeatures
};
