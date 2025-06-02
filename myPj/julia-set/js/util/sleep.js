// js/util/sleep.js

/**
 * 2Dで使用中
 * シンプルに sleep / 待機するだけの Promise を返す
 * 使い方：await sleep(500);
 */
export function sleep(ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }
  

/**
 * pauseAwareSleep(ms)
 *
 * ・与えられた ms ミリ秒だけ待機するが、その間に `isPaused` が true なら待機し続け、
 *   `isStopped` が true になったらすぐに例外を投げて処理を中断する。
 *
 * ・`isPaused` / `isStopped` は外部スクリプトでグローバルに定義されているものを参照する。
 *   （HTML 側の script で `window.isPaused` / `window.isStopped` として用意しておく）
 *
 * 使い方：
 *   await pauseAwareSleep(500);
 */
export function pauseAwareSleep(ms = 0) {
	return new Promise((resolve, reject) => {
	  const start = performance.now();
	  function tick() {
		// 外部で isStopped が true になっていたら例外を投げる
		if (window.isStopped) {
		  reject(new Error('Animation stopped'));
		  return;
		}
		// isPaused が true の間は再帰的にチェックだけ続ける
		if (window.isPaused) {
		  requestAnimationFrame(tick);
		  return;
		}
		// 経過時間をチェック
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
  