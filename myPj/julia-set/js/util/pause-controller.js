/**
 * 一時停止・再開機能付きの sleep を提供するオブジェクトを生成する
 *
 * 使い方:
 *   const pc = createPauseController();
 *   await pc.sleep(200);  // 200ms 待つ（途中で paused → resume も可能）
 *   pc.pause();           // 一時停止要求
 *   pc.resume();          // 再開要求
 *   if (pc.isPaused()) …  // 現在の一時停止状態を確認したいとき
 */
export function createPauseController() {
	let _paused = false;
	let _resolveNext = null;
  
	function pause() {
	  _paused = true;
	}
  
	function resume() {
	  if (_paused && _resolveNext) {
		_resolveNext();    // 一時停止解除時に待ち行列を解決
		_resolveNext = null;
	  }
	  _paused = false;
	}
  
	function isPaused() {
	  return _paused;
	}
  
	async function sleep(ms = 0) {
	  // 次のタイムアウトまで待った後、一時停止フラグが立っていたら Promise を止める
	  await new Promise(resolve => setTimeout(resolve, ms));
	  if (!_paused) return;
	  // _paused === true の間はここで待機し、resume() が呼ばれたら先に進む
	  await new Promise(resolve => {
		_resolveNext = resolve;
	  });
	}
  
	return { pause, resume, isPaused, sleep };
  }
  