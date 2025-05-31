// ─────────────────────────────────────────
// js/inverse.js
// ─────────────────────────────────────────
(function() {
	// ─────────────────────────────────────────
	// 1. 複素数クラス（Complex）定義
	// ─────────────────────────────────────────
	class Complex {
	  constructor(re, im) {
		this.re = re;
		this.im = im;
	  }
  
	  abs() {
		return Math.hypot(this.re, this.im);
	  }
  
	  add(o) {
		return new Complex(this.re + o.re, this.im + o.im);
	  }
  
	  sub(o) {
		return new Complex(this.re - o.re, this.im - o.im);
	  }
  
	  mul(o) {
		return new Complex(
		  this.re * o.re - this.im * o.im,
		  this.re * o.im + this.im * o.re
		);
	  }
  
	  scale(s) {
		return new Complex(this.re * s, this.im * s);
	  }
  
	  // 主値の √ を返す
	  sqrt() {
		const r = this.abs();
		const theta = Math.atan2(this.im, this.re);
		const sqrtR = Math.sqrt(r);
		return new Complex(
		  sqrtR * Math.cos(theta / 2),
		  sqrtR * Math.sin(theta / 2)
		);
	  }
  
	  // Canvas 座標に変換するメソッド
	  toCanvasCoord(cx, cy, scale) {
		return {
		  x: cx + this.re * scale,
		  y: cy - this.im * scale
		};
	  }
	}
  
	// ─────────────────────────────────────────
	// 2. 逆写像（f(z)=z^2 + c）の関数
	// ─────────────────────────────────────────
	function preimagesOfQuadratic(w, c) {
	  // w, c: Complex のインスタンス
	  const diff = w.sub(c);
	  const root = diff.sqrt();  // ±√(w - c) の主値
	  const rootNeg = new Complex(-root.re, -root.im);
	  return [root, rootNeg];
	}
  
	// ─────────────────────────────────────────
	// 3. 円をサンプリングする関数
	// ─────────────────────────────────────────
	function sampleCircle(R, N) {
	  const pts = [];
	  for (let k = 0; k < N; k++) {
		const theta = (2 * Math.PI * k) / N;
		pts.push(
		  new Complex(R * Math.cos(theta), R * Math.sin(theta))
		);
	  }
	  return pts;
	}
  
	// ─────────────────────────────────────────
	// 4. Canvas に点を描画する関数
	// ─────────────────────────────────────────
	function drawPoints(ctx, complexArray, cx, cy, scale, color) {
	  ctx.fillStyle = color;
	  complexArray.forEach(z => {
		const { x, y } = z.toCanvasCoord(cx, cy, scale);
		if (x < 0 || x >= ctx.canvas.width || y < 0 || y >= ctx.canvas.height) {
		  return;
		}
		ctx.fillRect(x, y, 1, 1);
	  });
	}
  
	// ─────────────────────────────────────────
	// 5. メイン処理：Canvas の準備 → 逆写像ムービーの開始
	// ─────────────────────────────────────────
	document.addEventListener('DOMContentLoaded', () => {
	  // Canvas 要素を取得
	  const canvas = document.getElementById('inverse-movie-canvas');
	  if (!canvas) {
		console.warn('Canvas 要素 (#inverse-movie-canvas) が見つかりませんでした。');
		return;
	  }
	  const ctx = canvas.getContext('2d');
	  const W = canvas.width, H = canvas.height;
	  const cx = W / 2, cy = H / 2;
	  const scale = 200;  // 表示スケール（適宜変更可）
  
	  // ジュリア写像の定数 c を設定（例：c = -0.8 + 0.156i）
	  const c = new Complex(-0.8, 0.156);
  
	  // 初期集合：半径 1 の円を 360 点でサンプリング
	  let currentSet = sampleCircle(1.0, 360);
  
	  // 最大逆写像繰り返し回数
	  const iterMax = 6;
	  let generation = 0;
  
	  // 背景を塗りつぶして黒にする
	  ctx.fillStyle = '#000';
	  ctx.fillRect(0, 0, W, H);
  
	  function animate() {
		if (generation > iterMax) return;
  
		// 色相 (hue) を世代ごとに変えて半透明で重ね描き
		const hue = (generation * 60) % 360;
		const color = `hsla(${hue}, 80%, 60%, 0.4)`;
  
		// 現在の集合を描画
		drawPoints(ctx, currentSet, cx, cy, scale, color);
  
		// 次の世代を計算
		const nextSet = [];
		currentSet.forEach(z => {
		  const invs = preimagesOfQuadratic(z, c);
		  nextSet.push(invs[0], invs[1]);
		});
		currentSet = nextSet;
		generation++;
  
		setTimeout(animate, 500);
	  }
  
	  // アニメーション開始
	  animate();
	});
  
	// ─────────────────────────────────────────
	// 6. テスト用に「window.Inverse」に公開
	// ─────────────────────────────────────────
	window.Inverse = {
	  Complex,
	  preimagesOfQuadratic,
	  sampleCircle
	};
  })();
  