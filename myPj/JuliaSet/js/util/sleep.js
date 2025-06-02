/**
 * シンプルに sleep / 待機するだけの Promise を返す
 * 使い方：await sleep(500);
 */
export function sleep(ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }
  