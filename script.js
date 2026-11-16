document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // 1. Theme Switcher (OLED Dark / Clean Light Mode)
    // ========================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('siddhesh_portfolio_theme');

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('siddhesh_portfolio_theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('siddhesh_portfolio_theme', 'light');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
            }
        });
    }

    // ========================================================
    // 2. Mobile Drawer Navigation
    // ========================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksList = document.getElementById('nav-links');

    if (mobileToggle && navLinksList) {
        mobileToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            const isOpen = navLinksList.classList.contains('active');
            mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksList.classList.contains('active')) {
                    navLinksList.classList.remove('active');
                    mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        });
    }

    // ========================================================
    // 3. Navbar Scroll & Back-to-Top Button
    // ========================================================
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================================
    // 4. Smooth Anchor Scrolling
    // ========================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================================
    // 5. Scroll Reveal Intersection Observer
    // ========================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .glass-card, .timeline-item, .skill-category, .section-header').forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
        revealObserver.observe(el);
    });

    // ========================================================
    // 6. Active Navbar Section Highlight
    // ========================================================
    const sections = document.querySelectorAll('section');
    const navAnchors = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ========================================================
    // 7. Interactive Professional Typing Animation
    // ========================================================
    const typingElement = document.querySelector('.hero-content .title');
    if (typingElement) {
        const titles = [
            'Building Practical Products with AI & Clean Architecture.',
            'Python Developer & Machine Learning Practitioner.',
            'Deep Learning (1D-CNN) & Computer Vision Pipelines.',
            'Full-Stack REST APIs & Relational Database Design.'
        ];

        let titleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeHeroTitle() {
            const currentTitle = titles[titleIdx];

            if (!isDeleting) {
                typingElement.textContent = currentTitle.substring(0, charIdx + 1);
                charIdx++;

                if (charIdx === currentTitle.length) {
                    isDeleting = true;
                    setTimeout(typeHeroTitle, 2200);
                    return;
                }
            } else {
                typingElement.textContent = currentTitle.substring(0, charIdx - 1);
                charIdx--;

                if (charIdx === 0) {
                    isDeleting = false;
                    titleIdx = (titleIdx + 1) % titles.length;
                }
            }

            setTimeout(typeHeroTitle, isDeleting ? 30 : 55);
        }

        typeHeroTitle();
    }

    // ========================================================
    // 8. Card Glow Hover Effect
    // ========================================================
    function applyCardTiltEffects() {
        const interactiveCards = document.querySelectorAll('.glass-card');
        interactiveCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        var(--accent-glow),
                        var(--bg-surface) 70%
                    )
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }
    applyCardTiltEffects();

    // ========================================================
    // 9. Featured Projects Filtering
    // ========================================================
    const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('#projects-grid .project-card');

    if (projectFilterBtns.length > 0) {
        projectFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                projectFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-proj-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category') || '';
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 40);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // ========================================================
    // 10. Curated Highlighted Open-Source Codebases
    // (Excludes raw/temporary scrapers like 'qwertyuio' or 'siddhesh-K7')
    // ========================================================
    const githubReposGrid = document.getElementById('github-repos-grid');

    const curatedCodebases = [
        {
            name: "sign-backend",
            url: "https://github.com/siddhesh-K7/sign-backend",
            description: "Deep Learning 1D-CNN hand gesture recognition pipeline with OpenCV real-time video stream classification.",
            language: "Python",
            langColor: "#3572A5",
            badge: "Deep Learning"
        },
        {
            name: "devpost-hackathon",
            url: "https://github.com/siddhesh-K7/devpost-hackathon",
            description: "PayPilot AI: Autonomous Commerce & Multi-Agent Engine powered by Google Gemini and PayPal API v2 integration.",
            language: "TypeScript",
            langColor: "#3178c6",
            badge: "AI Hackathon"
        },
        {
            name: "agrisense",
            url: "https://github.com/siddhesh-K7/agrisense",
            description: "Explainable & Risk-Aware Agricultural Price (LSTM) and Demand (XGBoost) Forecasting platform with SHAP attributions.",
            language: "Python",
            langColor: "#3572A5",
            badge: "Explainable AI"
        },
        {
            name: "real-world-OpenEnv-AI-agent",
            url: "https://github.com/siddhesh-K7/real-world-OpenEnv-environment-that-an-AI-agent",
            description: "Customer Support OpenEnv benchmark environment for evaluating autonomous triage agents using formal FSM state spaces.",
            language: "Python",
            langColor: "#3572A5",
            badge: "AI Agents"
        },
        {
            name: "WarehouseX-Optimization",
            url: "https://github.com/siddhesh-K7/WarehouseX-Order-Management-Performance-Optimization-System",
            description: "High-throughput ASP.NET Core Web API with LINQ query tuning, index optimization, and async non-tracking pipelines.",
            language: "C#",
            langColor: "#178600",
            badge: "Performance"
        },
        {
            name: "SafeVault-User-Management",
            url: "https://github.com/siddhesh-K7/SafeVault-Secure-User-Management-System",
            description: "Enterprise user management & authentication engine with cryptographic token verification and RBAC security bounds.",
            language: "Python",
            langColor: "#3572A5",
            badge: "Security"
        }
    ];

    if (githubReposGrid) {
        githubReposGrid.innerHTML = '';
        curatedCodebases.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'glass-card github-repo-card fade-in visible';

            card.innerHTML = `
                <div>
                    <div class="github-repo-header">
                        <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="github-repo-title">
                            <i class="fa-regular fa-bookmark" style="color: var(--accent-primary);"></i> ${repo.name}
                        </a>
                        <span style="font-size: 0.72rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-full); padding: 2px 8px; color: var(--accent-primary); background: var(--accent-glow);">
                            ${repo.badge}
                        </span>
                    </div>
                    <p class="github-repo-desc">${repo.description}</p>
                </div>
                <div class="github-repo-meta">
                    <span><span class="lang-indicator" style="background: ${repo.langColor};"></span>${repo.language}</span>
                    <span><i class="fa-solid fa-code-branch"></i> Open Source</span>
                    <span><a href="${repo.url}" target="_blank" style="color: var(--accent-primary); text-decoration: none;"><i class="fa-solid fa-arrow-up-right-from-square"></i></a></span>
                </div>
            `;
            githubReposGrid.appendChild(card);
        });
        applyCardTiltEffects();
    }

    // ========================================================
    // 11. Certifications Search & Modal Viewer
    // ========================================================
    const certsGrid = document.getElementById('certs-grid');
    const searchInput = document.getElementById('cert-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const filterPills = document.querySelectorAll('.filter-pill');
    const noResults = document.getElementById('no-results');

    const certModal = document.getElementById('cert-modal');
    const modalBackdrop = certModal ? certModal.querySelector('.modal-backdrop') : null;
    const modalTitle = document.getElementById('modal-title');
    const modalIssuer = document.getElementById('modal-issuer');
    const modalLoader = document.getElementById('modal-loader');
    const viewerContainer = document.getElementById('viewer-container');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalDownloadBtn = document.getElementById('modal-download');

    let currentCertFilter = 'all';
    let currentCertSearch = '';

    function renderCertificates() {
        if (!certsGrid || typeof CERTIFICATES_DATA === 'undefined') return;

        certsGrid.innerHTML = '';

        const filtered = CERTIFICATES_DATA.filter(cert => {
            const matchesFilter = currentCertFilter === 'all' || cert.category === currentCertFilter;
            const query = currentCertSearch.toLowerCase();
            const matchesSearch = !query || 
                cert.title.toLowerCase().includes(query) ||
                cert.issuer.toLowerCase().includes(query) ||
                (cert.skills && cert.skills.some(skill => skill.toLowerCase().includes(query)));

            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            if (noResults) noResults.style.display = 'block';
            certsGrid.style.display = 'none';
            return;
        }

        if (noResults) noResults.style.display = 'none';
        certsGrid.style.display = 'grid';

        filtered.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'glass-card cert-card fade-in visible';

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
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <i class="${iconClass}" style="font-size: 1.6rem; color: var(--accent-primary);"></i>
                        <span style="background: var(--accent-glow); border: 1px solid rgba(0, 229, 255, 0.25); color: var(--accent-primary); padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600;">
                            ${cert.issuer}
                        </span>
                    </div>
                    <h3 style="font-size: 1.12rem; margin-bottom: 12px; font-weight: 600; color: var(--text-primary);">${cert.title}</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
                        ${(cert.skills || []).map(s => `<span style="font-size: 0.74rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 2px 8px; border-radius: 4px; color: var(--text-secondary);">${s}</span>`).join('')}
                    </div>
                </div>
                <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; color: var(--accent-primary); font-weight: 500;">
                        <i class="fa-regular fa-eye"></i> View Certificate
                    </span>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.78rem; color: var(--text-muted);"></i>
                </div>
            `;

            card.addEventListener('click', () => {
                openModal(cert.filePath, cert.title, cert.issuer);
            });

            certsGrid.appendChild(card);
        });

        applyCardTiltEffects();
    }

    function openModal(filePath, title, issuer) {
        if (!certModal) return;

        modalTitle.textContent = title;
        modalIssuer.textContent = `Issued by: ${issuer}`;
        if (modalDownloadBtn) {
            modalDownloadBtn.href = filePath;
        }

        viewerContainer.innerHTML = '';
        modalLoader.classList.remove('hidden');

        const isPdf = filePath.toLowerCase().endsWith('.pdf');

        if (isPdf) {
            const iframe = document.createElement('iframe');
            iframe.src = filePath;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.onload = () => {
                modalLoader.classList.add('hidden');
            };
            viewerContainer.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.src = filePath;
            img.alt = title;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            img.onload = () => {
                modalLoader.classList.add('hidden');
            };
            viewerContainer.appendChild(img);
        }

        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!certModal) return;
        certModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            viewerContainer.innerHTML = '';
        }, 250);
    }

    if (filterPills.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCertFilter = pill.getAttribute('data-filter');
                renderCertificates();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentCertSearch = searchInput.value.trim();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentCertSearch.length > 0 ? 'block' : 'none';
            }
            renderCertificates();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentCertSearch = '';
            clearSearchBtn.style.display = 'none';
            renderCertificates();
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeModal();
        }
    });

    renderCertificates();

    // ========================================================
    // 12. Contact Form with Input Validation
    // ========================================================
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('sender-name').value.trim();
            const email = document.getElementById('sender-email').value.trim();
            const subject = document.getElementById('sender-subject').value.trim();
            const message = document.getElementById('sender-message').value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !subject || !message) {
                showFormAlert('Please complete all required fields.', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                showFormAlert('Please provide a valid email address.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Email...';

            setTimeout(() => {
                const mailtoUrl = `mailto:siddheshkrishnavel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Siddhesh,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;
                window.location.href = mailtoUrl;

                showFormAlert('Drafting email in your default mail application. Thank you!', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-arrow-right"></i>';
            }, 500);
        });
    }

    function showFormAlert(msg, type) {
        if (!formAlert) return;
        formAlert.className = `form-status-alert ${type}`;
        formAlert.textContent = msg;
        formAlert.style.display = 'block';

        setTimeout(() => {
            formAlert.style.display = 'none';
        }, 6000);
    }

});
