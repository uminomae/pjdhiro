// js/complex.js
// 複素数クラス：変更不要です。

export class Complex {
	constructor(re, im) {
	  this.re = re;
	  this.im = im;
	}
  
	clone() {
	  return new Complex(this.re, this.im);
	}
  
	add(other) {
	  return new Complex(this.re + other.re, this.im + other.im);
	}
  
	sub(other) {
	  return new Complex(this.re - other.re, this.im - other.im);
	}
  
	mul(other) {
	  return new Complex(
		this.re * other.re - this.im * other.im,
		this.re * other.im + this.im * other.re
	  );
	}
  
	abs() {
	  return Math.hypot(this.re, this.im);
	}
  
	/**
	 * 複素数 z = re + i·im の「位相（角度）」を返す。範囲は (-π, π]。
	 */
	arg() {
	  return Math.atan2(this.im, this.re);
	}
  }
  