/*
 * Simple pause/resume utilities once used in early prototypes.
 * They are not referenced by the current modules, so the entire
 * implementation is commented out.
 */

/*
let _paused  = false;
let _stopped = false;

export function pause() {
  _paused = true;
}

export function resume() {
  _paused = false;
  _stopped = false;
}

export function stop() {
  _stopped = true;
}

export function pauseAwareSleep(ms = 0) {
  return new Promise((resolve) => {
    const start = performance.now();
    function tick() {
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
*/
