// js/modules/quantStereo/qt-config.js

// — 点群サンプリング解像度 — 
export const RES_THETA = 160;
export const RES_PHI   = 160;
// export const RES_THETA = 320;
// export const RES_PHI   = 320;

// — UI の各要素 ID — 
export const UI_DOM_IDS = {
  BTN_TOP:   'btn-top-view',
  VAL_ALPHA: 'val-alpha',
  VAL_BETA:  'val-beta',
  VAL_GAMMA: 'val-gamma',
  VAL_DELTA: 'val-delta'
};

// — 外部画像パス — 
export const YIN_YANG_SYMBOL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Yin_and_Yang_symbol.svg/1920px-Yin_and_Yang_symbol.svg.png';

// — 色変更サイクル関連 — 
export const FULL_CYCLE     = 4 * Math.PI;  // 720° = 4π
export const HALF_CYCLE     = 2 * Math.PI;  // 360° = 2π
// export const ROTATION_SPEED = Math.PI * 2;  // 90°/秒 = π/2 rad/sec
export const ROTATION_SPEED = Math.PI / 2;  // 90°/秒 = π/2 rad/sec

// 床テクスチャをデフォルトでどのくらいの速さで回すか（1 秒で何ラジアン回すかなど）。
// たとえば 0.2 にすると「1 秒間で約0.2ラジアンずつ回転」する（実際の角度 = elapsed * 0.2）。
export const TEXTURE_DEFAULT_SPEED = 1;

// ———————————————
// カメラ回転制御フラグ
// ———————————————

// 水平方向（OrbitControls の回転）を有効にする／無効にする
export const CAMERA_ENABLE_HORIZONTAL = true;
// — カメラ初期設定 — 
export const CAMERA_INITIAL_POSITION    = [-15, 8, 10];
export const CAMERA_AUTO_ROTATE_ENABLED = true;
export const CAMERA_AUTO_ROTATE_PERIOD  = 200; // 360°にかかる秒数
// — カメラ上下往復（Oscillation）設定 — 
//   Math.PI    → 180°往復 (真上 ⇔ 真下)
//   Math.PI/2  →  90°往復 (真上 ⇔ 水平面)
export const CAMERA_OSCILLATION_RANGE   = Math.PI / 2;
export const CAMERA_OSCILLATION_ENABLED = true;
export const CAMERA_OSCILLATION_SPEED   = 0.5; // rad/sec

// — OrbitControls 角度制限 — 
export const CAMERA_POLAR_ANGLE = {
  MIN: 0,
  MAX: CAMERA_OSCILLATION_RANGE
};
export const CAMERA_AZIMUTH_ANGLE = {
  MIN: -Infinity,
  MAX:  Infinity
};

// — 背景色補間設定 — 
export const BG_COLOR_DARK    = '#000011';
export const BG_COLOR_LIGHT   = '#ffffff';
//   暗→明 の補間に使う指数（Math.pow の底）
//   たとえば 8 にすると「暗い時間を伸ばし、最後で一気に明るく」
export const BG_EXPONENT_RISE = 8;
//   明→暗 の補間に使う指数（Math.pow の底）
//   たとえば 1 にすると線形補間（変化が早い）、0.5 にすると前半で一気に暗くなる
export const BG_EXPONENT_FALL = 1;

// — 投影球（ステレオ投影球）色設定 — 
export const SPHERE_BASE_COLOR = '#ffffff';
export const SPHERE_MID_COLOR  = '#808080';
export const SPHERE_END_COLOR  = '#000000';

// — Projection Sphere（ステレオ投影球）サイズ — 
export const PROJ_SPHERE_POINT_SIZE = 0.05;

// — Earth Grid（地球グリッド）設定 — 
export const EARTH_GRID_LAT_LINES        = [-60, -30, 0, 30, 60];
export const EARTH_GRID_LON_LINES        = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
export const EARTH_GRID_SAMPLES_PER_LINE = 100;
export const EARTH_GRID_COLOR            = 0x51077c;
export const EARTH_GRID_POINT_SIZE       = 0.02;
export const EARTH_GRID_RADIUS           = 1.0;

// — 床グリッド設定 — 
export const GRID_SIZE           = 10;
export const GRID_DIVISIONS      = 10;
export const GRID_COLOR_CENTERLINE = 0x444444;
export const GRID_COLOR          = 0x888888;

// — 床テクスチャ設定 — 
export const GROUND_TEXTURE_OPACITY = 0.05;

// — 軸ヘルパー設定 — 
export const AXES_SIZE = 6;

// — カメラの注視点（lookAt で使う座標） — 
//   [x, y, z]の配列で指定。今は原点を見せたいので [0, 0, 0] に設定。
export const CAMERA_TARGET = [0, 0, 0];