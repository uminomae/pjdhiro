// js/modules/quantStereo/qt-main.js

import { startAnimation, stopAnimation } from './qt-animation.js';
import { SceneModule }                  from './qtSceneModule.js';
import { UIControlsModule }             from './qtUIControlsModule.js';

let qtMainModule = null;

export function startModule(context) {
  if (!qtMainModule) {
    qtMainModule = new QtMainModule(context);
    qtMainModule.init();
  }
}

export function resetModule(context) {
  // 動的にリセットを呼べるようエクスポート
  if (qtMainModule) {
    qtMainModule.reset();
  } else {
    startModule(context);
  }
}

export function disposeModule() {
  if (qtMainModule) {
    qtMainModule.dispose();
    qtMainModule = null;
  }
}

class QtMainModule {
  constructor(context) {
    this.context     = context;
    this.sceneModule = new SceneModule(context);
    this.uiModule    = new UIControlsModule(context);
  }

  init() {
    this.sceneModule.init();
    this.uiModule.init();
    startAnimation(
      this.context.scene,
      this.context.camera,
      this.context.controls
    );
  }

  sync() {
    this.sceneModule.sync();
    this.uiModule.sync();
  }

  dispose() {
    stopAnimation();
    this.uiModule.dispose();
    this.sceneModule.dispose();
  }

  reset() {
    this.dispose();
    this.init();
  }
}
