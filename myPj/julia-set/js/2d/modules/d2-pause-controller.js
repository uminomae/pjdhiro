// ファイル：js/2d/modules/d2-pause-controller.js

import { createPauseController } from '../../util/pause-controller.js';

/**
 * 一時停止コントローラを生成して返す。
 * （元のコードは util/pause-controller.js にある想定）
 */
export const pauseCtrl = createPauseController();

/** 一時停止 */
export function pauseAnimation() {
  pauseCtrl.pause();
}

/** 再開 */
export function resumeAnimation() {
  pauseCtrl.resume();
}

/**
 * await pauseCtrl.sleep(ms) を呼び出したい場合は、
 * pauseCtrl オブジェクトを直接 import してもOK。
 */
