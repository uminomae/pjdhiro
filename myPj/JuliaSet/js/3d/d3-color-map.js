/**
 * 3D 描画時に z 値や複素数の絶対値を色にマッピングするヘルパー関数
 * 例：z = 0〜max くらいの範囲を HSL の色相に変換し、THREE.Color オブジェクトを返す
 */
import * as THREE from 'three';

/**
 * z (あるいは複素数の絶対値など) を 0.0〜1.0 の範囲に正規化し、
 * さらに色相 (H) として 0〜240 度程度の範囲にマッピングして返す例。
 *
 * @param {number} value — マッピングしたい値
 * @param {number} maxValue — 最大値（value を正規化するために使う）
 * @returns {THREE.Color} 返り値は THREE.Color({ h, s, l })
 */
export function mapValueToColor(value, maxValue) {
  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  // たとえば、色相を 240°(青)〜0°(赤) の間で変化させる
  const hue = 240 - 240 * ratio; // ratio = 0 → hue=240、ratio=1 → hue=0
  // HSL → RGB 変換して THREE.Color にセット
  const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
  return color;
}
