// modules/julia-inverse/julia-main.js

import { UIControlsModule }      from './d3UIControlsModule.js';
import { LoopController }        from './LoopController.js';
import { D3SceneModule }         from './D3SceneModule.js';

let _juliaMainModule = null;

/**
 * モジュールを開始／シングルトン生成
 * @param {object} context - Three.js コンテキスト (scene, camera, renderer, controls)
 */
export function startModule(context) {
  if (!_juliaMainModule) {
    _juliaMainModule = new JuliaMainModule(context);
    _juliaMainModule.init();
  }
}

/**
 * 外部からリセットを呼び出すインターフェース
 */
export function resetModule(context) {
  if (_juliaMainModule) {
    _juliaMainModule.reset();
  } else {
    startModule(context);
  }
}

/**
 * モジュールの破棄とインスタンスクリア
 */
export function disposeModule() {
  if (_juliaMainModule) {
    _juliaMainModule.dispose();
    _juliaMainModule = null;
  }
}

/**
 * メインクラス：
 * UIControlsModule, LoopController, D3SceneModule の
 * 初期化・破棄を統括する
 */
class JuliaMainModule {
  /**
   * @param {object} context - 共通コンテキスト
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * 初期化処理：
   * シーン、UI、ループ制御のセットアップ
   */
  init() {
    console.log('[JuliaMainModule] init() start');
    console.log('[JuliaMainModule] D3SceneModule() start');
    this.sceneModule = new D3SceneModule(this.context);
    console.log('[JuliaMainModule] LoopController() start');
    this.loopCtrl = new LoopController(
      this.context.scene,
      this.context.camera,
      this.context.controls
    );
    console.log('[JuliaMainModule] UIControlsModule() start');
    this.uiModule    = new UIControlsModule({
      scene:         this.context.scene,
      camera:        this.context.camera,
      renderer:      this.context.renderer,
      controls:      this.context.controls,
      animController:this.loopCtrl,
      onTopView:     () => this.sceneModule.toTopView(2),
      sceneModule: this.sceneModule
    });
    
    console.log('[JuliaMainModule] sceneModule.init() start');
    this.sceneModule.init();
    console.log('[JuliaMainModule] uiModule.init() start');
    this.uiModule.init();
    console.log('[JuliaMainModule] animController.init() start');
    // this.animController.start();
    this.loopCtrl._resetState();
  }

  /**
   * 状態再同期
   */
  sync() {
    this.sceneModule.sync();
    this.uiModule.sync();
  }


  // renderReset() {
  //   // ① 既存オブジェクトを全部クリア（dispose など）
  //   this.sceneModule.dispose();

  //   // ② シーンを再構築
  //   this.sceneModule.init();

  //   // ③ 必要なら animate ループはそのまま動いているはず
  // }

  /**
   * 破棄処理：
   * シーン、UI、ループ制御の停止・クリア
   */
  dispose() {
    // this.animController._resetState();
    // cancel() で async ループを抜けさせてから…
    this.loopCtrl.cancel();
    // stop() で RAF をキャンセルし内部状態を初期化
    this.loopCtrl.stop();

    this.uiModule.dispose();
    this.sceneModule.dispose();
  }

  /**
   * リセット処理：
   * 完全破棄の後、再初期化
   */
  reset() {
    this.dispose();
    this.init();
  }
}
