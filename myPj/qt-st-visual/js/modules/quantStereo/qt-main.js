// ─────────────────────────────────────────────────────────────
// ファイルパス: js/modules/quantStereo/qt-main.js
// ─────────────────────────────────────────────────────────────

import { initScene, addHelpersAndLights, initPointCloud, initUI, startLoop } from './qt-init/qt-st-init.js';

/**
 * initialize()
 * ────────────────────────────────────────────────────────────
 * quantStereo（四元数ステレオ投影ビジュアライザ）の
 * エントリポイント「指揮者」です。
 *
 * 「シーン初期化 → UI 初期化 → 点群レンダリング → アニメーションループ開始」
 * の順で呼び出します。
 *
 * @returns {void}
 */
export function initialize() {
  console.log('[qt-main] initialize() を実行 (Init → UI → Render)');

  // ───────────────────────────────────────────────────────────
  // 1) Three.js のシーン/カメラ/レンダラー/コントロールを初期化
  // ───────────────────────────────────────────────────────────
  // initScene(): { scene, camera, renderer, controls } を返す
  const { scene, camera, renderer, controls } = initScene();
  console.log('[qt-main] initScene() 完了');

  // ───────────────────────────────────────────────────────────
  // 2) 照明と軸ヘルパー（Helpers & Lights）を追加
  // ───────────────────────────────────────────────────────────
  addHelpersAndLights(scene);
  console.log('[qt-main] addHelpersAndLights() 完了');

  // ───────────────────────────────────────────────────────────
  // 3) UI（スライダー・ボタン・変数表示）の初期化
  // ───────────────────────────────────────────────────────────
  //
  //   ここで UI を先に組み立てることで、
  //   ユーザーがページを開いた直後からスライダーなどが
  //   すぐに操作できるようにします。
  //
  initUI({ scene, camera, renderer, controls });
  console.log('[qt-main] initUI() 完了');

  // ───────────────────────────────────────────────────────────
  // 4) 四元数点群を初期生成してシーンに追加 (index = 0)
  // ───────────────────────────────────────────────────────────
  //
  //   initUI の後にレンダリングを行うことで、
  //   UI の操作で「点群のスケール変更」や「Next Q ボタン」などを
  //   すぐにテストできるようになります。
  //
  initPointCloud(scene);
  console.log('[qt-main] initPointCloud() 完了');

  // ───────────────────────────────────────────────────────────
  // 5) アニメーションループを開始 (Render Loop)
  // ───────────────────────────────────────────────────────────
  startLoop({ scene, camera, renderer, controls });
  console.log('[qt-main] startLoop() 完了');

  console.log('[qt-main] initialize() COMPLETE');
}
