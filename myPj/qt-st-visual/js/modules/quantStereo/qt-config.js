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
// ────────────────────────────────────────────────────────────
// 色変更のスピード
// ────────────────────────────────────────────────────────────
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
// カメラ初期位置 + 自動回転設定
// ────────────────────────────────────────────────────────────
// (A) カメラ初期位置 [x, y, z]（シーン内単位）。例: [0, 0, 5]
export const CAMERA_INITIAL_POSITION = [-15, 8, 10];
// (B) 自動回転を有効にするか（true/false）
export const CAMERA_AUTO_ROTATE_ENABLED = true;
// (C) １周にかかる秒数。autoRotate を有効にするときのみ意味を持ちます。
//     例えば 10 を指定すると、「10秒でカメラが360°回る」設定になります。
export const CAMERA_AUTO_ROTATE_PERIOD = 200;

// ────────────────────────────────────────────────────
// 床面テクスチャ用設定（追加分）
// ────────────────────────────────────────────────────

// 床画像を何％ (0.0〜1.0) の不透明度で貼り付けるか
// 例: 0.5 なら 50% の不透明度（半透明）
export const GROUND_TEXTURE_OPACITY = 0.1;

// ────────────────────────────────────────────────────
// Projection Sphere（ステレオ投影球）用設定
// ────────────────────────────────────────────────────

// (A) 投影球を構成するドットのサイズ（PointsMaterial.size）
export const PROJ_SPHERE_POINT_SIZE = 0.05;

// ───────────────────────────────────────────────────
// Earth Grid（地球グリッド）用設定
// ───────────────────────────────────────────────────

// (A) 緯度ライン (度単位) の配列。たとえば [-60, -30, 0, 30, 60]
export const EARTH_GRID_LAT_LINES = [-60, -30, 0, 30, 60];

// (B) 経度ライン (度単位) の配列。たとえば [0,30,60,…,330]
export const EARTH_GRID_LON_LINES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

// (C) 各ラインあたりのサンプル点数 (>=2)。増やすほど「点」が細かく、網目がなめらかになります。
//     たとえば 100 にすると緯度線１本を100 点で描画します。
export const EARTH_GRID_SAMPLES_PER_LINE = 100;

// (D) 地球グリッド点の色 (Hex か THREE.Color 互換)。ここでは薄い青系に。
export const EARTH_GRID_COLOR = 0x51077c;

// (E) 地球グリッド点のサイズ (PointsMaterial の size)。小さいほど細かい点に。
export const EARTH_GRID_POINT_SIZE = 0.02;

// ───────────────────────────────────────────────────
// (F) 地球グリッドの半径（シーン内単位）
//     例：半径が 2 なら直径は 4
// ───────────────────────────────────────────────────
export const EARTH_GRID_RADIUS = 1.0;

// ────────────────────────────────────────────────────────────
// 床グリッド (GridHelper) の設定
// ────────────────────────────────────────────────────────────

// グリッド全体の幅（シーン単位）
// export const GRID_SIZE = 0;
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
// export const AXES_SIZE = 0;
export const AXES_SIZE = 1.5;