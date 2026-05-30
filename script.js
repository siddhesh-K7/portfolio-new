document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // Navbar Scroll Effect
    // =========================

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }

        else {
            navbar.classList.remove('scrolled');
        }

    });

    // =========================
    // Smooth Scroll
    // =========================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function (e) {

            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

            }

        });

    });

    // =========================
    // Scroll Reveal Animation
    // =========================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('visible');

                observer.unobserve(entry.target);

            }

        });

    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in, .glass-card, .timeline-item, .skill-category, .section-header');
    
    fadeElements.forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
        observer.observe(el);
    });

    // =========================
    // Active Navbar Highlight
    // =========================

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {

        let current = '';

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 200;

            if (scrollY >= sectionTop) {

                current = section.getAttribute('id');

            }

        });

        navLinks.forEach(link => {

            link.classList.remove('active');

            if (link.getAttribute('href').includes(current)) {

                link.classList.add('active');

            }

        });

    });

    // =========================
    // Card Glow Hover Effect
    // =========================

    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {

        card.addEventListener('mousemove', e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(56,189,248,0.15),
                    rgba(255,255,255,0.03)
                )
            `;

        });

        card.addEventListener('mouseleave', () => {

            card.style.background = `
                rgba(255,255,255,0.03)
            `;

        });

    });

    // =========================
    // Typing Animation
    // =========================

    const typingText = document.querySelector('.title');

    const words = [
        'Full Stack Developer',
        'AI Enthusiast',
        'Machine Learning Developer',
        'Problem Solver'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {

        const currentWord = words[wordIndex];

        if (!isDeleting) {

            typingText.textContent =
                currentWord.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentWord.length) {

                isDeleting = true;

                setTimeout(typeEffect, 1200);

                return;
            }

        }

        else {

            typingText.textContent =
                currentWord.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {

                isDeleting = false;

                wordIndex++;

                if (wordIndex === words.length) {
                    wordIndex = 0;
                }

            }

        }

        setTimeout(typeEffect, isDeleting ? 50 : 100);

    }

    typeEffect();

    // =========================
    // Floating Blob Animation
    // =========================

    document.addEventListener('mousemove', (e) => {

        const blob1 = document.querySelector('.blob-1');
        const blob2 = document.querySelector('.blob-2');

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        blob1.style.transform =
            `translate(${x * 30}px, ${y * 30}px)`;

        blob2.style.transform =
            `translate(-${x * 30}px, -${y * 30}px)`;

    });

    // =========================
    // Hero Avatar Hover
    // =========================

    const avatar = document.querySelector('.avatar-container');

    avatar.addEventListener('mousemove', (e) => {

        const rect = avatar.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 20;
        const rotateX = ((y / rect.height) - 0.5) * -20;

        avatar.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;

    });

    avatar.addEventListener('mouseleave', () => {

        avatar.style.transform = `
            rotateX(0deg)
            rotateY(0deg)
        `;

    });

    // =========================
    // Project Card Tilt Effect
    // =========================

    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {

        card.addEventListener('mousemove', (e) => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / 20);
            const rotateY = ((centerX - x) / 20);

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-10px)
            `;

        });

        card.addEventListener('mouseleave', () => {

            card.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0px)
            `;

        });

    });

});

