/* ===========================
   MOTION AURA — script.js
=========================== */

// ── Logo intro → reveal main site ──────────────────────────────
(function () {
    const logoIntro = document.getElementById('logoIntro');
    const logoVideo = document.getElementById('logoVideo');
    const mainWebsite = document.getElementById('mainWebsite');

    function showWebsite() {
        if (!logoIntro) return;
        logoIntro.classList.add('hide');
        setTimeout(() => {
            logoIntro.style.display = 'none';
            if (mainWebsite) mainWebsite.style.opacity = '1';
        }, 1000);
    }

    if (logoVideo) {
        logoVideo.addEventListener('ended', showWebsite);
        setTimeout(showWebsite, 6000); // fallback
    } else {
        if (mainWebsite) mainWebsite.style.opacity = '1';
    }
})();

// ── Hero text reveal after promo video (or timeout) ─────────────
(function () {
    const promoVideo = document.getElementById('promoVideo');
    const heroContent = document.getElementById('heroContent');

    function revealHero() {
        if (heroContent) heroContent.style.opacity = '1';
    }

    if (promoVideo) {
        promoVideo.addEventListener('ended', revealHero);
        setTimeout(revealHero, 8000);
    } else {
        revealHero();
    }
})();

document.addEventListener('DOMContentLoaded', function () {

    // ── Smooth scroll for anchor links ─────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Navbar scroll effect ────────────────────────────────────
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    const onScroll = () => {
        const scrollY = window.scrollY;
        if (navbar) {
            if (scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            // Hide on scroll down, show on scroll up
            if (scrollY > lastScrollY && scrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Mobile menu toggle ──────────────────────────────────────
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            mobileBtn.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !mobileBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ── Escape key closes mobile menu ──────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileBtn && mobileBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ── Intersection Observer for fade-in animations ───────────
    const fadeEls = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target); // animate once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    fadeEls.forEach(el => fadeObserver.observe(el));

    // ── Animated counters (About section stats) ─────────────────
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target')) || 0;
        if (!target) return; // skip "24/7" etc.
        const duration = 1800;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;

        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
        }, 16);
    }

    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        aboutObserver.observe(aboutSection);
    }

    // ── Floating chatbot FAB toggle ─────────────────────────────
    const chatFabBtn = document.getElementById('chatFabBtn');
    const chatPopup = document.getElementById('chatPopup');

    if (chatFabBtn && chatPopup) {
        chatFabBtn.addEventListener('click', () => {
            const isOpen = chatPopup.classList.toggle('open');
            chatFabBtn.classList.toggle('open');
            if (isOpen) {
                setTimeout(() => {
                    const input = chatPopup.querySelector('.popup-input-field');
                    if (input) input.focus();
                }, 300);
            }
        });

        // Send message on popup
        const popupSend = chatPopup.querySelector('.popup-send-btn');
        const popupInput = chatPopup.querySelector('.popup-input-field');
        const popupBody = chatPopup.querySelector('.chat-popup-body');

        function sendPopupMsg() {
            const val = popupInput.value.trim();
            if (!val) return;
            const userBubble = document.createElement('div');
            userBubble.style.cssText = `
                background: rgba(48,195,228,0.15);
                border: 1px solid rgba(48,195,228,0.25);
                border-radius: 12px; border-bottom-right-radius: 3px;
                padding: 0.65rem 0.9rem; font-size: 0.83rem; line-height: 1.5;
                color: rgba(255,255,255,0.85); align-self: flex-end;
                max-width: 85%; margin-left: auto;
            `;
            userBubble.textContent = val;
            popupBody.appendChild(userBubble);
            popupInput.value = '';
            popupBody.scrollTop = popupBody.scrollHeight;
            setTimeout(() => {
                const reply = document.createElement('div');
                reply.className = 'popup-bubble';
                reply.textContent = 'Thanks! We\'ll reach out to you shortly. 🚀';
                popupBody.appendChild(reply);
                popupBody.scrollTop = popupBody.scrollHeight;
            }, 1000);
        }

        if (popupSend) popupSend.addEventListener('click', sendPopupMsg);
        if (popupInput) {
            popupInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') sendPopupMsg();
            });
        }

        // Close popup on outside click
        document.addEventListener('click', (e) => {
            if (chatPopup.classList.contains('open') &&
                !chatPopup.contains(e.target) &&
                !chatFabBtn.contains(e.target)) {
                chatPopup.classList.remove('open');
                chatFabBtn.classList.remove('open');
            }
        });
    }

    // ── Contact form ────────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showNotification('Thank you! We\'ll get back to you soon. 🎉', 'success');
            this.reset();
        });
    }

    // ── Service card hover glow ─────────────────────────────────
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ── Notification helper ─────────────────────────────────────
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.ma-notification');
        if (existing) existing.remove();

        const n = document.createElement('div');
        n.className = 'ma-notification';
        n.textContent = message;
        n.style.cssText = `
            position: fixed;
            top: 80px; right: 20px;
            background: ${type === 'success'
                ? 'linear-gradient(135deg, #832a8b, #30c3e4)'
                : 'linear-gradient(135deg, #ea7d2b, #832a8b)'};
            color: white;
            padding: 14px 22px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.35);
            z-index: 99999;
            font-family: Inter, sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            max-width: 320px;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(.175,.885,.32,1.275);
        `;
        document.body.appendChild(n);
        requestAnimationFrame(() => {
            n.style.transform = 'translateX(0)';
        });
        setTimeout(() => {
            n.style.transform = 'translateX(120%)';
            setTimeout(() => n.remove(), 400);
        }, 4000);
    }

    // ── Stagger service cards on load ───────────────────────────
    document.querySelectorAll('.service-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 80}ms`;
    });

});