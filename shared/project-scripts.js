// Common project page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add any common JavaScript functionality here
    
    // Example: Smooth scroll for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading animation for gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
});

// Function to set banner background image
function setBannerImage(imagePath) {
    const banner = document.querySelector('.project-banner');
    if (banner) {
        banner.style.backgroundImage = `url('${imagePath}')`;
    }
}

// Function to populate gallery with images
function populateGallery(images) {
    const gallery = document.querySelector('.image-gallery');
    if (gallery && images) {
        gallery.innerHTML = '';
        images.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
            gallery.appendChild(galleryItem);
        });
    }
}
