// ============================================
// MUHAMMAD WAQAR PORTFOLIO - SCRIPT.JS
// All Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // PARTICLES SYSTEM
    // ============================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let isActive = true;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '59, 130, 246' : '6, 182, 212';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles (fewer on mobile)
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 25 : 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections between nearby particles
        function drawConnections() {
            const maxDistance = 120;
            const maxConnections = 3;
            for (let i = 0; i < particles.length; i++) {
                let connections = 0;
                for (let j = i + 1; j < particles.length; j++) {
                    if (connections >= maxConnections) break;
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        connections++;
                    }
                }
            }
        }

        function animateParticles() {
            if (!isActive) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            animationId = requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isActive = false;
                cancelAnimationFrame(animationId);
            } else {
                isActive = true;
                animateParticles();
            }
        });
    }

    // ============================================
    // SCROLL PROGRESS
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });

    // ============================================
    // MOBILE MENU
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    const mobileLinks = navMobile.querySelectorAll('.nav-link, .nav-cta');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMobile.classList.toggle('open');
        document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // ACTIVE NAV LINK
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.querySelector('.suffix');
                const suffixText = suffix ? suffix.textContent : '';
                let current = 0;
                const duration = 2000;
                const step = target / (duration / 16);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.childNodes[0].textContent = Math.floor(current);
                }, 16);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObserver.observe(el));

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    const track = document.getElementById('testimonialsTrack');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
    });

    // Auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    startAutoSlide();

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoSlide();
        }
    }, { passive: true });
// ============================================
// CONTACT FORM — VALIDATION + BACKEND RECORDING
// ============================================
const CONTACT_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwvjhB8aosM1_5Yy54GV65DE2W0Q83gy_0d33pWfiUOcIfE6SzyE1NsiRbW2YPSI6cm/exec';

const contactForm = document.getElementById('contactForm');
const formSubmit = document.getElementById('formSubmit');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, show) {
    const error = document.getElementById(fieldId + 'Error');
    const input = document.getElementById(fieldId);
    if (show) { error.classList.add('show'); input.classList.add('error'); }
    else { error.classList.remove('show'); input.classList.remove('error'); }
}
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) {
    if (!phone) return true;
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s/g, ''));
}

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    let isValid = true;

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const company = document.getElementById('company').value.trim();

    if (!name) { showError('name', true); isValid = false; } else showError('name', false);
    if (!email || !validateEmail(email)) { showError('email', true); isValid = false; } else showError('email', false);
    if (phone && !validatePhone(phone)) { showError('phone', true); isValid = false; } else showError('phone', false);
    if (!subject) { showError('subject', true); isValid = false; } else showError('subject', false);
    if (!message) { showError('message', true); isValid = false; } else showError('message', false);
    if (!isValid) return;

    const payload = {
        timestamp: new Date().toISOString(),
        source: 'muhammadwaqar.com — portfolio contact form',
        name, email,
        phone: phone || 'Not provided',
        company: company || 'Not provided',
        subject, message
    };

    const defaultBtnHTML = formSubmit.innerHTML;
    formSubmit.classList.add('loading');
    formSubmit.innerHTML = '<span>Saving enquiry…</span>';

    let recorded = false;
    if (CONTACT_BACKEND_URL.indexOf('https://') === 0) {
        try {
            // text/plain avoids CORS preflight; Apps Script accepts it fine
            const response = await fetch(CONTACT_BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });
            recorded = response.ok;
        } catch (err) { recorded = false; }
    }

    if (!recorded) {
        // Safety net: open visitor's email app so no enquiry is ever lost
        const body = [
            'Name: ' + name, 'Email: ' + email, 'Phone: ' + payload.phone,
            'Company: ' + payload.company, '', message
        ].join('\n');
        window.location.href = 'director@cabxperts.com?subject=' +
            encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    formSubmit.classList.remove('loading');
    formSubmit.innerHTML = recorded ? '<span>Enquiry recorded ✓</span>' : defaultBtnHTML;
    formSuccess.classList.add('show');
    contactForm.reset();
});

// Clear errors on input
['name', 'email', 'phone', 'subject', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => showError(id, false));
});
    // ============================================
    // BACK TO TOP
    // ============================================
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile.classList.contains('open')) {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // REDUCED MOTION SUPPORT
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Disable particle animation
        if (canvas) {
            isActive = false;
            cancelAnimationFrame(animationId);
            canvas.style.display = 'none';
        }
        // Make all reveals visible immediately
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================
    // PERFORMANCE: Pause animations when not visible
    // ============================================
    const heroSection = document.querySelector('.hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (canvas) {
                if (entry.isIntersecting) {
                    if (!isActive) {
                        isActive = true;
                        animateParticles();
                    }
                } else {
                    isActive = false;
                    cancelAnimationFrame(animationId);
                }
            }
        });
    }, { threshold: 0 });
    if (heroSection) heroObserver.observe(heroSection);

    console.log('\u2705 Muhammad Waqar Portfolio loaded successfully');
});
// ============================================
// GLIDING ACTIVE-NAV RING
// Moves the screenshot-style ring to whichever
// nav link is active (scroll-spy driven).
// ============================================
(function () {
    const nav = document.querySelector('.nav-desktop');
    if (!nav) return;

    // Create the ring element (no HTML edit needed)
    const glide = document.createElement('span');
    glide.className = 'nav-glide';
    glide.setAttribute('aria-hidden', 'true');
    nav.prepend(glide);

    let current = null;

    function place() {
        const link = nav.querySelector('.nav-link.active');
        if (!link) { glide.classList.remove('on'); current = null; return; }
        if (link !== current) {
            current = link;
            glide.style.width  = (link.offsetWidth  + 6) + 'px';
            glide.style.height = (link.offsetHeight + 6) + 'px';
            glide.style.transform =
                'translate(' + (link.offsetLeft - 3) + 'px,' + (link.offsetTop - 3) + 'px)';
            glide.classList.add('on');
        }
    }

    function refresh() { current = null; place(); }

    // Runs AFTER the existing scroll-spy updates .active
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', refresh);
    window.addEventListener('load', refresh);   // re-measure after fonts load
    place();
})();
