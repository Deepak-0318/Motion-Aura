/* ===========================
   MOTION AURA — script.js
=========================== */

// ── Logo intro → reveal main site ──────────────────────────────
(function () {
    const logoIntro = document.getElementById('logoIntro');
    const logoVideo = document.getElementById('logoVideo');
    const mainWebsite = document.getElementById('mainWebsite');

    const introPlayed = sessionStorage.getItem('introPlayed');

    function showWebsite() {
        if (!logoIntro) return;

        logoIntro.classList.add('hide');

        setTimeout(() => {
            logoIntro.style.display = 'none';

            if (mainWebsite) {
                mainWebsite.style.opacity = '1';
            }

            sessionStorage.setItem('introPlayed', 'true');
        }, 1000);
    }

    // Skip intro if already played in this session
    if (introPlayed) {
        if (logoIntro) {
            logoIntro.style.display = 'none';
        }

        if (mainWebsite) {
            mainWebsite.style.opacity = '1';
        }

        return;
    }

    // First visit → play intro normally
    if (logoVideo) {
        logoVideo.addEventListener('ended', showWebsite);
        setTimeout(showWebsite, 6000);
    } else {
        if (mainWebsite) {
            mainWebsite.style.opacity = '1';
        }

        sessionStorage.setItem('introPlayed', 'true');
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
/* ===========================
   TEAM MEMBER POPUP
=========================== */

const teamData = {

    hariprasad: {
        name: "Hariprasad",

        role: "Founder",

        image: "images/team1.jpeg",

        bio: "Passionate entrepreneur and creative leader behind MotionAura. Specializing in video production, motion graphics, and digital storytelling, Hariprasad helps brands transform ideas into compelling visual experiences that drive engagement and growth.",

        linkedin: "https://linkedin.com/",

        email: "hariprasad@gmail.com",

        experience: "3+ Years",

        skills: "Leadership, Branding, Motion Graphics, Storytelling"
    },

    deepak: {
        name: "Deepak K S",

        role: "Co-Founder",

        image: "images/team2.jpeg",

        bio: "Passionate Full Stack Developer and AI enthusiast focused on building innovative digital products. Specialized in web development, AI-powered applications, automation solutions, and scalable software systems, helping businesses transform ideas into impactful digital experiences.",

        linkedin: "www.linkedin.com/in/deepak-k-s7",

        email: "deepak.hsn29@gmail.com",

        experience: "2+ Years",

        skills: "Full Stack Development, React.js, JavaScript, Python, AI & Generative AI, FastAPI, UI/UX Development, Database Design, API Development, Automation Solutions"
    },

    nidhi: {
        name: "Nidhi S Nayak",

        role: "Developer",

        image: "images/team3.jpg",

        bio: "Aspiring software developer passionate about building innovative and user-friendly digital solutions. Experienced in web development, programming, databases, and AI-assisted technologies, with a strong drive for continuous learning.",

        linkedin: "https://www.linkedin.com/in/nidhi-nayak-14b9523a9/",

        email: "nidhinayak218@gmail.com",

        experience: "B.Tech Student (2nd Year)",

        skills: "Web Development, HTML & CSS, JavaScript, Python, C Programming, React.js, Database Design, AI & Generative AI, Software Development"
    },

    rohit: {
        name: "Rohit Singh",

        role: "Content Writer",

        image: "images/team4.webp",

        bio: "Writer turning complex tech into simple, conversion-focused stories. Tech and marketing content that educates and sells. F1 fan, artist, creativity addict.",

        linkedin: "http://www.linkedin.com/in/rohit-singh-70b1341b4",

        email: "singhrohit.rs71@gmail.com",

        experience: "4+ Years",

        skills: "Technical writing, content writing, customer communication and service."
    },

    pragati: {
        name: "Pragati Mittal",

        role: "UI/UX Designer",

        image: "images/team5.jpeg",

        bio: "UI/UX Designer focused on designing simple, user-friendly, and impactful digital products.Dedicated to enhancing user experiences through thoughtful design and usability.",

        linkedin: "https://www.linkedin.com/in/pragati-mittal-530112234/",

        email: "pragatimittal2002@gmail.com",

        experience: "2+ Years",

        skills: "UI/UX Design, Wireframing, Prototyping, User Research, Figma, Design Systems"
    }

};

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".team-card");

    const modal = document.getElementById("teamModal");

    const closeBtn = document.querySelector(".close-btn");

    if (!cards.length || !modal || !closeBtn) return;

    cards.forEach(card => {

        card.addEventListener("click", () => {

            const member = teamData[card.dataset.member];

            if (!member) return;

            document.getElementById("modalImage").src = member.image;

            document.getElementById("modalName").innerText = member.name;

            document.getElementById("modalRole").innerText = member.role;

            document.getElementById("modalBio").innerText = member.bio;

            document.getElementById("modalLinkedin").href = member.linkedin;

            document.getElementById("modalEmail").innerText = member.email;

            document.getElementById("modalExperience").innerText = member.experience;

            document.getElementById("modalSkills").innerText = member.skills;

            modal.style.display = "flex";
        });

    });

    closeBtn.addEventListener("click", () => {

        modal.style.display = "none";

    });

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

});