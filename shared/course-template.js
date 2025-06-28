// Course Template JavaScript
// Handles dynamic course loading and theming

class CourseTemplate {
    constructor() {
        this.course = null;
        this.courseId = null;
        this.init();
    }

    init() {
        // Get course ID from URL parameters or filename
        const urlParams = new URLSearchParams(window.location.search);
        this.courseId = urlParams.get('id');

        // If no URL parameter, try to extract from filename
        if (!this.courseId) {
            const pathname = window.location.pathname;
            const filename = pathname.split('/').pop();
            
            // Extract course ID from filename (remove .html extension)
            if (filename && filename.endsWith('.html')) {
                this.courseId = filename.replace('.html', '');
                console.log('Extracted course ID from filename:', this.courseId);
            }
        }

        if (this.courseId) {
            this.loadCourse();
        } else {
            console.error('No course ID found in URL parameters or filename');
            this.showError('Course ID not found');
        }
    }

    async loadCourse() {
        try {
            // Determine the correct path for courses.json based on current location
            const coursesJsonPath = window.location.pathname.includes('/courses/') 
                ? '../../courses.json' 
                : 'courses.json';
                
            const response = await fetch(coursesJsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Loaded courses data:', data);
            
            this.course = data.courses.find(c => c.id === this.courseId);
            
            if (this.course) {
                console.log('Found course:', this.course);
                this.applyTheme();
                this.populateContent();
                this.embedNotionPage();
            } else {
                console.error('Course not found with ID:', this.courseId);
                this.showError(`Course not found: ${this.courseId}`);
            }
        } catch (error) {
            console.error('Error loading course:', error);
            this.showError(`Error loading course: ${error.message}`);
        }
    }

    applyTheme() {
        if (!this.course.colorTheme) return;

        const root = document.documentElement;
        const theme = this.course.colorTheme;
        
        // Apply CSS custom properties
        root.style.setProperty('--course-primary', theme.primary);
        root.style.setProperty('--course-primary-rgb', theme.primaryRgb);
        root.style.setProperty('--course-secondary', theme.secondary);
        root.style.setProperty('--course-background', theme.background);
        root.style.setProperty('--course-border', theme.border);

        console.log('Applied theme:', theme);
    }

    populateContent() {
        // Update page title
        document.title = `${this.course.title} | Loucas Rongeart`;
        
        // Update banner
        document.getElementById('course-title').textContent = this.course.title;
        document.getElementById('course-description').textContent = this.course.description;
        
        // Update banner background if course has a custom image
        const banner = document.getElementById('course-banner');
        if (this.course.bannerImage) {
            banner.style.backgroundImage = `url('${this.course.bannerImage}')`;
        } else {
            banner.style.backgroundImage = `url('${this.course.previewImage}')`;
        }
        
        // Update course info
        document.getElementById('course-difficulty').textContent = this.course.difficulty;
        document.getElementById('course-duration').textContent = this.course.duration;
        
        // Update tags
        const tagsContainer = document.getElementById('course-tags');
        tagsContainer.innerHTML = this.course.tags.map(tag => 
            `<span class="course-tag course-themed">${tag}</span>`
        ).join('');
    }

    async embedNotionPage() {
        const iframe = document.getElementById('notion-iframe');
        const loadingIndicator = document.getElementById('loading-indicator');
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        iframe.style.display = 'none';
        
        // Create fallback content with themed styling
        const fallbackContent = `
            <div class="notion-fallback">
                <div class="fallback-content">
                    <h3>📖 Course Content</h3>
                    <p>This course content is hosted on Notion. Click the button below to access the full interactive content.</p>
                    <a href="${this.course.notionUrl}" target="_blank" class="notion-link-btn course-themed">
                        🚀 Open Course in Notion
                    </a>
                    <div class="notion-preview">
                        <h4>Course Preview:</h4>
                        <p>Access comprehensive course materials, exercises, and resources directly in Notion.</p>
                    </div>
                </div>
            </div>
        `;

        // Multiple URL formats to try
        const originalUrl = this.course.notionUrl;
        const urlsToTry = [
            originalUrl + '?embed=true&hideSidebar=true&hideHeader=true',
            originalUrl + '?pvs=4&embed=true',
            originalUrl + '?embed=true',
            originalUrl,
            originalUrl.replace('notion.site', 'notion.so') + '?embed=true',
            originalUrl.replace('notion.site', 'notion.so')
        ];

        let currentUrlIndex = 0;
        let embedSuccess = false;

        const tryNextUrl = () => {
            if (currentUrlIndex >= urlsToTry.length || embedSuccess) {
                if (!embedSuccess) {
                    loadingIndicator.style.display = 'none';
                    document.querySelector('.notion-container').innerHTML = fallbackContent;
                    this.applyThemeToFallback();
                }
                return;
            }

            const urlToTry = urlsToTry[currentUrlIndex];
            console.log(`Trying Notion URL: ${urlToTry}`);

            // Create a new iframe for each attempt
            const newIframe = document.createElement('iframe');
            newIframe.id = 'notion-iframe';
            newIframe.width = '100%';
            newIframe.height = '100vh';
            newIframe.frameBorder = '0';
            newIframe.style.cssText = 'width: 100vw; height: 100vh; border: none; border-radius: 0; box-shadow: none; background: white; display: none;';
            
            // Add security attributes for better embedding
            newIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation');
            newIframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
            
            newIframe.onload = () => {
                setTimeout(() => {
                    try {
                        // Check if the iframe loaded successfully
                        const iframeDoc = newIframe.contentDocument || newIframe.contentWindow.document;
                        if (iframeDoc && iframeDoc.body && iframeDoc.body.innerHTML.length > 100) {
                            console.log(`Successfully embedded: ${urlToTry}`);
                            embedSuccess = true;
                            loadingIndicator.style.display = 'none';
                            newIframe.style.display = 'block';
                            return;
                        }
                    } catch (e) {
                        // Cross-origin access blocked - this might actually mean content is loaded
                        console.log(`Cross-origin blocked for: ${urlToTry} - assuming content loaded`);
                        embedSuccess = true;
                        loadingIndicator.style.display = 'none';
                        newIframe.style.display = 'block';
                        return;
                    }
                    
                    // If we get here, try next URL
                    currentUrlIndex++;
                    tryNextUrl();
                }, 3000);
            };

            newIframe.onerror = () => {
                console.log(`Failed to load: ${urlToTry}`);
                currentUrlIndex++;
                tryNextUrl();
            };

            // Replace the old iframe
            const oldIframe = document.getElementById('notion-iframe');
            if (oldIframe) {
                oldIframe.parentNode.replaceChild(newIframe, oldIframe);
            } else {
                document.querySelector('.notion-container').appendChild(newIframe);
            }
            
            // Set the source
            newIframe.src = urlToTry;
            currentUrlIndex++;
        };

        // Start trying URLs
        tryNextUrl();

        // Final fallback after all attempts
        setTimeout(() => {
            if (!embedSuccess) {
                loadingIndicator.style.display = 'none';
                document.querySelector('.notion-container').innerHTML = fallbackContent;
                this.applyThemeToFallback();
            }
        }, 15000); // Wait 15 seconds total before giving up
    }

    applyThemeToFallback() {
        // Apply theme colors to fallback elements
        const fallbackBtn = document.querySelector('.notion-link-btn');
        if (fallbackBtn && this.course.colorTheme) {
            const theme = this.course.colorTheme;
            fallbackBtn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
            fallbackBtn.style.borderColor = theme.primary;
        }
    }

    showError(message) {
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: white; background: black; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
                <div>
                    <h1>Error Loading Course</h1>
                    <p>${message}</p>
                    <a href="courses.html" style="color: #4CAF50; text-decoration: none;">← Back to Courses</a>
                </div>
            </div>
        `;
    }
}

// Initialize course template when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CourseTemplate();
});
