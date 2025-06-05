// js/modules/quantStereo/qt-config.js

// — 点群サンプリング解像度 — 
export const RES_THETA = 160;
export const RES_PHI   = 160;

// — UI の各要素 ID — 
export const UI_DOM_IDS = {
  BTN_TOP:   'btn-top-view',
  VAL_ALPHA: 'val-alpha',
  VAL_BETA:  'val-beta',
  VAL_GAMMA: 'val-gamma',
  VAL_DELTA: 'val-delta'
};

// path
export const YIN_YANG_SYMBOL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Yin_and_Yang_symbol.svg/1920px-Yin_and_Yang_symbol.svg.png'
// export const YIN_YANG_SYMBOL = '/myPj/qt-st-visual/assets/onmyo.png'

// — 色変更サイクル関連 — 
export const FULL_CYCLE    = 4 * Math.PI;  // 720° = 4π
export const HALF_CYCLE    = 2 * Math.PI;  // 360° = 2π
export const ROTATION_SPEED = Math.PI / 2;  // 90°/秒 = π/2 rad/sec

// — カメラ初期位置・自動回転設定 — 
export const CAMERA_INITIAL_POSITION   = [-15, 8, 10];
export const CAMERA_AUTO_ROTATE_ENABLED = true;
export const CAMERA_AUTO_ROTATE_PERIOD  = 200; // 360°にかかる秒数

// — カメラ振動（上下往復）設定 — 
//  Math.PI    → 180°往復 (真上 ⇔ 真下)
//  Math.PI/2  →  90°往復 (真上 ⇔ 水平面)
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

// — Projection Sphere（ステレオ投影球）設定 — 
export const PROJ_SPHERE_POINT_SIZE = 0.05;

// — Earth Grid（地球グリッド）設定 — 
export const EARTH_GRID_LAT_LINES        = [-60, -30, 0, 30, 60];
export const EARTH_GRID_LON_LINES        = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
export const EARTH_GRID_SAMPLES_PER_LINE = 100;
export const EARTH_GRID_COLOR            = 0x51077c;
export const EARTH_GRID_POINT_SIZE       = 0.02;
export const EARTH_GRID_RADIUS           = 1.0;

// — 床グリッド設定 — 
export const GRID_SIZE        = 10;
export const GRID_DIVISIONS   = 10;
export const GRID_COLOR_CENTERLINE = 0x444444;
export const GRID_COLOR       = 0x888888;

// — 床テクスチャ設定 — 
export const GROUND_TEXTURE_OPACITY = 0.05;

// — 軸ヘルパー設定 — 
export const AXES_SIZE = 1.5;
