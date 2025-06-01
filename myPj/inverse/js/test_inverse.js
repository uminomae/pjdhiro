// js/test_inverse.js (分割構成用)

import { Complex } from './complex.js';
import { sampleCircle, preimagesOfQuadratic } from './inverseLogic.js';
import { drawPoints, visualizeSqrtSteps } from './draw.js';

console.log('――――――――――――――――――――');
console.log('分割構成テスト開始');
console.log('――――――――――――――――――――');

// 1. Complex の基本演算テスト
const a = new Complex(3, 4);
console.assert(Math.abs(a.abs() - 5) < 1e-10, `Complex.abs: 期待 5, 実際 ${a.abs()}`);

const b = new Complex(1, -2);
const sum = a.add(b);
console.assert(sum.re === 4 && sum.im === 2, `Complex.add: 期待 (4,2), 実際 (${sum.re},${sum.im})`);

const diff = a.sub(b);
console.assert(diff.re === 2 && diff.im === 6, `Complex.sub: 期待 (2,6), 実際 (${diff.re},${diff.im})`);

const prod = a.mul(b);
console.assert(prod.re === 11 && prod.im === -2, `Complex.mul: 期待 (11,-2), 実際 (${prod.re},${prod.im})`);

const sq = (new Complex(2, 1)).mul(new Complex(2, 1));
const root = sq.sqrt();
console.assert(Math.abs(root.re - 2) < 1e-10 && Math.abs(root.im - 1) < 1e-10,
  `Complex.sqrt: 期待 (2,1), 実際 (${root.re},${root.im})`
);

console.log('✅ Complex の基本演算テストは通りました。');

// 2. sampleCircle のテスト
const circ = sampleCircle(2, 4);
console.assert(circ.length === 4, `sampleCircle: 期待長さ 4, 実際 ${circ.length}`);
console.assert(Math.abs(circ[0].re - 2) < 1e-10 && Math.abs(circ[0].im - 0) < 1e-10,
  `sampleCircle[0]: 期待 (2,0), 実際 (${circ[0].re},${circ[0].im})`
);
console.assert(Math.abs(circ[1].re - 0) < 1e-10 && Math.abs(circ[1].im - 2) < 1e-10,
  `sampleCircle[1]: 期待 (0,2), 実際 (${circ[1].re},${circ[1].im})`
);

console.log('✅ sampleCircle のテストは通りました。');

// 3. preimagesOfQuadratic のテスト
const c0 = new Complex(1, 0);
const w0 = new Complex(5, 0);
const invs0 = preimagesOfQuadratic(w0, c0);
console.assert(invs0.length === 2, `preimagesOfQuadratic: 期待長さ 2, 実際 ${invs0.length}`);
const [z1, z2] = invs0;
const ok0 = ((Math.abs(z1.re - 2) < 1e-10 && Math.abs(z1.im) < 1e-10 && Math.abs(z2.re + 2) < 1e-10 && Math.abs(z2.im) < 1e-10)
           || (Math.abs(z1.re + 2) < 1e-10 && Math.abs(z2.re - 2) < 1e-10));
console.assert(ok0, `preimagesOfQuadratic: 期待 {±2}, 実際 {(${z1.re},${z1.im}),(${z2.re},${z2.im})}`);
console.log('✅ preimagesOfQuadratic のテストは通りました。');

// 4. computeSqrtSteps のテスト
console.log('— テスト: Complex.computeSqrtSteps の結果を検証 —');
const diffTest = new Complex(3, 4);
const { r, theta, sqrtR, halfTheta, sqrtComplex } = diffTest.computeSqrtSteps();
console.assert(Math.abs(r - 5) < 1e-10, `r: 期待 5, 実際 ${r}`);
console.assert(Math.abs(theta - Math.atan2(4, 3)) < 1e-10, `theta: 期待 ${Math.atan2(4,3)}, 実際 ${theta}`);
console.assert(Math.abs(sqrtR - Math.sqrt(5)) < 1e-10, `sqrtR: 期待 ${Math.sqrt(5)}, 実際 ${sqrtR}`);
console.assert(Math.abs(halfTheta - theta/2) < 1e-10, `halfTheta: 期待 ${theta/2}, 実際 ${halfTheta}`);
const square = sqrtComplex.mul(sqrtComplex);
console.assert(Math.abs(square.re - diffTest.re) < 1e-10 && Math.abs(square.im - diffTest.im) < 1e-10,
  `sqrtComplex^2: 期待 (${diffTest.re},${diffTest.im}), 実際 (${square.re},${square.im})`
);
console.log('✅ Complex.computeSqrtSteps のテストは通りました。');

// 5. visualizeSqrtSteps の基本動作（コールバックが呼ばれるか）
//    → ここはタイマー系のテストなので、1秒後にコールバックを確認する例
console.log('— テスト: visualizeSqrtSteps のコールバック検証 —');
let callbackCalled = false;
const testCanvas = document.createElement('canvas');
testCanvas.width = 100;
testCanvas.height = 100;
const testCtx = testCanvas.getContext('2d');
const wTest = new Complex(1, 1);
const cTest = new Complex(0, 0);
visualizeSqrtSteps(testCtx, wTest, cTest, 50, 50, 10, 100, () => {
  callbackCalled = true;
});
setTimeout(() => {
  console.assert(callbackCalled === true, 'visualizeSqrtSteps: コールバックが呼ばれていません');
  console.log('✅ visualizeSqrtSteps のコールバックテストは通りました。');
}, 100 * 6);

// 6. 終了メッセージ
setTimeout(() => {
  console.log('――――――――――――――――――――');
  console.log('すべてのテストが完了しました（コンソールを確認）。');
  console.log('――――――――――――――――――――');
}, 100 * 7);
