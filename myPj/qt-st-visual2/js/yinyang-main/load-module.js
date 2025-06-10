// ─────────────────────────────────────────────────────────────
// フォルダパス: js/qt-main/load-module.js
// ─────────────────────────────────────────────────────────────

import { DEFAULT_ALG, ALG_MODULE_PATHS, ALG_FALLBACK_PATH } from '../yinyang-config.js';

/**
 * getAlgFromURL()
 * ────────────────────────────────────────────────────────────
 * URL のクエリパラメータから "alg" を取得し、なければ DEFAULT_ALG を返す
 */
export function getAlgFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('alg') || DEFAULT_ALG;
}

/**
 * loadAlgModule()
 * ────────────────────────────────────────────────────────────
 * alg キーに対応するモジュールパスを ALG_MODULE_PATHS から取得し、
 * 動的 import → startModule(context) を呼び出す
 *
 * @param {string} alg
 * @param {{ scene, camera, renderer, controls }} context
 */
export async function loadAlgModule(alg, context) {
  console.log('[load-module] loadAlgModule() を実行 (alg =', alg, ')');

  // キーがあればそのモジュールパス、なければフォールバック
  const modulePath = ALG_MODULE_PATHS[alg] || ALG_FALLBACK_PATH;
  console.log('[load-module] インポート対象モジュール:', modulePath);

  try {
    const mod = await import(modulePath);
    console.log('[load-module] モジュールインポート完了:', mod);

    if (typeof mod.startModule !== 'function') {
      throw new Error(`[load-module] ${modulePath} に startModule(context) が定義されていません`);
    }
    // モジュールの startModule() を呼び出す
    mod.startModule(context);
    console.log('[load-module] startModule() を実行完了');
  } catch (err) {
    throw new Error(`[load-module] ${modulePath} の読み込み失敗: ${err}`);
  }
}
