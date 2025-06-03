// js/d3-load-partials.js

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
	includeHTML('#offcanvas-placeholder', '3d-partials/d3-offcanvas.html')
	// includeHTML('#navbar-placeholder', '3d-partials/navbar.html')
	//   .then(() => {
	// 	// 2) Offcanvas 読み込み
	// 	return includeHTML('#offcanvas-placeholder', '3d-partials/offcanvas.html');
	//   })
	  .then(() => {
		// 3) offcanvas.html を挿入し終えたタイミングで d3-init-app.js を動的に読み込む
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
  