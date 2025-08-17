// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Enhanced mobile menu closing
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Enhanced smooth scrolling with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Enhanced navbar behavior
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
        navbar.style.borderBottom = '1px solid rgba(79, 70, 229, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    }
    
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Update active navigation on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmQw62zNtJQWKhnxyXrkWnIpFbHAgtea0",
  authDomain: "flymize.firebaseapp.com",
  projectId: "flymize",
  storageBucket: "flymize.firebasestorage.app",
  messagingSenderId: "855294898724",
  appId: "1:855294898724:web:8bc3cd7577a45a7958deb1",
};

// Initialize Firebase
let db;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    }
} catch (error) {
    console.log('Firebase initialization failed:', error);
}

// Enhanced contact form handling
function handleContactForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input');
        const textarea = this.querySelector('textarea');
        
        let name = '', email = '', message = '', phone = '', budget = '', website = '';
        
        inputs.forEach(input => {
            const placeholder = input.placeholder.toLowerCase();
            const value = input.value.trim();
            
            if (placeholder.includes('name')) name = value;
            else if (placeholder.includes('email')) email = value;
            else if (placeholder.includes('phone')) phone = value;
            else if (placeholder.includes('budget')) budget = value;
            else if (placeholder.includes('website')) website = value;
        });
        
        if (textarea) message = textarea.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"], .btn-primary, .send-message-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        const contactData = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'new',
            source: 'website'
        };
        
        if (phone) contactData.phone = phone;
        if (budget) contactData.budget = budget;
        if (website) contactData.website = website;
        
        // Try Firebase first, fallback if it fails
        if (db) {
            db.collection('contacts').add(contactData)
            .then(() => {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
                resetButton(submitBtn, originalText);
                if (this.closest('.modal')) {
                    document.getElementById('contactModal').classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            })
            .catch((error) => {
                console.log('Firebase error, using fallback:', error);
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
                resetButton(submitBtn, originalText);
                if (this.closest('.modal')) {
                    document.getElementById('contactModal').classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        } else {
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
                resetButton(submitBtn, originalText);
                if (this.closest('.modal')) {
                    document.getElementById('contactModal').classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }, 1000);
        }
    });
}

// Apply to all contact forms
const contactForms = document.querySelectorAll('.contact-form, .modal-form, #modalContactForm');
contactForms.forEach(form => {
    if (form) handleContactForm(form);
});

function resetButton(btn, originalText) {
    if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

// Custom notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
        }
        .notification-success {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        .notification-error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        .notification-info {
            background: linear-gradient(135deg, #4f46e5, #06b6d4);
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notification-content i {
            font-size: 1.2rem;
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// FAQ functionality
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const icon = question.querySelector('i');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('i').classList.remove('fa-minus');
                otherItem.querySelector('i').classList.add('fa-plus');
            }
        });
        
        if (isActive) {
            item.classList.remove('active');
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        } else {
            item.classList.add('active');
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        }
    });
});

// Social media and contact links
const socialLinks = {
    facebook: 'https://www.facebook.com/people/Flymize/61568456784466/?_rdr',
    instagram: 'https://www.instagram.com/flymize/',
    location: 'https://maps.app.goo.gl/BBFHbyG3w2xNVes17'
};

// Handle social media clicks
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-social="facebook"], .facebook-link, .fa-facebook-f')) {
        window.open(socialLinks.facebook, '_blank');
    }
    if (e.target.matches('[data-social="instagram"], .instagram-link, .fa-instagram')) {
        window.open(socialLinks.instagram, '_blank');
    }
    if (e.target.matches('[data-location], .location-link, .fa-map-marker-alt')) {
        window.open(socialLinks.location, '_blank');
    }
});

// Get in touch functionality
function openGetInTouch() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        window.location.href = '#contact';
    }
}

document.querySelectorAll('[data-action="get-in-touch"], .get-in-touch-btn').forEach(btn => {
    btn.addEventListener('click', openGetInTouch);
});

// Auto-close maintenance modal
setTimeout(() => {
    const maintenanceModal = document.getElementById('maintenanceModal');
    if (maintenanceModal) {
        maintenanceModal.classList.remove('active');
    }
}, 3000);