// js/modules/quantStereo/qt-config.js

// 点群サンプリング解像度
export const RES_THETA = 40;
export const RES_PHI   = 40;

// UI の各要素 ID
export const UI_DOM_IDS = {
  BTN_TOP:    'btn-top-view',
  VAL_ALPHA:  'val-alpha',
  VAL_BETA:   'val-beta',
  VAL_GAMMA:  'val-gamma',
  VAL_DELTA:  'val-delta'
};

// ─────────── ここから追加 ───────────
// １サイクルを “720度（＝4πラジアン）” とする
export const FULL_CYCLE = 4 * Math.PI;

// １回転分のラジアン＝2π
export const HALF_CYCLE = 2 * Math.PI;

// 回転速度：（毎秒90°＝π/2ラジアン）
// ※ もともと qt-main.js 内で使われていた omega = Math.PI/2 を置き換え
export const ROTATION_SPEED = Math.PI / 2;
// ─────────── ここまで追加 ───────────