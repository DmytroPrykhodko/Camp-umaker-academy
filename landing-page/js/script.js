document.addEventListener('DOMContentLoaded', () => {
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
            });
        });

        closeBtn.addEventListener('click', () => {
            popupOverlay.classList.remove('active');
        });

        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
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
                    popupOverlay.classList.remove('active');
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1200);
            });
        }
    }
});
