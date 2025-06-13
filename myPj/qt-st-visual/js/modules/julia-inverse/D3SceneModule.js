// modules/julia-inverse/D3SceneModule.js

/**
 * Three.js シーンの初期化＆破棄を担うクラス
 */
export class D3SceneModule {
  constructor(context) {
    this.scene    = context.scene;
    this.renderer = context.renderer;
    this._inited  = false;
  }

  /** 一度だけシーンを初期化する */
  init() {
    if (this._inited) return;
    // initThree();
    this._inited = true;
    console.log('[D3SceneModule] init() 完了');
  }

  /** シーン内オブジェクトとレンダラーをクリア */
  dispose() {
    clearScene();
    clearRenderer();
    this._inited = false;
    console.log('[D3SceneModule] dispose() 完了');
  }

  /** 内部用メソッド：シーン中身を全消去 */
  _clearScene() {
    if (window.scene) {
      while (window.scene.children.length) {
        window.scene.remove(window.scene.children[0]);
      }
    }
  }

  /** 内部用メソッド：レンダラーをクリア */
  _clearRenderer() {
    if (window.renderer) window.renderer.clear();
  }
}
