// Configuration
const CONFIG = {
    weddingDate: 'July 26, 2026 09:00:00',
    timezone: 'Asia/Jakarta' // WIB (Western Indonesia Time)
};

// DOM Elements Cache
const elements = {
    form: document.getElementById('rsvpForm'),
    countdown: document.getElementById('countdown'),
    daysEl: document.getElementById('days'),
    hoursEl: document.getElementById('hours'),
    minutesEl: document.getElementById('minutes'),
    secondsEl: document.getElementById('seconds')
};

// Selectors
const SELECTORS = {
    animatedElements: '.detail-box, .couple, .info, .countdown-item',
    anchorLinks: 'a[href^="#"]'
};

// Countdown Timer
function initCountdown() {
    const targetDate = new Date(CONFIG.weddingDate);
    
    if (isNaN(targetDate.getTime())) {
        console.error('Invalid wedding date format');
        return;
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            // Wedding has occurred
            if (elements.countdown) {
                elements.countdown.innerHTML = '<h3>🎉 The wedding is here! 🎉</h3>';
            }
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update HTML
        if (elements.daysEl) elements.daysEl.textContent = String(days).padStart(2, '0');
        if (elements.hoursEl) elements.hoursEl.textContent = String(hours).padStart(2, '0');
        if (elements.minutesEl) elements.minutesEl.textContent = String(minutes).padStart(2, '0');
        if (elements.secondsEl) elements.secondsEl.textContent = String(seconds).padStart(2, '0');

        // Update aria-label for accessibility
        if (elements.countdown) {
            elements.countdown.setAttribute('aria-label', `Wedding countdown: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        }
    }

    // Update countdown immediately
    updateCountdown();

    // Update countdown every 1 second
    setInterval(updateCountdown, 1000);
}

// Form Validation
function validateRSVP(formData) {
    if (!formData.name?.trim()) return 'Name is required';
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Valid email is required';
    if (!formData.attendance) return 'Please select your attendance status';
    return null;
}

// Save RSVP to Local Storage
function saveRSVP(data) {
    try {
        localStorage.setItem('rsvpData', JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save RSVP data:', e);
    }
}

// Load RSVP from Local Storage
function loadRSVP() {
    try {
        return JSON.parse(localStorage.getItem('rsvpData') || '{}');
    } catch (e) {
        console.error('Failed to load RSVP data:', e);
        return {};
    }
}

// Initialize Animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll(SELECTORS.animatedElements);
    animatedElements.forEach(element => {
        element.classList.add('not-visible');
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Throttled Scroll Handler
function createThrottledScrollHandler() {
    let scrollTimeout;
    return function() {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            const animatedElements = document.querySelectorAll(SELECTORS.animatedElements);
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    element.classList.remove('not-visible');
                    element.classList.add('visible');
                }
            });
            scrollTimeout = null;
        }, 100);
    };
}

// Setup Smooth Scroll for Anchor Links
function setupSmoothScroll() {
    document.querySelectorAll(SELECTORS.anchorLinks).forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Setup RSVP Form Handling
function setupRSVPForm() {
    if (!elements.form) return;

    elements.form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: this.querySelector('input[type="text"]')?.value || '',
            email: this.querySelector('input[type="email"]')?.value || '',
            attendance: this.querySelector('select')?.value || '',
            message: this.querySelector('textarea')?.value || ''
        };

        // Validate form
        const validationError = validateRSVP(formData);
        if (validationError) {
            alert(validationError);
            return;
        }

        // Show success message
        alert(`Thank you, ${formData.name}! Your RSVP has been received. We look forward to celebrating with you!`);

        // Save RSVP data locally
        saveRSVP(formData);

        // Reset form
        this.reset();

        // TODO: Send data to a backend service or email
        // Example: 
        // fetch('/api/rsvp', { 
        //     method: 'POST', 
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData) 
        // })
        // .catch(error => console.error('Error sending RSVP:', error));

        console.log('RSVP Data:', formData);
    });
}

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown
    initCountdown();

    // Setup form handling
    setupRSVPForm();

    // Setup smooth scroll
    setupSmoothScroll();

    // Initialize animations
    initializeAnimations();

    // Setup throttled scroll listener
    window.addEventListener('scroll', createThrottledScrollHandler());
});
