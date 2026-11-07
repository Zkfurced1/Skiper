<p align="center">
  <img src="docs/banner.png" alt="Skiper Banner" width="100%"/>
</p>

<p align="center">
  <a href="#ru">🇷🇺 Русский</a> &nbsp;|&nbsp;
  <a href="#en">🇬🇧 English</a> &nbsp;|&nbsp;
  <a href="#uk">🇺🇦 Українська</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white"/>
  <img src="https://img.shields.io/badge/Manifest-V3-6c63ff?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-48cfad?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-ff6b6b?style=for-the-badge"/>
</p>

---

<h2 id="ru">🇷🇺 Русский</h2>

## ⚡ Skiper — Автоматический пропуск таймеров ожидания

**Skiper** — расширение для Google Chrome, которое автоматически пропускает таймеры обратного отсчёта на файловых хостингах и других сайтах. Больше никаких «подождите 30 секунд перед скачиванием»!

### 📸 Скриншоты

<p align="center">
  <img src="docs/screenshot.png" alt="Skiper в действии" width="80%"/>
</p>

### ✨ Возможности

| Стратегия | Описание |
|-----------|----------|
| 🔗 Hidden Link | Мгновенно разблокирует скрытые ссылки на скачивание (`#dlink`) |
| 📊 Data Attrs | Обнуляет `data-counter`, `data-countdown`, `data-seconds` |
| 🔓 Locked Buttons | Разблокирует кнопки `disabled`/`display:none` |
| 🔢 Text Countdown | Принудительно сбрасывает текстовый счётчик в ноль |
| 📺 Skip Ad | Нажимает кнопки «Пропустить рекламу» / «Skip Ad» |
| 🎬 Video Ads | Перематывает рекламные видеоролики в конец |
| ⚡ JS Speedup | Ускоряет все JS-таймеры страницы в 100× |

### 🌐 Поддерживаемые сайты

- ✅ freetp.org / freeftp.org
- ✅ YouTube (пропуск рекламы)
- ✅ Любые сайты с `data-counter`, `data-countdown`
- ✅ Файловые хостинги с таймером перед скачиванием
- ✅ Сайты с заблокированными кнопками-таймерами

### 🚀 Установка

1. Скачай репозиторий: нажми **Code → Download ZIP**
2. Распакуй архив
3. Открой Chrome и перейди на `chrome://extensions/`
4. Включи **«Режим разработчика»** (правый верхний угол)
5. Нажми **«Загрузить распакованное»** и выбери папку `Skiper`

### 🎮 Использование

После установки расширение работает **автоматически** на всех сайтах. Нажми на иконку ⚡ в панели Chrome чтобы:
- Включить/выключить автоскип
- Посмотреть счётчик пропущенных таймеров
- Вручную запустить пропуск

---

<h2 id="en">🇬🇧 English</h2>

## ⚡ Skiper — Auto Skip Download Wait Timers

**Skiper** is a Google Chrome extension that automatically bypasses countdown timers on file hosting sites and other websites. No more "please wait 30 seconds before downloading"!

### ✨ Features

| Strategy | Description |
|----------|-------------|
| 🔗 Hidden Link | Instantly unlocks hidden download links (`#dlink` pattern) |
| 📊 Data Attrs | Zeroes out `data-counter`, `data-countdown`, `data-seconds` |
| 🔓 Locked Buttons | Unlocks `disabled` / `display:none` download buttons |
| 🔢 Text Countdown | Force-resets visible text countdown to zero |
| 📺 Skip Ad | Clicks "Skip Ad" / "Пропустить рекламу" buttons |
| 🎬 Video Ads | Fast-forwards short ad videos to the end |
| ⚡ JS Speedup | Accelerates all page JS timers by 100× |

### 🌐 Supported Sites

- ✅ freetp.org / freeftp.org
- ✅ YouTube (ad skipping)
- ✅ Any site using `data-counter` or `data-countdown` attributes
- ✅ File hosting sites with download wait timers
- ✅ Sites with timer-locked buttons

### 🚀 Installation

1. Download the repo: click **Code → Download ZIP**
2. Unzip the archive
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **"Developer mode"** (top right corner)
5. Click **"Load unpacked"** and select the `Skiper` folder

### 🎮 Usage

Once installed, the extension works **automatically** on all websites. Click the ⚡ icon in Chrome's toolbar to:
- Toggle auto-skip on/off
- View the skipped timer count
- Manually trigger a skip

### 🛠️ How It Works

```
Page loads
    │
    ▼
injector.js fires at document_start
  └─ Patches setInterval / setTimeout / Date.now (×100 speedup)
    │
    ▼  (30 sec timer → ~0.3 sec real time)
content.js scans the DOM
  └─ Finds hidden download link in #dlink input
  └─ Assigns href to the download button
  └─ Makes the button visible immediately
    │
    ▼
File downloads instantly ⚡
```

### 🤝 Contributing

Found a site that isn't supported? Open an [Issue](../../issues/new?template=site_request.md) with the site URL and timer mechanism details!

---

<h2 id="uk">🇺🇦 Українська</h2>

## ⚡ Skiper — Автоматичний пропуск таймерів очікування

**Skiper** — розширення для Google Chrome, яке автоматично пропускає таймери зворотного відліку на файлових хостингах та інших сайтах. Більше ніякого «зачекайте 30 секунд перед завантаженням»!

### ✨ Можливості

| Стратегія | Опис |
|-----------|------|
| 🔗 Hidden Link | Миттєво розблоковує приховані посилання на завантаження |
| 📊 Data Attrs | Обнуляє `data-counter`, `data-countdown`, `data-seconds` |
| 🔓 Locked Buttons | Розблоковує кнопки `disabled`/`display:none` |
| 🔢 Text Countdown | Примусово скидає текстовий лічильник до нуля |
| 📺 Skip Ad | Натискає кнопки «Пропустити рекламу» / «Skip Ad» |
| 🎬 Video Ads | Перемотує рекламні відеоролики до кінця |
| ⚡ JS Speedup | Прискорює всі JS-таймери сторінки у 100× |

### 🌐 Підтримувані сайти

- ✅ freetp.org / freeftp.org
- ✅ YouTube (пропуск реклами)
- ✅ Будь-які сайти з `data-counter`, `data-countdown`
- ✅ Файлові хостинги з таймером перед завантаженням
- ✅ Сайти із заблокованими кнопками-таймерами

### 🚀 Встановлення

1. Завантаж репозиторій: натисни **Code → Download ZIP**
2. Розпакуй архів
3. Відкрий Chrome і перейди на `chrome://extensions/`
4. Увімкни **«Режим розробника»** (правий верхній кут)
5. Натисни **«Завантажити нерозпаковане»** і обери папку `Skiper`

### 🎮 Використання

Після встановлення розширення працює **автоматично** на всіх сайтах. Натисни на іконку ⚡ у панелі Chrome щоб:
- Увімкнути/вимкнути автоскіп
- Переглянути лічильник пропущених таймерів
- Вручну запустити пропуск

---

<p align="center">
  Зроблено з ⚡ by <a href="https://github.com/Zkfurced1">Zkfurced1</a>
  &nbsp;•&nbsp;
  <a href="LICENSE">MIT License</a>
  &nbsp;•&nbsp;
  <a href="CHANGELOG.md">Changelog</a>
</p>
