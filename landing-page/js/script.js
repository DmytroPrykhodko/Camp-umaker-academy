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
        gsap.from('.uec-bento-card', {
            opacity: 0,
            y: 50,
            scale: 0.96,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
            clearProps: 'transform,opacity'
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
                tl.from(title, {
                    opacity: 0,
                    y: 35,
                    duration: 0.7,
                    ease: 'power3.out'
                });
            }

            if (desc) {
                tl.from(desc, {
                    opacity: 0,
                    y: 20,
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
                    tl.from(items, {
                        opacity: 0,
                        y: 30,
                        scale: 0.98,
                        duration: 0.7,
                        stagger: 0.08,
                        ease: 'power3.out',
                        clearProps: 'transform,opacity'
                    }, '-=0.4');
                }
            });
        });

        // 4. Smooth reveal for dates cards inside wide-dates block
        if (document.querySelector('.uec-date-item')) {
            gsap.from('.uec-date-item', {
                opacity: 0,
                x: -20,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.uec-bento-card--wide-dates',
                    start: 'top 85%'
                }
            });
        }
    }
});
