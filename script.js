document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // 0. Glitch / Statement Screen Preloader (Inspired by reference)
    // ========================================================
    const loader = document.getElementById('glitch-loader');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderStatement = document.getElementById('loader-statement');

    if (loader) {
        document.body.style.overflow = 'hidden';
        let progress = 0;
        const startTime = performance.now();
        const duration = 1200; // 1.2s smooth reveal

        const updateLoader = (now) => {
            const elapsed = now - startTime;
            const target = Math.min(100, Math.floor((elapsed / duration) * 100));
            progress += Math.ceil((target - progress) * 0.2);

            if (loaderPercent) {
                loaderPercent.textContent = progress < 10 ? `0${progress}` : `${progress}`;
            }

            if (loaderStatement) {
                const blurAmount = (1 - progress / 100) * 8;
                loaderStatement.style.filter = `blur(${blurAmount}px)`;
            }

            if (progress < 100) {
                requestAnimationFrame(updateLoader);
            } else {
                loader.classList.add('is-revealing');
                document.body.style.overflow = '';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }
        };

        requestAnimationFrame(updateLoader);
    }

    // ========================================================
    // 0.1 Interactive WebGL Particle Starfield (Three.js GPU Engine)
    // ========================================================
    const canvas = document.getElementById('bg-starfield');
    let triggerStarfieldPulse = null;

    if (canvas && typeof THREE !== 'undefined') {
        try {
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: false,
                powerPreference: 'high-performance'
            });

            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
            camera.position.set(0, 0, 6);

            const isMobile = window.innerWidth < 768;
            const particleCount = isMobile ? 1000 : 2200;

            const positions = new Float32Array(particleCount * 3);
            const aSize = new Float32Array(particleCount);
            const aSeed = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                const radius = Math.pow(Math.random(), 0.7) * 26;
                const angle = Math.random() * Math.PI * 2;
                positions[i * 3] = Math.cos(angle) * radius * 1.4 + (Math.random() - 0.5) * 4;
                positions[i * 3 + 1] = Math.sin(angle) * radius * 0.9 + (Math.random() - 0.5) * 4;
                positions[i * 3 + 2] = -Math.random() * 70;

                aSize[i] = Math.random() < 0.08 ? (6 + Math.random() * 8) : (1.2 + Math.random() * 2.8);
                aSeed[i] = Math.random();
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
            geometry.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));

            // Custom GLSL Vertex & Fragment Shaders
            const vertexShader = `
                attribute float aSize;
                attribute float aSeed;
                uniform float uTime;
                uniform float uTravel;
                uniform float uDepth;
                uniform vec2 uMouse;
                uniform float uSpeed;
                uniform float uPixelRatio;
                uniform float uClock;
                uniform float uAspect;
                uniform vec3 uClick[4];
                varying float vAlpha;
                varying float vSeed;
                varying float vSize;

                void main() {
                    vec3 p = position;
                    // Organic ambient drift
                    p.x += sin(uTime * (0.12 + aSeed * 0.2) + aSeed * 31.0) * (0.4 + aSeed * 0.6);
                    p.y += cos(uTime * (0.10 + aSeed * 0.18) + aSeed * 17.0) * (0.4 + aSeed * 0.6);

                    // Forward warp travel
                    float z = p.z + uTravel + uTime * 0.35;
                    z = mod(z + uDepth, uDepth + 6.0) - uDepth;
                    p.z = z;

                    // Mouse parallax displacement
                    float near = clamp((z + uDepth) / (uDepth + 6.0), 0.0, 1.0);
                    p.xy += uMouse * near * near * 1.8;

                    vec4 mv = modelViewMatrix * vec4(p, 1.0);

                    // Click shockwave ripple repulsion
                    vec4 clip0 = projectionMatrix * mv;
                    vec2 ndc = clip0.xy / clip0.w;
                    for (int i = 0; i < 4; i++) {
                        float age = uClock - uClick[i].z;
                        if (age > 0.0 && age < 3.5) {
                            vec2 d = ndc - uClick[i].xy;
                            d.x *= uAspect;
                            float dist = length(d);
                            float reach = 0.18 + age * 0.55;
                            float fall = exp(-dist * dist / (reach * reach * 0.35));
                            float env = age * exp(-age * 2.2) * 6.0;
                            vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0, 1.0);
                            dir.x /= uAspect;
                            mv.xy += dir * fall * env * 0.25 * -mv.z;
                        }
                    }

                    gl_Position = projectionMatrix * mv;
                    float pulse = 0.75 + 0.25 * sin(uTime * (0.8 + aSeed) + aSeed * 50.0);
                    gl_PointSize = aSize * uPixelRatio * (1.0 + uSpeed * 0.5) * (60.0 / -mv.z) * (0.8 + near * near * 1.8);

                    float fadeFar = smoothstep(-uDepth, -uDepth + 14.0, z);
                    float fadeNear = 1.0 - smoothstep(2.0, 5.5, z);
                    vAlpha = fadeFar * fadeNear * pulse * (0.35 + aSeed * 0.65) * (0.55 + near * 0.75);
                    vSeed = aSeed;
                    vSize = aSize;
                }
            `;

            const fragmentShader = `
                varying float vAlpha;
                varying float vSeed;
                varying float vSize;

                void main() {
                    vec2 c = gl_PointCoord - 0.5;
                    float d = length(c);
                    float core = exp(-d * d * 60.0);
                    float halo = exp(-d * d * 7.0) * (0.35 + vSize * 0.04);
                    float a = (core + halo) * vAlpha;
                    if (a < 0.003) discard;
                    
                    // Cyan-blue celestial stars matching portfolio accent
                    vec3 col = mix(vec3(0.08, 0.45, 0.85), vec3(0.22, 0.74, 0.97), core * (0.4 + vSeed * 0.6));
                    gl_FragColor = vec4(col * a, a);
                }
            `;

            const shaderMaterial = new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uTime: { value: 0 },
                    uTravel: { value: 0 },
                    uDepth: { value: 70 },
                    uMouse: { value: new THREE.Vector2(0, 0) },
                    uSpeed: { value: 0 },
                    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                    uClock: { value: 0 },
                    uAspect: { value: window.innerWidth / window.innerHeight },
                    uClick: { value: [0, 1, 2, 3].map(() => new THREE.Vector3(0, 0, -99)) }
                }
            });

            const points = new THREE.Points(geometry, shaderMaterial);
            points.frustumCulled = false;
            scene.add(points);

            const handleResize = () => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                shaderMaterial.uniforms.uAspect.value = w / h;
            };
            window.addEventListener('resize', handleResize);

            const mouse = { x: 0, y: 0 };
            window.addEventListener('pointermove', (e) => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
            }, { passive: true });

            let clickIndex = 0;
            triggerStarfieldPulse = (clientX, clientY) => {
                const nx = (clientX / window.innerWidth) * 2 - 1;
                const ny = -((clientY / window.innerHeight) * 2 - 1);
                shaderMaterial.uniforms.uClick.value[clickIndex++ % 4].set(
                    nx,
                    ny,
                    (performance.now() - animStart) / 1000
                );
            };

            let smoothTravel = 0;
            let targetTravel = 0;
            let prevScrollY = window.scrollY;
            let currentSpeed = 0;
            const animStart = performance.now();
            let lastTime = animStart;

            const renderLoop = (now) => {
                requestAnimationFrame(renderLoop);
                const dt = Math.min((now - lastTime) / 1000, 0.05);
                lastTime = now;

                const curY = window.scrollY;
                const deltaScroll = curY - prevScrollY;
                prevScrollY = curY;
                targetTravel += deltaScroll * 0.02;

                const prevTravel = smoothTravel;
                smoothTravel += (targetTravel - smoothTravel) * (1 - Math.exp(-6 * dt));

                const instSpeed = Math.min(Math.abs(smoothTravel - prevTravel) / Math.max(dt, 0.001) / 25, 1);
                currentSpeed += (instSpeed - currentSpeed) * (1 - Math.exp(-8 * dt));

                const u = shaderMaterial.uniforms;
                u.uTime.value = (now - animStart) / 1000;
                u.uTravel.value = smoothTravel;
                u.uSpeed.value = currentSpeed;
                u.uClock.value = (now - animStart) / 1000;
                u.uMouse.value.x += (mouse.x - u.uMouse.value.x) * (1 - Math.exp(-3 * dt));
                u.uMouse.value.y += (mouse.y - u.uMouse.value.y) * (1 - Math.exp(-3 * dt));

                renderer.render(scene, camera);
            };

            requestAnimationFrame(renderLoop);
        } catch (err) {
            console.warn('WebGL Starfield initialization skipped:', err);
        }
    }

    // ========================================================
    // 0.2 Global Click Ripple Effect (.pf-ripple)
    // ========================================================
    window.addEventListener('pointerdown', (e) => {
        const target = e.target;
        if (target && target.closest('input, textarea, select')) return;

        // Trigger WebGL shockwave if starfield is active
        if (triggerStarfieldPulse) {
            triggerStarfieldPulse(e.clientX, e.clientY);
        }

        // Create DOM ripple element
        const ripple = document.createElement('span');
        ripple.className = 'pf-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        }, { once: true });
    }, { passive: true });

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
