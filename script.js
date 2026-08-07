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

    // =========================
    // Certifications Gallery
    // =========================

    const certsGrid = document.getElementById('certs-grid');
    const searchInput = document.getElementById('cert-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const filterPills = document.querySelectorAll('.filter-pill');
    const noResults = document.getElementById('no-results');

    // Modal elements
    const certModal = document.getElementById('cert-modal');
    const modalBackdrop = certModal ? certModal.querySelector('.modal-backdrop') : null;
    const modalTitle = document.getElementById('modal-title');
    const modalIssuer = document.getElementById('modal-issuer');
    const modalLoader = document.getElementById('modal-loader');
    const viewerContainer = document.getElementById('viewer-container');
    const modalCloseBtn = document.getElementById('modal-close');

    let currentFilter = 'all';
    let currentSearch = '';

    function renderCertificates() {
        if (!certsGrid) return;
        
        certsGrid.innerHTML = '';
        
        // Filter the data
        const filtered = CERTIFICATES_DATA.filter(cert => {
            const matchesFilter = currentFilter === 'all' || cert.category === currentFilter;
            
            const query = currentSearch.toLowerCase();
            const matchesSearch = !query || 
                cert.title.toLowerCase().includes(query) ||
                cert.issuer.toLowerCase().includes(query) ||
                (cert.skills && cert.skills.some(skill => skill.toLowerCase().includes(query)));
                
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            noResults.style.display = 'block';
            certsGrid.style.display = 'none';
            return;
        }

        noResults.style.display = 'none';
        certsGrid.style.display = 'grid';

        filtered.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'glass-card cert-card fade-in';
            card.style.animationDelay = `${index * 0.05}s`;
            
            // Choose an icon based on category/issuer
            let iconClass = 'fa-solid fa-award';
            if (cert.category.includes('Cloud & AI')) {
                iconClass = 'fa-solid fa-cloud';
            } else if (cert.issuer.includes('Cisco')) {
                iconClass = 'fa-solid fa-shield-halved';
            } else if (cert.issuer.includes('MongoDB') || cert.issuer.includes('Oracle')) {
                iconClass = 'fa-solid fa-database';
            } else if (cert.category.includes('Hackathons')) {
                iconClass = 'fa-solid fa-trophy';
            }
            
            

            card.innerHTML = `
                <div class="cert-card-header">
                    <i class="${iconClass} cert-icon"></i>
                    <span class="cert-badge">${cert.issuer}</span>
                </div>
                <div class="cert-card-body">
                    <h3>${cert.title}</h3>
                </div>
            `;

            certsGrid.appendChild(card);
            
            // Staggered fade-in transition
            setTimeout(() => {
                card.classList.add('visible');
            }, 50 + index * 30);
            
            // Re-apply reveal animation observer
            if (typeof observer !== 'undefined') {
                observer.observe(card);
            }
        });

        // Bind interactive effects to the newly rendered cards
        bindCertCardEffects();
    }

    function bindCertCardEffects() {
        const certCards = document.querySelectorAll('.cert-card');
        
        certCards.forEach(card => {
            // Glow effect
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
                card.style.background = 'rgba(255,255,255,0.03)';
            });

            // Tilt effect
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

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
            
            // View click handler
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                openModal(cert.filePath, cert.title, cert.issuer);
            });
        });
    }

    // Modal control functions
    function openModal(filePath, title, issuer) {
        if (!certModal) return;
        
        modalTitle.textContent = title;
        modalIssuer.textContent = `Issued by: ${issuer}`;
        
        // Clear previous content
        viewerContainer.innerHTML = '';
        modalLoader.classList.remove('hidden');
        
        // Add PDF or image viewer based on extension
        const isPdf = filePath.toLowerCase().endsWith('.pdf');
        
        
        if (isPdf) {
            const iframe = document.createElement('iframe');
            iframe.src = filePath;
            iframe.onload = () => {
                modalLoader.classList.add('hidden');
            };
            viewerContainer.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.src = filePath;
            img.onload = () => {
                modalLoader.classList.add('hidden');
            };
            viewerContainer.appendChild(img);
        }
        
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    }

    function closeModal() {
        if (!certModal) return;
        certModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
        // Timeout to allow transitions to complete before clearing viewer
        setTimeout(() => {
            viewerContainer.innerHTML = '';
        }, 400);
    }

    // Event listeners for filters, search and modal close
    if (filterPills) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilter = pill.getAttribute('data-filter');
                renderCertificates();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentSearch = searchInput.value;
            if (currentSearch.length > 0) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
            renderCertificates();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearch = '';
            clearSearchBtn.style.display = 'none';
            renderCertificates();
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Initial render
    renderCertificates();

});

