// Web4.com - Ana JavaScript Dosyası
// Mobile-First, SEO Optimize, Yüksek Dönüşüm Odaklı

(function() {
    'use strict';
    
    // DOM Yüklendikten Sonra Çalışacak Tüm Fonksiyonlar
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Web4.com yüklendi - ' + new Date().toLocaleString());
        
        // ===== DEĞİŞKENLER =====
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // ===== MOBİL MENÜ FONKSİYONALİTESİ =====
        function initMobileMenu() {
            if (!mobileMenuBtn) return;
            
            // Mobil Menüyü Aç/Kapat
            function toggleMobileMenu() {
                const isActive = mobileMenu.classList.contains('active');
                
                mobileMenuBtn.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                mobileMenuOverlay.classList.toggle('active');
                
                // Body scroll'u engelle/aktif et
                document.body.style.overflow = isActive ? '' : 'hidden';
                
                // Analytics Event (isteğe bağlı)
                if (!isActive) {
                    trackEvent('menu', 'mobile_menu_opened');
                }
            }
            
            // Event Listeners
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            closeMenuBtn.addEventListener('click', toggleMobileMenu);
            mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
            
            // Mobil Dropdown'lar
            mobileDropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('.has-dropdown');
                if (!link) return;
                
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isActive = dropdown.classList.contains('active');
                    
                    // Diğer dropdown'ları kapat
                    mobileDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Tıklananı aç/kapat
                    dropdown.classList.toggle('active');
                    
                    // İkonu döndür
                    const icon = this.querySelector('.fa-chevron-down');
                    if (icon) {
                        icon.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
                        icon.style.transition = 'transform 0.3s ease';
                    }
                });
            });
            
            // Mobil menüde link tıklanınca menüyü kapat
            const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.has-dropdown)');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Menüyü kapat
                    mobileMenuBtn.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Dropdown'ları kapat
                    mobileDropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                    
                    // 300ms sonra scroll yap (animasyon için)
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        setTimeout(() => {
                            smoothScrollTo(href);
                        }, 300);
                    }
                });
            });
            
            console.log('✅ Mobil menü başlatıldı');
        }
        
        // ===== AKTİF MENÜ LİNKİ GÖSTERİMİ =====
        function setActiveMenu() {
            const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
            
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                
                // Ana sayfa kontrolü
                if ((currentPage === '' || currentPage === 'index.html') && 
                    (linkHref === 'index.html' || linkHref === './')) {
                    link.classList.add('active');
                    return;
                }
                
                // Diğer sayfalar
                if (linkHref === currentPage || 
                    (linkHref && currentPage.includes(linkHref.replace('.html', '')))) {
                    link.classList.add('active');
                    
                    // Ana menüde parent'ı da aktif yap
                    const parentMenuItem = link.closest('.dropdown');
                    if (parentMenuItem) {
                        const parentLink = parentMenuItem.querySelector('.nav-link');
                        if (parentLink) {
                            parentLink.classList.add('active');
                        }
                    }
                }
            });
            
            console.log('✅ Aktif menü ayarlandı:', currentPage);
        }
        
        // ===== SMOOTH SCROLL FONKSİYONU =====
        function initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    if (href !== '#' && href.startsWith('#')) {
                        e.preventDefault();
                        smoothScrollTo(href);
                    }
                });
            });
        }
        
        function smoothScrollTo(targetId) {
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            // Easing function
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        }
        
        // ===== FADE-IN ANİMASYONLARI =====
        function initScrollAnimations() {
            const fadeElements = document.querySelectorAll('.service-card, .benefit-item, .trust-item');
            
            function checkVisibility() {
                fadeElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.classList.add('fade-in');
                    }
                });
            }
            
            // İlk yüklemede kontrol et
            checkVisibility();
            
            // Scroll ve resize event'lerinde kontrol et
            window.addEventListener('scroll', checkVisibility);
            window.addEventListener('resize', checkVisibility);
            
            console.log('✅ Scroll animasyonları başlatıldı');
        }
        
        // ===== SAYAÇ ANİMASYONLARI =====
        function initCounters() {
            const trustItems = document.querySelectorAll('.trust-item span');
            
            trustItems.forEach(item => {
                const text = item.textContent.trim();
                
                // Sayı içeren trust item'ları bul
                if (text.includes('+') || text.match(/\d+/)) {
                    const match = text.match(/\d+/);
                    if (!match) return;
                    
                    const targetNumber = parseInt(match[0]);
                    const prefix = text.split(match[0])[0] || '';
                    const suffix = text.split(match[0])[1] || '';
                    
                    // Sayacı sıfırla
                    item.setAttribute('data-original', text);
                    item.setAttribute('data-target', targetNumber);
                    item.textContent = prefix + '0' + suffix;
                    
                    // Observer ile görünür olduğunda animasyonu başlat
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                animateCounter(item);
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.5 });
                    
                    observer.observe(item);
                }
            });
        }
        
        function animateCounter(element) {
            const originalText = element.getAttribute('data-original');
            const target = parseInt(element.getAttribute('data-target'));
            const prefix = originalText.split(target)[0] || '';
            const suffix = originalText.split(target)[1] || '';
            
            let current = 0;
            const increment = target / 30; // 30 frame'de tamamlansın
            const duration = 1500; // 1.5 saniye
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = prefix + Math.floor(current) + suffix;
            }, duration / 30);
        }
        
        // ===== WHATSAPP & TELEFON TAKİP =====
        function initConversionTracking() {
            // WhatsApp Butonları
            const whatsappButtons = document.querySelectorAll('[href*="whatsapp"], .btn-whatsapp');
            whatsappButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const buttonText = this.textContent.trim();
                    const buttonLocation = this.closest('section')?.id || 'unknown';
                    
                    // Event Tracking (Google Analytics için)
                    trackEvent('conversion', 'whatsapp_click', {
                        location: buttonLocation,
                        text: buttonText
                    });
                    
                    // Console log (geliştirme için)
                    console.log('📱 WhatsApp tıklandı:', {
                        text: buttonText,
                        location: buttonLocation,
                        url: this.href,
                        timestamp: new Date().toISOString()
                    });
                    
                    // 100ms gecikmeyle yönlendir (tracking için zaman tanı)
                    setTimeout(() => {
                        // Normal davranışa devam et
                    }, 100);
                });
            });
            
            // Telefon Butonları
            const phoneButtons = document.querySelectorAll('[href^="tel:"]');
            phoneButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const phoneNumber = this.href.replace('tel:', '');
                    const buttonLocation = this.closest('section')?.id || 'unknown';
                    
                    // Event Tracking
                    trackEvent('conversion', 'phone_click', {
                        location: buttonLocation,
                        number: phoneNumber
                    });
                    
                    console.log('📞 Telefon tıklandı:', {
                        number: phoneNumber,
                        location: buttonLocation,
                        timestamp: new Date().toISOString()
                    });
                });
            });
            
            // Form Gönderimleri (gelecekte eklenebilir)
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    // Form validasyonu ve tracking buraya eklenebilir
                    trackEvent('conversion', 'form_submit', {
                        formId: this.id || 'contact_form'
                    });
                });
            });
            
            console.log('✅ Dönüşüm takibi başlatıldı');
        }
        
        // ===== FORM VALİDASYONU =====
        function initFormValidation() {
            const forms = document.querySelectorAll('form[data-validate]');
            
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                
                inputs.forEach(input => {
                    // Real-time validation
                    input.addEventListener('blur', function() {
                        validateField(this);
                    });
                    
                    // Clear error on focus
                    input.addEventListener('focus', function() {
                        clearError(this);
                    });
                });
                
                // Form submit validation
                form.addEventListener('submit', function(e) {
                    let isValid = true;
                    
                    inputs.forEach(input => {
                        if (!validateField(input)) {
                            isValid = false;
                        }
                    });
                    
                    if (!isValid) {
                        e.preventDefault();
                        showFormError(form, 'Lütfen tüm zorunlu alanları doğru şekilde doldurun.');
                    }
                });
            });
        }
        
        function validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            let isValid = true;
            let message = '';
            
            // Required check
            if (field.required && !value) {
                isValid = false;
                message = 'Bu alan zorunludur.';
            }
            
            // Email validation
            if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Geçerli bir email adresi girin.';
                }
            }
            
            // Phone validation
            if (field.name.includes('phone') && value) {
                const phoneRegex = /^[0-9\s\+\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    message = 'Geçerli bir telefon numarası girin.';
                }
            }
            
            // Update field state
            if (!isValid) {
                showFieldError(field, message);
            } else {
                clearError(field);
                showFieldSuccess(field);
            }
            
            return isValid;
        }
        
        function showFieldError(field, message) {
            clearError(field);
            field.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #dc2626;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            `;
            
            field.parentNode.appendChild(errorDiv);
        }
        
        function showFieldSuccess(field) {
            field.classList.remove('error');
            field.classList.add('success');
        }
        
        function clearError(field) {
            field.classList.remove('error', 'success');
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
        }
        
        function showFormError(form, message) {
            // Remove existing form errors
            const existingErrors = form.querySelectorAll('.form-error');
            existingErrors.forEach(error => error.remove());
            
            // Add new error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                background-color: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                font-size: 0.875rem;
            `;
            
            form.insertBefore(errorDiv, form.firstChild);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
        
        // ===== LAZY LOADING İMAGES =====
        function initLazyLoading() {
            if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img[loading="lazy"]');
                
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }
        
        // ===== STICKY HEADER =====
        function initStickyHeader() {
            const header = document.querySelector('.header');
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                // Aşağı kaydırılıyorsa header'ı gizle
                if (currentScroll > lastScroll && currentScroll > 100) {
                    header.style.transform = 'translateY(-100%)';
                    header.style.transition = 'transform 0.3s ease';
                } 
                // Yukarı kaydırılıyorsa header'ı göster
                else {
                    header.style.transform = 'translateY(0)';
                }
                
                // Scrolda header'a shadow ekle
                if (currentScroll > 50) {
                    header.style.boxShadow = 'var(--shadow-md)';
                } else {
                    header.style.boxShadow = 'var(--shadow-sm)';
                }
                
                lastScroll = currentScroll;
            });
        }
        
        // ===== ANALYTICS / TRACKING FUNCTIONS =====
        function trackEvent(category, action, label = {}) {
            // Google Analytics (gtag) varsa
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    'event_category': category,
                    'event_label': JSON.stringify(label)
                });
            }
            
            // Facebook Pixel varsa
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', action, label);
            }
            
            // Console'a log (geliştirme için)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('📊 Event Tracked:', { category, action, label, timestamp: new Date().toISOString() });
            }
        }
        
        // ===== PAGE LOAD PERFORMANCE =====
        function initPerformanceMetrics() {
            // Page load time
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`⏱️ Sayfa yükleme süresi: ${loadTime}ms`);
                
                // Critical performance metrics
                if (loadTime > 3000) {
                    console.warn('⚠️ Sayfa yükleme süresi 3 saniyeden fazla, optimizasyon gerekli.');
                }
            });
            
            // CLS (Cumulative Layout Shift) monitoring
            let cls = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        cls += entry.value;
                    }
                }
                
                if (cls > 0.1) {
                    console.warn(`⚠️ Yüksek layout shift (CLS): ${cls.toFixed(3)}`);
                }
            }).observe({ type: 'layout-shift', buffered: true });
        }
        
        // ===== BACK TO TOP BUTTON =====
        function initBackToTop() {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.setAttribute('aria-label', 'Yukarı çık');
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 5rem;
                right: 1rem;
                width: 50px;
                height: 50px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                box-shadow: var(--shadow-lg);
                z-index: 998;
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(backToTopBtn);
            
            // Show/hide based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = 'flex';
                    backToTopBtn.style.opacity = '1';
                } else {
                    backToTopBtn.style.opacity = '0';
                    setTimeout(() => {
                        backToTopBtn.style.display = 'none';
                    }, 300);
                }
            });
            
            // Scroll to top on click
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // ===== SERVICE ICONS HOVER EFFECTS =====
        function initServiceIcons() {
            const serviceIcons = document.querySelectorAll('.service-icon-item');
            
            serviceIcons.forEach(icon => {
                icon.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.05)';
                });
                
                icon.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
                
                // Click to scroll to services section
                icon.addEventListener('click', function() {
                    smoothScrollTo('#services-section');
                    trackEvent('navigation', 'service_icon_click', {
                        service: this.querySelector('span').textContent
                    });
                });
            });
        }
        
        // ===== INITIALIZE EVERYTHING =====
        function initAll() {
            console.log('🎬 Web4.com başlatılıyor...');
            
            // Core functionality
            initMobileMenu();
            setActiveMenu();
            initSmoothScroll();
            initScrollAnimations();
            initCounters();
            initConversionTracking();
            initFormValidation();
            
            // Performance & UX enhancements
            initLazyLoading();
            initStickyHeader();
            initBackToTop();
            initServiceIcons();
            initPerformanceMetrics();
            
            // Service icons için Intersection Observer
            const serviceIcons = document.querySelector('.services-icons');
            if (serviceIcons && 'IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(serviceIcons);
            }
            
            console.log('✅ Web4.com başarıyla başlatıldı!');
        }
        
        // ===== ERROR HANDLING =====
        window.addEventListener('error', function(e) {
            console.error('❌ JavaScript hatası:', e.error);
            trackEvent('error', 'javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno
            });
        });
        
        // ===== START EVERYTHING =====
        initAll();
        
        // ===== PUBLIC API (İsteğe bağlı) =====
        window.Web4 = {
            trackEvent: trackEvent,
            smoothScroll: smoothScrollTo,
            toggleMobileMenu: function() {
                const btn = document.getElementById('mobileMenuBtn');
                if (btn) btn.click();
            }
        };
    });
    
    // ===== UTILITY FUNCTIONS =====
    function debounce(func, wait) {
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
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
})();

// ===== POLYFILLS (Eski tarayıcı desteği) =====
// IntersectionObserver polyfill
if (!('IntersectionObserver' in window)) {
    console.warn('⚠️ IntersectionObserver desteklenmiyor, lazy loading devre dışı.');
}

// ===== EXTERNAL INTEGRATIONS (Örnek) =====
// Google Maps API için (gelecekte)
function initGoogleMaps() {
    // Bu fonksiyon Google Maps API yüklendikten sonra çağrılacak
    console.log('🗺️ Google Maps başlatılıyor...');
    
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Maps initialization code buraya gelecek
    }
}

// WhatsApp API için (isteğe bağlı)
function initWhatsAppWidget() {
    // Resmi WhatsApp Widget API için
    // https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-widget
}
