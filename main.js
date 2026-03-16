/**
 * Refabulous - Main JavaScript
 * Premium Company Profile Website
 * Interactive Features & Animations
 */

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

// Throttle function for performance optimization
const API_URL = "http://localhost:5000";
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// ===============================================
// NAVIGATION
// ===============================================

const navbar = document.querySelector('.navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll event for navbar
window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 100));

// Mobile menu toggle
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// Active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// ===============================================
// SMOOTH SCROLLING
// ===============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===============================================
// HERO SECTION ANIMATIONS
// ===============================================

// Animated particles in hero
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

createParticles();

// Counter animation for stats
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const isDecimal = target % 1 !== 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    }, 16);
}

// Trigger counter animation when visible

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            animateCounter(entry.target);
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===============================================
// ANIMATION ON SCROLL (AOS)
// ===============================================

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
        
        // Add delay if specified
        const delay = el.getAttribute('data-aos-delay');
        if (delay) {
            el.style.transitionDelay = `${delay}ms`;
        }
    });
});

// ===============================================
// CONTACT FORM
// ===============================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        // Validate form
        if (!data.name || !data.phone || !data.service || !data.message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        // Phone validation (South African format)
        const phonePattern = /^(\+27|0)[6-8][0-9]{8}$/;
        if (!phonePattern.test(data.phone.replace(/\s/g, ''))) {
            showFormMessage('Please enter a valid South African phone number.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            console.log('Form data:', data);
            
            // Show success message
            showFormMessage('Thank you! Your request has been received. We\'ll contact you shortly.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Auto-hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===============================================
// BACK TO TOP BUTTON
// ===============================================

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, 100));

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===============================================
// IMAGE LAZY LOADING
// ===============================================

// Additional lazy loading for better performance
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===============================================
// TESTIMONIALS SCROLL
// ===============================================

// Auto-scroll testimonials on mobile (optional enhancement)
const testimonialGrid = document.querySelector('.testimonials-grid');
if (testimonialGrid && window.innerWidth < 768) {
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 50;
    
    // Uncomment to enable auto-scroll
    /*
    setInterval(() => {
        scrollAmount += scrollStep;
        testimonialGrid.scrollLeft = scrollAmount;
        
        if (scrollAmount >= testimonialGrid.scrollWidth - testimonialGrid.clientWidth) {
            scrollAmount = 0;
        }
    }, scrollInterval);
    */
}

// ===============================================
// DYNAMIC PHONE NUMBER FORMATTING
// ===============================================

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as South African number: 082 123 4567
        if (value.length > 3 && value.length <= 6) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        } else if (value.length > 6) {
            value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
        }
        
        e.target.value = value;
    });
});

// ===============================================
// SCROLL PROGRESS INDICATOR (OPTIONAL)
// ===============================================

function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 10000;
        transition: width 0.3s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', throttle(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, 50));
}

createScrollProgress();

// ===============================================
// PERFORMANCE OPTIMIZATION
// ===============================================

// Preload critical images
function preloadImages() {
    const criticalImages = [
        // Add paths to critical images here if needed
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===============================================
// ACCESSIBILITY ENHANCEMENTS
// ===============================================

// Focus trap for mobile menu
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.focus();
        }
    });
}

if (navMenu) {
    trapFocus(navMenu);
}

// Skip to main content link (accessibility)
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#services';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -100px;
        left: 0;
        background: #667eea;
        color: white;
        padding: 0.75rem 1.5rem;
        text-decoration: none;
        z-index: 10001;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
}

addSkipLink();

// ===============================================
// CONSOLE MESSAGE
// ===============================================

console.log('%c🎨 Refabulous - Premium Company Profile', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cLooking for TV Repairs or Plumbing Services?', 'font-size: 14px; color: #666;');
console.log('%cCall us: 067 200 8426', 'font-size: 14px; font-weight: bold; color: #764ba2;');

// ===============================================
// INITIALIZATION
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial nav link update
    updateActiveNavLink();
    
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`✅ Page loaded in ${(loadTime / 1000).toFixed(2)}s`);
    });
});

// ===============================================
// ERROR HANDLING
// ===============================================

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.message);
});

// Service Worker registration (for PWA capabilities - optional)
if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA
    /*
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
    */
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        throttle,
        animateCounter,
        showFormMessage
    };
}
