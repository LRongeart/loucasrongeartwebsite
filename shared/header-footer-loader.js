// Shared utility functions for loading header and footer
function loadHeaderAndFooter(headerPath = 'header.html', footerPath = 'footer.html') {
    // Load header
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                
                // Fix logo path for project pages
                const logo = document.getElementById('header-logo');
                if (logo && window.location.pathname.includes('/project/')) {
                    logo.src = '../../img/LR_logo_v02_100.png';
                }
                
                // Fix navigation links for project pages
                if (window.location.pathname.includes('/project/')) {
                    const links = headerPlaceholder.querySelectorAll('nav a[href^="index.html"], nav a[href^="about.html"], nav a[href^="contact.html"], nav a[href^="cv.html"], nav a[href^="tutorial.html"]');
                    links.forEach(link => {
                        if (!link.href.startsWith('http')) {
                            link.href = '../../' + link.getAttribute('href');
                        }
                    });
                }
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch(footerPath)
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Auto-load header and footer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Determine the correct paths based on current location
    const isProjectPage = window.location.pathname.includes('/project/');
    const headerPath = isProjectPage ? '../../header.html' : 'header.html';
    const footerPath = isProjectPage ? '../../footer.html' : 'footer.html';
    
    loadHeaderAndFooter(headerPath, footerPath);
});
