// js/modules/quantStereo/qt-main.js
import { startAnimation, stopAnimation } from './qt-animation.js';
import { SceneModule }         from './qtSceneModule.js';  // パスは環境に合わせて調整
import { UIControlsModule }         from './qtUIControlsModule.js';  // パスは環境に合わせて調整
import * as Config            from './qt-config.js';

/** @type {SceneModule|null} */
let sceneModule = null;
let uiControls = null;


/**
 * アルゴリズムモジュールのエントリーポイント
 * （アプリ起動時はこちらが呼ばれる）
 */
export function startModule(context) {
  console.log('[qt-main] startModule() が呼ばれました');
  initializeModule(context);
  console.log('[qt-main] initializeModule: 完了');
}



/**
 * シーン／コントロール／UI／アニメーションの初期化フロー
 * @param {{ scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer, controls: any }} context
 */
export function initializeModule(context) {
  const { scene, camera, renderer, controls } = context;
  // --- SceneModule の生成＆初期化 ---
  if (!sceneModule) {
    sceneModule = new SceneModule(context);
  }
  sceneModule.init();
  console.log('[qt-main] sceneModule.init(); 完了');
  // --- コントロール初期化 ---
  if (!uiControls) {
    uiControls = new UIControlsModule( { scene, camera, renderer, controls });
  }
  uiControls.init();
  console.log('[qt-main] uiControls.init(); 完了');
  // --- アニメーション開始 ---
  startAnimation(scene, camera, controls);
  uiControls._hasStarted = true;
}

/**
 * モジュール破棄用
 */
export function disposeModule() {
  if (sceneModule) {
    sceneModule.dispose();
    sceneModule = null;
  }
  if (uiControls) {
    uiControls.dispose();
    uiControls = null;
  }
}

/**
 * リセット用：アニメーション停止→破棄→初期化フロー再実行
 */
export function resetModule(context) {
  stopAnimation();
  disposeModule();
  initializeModule(context);
}
