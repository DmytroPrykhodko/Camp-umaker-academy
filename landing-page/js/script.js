document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis smooth scroll
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Sync ScrollTrigger with Lenis
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    // Popup Logic
    const popupOverlay = document.getElementById('campRegistrationPopup');
    const openBtns = document.querySelectorAll('[data-open-popup]');
    const closeBtn = document.querySelector('.camp-popup-close');
    const form = document.getElementById('campRegistrationForm');

    if (popupOverlay) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Set challenge selector value if provided in the button attribute
                const course = btn.getAttribute('data-course');
                if (course && document.getElementById('campCourse')) {
                    document.getElementById('campCourse').value = course;
                }
                popupOverlay.classList.add('active');
                if (lenis) lenis.stop(); // Stop scroll when modal is active
            });
        });

        const closeModal = () => {
            popupOverlay.classList.remove('active');
            if (lenis) lenis.start(); // Resume scroll
        };

        closeBtn.addEventListener('click', closeModal);

        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                closeModal();
            }
        });

        // Form submission Simulation
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = 'Відправка...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('✓ Дякуємо! Заявку отримано — ми зв\'яжемося з вами найближчим часом.');
                    closeModal();
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1200);
            });
        }
    }

    // --- Premium Scroll Animations with GSAP ---
    if (typeof gsap !== 'undefined') {
        // 1. Initial Hero Bento Grid Animation (staggered bounce-up)
        gsap.fromTo('.uec-bento-card', {
            autoAlpha: 0,
            y: 50,
            scale: 0.96
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
            clearProps: 'transform'
        });

        // 2. Parallax effect for the Bento image
        if (document.querySelector('.uec-bento-img')) {
            gsap.fromTo('.uec-bento-img', 
                { yPercent: -8 },
                {
                    yPercent: 8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.uec-bento-card--photo',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }

        // 3. Staggered reveal for section contents as they enter viewport
        document.querySelectorAll('.uec-section').forEach(section => {
            const title = section.querySelector('.uec-section-title');
            const desc = section.querySelector('.uec-section-desc');
            const grids = section.querySelectorAll('.uec-grid-three, .uec-grid-four, .uec-mentors-grid, .uec-challenges-stack, .uec-participant-steps, .uec-conditions-box, .uec-faq-categories');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            });

            if (title) {
                tl.fromTo(title, {
                    autoAlpha: 0,
                    y: 35
                }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                });
            }

            if (desc) {
                tl.fromTo(desc, {
                    autoAlpha: 0,
                    y: 20
                }, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                }, '-=0.5');
            }

            grids.forEach(grid => {
                const items = Array.from(grid.children).filter(child => {
                    // Avoid animating hidden elements or structural helper tags
                    return window.getComputedStyle(child).display !== 'none';
                });

                if (items.length > 0) {
                    tl.fromTo(items, {
                        autoAlpha: 0,
                        y: 30,
                        scale: 0.98
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.08,
                        ease: 'power3.out',
                        clearProps: 'transform'
                    }, '-=0.4');
                }
            });
        });

        // 4. Smooth reveal for dates cards inside wide-dates block
        if (document.querySelector('.uec-date-card')) {
            gsap.fromTo('.uec-date-card', {
                autoAlpha: 0,
                y: 20
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.uec-bento-card--wide-dates',
                    start: 'top 85%'
                }
            });
        }

        // 5. Stat Counter Count-up Animation
        if (document.querySelector('.uec-stat-number')) {
            document.querySelectorAll('.uec-stat-number').forEach(counter => {
                const targetVal = parseInt(counter.getAttribute('data-target'), 10);
                gsap.fromTo(counter, 
                    { textContent: 0 },
                    {
                        textContent: targetVal,
                        duration: 1.8,
                        ease: 'power2.out',
                        snap: { textContent: 1 },
                        scrollTrigger: {
                            trigger: '.uec-stats-grid',
                            start: 'top 90%'
                        },
                        onComplete: () => {
                            gsap.to(counter.closest('.uec-stat-val'), {
                                scale: 1.08,
                                duration: 1.2,
                                repeat: -1,
                                yoyo: true,
                                ease: 'sine.inOut'
                            });
                        }
                    }
                );
            });
        }

        // Floating CTA Button Logic
        const floatingBtn = document.getElementById('floatingBtn');
        if (floatingBtn && document.querySelector('.uec-section--history') && document.querySelector('.uec-conditions-box')) {
            ScrollTrigger.create({
                trigger: '.uec-section--history',
                start: 'top center',
                endTrigger: '.uec-conditions-box',
                end: 'top center',
                onEnter: () => floatingBtn.classList.add('show'),
                onLeave: () => floatingBtn.classList.remove('show'),
                onEnterBack: () => floatingBtn.classList.add('show'),
                onLeaveBack: () => floatingBtn.classList.remove('show')
            });
        }

        // 6. Mentor Bio Modal Logic
        const bioPopupOverlay = document.getElementById('bioPopupOverlay');
        const closeBioBtn = document.getElementById('closeBioBtn');

        if (bioPopupOverlay) {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('uec-read-more-btn')) {
                    const card = e.target.closest('.uec-mentor-card');
                    if (card) {
                        const img = card.querySelector('img').src;
                        const name = card.querySelector('.uec-mentor-name').innerHTML;
                        const role = card.querySelector('.uec-mentor-role').innerHTML;
                        const bioText = card.querySelector('.uec-mentor-text-content').innerHTML;

                        document.getElementById('bio-modal-img').src = img;
                        document.getElementById('bio-modal-name').innerHTML = name;
                        document.getElementById('bio-modal-role').innerHTML = role;
                        document.getElementById('bio-modal-text').innerHTML = bioText;

                        bioPopupOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            });

            if (closeBioBtn) {
                closeBioBtn.addEventListener('click', () => {
                    bioPopupOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            bioPopupOverlay.addEventListener('click', (e) => {
                if (e.target === bioPopupOverlay) {
                    bioPopupOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // 7. Initialize Mentors Swiper
        if (typeof Swiper !== 'undefined' && document.querySelector('.uec-mentors-swiper')) {
            new Swiper('.uec-mentors-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    992: { slidesPerView: 3, spaceBetween: 30 },
                    1200: { slidesPerView: 4, spaceBetween: 30 }
                }
            });
        }
    }
});

// Tab Switching Logic for Challenges Section
window.switchUecTab = function(evt, tabId) {
    const tabsContainer = evt.currentTarget.closest('.uec-tabs-wrapper');
    const tabPanes = tabsContainer.querySelectorAll('.uec-tab-content');
    const tabBtns = tabsContainer.querySelectorAll('.uec-tabs-nav .uec-tab-btn');

    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });

    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    tabsContainer.querySelector('#' + tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
};
