/**
 * Skiper — popup.js v2.1
 *
 * ИСПРАВЛЕНО:
 *  - popup.js запускается в контексте расширения, поэтому
 *    chrome.tabs.query требует разрешения "tabs" (добавлено в manifest)
 *  - loadStatus: если tab не найден — не падаем, просто показываем прочерк
 *  - setInterval для loadStatus: очищается при закрытии попапа (window.unload)
 *  - manualBtn click: проверяем что tab существует перед sendMessage
 *  - Убран дублирующий вызов setStatus в toggleEl listener
 *    (состояние обновится через следующий loadStatus)
 */

(function () {
  'use strict';

  var toggleEl    = document.getElementById('toggleEnabled');
  var skipCountEl = document.getElementById('skipCount');
  var manualBtn   = document.getElementById('manualSkip');
  var statusPill  = document.getElementById('statusPill');
  var statusText  = document.getElementById('statusText');
  var lastSkipEl  = document.getElementById('lastSkip');

  var pollTimer   = null;

  // ── Получить активную вкладку ─────────────────────────────────────────────
  function getTab(cb) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      cb(tabs && tabs[0] ? tabs[0] : null);
    });
  }

  // ── Обновить UI статуса ───────────────────────────────────────────────────
  function setStatus(enabled) {
    statusPill.className   = 'status-pill ' + (enabled ? 'on' : 'off');
    statusText.textContent = enabled ? 'Активен' : 'Выключен';
    toggleEl.checked       = enabled;
    manualBtn.disabled     = !enabled;
  }

  // ── Загрузить статус из content.js ───────────────────────────────────────
  function loadStatus() {
    getTab(function (tab) {
      if (!tab) {
        skipCountEl.textContent = '—';
        return;
      }
      chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' }, function (res) {
        // chrome.runtime.lastError — подавляем ошибку "no receiver"
        if (chrome.runtime.lastError || !res) {
          skipCountEl.textContent = '—';
          return;
        }
        setStatus(res.enabled);
        skipCountEl.textContent = typeof res.skipped === 'number' ? res.skipped : '0';
      });
    });
  }

  // ── Toggle ────────────────────────────────────────────────────────────────
  toggleEl.addEventListener('change', function () {
    var val = toggleEl.checked;
    setStatus(val);
    getTab(function (tab) {
      if (!tab) return;
      chrome.tabs.sendMessage(tab.id, { type: 'SET_ENABLED', value: val }, function () {
        if (chrome.runtime.lastError) { /* ignore */ }
      });
    });
  });

  // ── Ручной скип ───────────────────────────────────────────────────────────
  manualBtn.addEventListener('click', function (e) {
    // Ripple эффект
    var r    = document.createElement('span');
    r.className = 'ripple';
    var rect = manualBtn.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left - 5) + 'px';
    r.style.top  = (e.clientY - rect.top  - 5) + 'px';
    manualBtn.appendChild(r);
    setTimeout(function () { r.remove(); }, 600);

    getTab(function (tab) {
      if (!tab) return;
      chrome.tabs.sendMessage(tab.id, { type: 'MANUAL_SKIP' }, function (res) {
        if (chrome.runtime.lastError || !res) return;
        skipCountEl.textContent = typeof res.skipped === 'number' ? res.skipped : skipCountEl.textContent;
        lastSkipEl.textContent  = 'Последний: ' + new Date().toLocaleTimeString('ru', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
      });
    });
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  loadStatus();
  pollTimer = setInterval(loadStatus, 1500);

  // Очищаем интервал при закрытии попапа
  window.addEventListener('unload', function () {
    clearInterval(pollTimer);
  });

})();
