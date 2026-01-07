// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    
    // Toggle Mobile Menu
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    // Event Listeners for Mobile Menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    closeMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    
    // Mobile Dropdown Functionality
    mobileDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.has-dropdown');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            
            // Close other dropdowns
            mobileDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
        });
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.has-dropdown)');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
    
    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref === 'index.html' && currentPage === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                }
            }
        });
    });
    
    // Add fade-in animation to elements when scrolling
    const fadeElements = document.querySelectorAll('.service-card, .benefit-item');
    
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // Initial check
    fadeInOnScroll();
    
    // Listen for scroll
    window.addEventListener('scroll', fadeInOnScroll);
    
    // WhatsApp click tracking
    const whatsappButtons = document.querySelectorAll('[href*="whatsapp"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            // You can add Google Analytics or other tracking here
            console.log('WhatsApp button clicked from: ' + this.textContent);
        });
    });
    
    // Phone call tracking
    const phoneButtons = document.querySelectorAll('[href^="tel:"]');
    phoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Phone call initiated to: ' + this.textContent);
        });
    });
    
    // Trust indicator counter animation
    const trustItems = document.querySelectorAll('.trust-item span');
    trustItems.forEach(item => {
        if (item.textContent.includes('+')) {
            const originalText = item.textContent;
            item.textContent = '0';
            
            setTimeout(() => {
                animateCounter(item, originalText);
            }, 1000);
        }
    });
    
    function animateCounter(element, targetText) {
        const match = targetText.match(/\d+/);
        if (!match) return;
        
        const targetNumber = parseInt(match[0]);
        const prefix = targetText.split(match[0])[0];
        const suffix = targetText.split(match[0])[1];
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.floor(current) + suffix;
        }, 20);
    }
});