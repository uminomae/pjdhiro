// ファイル: js/d3-load-partials.js
// import { initLegendToggle } from './ui/legend-ui.js'; // 追加
/**
 * includeHTML: selector で指定した要素に対し、url の HTML を fetch → innerHTML で挿入するヘルパー
 */
async function includeHTML(selector, url) {
	const container = document.querySelector(selector);
	if (!container) {
	  console.warn(`includeHTML: "${selector}" が見つかりません`);
	  return;
	}
	try {
	  const resp = await fetch(url);
	  if (!resp.ok) throw new Error(`${url} の読み込み失敗: ${resp.status}`);
	  const html = await resp.text();
	  container.innerHTML = html;
	} catch (err) {
	  console.error(`includeHTML Error (${url}):`, err);
	  container.innerHTML = `<!-- ${url} の読み込みエラー -->`;
	}
  }
  
  document.addEventListener('DOMContentLoaded', () => {
	console.log('▶ DOMContentLoaded: load-partials 開始'); // ← 追加

	// 1) まずはナビバーを読み込む
	includeHTML('#navbar-placeholder', '3d-partials/d3-navbar.html')
	  .then(() => {
		console.log('▶ ナビバー挿入完了'); // ← 追加
		// 2) ナビバー挿入後に Offcanvas を読み込む
		return includeHTML('#offcanvas-placeholder', '3d-partials/d3-offcanvas.html');
	  })
	  .then(() => {
		console.log('▶ Offcanvas 挿入完了 (DOM に offcanvasForm があるか確認します)'); // ← 追加
		// ─── Offcanvas の HTML が DOM に挿入された直後 ───
      // (ここで <input id="chk-legend"> が存在するはず)
      // ここで実際に #offcanvasForm 要素が存在するかをチェック
      const oc = document.getElementById('offcanvasForm');
      console.log('   >>> document.getElementById("offcanvasForm") =', oc);

      // initLegendToggle();
      // console.log('▶ initLegendToggle() を呼び出しました'); // ← 追加
      // 3) Offcanvas 読み込み後に d3-init-app.js を動的に追加
      const script = document.createElement('script');
      script.type = 'module';
      script.src  = 'js/3d/d3-init-app.js';
      document.body.appendChild(script);
      console.log('✅ d3-init-app.js を動的に読み込みました');
	  })
	  .catch(err => {
		console.error('partials 読み込み中にエラー:', err);
	  });
  });
  