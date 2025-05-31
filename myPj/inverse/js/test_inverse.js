// js/test_inverse.js
(function() {
	if (!window.Inverse) {
	  console.error('Error: window.Inverse が定義されていません。js/inverse.js を先に読み込んでください。');
	  return;
	}
	const { Complex, sampleCircle, preimagesOfQuadratic } = window.Inverse;
  
	console.log('――――――――――――――――――――');
	console.log('js/test_inverse.js：基本演算テスト開始');
	console.log('――――――――――――――――――――');
  
	// 1. Complex の加算・減算・乗算・abs テスト
	const a = new Complex(3, 4); // |a|=5
	console.assert(
	  Math.abs(a.abs() - 5) < 1e-10,
	  `Complex.abs: 期待 5, 実際 ${a.abs()}`
	);
  
	const b = new Complex(1, -2);
	const sum = a.add(b);   // (3+1, 4-2) = (4, 2)
	console.assert(
	  sum.re === 4 && sum.im === 2,
	  `Complex.add: 期待 (4,2), 実際 (${sum.re},${sum.im})`
	);
  
	const diff = a.sub(b);  // (3-1, 4-(-2)) = (2,6)
	console.assert(
	  diff.re === 2 && diff.im === 6,
	  `Complex.sub: 期待 (2,6), 実際 (${diff.re},${diff.im})`
	);
  
	const prod = a.mul(b);  // (3*1 - 4*(-2), 3*(-2)+4*1) = (3+8, -6+4) = (11, -2)
	console.assert(
	  prod.re === 11 && prod.im === -2,
	  `Complex.mul: 期待 (11,-2), 実際 (${prod.re},${prod.im})`
	);
  
	// sqrt テスト： (3+4i) の sqrt は ±(2+1i) になる
	const sq = (new Complex(2, 1)).mul(new Complex(2, 1)); // (2+ i)^2 = 3 + 4i
	const root = sq.sqrt(); // 主値
	console.assert(
	  Math.abs(root.re - 2) < 1e-10 && Math.abs(root.im - 1) < 1e-10,
	  `Complex.sqrt: 期待 (2,1), 実際 (${root.re},${root.im})`
	);
  
	console.log('✅ Complex の基本演算テストは通りました。');
  
	// 2. sampleCircle のテスト：半径 2, N=4 なら四隅が (±2,0) と (0,±2) になる
	const circ = sampleCircle(2, 4);
	// sampleCircle(2,4) = [ (2,0), (0,2), (-2,0), (0,-2) ] の順
	console.assert(
	  circ.length === 4,
	  `sampleCircle: 期待長さ 4, 実際 ${circ.length}`
	);
	console.assert(
	  Math.abs(circ[0].re - 2) < 1e-10 && Math.abs(circ[0].im - 0) < 1e-10,
	  `sampleCircle[0]: 期待 (2,0), 実際 (${circ[0].re},${circ[0].im})`
	);
	console.assert(
	  Math.abs(circ[1].re - 0) < 1e-10 && Math.abs(circ[1].im - 2) < 1e-10,
	  `sampleCircle[1]: 期待 (0,2), 実際 (${circ[1].re},${circ[1].im})`
	);
	console.log('✅ sampleCircle のテストは通りました。');
  
	// 3. preimagesOfQuadratic のテスト：f(z)=z^2 + c, c = 1 + 0i, w = 5 + 0i のとき z は ±2
	const c = new Complex(1, 0);
	const w = new Complex(5, 0);
	const invs = preimagesOfQuadratic(w, c);
	// invs は [Complex(2,0), Complex(-2,0)] のはず。（順序は√の主値→符号反転）
	console.assert(
	  invs.length === 2,
	  `preimagesOfQuadratic: 期待長さ 2, 実際 ${invs.length}`
	);
	const [z1, z2] = invs;
	const okPair = ( (Math.abs(z1.re - 2) < 1e-10 && Math.abs(z1.im) < 1e-10 
				   && Math.abs(z2.re + 2) < 1e-10 && Math.abs(z2.im) < 1e-10)
				 || (Math.abs(z1.re + 2) < 1e-10 && Math.abs(z2.re - 2) < 1e-10) );
	console.assert(
	  okPair,
	  `preimagesOfQuadratic: 期待 {±2}, 実際 {(${z1.re},${z1.im}), (${z2.re},${z2.im})}`
	);
	console.log('✅ preimagesOfQuadratic のテストは通りました。');
  
	console.log('――――――――――――――――――――');
	console.log('すべてのテストが完了しました（ブラウザのコンソールを確認してください）。');
	console.log('――――――――――――――――――――');
  })();
  