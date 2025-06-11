// js/3d/renderer/d3-color-map.js

import * as THREE from 'three';

/**
 * z の値を取得し、0〜1 に正規化したあと、
 * 0→青, 1→赤 の間の HSL で色付けする例
 */
export function mapValueToColor(value, maxValue) {
  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  // 色相を 240° (青) から 0° (赤) に線形補間
  const hue = 240 - 240 * ratio; // ratio=0→hue=240(青), ratio=1→hue=0(赤)
  // 彩度100%、明度50% で HSL を指定
  return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
}
