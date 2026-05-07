// ===================================
// Orunyx Landing Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileNav();
    initScrollAnimations();
    initParticles();
    initWaitlistForm();
});

// ===================================
// Navbar Scroll Effect
// ===================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================
// Mobile Navigation Toggle
// ===================================
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navActions.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navActions.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.feature-card, .arch-layer, .timeline-item, .flow-step, .section-header'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===================================
// Particles Effect
// ===================================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');

    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 20;
    const delay = Math.random() * 20;
    const opacity = Math.random() * 0.5 + 0.1;

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, rgba(139, 92, 246, ${opacity}), rgba(6, 182, 212, ${opacity}));
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
    `;

    container.appendChild(particle);
}

// Floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
        }
        25% {
            transform: translate(20px, -30px) scale(1.1);
            opacity: 0.7;
        }
        50% {
            transform: translate(-10px, -50px) scale(0.9);
            opacity: 0.3;
        }
        75% {
            transform: translate(30px, -20px) scale(1.05);
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Waitlist Form
// ===================================
function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('emailInput');

    if (!form || !emailInput) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const button = form.querySelector('button');
        const originalText = button.innerHTML;

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!form.action || !form.method) {
            showNotification('Waitlist form is not configured yet.', 'error');
            return;
        }

        button.innerHTML = `
            <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span>Joining...</span>
        `;
        button.disabled = true;

        try {
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to join waitlist. Please try again.');
            }

            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>You're on the list!</span>
            `;
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            showNotification('Welcome to Orunyx! Your signup has been received.', 'success');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
                emailInput.value = '';
            }, 3000);
        } catch (error) {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';

            showNotification(error.message || 'Failed to join waitlist. Please try again.', 'error');
        }
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#8b5cf6'
    };

    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: rgba(10, 10, 15, 0.95);
        border: 1px solid ${colors[type]};
        border-radius: 10px;
        color: white;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        max-width: 320px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    const animStyle = document.createElement('style');
    animStyle.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(animStyle);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
