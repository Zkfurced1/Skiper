@echo off
chcp 65001 >nul
echo.
echo ⚡ SKIPER — GitHub Setup Script
echo ================================
echo.

REM Проверяем git
git --version >nul 2>&1
if errorlevel 1 (
    echo [!] Git не установлен. Скачай с https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Инициализируем репозиторий
git init
git add .
git commit -m "🎉 Initial release: Skiper v1.0.0"

REM Добавляем remote (замени на свой токен если нужен push)
git remote add origin https://github.com/Zkfurced1/Skiper.git

echo.
echo [✓] Репозиторий готов!
echo.
echo Следующие шаги:
echo   1. Создай репозиторий на GitHub: https://github.com/new
echo      Название: Skiper
echo      Description: Chrome Extension — Auto Skip Download Wait Timers
echo      Public: ✓
echo.
echo   2. Запусти:
echo      git push -u origin main
echo.
echo   3. Создай релиз:
echo      https://github.com/Zkfurced1/Skiper/releases/new
echo      Tag: v1.0.0
echo      Title: ⚡ Skiper v1.0.0 — Initial Release
echo      Прикрепи: Skiper.zip
echo.
pause
