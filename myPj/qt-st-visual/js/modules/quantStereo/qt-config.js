// ─────────────────────────────────────────────────────────────
// ファイルパス: js/modules/quantStereo/qt-config.js
// ─────────────────────────────────────────────────────────────

/**
 * qt-config.js
 *  ──────────────────────────────────────────────────────────
 *  quantStereo モジュール全体で使う定数／パラメータをまとめます。
 *  変更したい場合はこのファイルのみを編集すれば OK です。
 */

/** ── DOM ID ──────────────────────────────────────────────────── */
/** Three.js を差し込む親要素の ID */
export const CANVAS_CONTAINER_ID = 'canvas-container';

/** スライダー／ボタン／変数表示に使う DOM ID */
export const UI_DOM_IDS = {
  SLIDER_I:   'input-i-scale',   // i‐scale スライダー<input>
  LABEL_I:    'label-i-scale',   // i‐scale 表示用<span>
  SLIDER_K:   'input-k-scale',   // k‐scale スライダー
  LABEL_K:    'label-k-scale',   // k‐scale 表示用
  BTN_NEXT_Q: 'btn-next-q',      // Next Q ボタン
  BTN_TOP:    'btn-top-view',    // Top View ボタン
  VAL_ALPHA:  'val-alpha',       // α 表示用<span>
  VAL_BETA:   'val-beta',        // β 表示用<span>
  VAL_GAMMA:  'val-gamma',       // γ 表示用<span>
  VAL_DELTA:  'val-delta'        // δ 表示用<span>
};

/** ── 四元数ステレオ投影のパラメータ ──────────────────────────── */
/** 緯度分割数 */
export const RES_THETA = 40;

/** 経度分割数 */
export const RES_PHI = 40;

/** ステレオ投影のタイプ: 'north' or 'south' */
export const PROJECTION_TYPE = 'north';

/** ── 初期クォータニオンシーケンス ───────────────────────────── */
/**
 *  Next Q ボタンを押すたびにこの配列を順番に表示します。
 *  { w, x, y, z } の形で単位四元数を定義してください。
 */
export const QUATERNION_SEQUENCE = [
  { w: 1, x: 0, y: 0, z: 0 },
  { w: 0, x: 1, y: 0, z: 0 },
  { w: -1, x: 0, y: 0, z: 0 },
  { w: 0, x: -1, y: 0, z: 0 }
];

/** ── カラーマッピング用 HSL パラメータ ──────────────────────── */
/**
 *  ステレオ投影後の各点を着色する際に使う HSL の “色相” スケールなど。
 *  必要に応じてこのあたりをいじってください。
 */
export const COLOR_PARAMS = {
  HUE_MIN: 0.0,
  HUE_MAX: 0.7,
  SATURATION: 1.0,
  LIGHTNESS: 0.5
};

/** ── その他今後変更しそうな定数があればここに追加 ───────────────── */
