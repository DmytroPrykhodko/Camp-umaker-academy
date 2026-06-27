# U:maker Academy Camp — Landing Page 🌍

Цей репозиторій містить вихідний код кастомної лендінгової сторінки екоінтенсиву для підлітків "Літо твого впливу" від U:maker Academy.

Проєкт розроблено на чистому HTML/CSS/JS з фокусом на преміальну естетику (Bento Grid), високу швидкодію (Lighthouse 100/100) та безболісну майбутню інтеграцію у WordPress.

---

## 🛠 Технологічний стек
*   **HTML5 / CSS3:** Семантична розмітка, CSS Variables, Flexbox/Grid.
*   **JavaScript (ES6):** Модульна логіка.
*   **Бібліотеки:**
    *   [GSAP](https://gsap.com/) & ScrollTrigger — для плавних скрол-анімацій.
    *   [Swiper.js](https://swiperjs.com/) — для каруселі фотографій та відгуків.
*   **Шрифти:** Google Fonts (Manrope).

## ✨ Ключові особливості (Що реалізовано)
1. **Ізоляція стилів (CSS Scoping):** Увесь код загорнуто в батьківський клас `.umaker-camp-wrapper`. Це гарантує, що при перенесенні коду на WordPress наші стилі не "поламають" тему сайту, а тема не вплине на наш лендінг.
2. **Forced Dark Mode Protection:** Телефони Xiaomi, Samsung та інші браузери з "примусовим темним режимом" часто спотворюють кольори. Ми впровадили захист:
    * Логотипи використовують `mix-blend-mode: difference`, щоб бути контрастними на будь-якому фоні.
    * Кольорові акценти (дати, статуси) використовують градієнтні хаки (`background-clip: text`), які ігноруються агресивними темними темами.
3. **Lighthouse & Мобільна оптимізація:** 
    * Головне зображення (LCP) завантажується пріоритетно через `<link rel="preload">`.
    * Важкі скрипти (GSAP, Swiper) мають атрибут `defer`, щоб не блокувати рендер сторінки на слабких мобільних пристроях.

---

## 📂 Структура проєкту

```text
landing-page/
├── index.html        # Основна розмітка сторінки
├── css/
│   └── styles.css    # Всі стилі лендінгу (понад 2000 рядків, ізольовані)
├── js/
│   └── script.js     # Ініціалізація слайдерів, GSAP анімацій, обробка форми
├── images/           # Оптимізовані WebP зображення
└── README.md         # Документація (цей файл)
```

---

## ⚙️ Інструкція для WordPress-розробника (Як інтегрувати)

Лендінг повністю готовий до перенесення. Дотримуйтесь цих кроків для чистої інтеграції:

### 1. Перенесення HTML
Відкрийте файл `index.html`. 
Вам потрібно скопіювати **УСЕ**, що знаходиться між коментарями:
`<!-- START UMAKER CAMP WRAPPER -->` 
та 
`<!-- END UMAKER CAMP WRAPPER -->`

> **ВАЖЛИВО:** Ніколи не видаляйте головний `div class="umaker-camp-wrapper"`. Без нього вся ізоляція стилів зламається.

Вставте цей HTML-код у ваш шаблон сторінки WordPress (через Custom HTML блок в Gutenberg, Elementor, або створивши кастомний файл шаблону `page-eco-camp.php`).

### 2. Підключення стилів та скриптів
Найкращий спосіб — підключити ассети виключно для цієї сторінки у файлі `functions.php` вашої активної теми.

```php
function enqueue_umaker_camp_assets() {
    // Змініть 'eco-camp' на slug вашої сторінки
    if ( is_page('eco-camp') ) { 
        
        // 1. Swiper CSS
        wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
        // 2. Наш головний CSS
        wp_enqueue_style('umaker-camp-css', get_template_directory_uri() . '/assets/camp/css/styles.css', array(), '1.1');
        
        // 3. GSAP Core & ScrollTrigger (у футері)
        wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', array(), null, true);
        wp_enqueue_script('gsap-st', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', array('gsap'), null, true);
        
        // 4. Swiper JS
        wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), null, true);
        
        // 5. Наш головний JS файл (залежить від GSAP та Swiper)
        wp_enqueue_script('umaker-camp-js', get_template_directory_uri() . '/assets/camp/js/script.js', array('gsap', 'gsap-st', 'swiper-js'), '1.1', true);
    }
}
add_action( 'wp_enqueue_scripts', 'enqueue_umaker_camp_assets' );
```

Також не забудьте переконатись, що шрифт **Manrope** підключається на вашому WordPress сайті (або додайте тег `<link>` з Google Fonts у `header.php`).

### 3. Шляхи до зображень (Media Paths)
В `index.html` усі шляхи до зображень відносні (наприклад: `src="images/logo.U-white.png"`).
У WordPress вам доведеться їх оновити. Якщо ви закинете зображення в Media Library, скопіюйте їхні абсолютні URL. 
Якщо ви заливаєте папку `images` безпосередньо у файли теми, використовуйте шлях типу:
`src="<?php echo get_template_directory_uri(); ?>/assets/camp/images/logo.U-white.png"`

---

## ✉️ Інтеграція Google Форм (Форма реєстрації)

Наразі попап-форма (HTML ID `#campRegistrationForm`) обробляється у файлі `script.js` за допомогою фейкової затримки `setTimeout()`.

Оскільки відправка відбувається без перезавантаження сторінки (AJAX), вам **не обов'язково** ставити плагіни на кшталт Contact Form 7. Ви можете безпосередньо надсилати дані в Google Forms:

1. Створіть Google Форму з полями (ПІБ, E-mail, Телефон, Коментар, Напрям).
2. Дізнайтесь `action` URL форми (щось на кшталт `https://docs.google.com/forms/d/e/.../formResponse`).
3. Знайдіть унікальні ідентифікатори `entry.XXXXXX` для кожного поля.
4. Оновіть `script.js`, замінивши блок `setTimeout` на наступний код:

```javascript
const GOOGLE_FORM_URL = 'ВАШ_FORM_RESPONSE_URL';
const formData = new FormData();

formData.append('entry.123456', form.querySelector('#campName').value);
formData.append('entry.234567', form.querySelector('#campEmail').value);
formData.append('entry.345678', form.querySelector('#campPhone').value);
formData.append('entry.456789', form.querySelector('#campComments').value);

// Для чекбоксів (Обери напрям)
const selectedCourses = form.querySelectorAll('input[name="course[]"]:checked');
selectedCourses.forEach(cb => {
    formData.append('entry.567890', cb.value); // Один і той же entry ID
});

fetch(GOOGLE_FORM_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
}).then(() => {
    alert('✓ Дякуємо! Заявку отримано.');
    closeModal();
    form.reset();
}).catch(err => console.error(err));
```

---
*Документацію згенеровано в рамках підготовки до релізу. Успішного запуску! 🚀*
