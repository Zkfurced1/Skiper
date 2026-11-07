# Changelog

## [1.1.1] - 2026-11-07 — Bug Fix Release

### Fixed
- CSP ошибки: injector.js теперь работает через world: MAIN без <script> тегов
- WeakSet processedEls: элементы обрабатываются один раз, нет бесконечного loop
- Убран лишний skippedCount++ в unlockHiddenButtons
- Исправлен парсинг времени "M:SS" в forceZeroCountdownText (было 130 вместо 90 сек)
- chrome.runtime.onMessage: return false для синхронных ответов
- Все querySelector обёрнуты в try/catch
- popup.js: добавлена проверка chrome.runtime.lastError везде
- popup.js: clearInterval при закрытии попапа (нет утечки памяти)
- popup.js: переписан с async/await на callback (MV3 совместимость)
- manifest.json: добавлено разрешение "tabs"

## [1.0.0] - 2026-11-07 — Initial Release

### Added
- 6 универсальных стратегий пропуска таймеров
- Поддержка freetp.org и аналогов (#dlink pattern)
- injector.js: ускорение setInterval/setTimeout/Date.now в 100x (world: MAIN)
- Красивый тёмный попап с переключателем и счётчиком
- MutationObserver для динамических страниц
- README на 3 языках (RU/EN/UK)
