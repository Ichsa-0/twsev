// Countdown Timer
function initCountdown() {
    // Set your wedding date here (format: 'MONTH DD, YYYY HH:MM:SS')
    // Example: 'June 15, 2024 16:00:00'
    const weddingDate = new Date('July 26, 2026 09:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update HTML
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // If countdown is finished
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<h3>🎉 The wedding is here! 🎉</h3>';
        }
    }

    // Update countdown immediately
    updateCountdown();

    // Update countdown every 1 second
    setInterval(updateCountdown, 1000);
}

// RSVP Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown
    initCountdown();

    // RSVP Form submission
    const form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const attendance = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Validate
            if (!name || !email || !attendance) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Show success message
            alert(`Thank you, ${name}! Your RSVP has been received. We look forward to celebrating with you!`);
            
            // Reset form
            this.reset();
            
            // TODO: Send data to a backend service or email
            // Example: fetch('/api/rsvp', { method: 'POST', body: JSON.stringify({name, email, attendance, message}) })
            
            console.log('RSVP Data:', { name, email, attendance, message });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add animation on scroll
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.detail-box, .couple, .info, .countdown-item');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });

    // Initialize animations
    document.querySelectorAll('.detail-box, .couple, .info, .countdown-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});
