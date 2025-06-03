// ファイル: js/load-partials.js

// 1. HTML フラグメントを指定した selector の要素に挿入する関数
async function includeHTML(selector, url) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(`includeHTML: "${selector}" が見つかりません`);
    return;
  }
  try {
    console.log(`★ includeHTML: "${url}" を fetch 開始`);
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`${url} の読み込みに失敗: ${resp.status}`);
    }
    const html = await resp.text();
    console.log(`★ includeHTML: "${url}" の取得成功 (${html.length} bytes)`);
    container.innerHTML = html;
    console.log(`★ includeHTML: "${selector}" に HTML を挿入完了`);
  } catch (err) {
    console.error(`★ includeHTML Error (${url}):`, err);
    container.innerHTML = `<!-- ${url} の読み込みエラー -->`;
  }
}

// 2. ページロード後に各フラグメントを順に読み込む
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded 発火 → パーシャル読み込み開始');

  includeHTML('#navbar-placeholder', '2d-partials/navbar.html')
    .then(() => {
      console.log('→ navbar 読み込み完了 → 設定フォーム用 Offcanvas 読み込み');
      return includeHTML('#offcanvas-config-placeholder', '2d-partials/offcanvas-config.html');
    })
    .then(() => {
      console.log('→ 設定フォーム用 Offcanvas 読み込み完了 → 更新履歴用 Offcanvas 読み込み');
      return includeHTML('#offcanvas-history-placeholder', '2d-partials/offcanvas-history.html');
    })
    .then(() => {
      console.log('→ 更新履歴用 Offcanvas 読み込み完了 → フッター読み込み');
      return includeHTML('#footer-placeholder', '2d-partials/footer.html');
    })
    .then(() => {
      console.log('→ フッター読み込み完了 → d2-main.js を動的に追加');
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'js/2d/d2-main.js';
      script.onload = () => console.log('★★ d2-main.js 読み込み完了');
      script.onerror = () => console.error('★★ d2-main.js の読み込み失敗');
      document.body.appendChild(script);
    })
    .catch(err => {
      console.error('どこかで読み込み失敗:', err);
      // 必要があればここでフォールバックとして d2-main.js を直接追加するなどの処理を入れられます
    });
});
