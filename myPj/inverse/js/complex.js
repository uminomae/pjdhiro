// js/complex.js

export class Complex {
	constructor(re, im) {
	  this.re = re;
	  this.im = im;
	}
  
	// 減算 (this - other)
	sub(other) {
	  return new Complex(this.re - other.re, this.im - other.im);
	}
  
	// 絶対値 √(re^2 + im^2)
	abs() {
	  return Math.hypot(this.re, this.im);
	}
  }
  