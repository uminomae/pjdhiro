// d3ModSleep.js

let _paused  = false;
let _stopped = false;

/** pause: 一時停止フラグだけ立てる */
export function pause() {
  _paused = true;
}

/** resume: 一時停止解除 */
export function resume() {
  _paused = false;
  _stopped = false;
}

/** stop: 完全停止フラグ */
export function stop() {
  _stopped = true;
}

/**
 * pauseAwareSleep:
 * - _stopped または _paused が立っていたら **即時** resolve（エラーも出さない）
 * - それ以外は ms 経過まで待って resolve
 */
export function pauseAwareSleep(ms = 0) {
  return new Promise((resolve) => {
    const start = performance.now();
    function tick() {
      // 完全停止または一時停止ならば即解放
      if (_stopped || _paused) {
        resolve();
        return;
      }
      const elapsed = performance.now() - start;
      if (elapsed >= ms) {
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    }
    tick();
  });
}
