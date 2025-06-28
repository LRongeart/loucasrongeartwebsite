/**
 * Performance Optimization Script for Loucas Rongeart Website
 * Includes lazy loading, viewport optimizations, and mobile performance enhancements
 */

(function() {
    'use strict';
    
    // Performance monitoring
    const perfMark = (name) => {
        if (performance && performance.mark) {
            performance.mark(name);
        }
    };
    
    perfMark('optimization-start');
    
    // Lazy loading implementation
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Preload the image
                        const tempImg = new Image();
                        tempImg.onload = () => {
                            img.src = tempImg.src;
                            img.classList.add('loaded');
                        };
                        tempImg.src = img.dataset.src || img.src;
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => {
                img.classList.add('lazy-image');
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.classList.add('loaded');
            });
        }
    };
    
    // Optimize viewport meta tag for mobile
    const optimizeViewport = () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && window.innerWidth <= 768) {
            const content = viewport.getAttribute('content');
            if (!content.includes('user-scalable=no')) {
                viewport.setAttribute('content', content + ', user-scalable=no');
            }
        }
    };
    
    // Debounced resize handler
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    // Performance-optimized scroll handler
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Add scroll-based optimizations here
                ticking = false;
            });
            ticking = true;
        }
    };
    
    // Touch optimization for mobile
    const optimizeTouch = () => {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Optimize touch events
            const touchElements = document.querySelectorAll('.social-link, .course-card, .gallery-item');
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
        }
    };
    
    // Reduce motion for users who prefer it
    const respectReducedMotion = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            
            // Disable non-essential animations
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    // Optimize font loading
    const optimizeFonts = () => {
        if ('fonts' in document) {
            // Preload critical fonts
            const fonts = [
                new FontFace('system-ui', 'local(system-ui)'),
            ];
            
            Promise.all(fonts.map(font => font.load())).then(() => {
                perfMark('fonts-loaded');
            }).catch(err => {
                console.warn('Font loading failed:', err);
            });
        }
    };
    
    // Critical resource hints
    const addResourceHints = () => {
        const head = document.head;
        
        // DNS prefetch for external domains
        const domains = [
            'https://vimeo.com',
            'https://www.linkedin.com',
            'https://www.youtube.com',
            'https://www.artstation.com'
        ];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            head.appendChild(link);
        });
    };
    
    // Memory management
    const cleanupUnusedAssets = () => {
        // Remove non-critical event listeners on mobile
        if (window.innerWidth <= 768) {
            const hoverElements = document.querySelectorAll('[onmouseover], [onmouseout]');
            hoverElements.forEach(element => {
                element.removeAttribute('onmouseover');
                element.removeAttribute('onmouseout');
            });
        }
    };
    
    // Service Worker registration for caching
    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered:', registration);
                perfMark('sw-registered');
            }).catch(error => {
                console.log('SW registration failed:', error);
            });
        }
    };
    
    // Initialize all optimizations
    const initOptimizations = () => {
        perfMark('init-start');
        
        // Core optimizations
        lazyLoadImages();
        optimizeViewport();
        optimizeTouch();
        respectReducedMotion();
        optimizeFonts();
        addResourceHints();
        cleanupUnusedAssets();
        
        // Event listeners
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', debounce(() => {
            optimizeViewport();
        }, 250), { passive: true });
        
        // Service worker (optional)
        if (window.location.hostname !== 'localhost') {
            registerServiceWorker();
        }
        
        perfMark('init-complete');
        
        // Performance logging
        if (performance && performance.measure) {
            try {
                performance.measure('optimization-duration', 'optimization-start', 'init-complete');
                const measure = performance.getEntriesByName('optimization-duration')[0];
                console.log(`Performance optimizations completed in ${measure.duration.toFixed(2)}ms`);
            } catch (e) {
                console.log('Performance optimizations completed');
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOptimizations);
    } else {
        initOptimizations();
    }
    
    // Export for debugging
    window.performanceOptimizer = {
        lazyLoadImages,
        optimizeViewport,
        optimizeTouch,
        respectReducedMotion
    };
})();
