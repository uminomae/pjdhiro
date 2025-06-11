// ─────────────────────────────────────────────────────────────
// ファイルパス: js/yinyang-load-partials.js
// ─────────────────────────────────────────────────────────────

import { PARTIALS_PATHS } from './yinyang-config.js';

/**
 * includeHTML(selector, url)
 *  ────────────────────────────────────────────────────────────
 *  fetch で指定 URL の HTML を取得し、指定したセレクタの要素に挿入する。
 *
 *  @param {string} selector  DOM セレクタ (例: '#navbar-placeholder')
 *  @param {string} url       読み込む HTML ファイルの相対パス
 *  @returns {Promise<void>}
 */
export function includeHTML(selector, url) {
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`${url} の読み込みに失敗`);
      return res.text();
    })
    .then((html) => {
      const el = document.querySelector(selector);
      if (!el) throw new Error(`${selector} が見つかりません`);
      el.innerHTML = html;
    });
}

/**
 * loadPartials(alg)
 *  ────────────────────────────────────────────────────────────
 *  アルゴリズムキー (alg) に応じて PARTIALS_PATHS を参照し、
 *  placeholder 要素に HTML を読み込んで挿入する。
 *
 *  @param {string} alg  アルゴリズムキー ('qt-st' など)
 *  @returns {Promise<void>}
 */
export async function loadPartials(alg) {
  console.log(`[load-partials] alg="${alg}"`);

  // PARTIALS_PATHS に定義された URL をすべて順番に読み込む
  try {
    const navbarUrl  = PARTIALS_PATHS.navbar[alg] || PARTIALS_PATHS.navbar['qt-st'];
    const offcanvasUrl = PARTIALS_PATHS.offcanvas[alg] || PARTIALS_PATHS.offcanvas['qt-st'];
    const mainUrl    = PARTIALS_PATHS.main[alg] || PARTIALS_PATHS.main['qt-st'];
    const canvasUrl  = PARTIALS_PATHS.canvasContainer[alg] || PARTIALS_PATHS.canvasContainer['qt-st'];

    console.log('[load-partials] Navbar を挿入:', navbarUrl);
    await includeHTML('#navbar-placeholder', navbarUrl);
    console.log('[load-partials] Navbar 挿入完了');

    console.log('[load-partials] Offcanvas を挿入:', offcanvasUrl);
    await includeHTML('#offcanvas-placeholder', offcanvasUrl);
    console.log('[load-partials] Offcanvas 挿入完了');

    console.log('[load-partials] main.html を挿入:', mainUrl);
    await includeHTML('#main-content-placeholder', mainUrl);
    console.log('[load-partials] main.html 挿入完了');

    console.log('[load-partials] canvas-container.html を挿入:', canvasUrl);
    await includeHTML('#canvas-area-placeholder', canvasUrl);
    console.log('[load-partials] canvas-container.html 挿入完了');
  }
  catch (err) {
    console.error('[load-partials] HTML 挿入中にエラー発生:', err);
    throw err;
  }
}
