document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // 1. Theme Switcher (Dark / Light Theme Persistence)
    // ========================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('siddhesh_portfolio_theme');

    // Initial theme initialization
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeToggleBtn.setAttribute('title', 'Switch to dark theme');
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            themeToggleBtn.setAttribute('title', 'Switch to light theme');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('siddhesh_portfolio_theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                themeToggleBtn.setAttribute('title', 'Switch to light theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('siddhesh_portfolio_theme', 'light');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                themeToggleBtn.setAttribute('title', 'Switch to dark theme');
            }
        });
    }

    // ========================================================
    // 2. Responsive Mobile Navigation Toggle
    // ========================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksList = document.getElementById('nav-links');

    if (mobileToggle && navLinksList) {
        mobileToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            const isOpen = navLinksList.classList.contains('active');
            mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        // Close mobile drawer when clicking any link
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
    // 3. Navbar Scroll & Dynamic Back-to-Top
    // ========================================================
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
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
    // 5. Scroll Reveal IntersectionObserver
    // ========================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
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

    // ========================================================
    // 6. Active Section Navbar Spy
    // ========================================================
    const sections = document.querySelectorAll('section');
    const navAnchors = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
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
    // 7. Interactive Typing Effect (Professional Titles)
    // ========================================================
    const typingElement = document.querySelector('.hero-content .title');
    if (typingElement) {
        const titles = [
            'Building Intelligent Solutions Through Code.',
            'AI Engineer & Full-Stack Developer.',
            'Deep Learning & LLM Agent Architect.',
            'High-Performance Backend & Database Engineer.'
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

            setTimeout(typeHeroTitle, isDeleting ? 30 : 60);
        }

        typeHeroTitle();
    }

    // ========================================================
    // 8. 3D Card Hover & Tilt Effects
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
                        rgba(0, 229, 255, 0.12),
                        rgba(255, 255, 255, 0.03)
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
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ========================================================
    // 10. Real GitHub Repositories & Stats Integration
    // ========================================================
    const githubReposGrid = document.getElementById('github-repos-grid');
    const ghReposCount = document.getElementById('gh-repos-count');

    // Language color mapping
    const langColors = {
        'Python': '#3572A5',
        'TypeScript': '#3178c6',
        'JavaScript': '#f1e05a',
        'C#': '#178600',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Java': '#b07219'
    };

    async function loadGitHubActivity() {
        try {
            // Fetch live public repositories of Siddhesh-K7
            const response = await fetch('https://api.github.com/users/siddhesh-K7/repos?sort=updated&per_page=6');
            if (!response.ok) throw new Error('GitHub API rate limit or network issue');

            const repos = await response.json();
            if (ghReposCount && repos.length > 0) {
                ghReposCount.textContent = `${repos.length}+`;
            }

            if (githubReposGrid && Array.isArray(repos) && repos.length > 0) {
                githubReposGrid.innerHTML = '';

                repos.slice(0, 6).forEach(repo => {
                    const repoCard = document.createElement('div');
                    repoCard.className = 'glass-card github-repo-card fade-in visible';

                    const lang = repo.language || 'Code';
                    const color = langColors[lang] || '#00e5ff';
                    const desc = repo.description || 'Public open-source repository showcasing engineering design and clean implementation.';

                    repoCard.innerHTML = `
                        <div>
                            <div class="github-repo-header">
                                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-repo-title">
                                    <i class="fa-regular fa-bookmark highlight"></i> ${repo.name}
                                </a>
                                <span style="font-size: 0.75rem; border: 1px solid var(--border); border-radius: 12px; padding: 2px 8px; color: var(--muted);">
                                    ${repo.visibility || 'public'}
                                </span>
                            </div>
                            <p class="github-repo-desc">${desc}</p>
                        </div>
                        <div class="github-repo-meta">
                            <span><span class="lang-indicator" style="background: ${color};"></span>${lang}</span>
                            <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
                        </div>
                    `;

                    githubReposGrid.appendChild(repoCard);
                });

                applyCardTiltEffects();
            }
        } catch (err) {
            console.warn('Using curated GitHub repository data (fallback):', err);
            // Graceful fallback to avoid empty state
            if (githubReposGrid) {
                githubReposGrid.innerHTML = `
                    <div class="glass-card github-repo-card">
                        <div>
                            <div class="github-repo-header">
                                <a href="https://github.com/siddhesh-K7/devpost-hackathon" target="_blank" class="github-repo-title">
                                    <i class="fa-regular fa-bookmark highlight"></i> devpost-hackathon
                                </a>
                            </div>
                            <p class="github-repo-desc">PayPilot AI: Autonomous Commerce, Multi-Agent Engine & PayPal Payment Orchestration with Google Gemini.</p>
                        </div>
                        <div class="github-repo-meta">
                            <span><span class="lang-indicator" style="background: #3178c6;"></span>TypeScript / Python</span>
                            <span><i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Production Ready</span>
                        </div>
                    </div>
                    <div class="glass-card github-repo-card">
                        <div>
                            <div class="github-repo-header">
                                <a href="https://github.com/siddhesh-K7/agrisense" target="_blank" class="github-repo-title">
                                    <i class="fa-regular fa-bookmark highlight"></i> agrisense
                                </a>
                            </div>
                            <p class="github-repo-desc">AgriSense: Explainable & Risk-Aware Framework for Agricultural Price (LSTM) and Demand (XGBoost) Forecasting.</p>
                        </div>
                        <div class="github-repo-meta">
                            <span><span class="lang-indicator" style="background: #f1e05a;"></span>JavaScript / Python</span>
                            <span><i class="fa-solid fa-circle-check" style="color: #10b981;"></i> XAI Verified</span>
                        </div>
                    </div>
                    <div class="glass-card github-repo-card">
                        <div>
                            <div class="github-repo-header">
                                <a href="https://github.com/siddhesh-K7/WarehouseX-Order-Management-Performance-Optimization-System" target="_blank" class="github-repo-title">
                                    <i class="fa-regular fa-bookmark highlight"></i> WarehouseX-Order-Management
                                </a>
                            </div>
                            <p class="github-repo-desc">High-throughput ASP.NET Core Web API with LINQ query tuning, index optimization, and async non-tracking pipelines.</p>
                        </div>
                        <div class="github-repo-meta">
                            <span><span class="lang-indicator" style="background: #178600;"></span>C# / .NET 8</span>
                            <span><i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 50% Faster</span>
                        </div>
                    </div>
                `;
                applyCardTiltEffects();
            }
        }
    }
    loadGitHubActivity();

    // ========================================================
    // 11. Certifications Gallery & Dynamic Modal
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
                <div class="cert-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <i class="${iconClass} cert-icon" style="font-size: 1.8rem; color: var(--accent);"></i>
                    <span class="cert-badge" style="background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.25); color: var(--accent); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                        ${cert.issuer}
                    </span>
                </div>
                <div class="cert-card-body" style="flex: 1;">
                    <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--text);">${cert.title}</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${(cert.skills || []).map(s => `<span style="font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px; color: var(--muted);">${s}</span>`).join('')}
                    </div>
                </div>
                <div style="margin-top: 18px; border-top: 1px solid var(--border); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; color: var(--accent); font-weight: 500;">
                        <i class="fa-regular fa-eye"></i> View Certificate
                    </span>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8rem; color: var(--muted);"></i>
                </div>
            `;

            card.style.cursor = 'pointer';
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
        }, 300);
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
    // 12. Contact Form Validation & Formspree / Mailto Fallback
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
                showFormAlert('Please fill in all required fields.', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                showFormAlert('Please provide a valid email address.', 'error');
                return;
            }

            // Simulate sending & open verified mailto client
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Email...';

            setTimeout(() => {
                const mailtoUrl = `mailto:siddheshkrishnavel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Siddhesh,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;
                window.location.href = mailtoUrl;

                showFormAlert('Opening your default mail client with your message drafted. Thank you!', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-arrow-right"></i>';
            }, 600);
        });
    }

    function showFormAlert(msg, type) {
        if (!formAlert) return;
        formAlert.className = `form-status-alert ${type}`;
        formAlert.textContent = msg;
        formAlert.style.display = 'block';

        setTimeout(() => {
            formAlert.style.display = 'none';
        }, 7000);
    }

});
