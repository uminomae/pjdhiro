// ファイル: js/2d/d2-main.js (修正版)
import { initApp } from './d2-init-app.js';

/** 
 * DOM がすでに完全に読み込まれている (interactive or complete) なら即座に initApp()
 * そうでなければ DOMContentLoaded を待つ
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}
