// app.js
import { loadPartials } from './js/yinyang-load-partials.js';
import { startMain }      from './js/yinyang-main.js';

document.addEventListener('DOMContentLoaded', async () => 
{
  console.log('[app] DOMContentLoaded');
  const params = new URLSearchParams(location.search);
  const alg = params.get('alg') || 'qt-st';
  console.log('[app] alg=', alg);
  try 
  {
    // ナビ・Offcanvas を読み込む
    await loadPartials(alg);
    console.log('[app] loadPartials() が完了');
    // #canvas-container と Offcanvas の <form> が挿入されるまで待つ
    const waitForContainer = () => {
      const container = document.getElementById('canvas-container');
      const offcanvasForm = document.querySelector('#offcanvasForm form');
      if (container && offcanvasForm) {
        startMain(alg);
        console.log('[app] startMain() を呼び出し完了: alg=', alg);
      } else {
        // 50ms 待ってからもう一度チェック
        setTimeout(waitForContainer, 50);
      }
    };
    waitForContainer();
    console.log('[app] waitForContainer() を呼び出し完了');
  } catch (err) {
    console.error('[app] loadPartials か startMain でエラー', err);
  }
});

// test:
// python3 -m http.server 8000
// http://localhost:8000/myPj/qt-st-visual/?alg=qt-st
// http://localhost:8000/myPj/qt-st-visual/?alg=julia-inverse