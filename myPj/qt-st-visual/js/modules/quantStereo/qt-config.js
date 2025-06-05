// js/modules/quantStereo/qt-config.js

// 点群サンプリング解像度
export const RES_THETA = 160;
export const RES_PHI   = 160;

// UI の各要素 ID
export const UI_DOM_IDS = {
  BTN_TOP:    'btn-top-view',
  VAL_ALPHA:  'val-alpha',
  VAL_BETA:   'val-beta',
  VAL_GAMMA:  'val-gamma',
  VAL_DELTA:  'val-delta'
};

// １サイクルを “720度（＝4πラジアン）” とする
// “720°の回転” をひとまとまり（１サイクル）
// 「１回転目」と「２回転目」で別々に切り替えるため
// 角度 θ を 0 ≦ θ < 4π の範囲でモジュロ演算して使う
export const FULL_CYCLE = 4 * Math.PI;
// １回転分のラジアン＝2π
export const HALF_CYCLE = 2 * Math.PI;
// 回転速度：（毎秒90°＝π/2ラジアン）
// 分母を小さくすると遅くなる（例：Math.PI / 4 → 45°/秒）
export const ROTATION_SPEED = Math.PI / 2;


// ────────────────────────────────────────────────────────────
// 床グリッド (GridHelper) の設定
// ────────────────────────────────────────────────────────────

// グリッド全体の幅（シーン単位）
export const GRID_SIZE = 10;

// グリッドの分割数（何マスに分割するか）
export const GRID_DIVISIONS = 10;

// グリッドの中心線の色 (Hex)
export const GRID_COLOR_CENTERLINE = 0x444444;

// グリッドのその他線の色 (Hex)
export const GRID_COLOR = 0x888888;

// ────────────────────────────────────────────────────────────
// 軸ヘルパー (AxesHelper) のスケール
// ────────────────────────────────────────────────────────────

// AxesHelper の大きさ (長さ)
export const AXES_SIZE = 1.5;