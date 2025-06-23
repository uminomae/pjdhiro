/*
 * Pause controller utility kept for reference. The current codebase
 * does not make use of this helper.
 */

/*
export function createPauseController() {
        let _paused = false;
        let _resolveNext = null;

        function pause() {
          _paused = true;
        }

        function resume() {
          if (_paused && _resolveNext) {
                _resolveNext();
                _resolveNext = null;
          }
          _paused = false;
        }

        function isPaused() {
          return _paused;
        }

        async function sleep(ms = 0) {
          await new Promise(resolve => setTimeout(resolve, ms));
          if (!_paused) return;
          await new Promise(resolve => {
                _resolveNext = resolve;
          });
        }

        return { pause, resume, isPaused, sleep };
  }
*/
  