// ============================================
// CONFIGURATION & CONSTANTS
// ============================================
const CONFIG = {
    weddingDate: 'July 26, 2026 09:00:00',
    timezone: 'Asia/Jakarta', // WIB (Western Indonesia Time)
    splashAnimationDuration: 800, // milliseconds
    scrollAnimationDuration: 1000 // milliseconds
};

// ============================================
// DOM ELEMENTS CACHE
// ============================================
const elements = {
    // Splash Elements
    splashScreen: document.getElementById('splashScreen'),
    openInvitationBtn: document.getElementById('openInvitationBtn'),
    guestNameEl: document.getElementById('guest-name'),
    mainContent: document.getElementById('main-content'),

    // Countdown Elements
    form: document.getElementById('rsvpForm'),
    countdown: document.getElementById('countdown'),
    daysEl: document.getElementById('days'),
    hoursEl: document.getElementById('hours'),
    minutesEl: document.getElementById('minutes'),
    secondsEl: document.getElementById('seconds')
};

// ============================================
// SELECTORS
// ============================================
const SELECTORS = {
    animatedElements: '.detail-box, .couple, .info, .countdown-item',
    anchorLinks: 'a[href^="#"]'
};

// ============================================
// SPLASH SCREEN FUNCTIONALITY
// ============================================

/**
 * Extract guest name from URL parameters
 * Example: index.html?to=Ichsanul+Habib
 */
function extractGuestNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('to');
    return guestName ? decodeURIComponent(guestName) : 'Our Valued Guest';
}

/**
 * Initialize guest name on splash screen
 */
function initializeGuestName() {
    if (elements.guestNameEl) {
        const guestName = extractGuestNameFromURL();
        elements.guestNameEl.textContent = guestName;
    }
}

/**
 * Handle "Open Invitation" button click
 * Triggers: fade out, slide up, and scroll to main content
 */
function handleOpenInvitationClick() {
    if (!elements.splashScreen) return;

    // Add fade-out animation class
    elements.splashScreen.classList.add('fade-out');

    // After animation completes, scroll to main content
    setTimeout(() => {
        if (elements.mainContent) {
            elements.mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    }, CONFIG.splashAnimationDuration);
}

/**
 * Setup splash screen interactions
 */
function setupSplashScreen() {
    if (elements.openInvitationBtn) {
        elements.openInvitationBtn.addEventListener('click', handleOpenInvitationClick);
    }
}

// ============================================
// COUNTDOWN TIMER FUNCTIONALITY
// ============================================

/**
 * Initialize and start countdown timer
 */
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

// ============================================
// FORM VALIDATION & HANDLING
// ============================================

/**
 * Validate RSVP form data
 * @param {Object} formData - Form data object
 * @returns {string|null} - Error message or null if valid
 */
function validateRSVP(formData) {
    if (!formData.name?.trim()) return 'Name is required';
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Valid email is required';
    if (!formData.attendance) return 'Please select your attendance status';
    return null;
}

/**
 * Save RSVP data to Local Storage
 * @param {Object} data - RSVP data to save
 */
function saveRSVP(data) {
    try {
        localStorage.setItem('rsvpData', JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save RSVP data:', e);
    }
}

/**
 * Load RSVP data from Local Storage
 * @returns {Object} - Stored RSVP data or empty object
 */
function loadRSVP() {
    try {
        return JSON.parse(localStorage.getItem('rsvpData') || '{}');
    } catch (e) {
        console.error('Failed to load RSVP data:', e);
        return {};
    }
}

/**
 * Setup RSVP form handling
 */
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

// ============================================
// SCROLL ANIMATIONS
// ============================================

/**
 * Initialize scroll-triggered animations
 */
function initializeAnimations() {
    const animatedElements = document.querySelectorAll(SELECTORS.animatedElements);
    animatedElements.forEach(element => {
        element.classList.add('not-visible');
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

/**
 * Create a throttled scroll handler for performance
 * @returns {Function} - Throttled scroll handler
 */
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

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

/**
 * Setup smooth scroll behavior for anchor links
 */
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

// ============================================
// INITIALIZATION
// ============================================

/**
 * Main initialization function
 * Called when DOM is fully loaded
 */
function initializeApplication() {
    // Initialize guest name from URL parameter
    initializeGuestName();

    // Setup splash screen interactions
    setupSplashScreen();

    // Initialize countdown timer
    initCountdown();

    // Setup RSVP form handling
    setupRSVPForm();

    // Setup smooth scroll for anchor links
    setupSmoothScroll();

    // Initialize scroll-triggered animations
    initializeAnimations();

    // Setup throttled scroll listener
    window.addEventListener('scroll', createThrottledScrollHandler());

    // Log initialization
    console.log('Wedding Invitation App Initialized');
}

// ============================================
// DOM READY EVENT
// ============================================

document.addEventListener('DOMContentLoaded', initializeApplication);
