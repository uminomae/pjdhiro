// app.js

import { loadPartials } from './js/qt-st-load-partials.js';
import { startMain }      from './js/qt-st-main.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[app] DOMContentLoaded');
  const params = new URLSearchParams(location.search);
  const alg = params.get('alg') || 'qt-st';
  console.log('[app] alg=', alg);
  try {
    // 1) ナビ・Offcanvas を読み込む
    await loadPartials(alg);
    console.log('[app] loadPartials() が完了');

    // 2) loadPartials 完了後に main の初期化を呼ぶ
    console.log('[test] モジュール切り替え:', alg);
    startMain(alg);
    console.log('[app] startMain() を呼び出し完了');
  } catch (err) {
    console.error('[app] loadPartials か startMain でエラー', err);
  }
});

// test:
// http://localhost:8000/qt-st-visual/?alg=qt-st
// http://localhost:8000/qt-st-visual/?alg=julia-inverse
