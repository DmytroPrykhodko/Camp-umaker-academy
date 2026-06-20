# U: maker Academy Camp Landing Page

## Огляд Проєкту
Це кастомна лендінгова сторінка для екоінтенсиву Академії U: maker.
Сторінка розроблена спеціально для інтеграції в існуючий сайт на WordPress.
Вона дотримується візуального стилю бренду U: maker (використані корпоративні кольори, сучасна типографіка та скруглення).

Всі стилі та скрипти ізольовані, щоб не порушити роботу основного сайту.

## Структура Файлів
```text
landing-page/
├── index.html        # Основна HTML розмітка сторінки
├── css/
│   └── styles.css    # Ізольовані CSS стилі (.umaker-camp-wrapper)
├── js/
│   └── script.js     # Скрипти для анімацій, FAQ та Popup
├── images/           # Зображення (webp)
└── README.md         # Цей файл
```

## Інструкція з Інтеграції для WordPress Розробника

Ця сторінка розроблена так, щоб її можна було легко вбудувати в існуючу сторінку WordPress без конфліктів.

### 1. Підключення Стилів та Скриптів
Додайте посилання на `styles.css` та `script.js` на сторінці, де буде розміщено лендінг. 
Ви можете скористатися функцією `wp_enqueue_style` та `wp_enqueue_script` в `functions.php` для конкретної сторінки, або підключити їх через блок Custom HTML.

```php
// Приклад для functions.php (опціонально)
function umaker_camp_assets() {
    if ( is_page('camp-2024') ) { // замініть на slug вашої сторінки
        wp_enqueue_style( 'umaker-camp-css', get_template_directory_uri() . '/path-to/css/styles.css' );
        wp_enqueue_script( 'umaker-camp-js', get_template_directory_uri() . '/path-to/js/script.js', array(), false, true );
    }
}
add_action( 'wp_enqueue_scripts', 'umaker_camp_assets' );
```

### 2. Вставка HTML-коду
Скопіюйте ВЕСЬ вміст файлу `index.html` **починаючи від коментаря** `<!-- START UMAKER CAMP WRAPPER -->` **і до коментаря** `<!-- END UMAKER CAMP WRAPPER -->`.
Вставте цей код у редакторі WordPress (використовуйте блок "Custom HTML" у Gutenberg або текстовий редактор Classic Editor).

**ВАЖЛИВО**: 
- Не видаляйте батьківський div `<div class="umaker-camp-wrapper">`. Він забезпечує ізоляцію всіх CSS стилів, щоб не порушити глобальні стилі теми.
- Шрифти: В CSS встановлена змінна `--camp-font: 'Mont', sans-serif;`. Оскільки на сайті вже підключено шрифт Mont, він має підхопитися автоматично. У демо використовується fallback на Montserrat.

### 3. Оновлення Шляхів до Зображень
Після завантаження зображень з папки `images/` у медіабібліотеку WordPress, **обов'язково** оновіть шляхи `src` у розмітці (наприклад, замініть `images/logo-umaker.webp` на реальний URL з WordPress).

### 4. Інтеграція Форми (Google Sheets)
В кінці сторінки є попап-форма (`#campRegistrationForm`). 
Зараз відправка форми симулюється за допомогою JavaScript (див. `script.js`). 
Щоб дані дійсно відправлялися у Google Таблицю:
1. Створіть Google Apps Script (Web App), який приймає POST запити і записує їх у таблицю.
2. У `script.js` знайдіть закоментований блок `fetch('YOUR_GOOGLE_SCRIPT_URL', ...)` та замініть URL на свій Web App URL. Розкоментуйте його.

## Продуктивність та SEO
- Всі зображення оптимізовані (WebP).
- Використовується `loading="lazy"` для зображень (окрім першого екрану).
- Додані семантичні теги (`section`, `h1`-`h4`).
- Анімації використовують `IntersectionObserver` для оптимізації рендерингу (не навантажують скрол).
