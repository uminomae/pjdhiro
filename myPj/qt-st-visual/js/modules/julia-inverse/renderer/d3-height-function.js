// js/3d/d3-height-function.js

/**
 * getZ(complex, info)
 *
 * 「Z軸に何を割り当てるか」を定義する関数です。
 * いまはサンプルとして「ノルム」を返しますが、別途書き換えれば
 * 「実部」「位相」「リャプノフ指数」など、好きな指標に変えられます。
 *
 * @param {Complex} complex - 描画対象の複素数オブジェクト
 * @param {object}  info    - { stage: 'init'|'iter', iter: 世代番号 }（必要に応じて利用）
 * @returns {number}        - Z軸に乗せる数値
 */
export function getZ(complex, info) {
	return complex.abs();
  
	// 例：実部にしたい場合
	// return complex.re;
  
	// 例：位相にしたい場合
	// let a = Math.atan2(complex.im, complex.re);
	// if (a < 0) a += 2 * Math.PI;
	// return a;
  
	// 例：ノルムの二乗
	// return complex.abs() ** 2;
  }
  