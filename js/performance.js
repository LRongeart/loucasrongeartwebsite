/**
 * Performance Optimization Script
 * Handles lazy loading, image optimization, and performance monitoring
 */

// Lazy Loading Implementation
class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
        
        this.setupLazyImages();
    }

    setupLazyImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (this.imageObserver) {
                this.imageObserver.observe(img);
            } else {
                // Fallback for browsers without IntersectionObserver
                this.loadImage(img);
            }
        });
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        
        img.onload = () => {
            img.classList.add('fade-in');
        };
        
        img.onerror = () => {
            img.classList.add('error');
            console.warn('Failed to load image:', img.dataset.src);
        };
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            this.measurePageLoad();
        });

        // Monitor First Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.fcp = entry.startTime;
                        }
                    }
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('Performance Observer not supported for paint metrics');
            }
        }
    }

    measurePageLoad() {
        if ('performance' in window && 'timing' in window.performance) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            this.metrics.loadTime = loadTime;
            
            // Log performance metrics (in development)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Performance Metrics:', this.metrics);
            }
        }
    }
}

// Image Optimization
class ImageOptimizer {
    static addWebPSupport() {
        // Check WebP support
        const webpSupported = (() => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        })();

        if (webpSupported) {
            document.documentElement.classList.add('webp-supported');
        }
        
        return webpSupported;
    }

    static optimizeGalleryImages() {
        const galleryImages = document.querySelectorAll('#gallery-grid img');
        galleryImages.forEach(img => {
            // Add loading="lazy" for native lazy loading
            img.loading = 'lazy';
            
            // Add proper alt text if missing
            if (!img.alt) {
                img.alt = 'Portfolio image';
            }
            
            // Add error handling
            img.addEventListener('error', function() {
                this.style.background = 'rgb(60,60,60)';
                this.alt = '[Image not available]';
            });
        });
    }
}

// Touch Optimization for Mobile
class TouchOptimizer {
    static init() {
        // Add touch feedback
        const touchElements = document.querySelectorAll('a, button, .course-card, .gallery-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });

        // Prevent zoom on double tap for certain elements
        const noZoomElements = document.querySelectorAll('button, .course-card');
        noZoomElements.forEach(element => {
            element.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            });
        });
    }
}

// Critical CSS Loader
class CSSLoader {
    static loadNonCriticalCSS() {
        const nonCriticalCSS = [
            'css/mobile-optimized.css',
            'css/animations.css'
        ];

        nonCriticalCSS.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print';
                link.onload = function() {
                    this.media = 'all';
                };
                document.head.appendChild(link);
            }
        });
    }
}

// Initialize all optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading
    new LazyLoader();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Add WebP support detection
    ImageOptimizer.addWebPSupport();
    
    // Optimize gallery images
    setTimeout(() => {
        ImageOptimizer.optimizeGalleryImages();
    }, 100);
    
    // Initialize touch optimizations on mobile
    if ('ontouchstart' in window) {
        TouchOptimizer.init();
    }
    
    // Load non-critical CSS
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            CSSLoader.loadNonCriticalCSS();
        });
    } else {
        setTimeout(() => {
            CSSLoader.loadNonCriticalCSS();
        }, 1000);
    }
});

// Expose performance utilities globally
window.PerformanceUtils = {
    LazyLoader,
    PerformanceMonitor,
    ImageOptimizer,
    TouchOptimizer,
    CSSLoader
};
