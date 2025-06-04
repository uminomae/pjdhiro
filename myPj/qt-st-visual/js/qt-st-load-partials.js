// js/qt-load-partials.js

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

export async function loadPartials(alg) {
  console.log(`[load-partials] alg="${alg}"`);

  // Navbar を if で切り替え
  let navbarUrl;
  if (alg === 'julia-inverse') {
    navbarUrl = './partials/d3-julia-navbar.html';
  } else {
    navbarUrl = './partials/qt-navbar.html';
  }
  console.log('[load-partials] Navbar を挿入:', navbarUrl);
  await includeHTML('#navbar-placeholder', navbarUrl);
  console.log('[load-partials] Navbar 挿入完了');

  // Offcanvas を if で切り替え
  let offcanvasUrl;
  if (alg === 'julia-inverse') {
    offcanvasUrl = './partials/d3-julia-offcanvas.html';
  } else {
    offcanvasUrl = './partials/qt-offcanvas.html';
  }
  console.log('[load-partials] Offcanvas を挿入:', offcanvasUrl);
  await includeHTML('#offcanvas-placeholder', offcanvasUrl);
  console.log('[load-partials] Offcanvas 挿入完了');

  let mainUrl;
  if (alg === 'julia-inverse') {
    mainUrl = './partials/d3-julia-main.html';
  } else {
    mainUrl = './partials/qt-main.html';
  }
  console.log('[load-partials] main.html を挿入:', mainUrl);
  await includeHTML('#main-content-placeholder', mainUrl);
  console.log('[load-partials] main.html 挿入完了');

  let canvasContainer;
  if (alg === 'julia-inverse') {
    canvasContainer = './partials/d3-julia-canvas-container.html';
  } else {
    canvasContainer = './partials/qt-canvas-container.html';
  }
  console.log('[load-partials] canvas-container.html を挿入:', canvasContainer);
  await includeHTML('#canvas-area-placeholder', canvasContainer);
  console.log('[load-partials] canvas-container.html 挿入完了');
}
