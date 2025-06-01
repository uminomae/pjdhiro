// js/arc.js
import { Complex } from './complex.js';

/**
 * Arc（円弧）を表すクラス
 *  - center: 原点 (0,0) 固定なので不要
 *  - radius: 半径 R
 *  - θ_start, θ_end: 角度区間（ラジアン）
 *  - steps: 局所的にサンプリングする分割数（描画品質のため）
 */
export class Arc {
  constructor(radius, thetaStart, thetaEnd, steps = 100) {
    this.radius = radius;
    this.thetaStart = thetaStart;
    this.thetaEnd = thetaEnd;
    this.steps = steps;
  }

  /** 
   * 連続的に θ を分割して円弧上の Complex[] を返す
   */
  samplePoints() {
    const pts = [];
    for (let i = 0; i <= this.steps; i++) {
      // t ∈ [0,1]
      const t = i / this.steps;
      const θ = this.thetaStart + (this.thetaEnd - this.thetaStart) * t;
      pts.push(new Complex(
        this.radius * Math.cos(θ),
        this.radius * Math.sin(θ)
      ));
    }
    return pts;
  }

  /**
   * この円弧を逆写像したら得られる 2 つの Arc インスタンスを返す
   *   - c: Complex 型のジュリア定数
   *   - newSteps: 次世代でサンプリングする分割数
   *
   * 逆写像 \sqrt{w - c} は、w(θ)=R e^{iθ} として θ が連続している時、
   * \sqrt{R e^{iθ} - c} の引数 arg(R e^{iθ} - c) が連続するならば、
   * 角度半分した連続的な弧として現れる。負号の方は +π の偏角シフト。
   */
  preimageArcs(c, newSteps = 100) {
    // θ を steps+1 点に分割して、それぞれの逆写像を得る
    const thetas = [];
    for (let i = 0; i <= this.steps; i++) {
      const t = i / this.steps;
      thetas.push(this.thetaStart + (this.thetaEnd - this.thetaStart) * t);
    }

    // サンプル点ごとに逆写像を計算し、新しい θ' を求める
    // ただし、連続性を保つために「引数 arg(diff) / 2」と「(arg(diff)/2 + π)」を逐次記録して、
    // θ'_min, θ'_max を算出できるようにする。
    // ここではまず全点で sqrt を取り、それらの極座標を取得してから、
    // 最大最小の偏角範囲を弧として返すイメージになります。

    const pre1 = [];  // 主値 sqrt(w - c)
    const pre2 = [];  // -主値
    for (const θ of thetas) {
      const w = new Complex(
        this.radius * Math.cos(θ),
        this.radius * Math.sin(θ)
      );
      const diff = w.sub(c);
      const root = diff.sqrt();            // 主値
      const rootNeg = new Complex(-root.re, -root.im);
      pre1.push(root);
      pre2.push(rootNeg);
    }

    // pre1, pre2 の偏角 θ'_list を得て、最小と最大を探す
    const angles1 = pre1.map(z => Math.atan2(z.im, z.re));
    const angles2 = pre2.map(z => Math.atan2(z.im, z.re));

    // 通常、atan2 の値は (-π, +π] の範囲なので、折り返しを防ぐための正規化関数を準備
    function normalizeAngleList(list) {
      // すべてを [0, 2π) に変換
      return list.map(a => (a < 0 ? a + 2 * Math.PI : a));
    }
    const norm1 = normalizeAngleList(angles1);
    const norm2 = normalizeAngleList(angles2);

    // θ'_min, θ'_max を取る。ただし、360°を跨ぐ場合もあるので、そのときは 2 つに分割して返してもよいが
    // ここでは簡単化のため「単一路線で連続している」前提とする。
    const θ1_min = Math.min(...norm1);
    const θ1_max = Math.max(...norm1);
    const θ2_min = Math.min(...norm2);
    const θ2_max = Math.max(...norm2);

    // 新たに 2 つの Arc を返す
    const arc1 = new Arc(1.0 /* 実際の半径は極座標から求めるので dummy */,
                          θ1_min, θ1_max, newSteps);
    const arc2 = new Arc(1.0,
                          θ2_min, θ2_max, newSteps);

    // しかし、Arc クラスでは半径固定になっているので、
    // ここでは radius を「平均距離」にするか個別に分けてもよい。
    // サンプルとして radius を各サンプル点の |z| の平均値にしてみる：
    arc1.radius = pre1.reduce((sum, z) => sum + z.abs(), 0) / pre1.length;
    arc2.radius = pre2.reduce((sum, z) => sum + z.abs(), 0) / pre2.length;

    return [arc1, arc2];
  }
}
