// modules/julia-inverse/loop/syncers/loopSync.js

/**
 * Run/Pause ボタンの有効・無効を切り替える
 * @param {LoopController} loopCtrl
 */
export function syncLoopButtons(loopCtrl) {
	const runBtn   = document.getElementById('btn-run');
	const pauseBtn = document.getElementById('btn-pause');
	if (runBtn && pauseBtn) {
	  runBtn.disabled   = loopCtrl.isRunning;
	  pauseBtn.disabled = !loopCtrl.isRunning;
	}
  }
  