// js/3d/d3-config.js

/**
 * ====================================================
 * 1) フォーム初期値 (FORM_DEFAULTS)
 *    ・入力フォームのデフォルト値をまとめる
 * ====================================================
 */
export const FORM_DEFAULTS = {
	re:      -0.4,  // Re(c) の初期値
	im:       0.6,  // Im(c) の初期値
	N:       45,    // ポイント数の初期値
	maxIter:  8     // 最大世代数の初期値
  };
  
  /**
   * ====================================================
   * 2) 描画パラメータ (DRAW_PARAMS)
   *    ・点サイズ、補間ステップ数、世代間インターバルなど
   * ====================================================
   */
  export const DRAW_PARAMS = {
	pointSize: 0.02,  // 各ステップで使う Three.Points のサイズ
	steps:     30,    // 補間アニメーション時の分割数
	interval:  800    // 世代間インターバル (ms)
  };
  
  /**
   * ====================================================
   * 3) カメラ/シーン初期設定 (CAMERA_PARAMS, SCENE_PARAMS)
   *    ・Three.js のシーンやカメラ、グリッドなどのパラメータ
   * ====================================================
   */
  export const CAMERA_PARAMS = {
	position: { x: -3, y: -7, z: 7 },
	up:       { x: 0, y: 0, z: 1 },
	lookAt:   { x: 0, y: 0, z: 0 },
	fov:      45,
	near:     0.1,
	far:      1000
  };
  
  export const SCENE_PARAMS = {
	backgroundColor: 0x111111,
	axesSize:        3,
	gridSize:        4,
	gridDivisions:   20,
	gridColorMajor:  0x333333,
	gridColorMinor:  0x222222,
	gridRotationX:   Math.PI / 2,    // グリッドの X 軸回転角度
	containerId:     'canvas-container' // Canvas を埋め込む要素の ID
  };
  
  /**
   * ====================================================
   * 4) ステージ名・オブジェクト名定義 (STAGE_NAMES, OBJECT_NAMES)
   *    ・逆写像アルゴリズムで利用する文字列をまとめる
   * ====================================================
   */
  export const STAGE_NAMES = {
	init:     'init',
	subtract: 'subtract',
	sqrt1:    'sqrt1',
	sqrt2:    'sqrt2',
	recolor:  'recolor'
  };
  
  export const OBJECT_NAMES = {
	// step1: 引き算アニメーション用オブジェクト
	subtractInterp: 'ptsSubtract',
	// step1: diff 最終描画用
	diffFinal:      'ptsDiffFinal',
	// step2: 白く描画する際につける一時的名称
	diffWhite2:     'ptsDiffWhite2',
	// step2: 第一解（黄色）アニメーション
	yellow:         'ptsYellow',
	// step2: 第一解 最終描画
	yellowFinal:    'ptsYellowFinal',
	// step3: 第一解を保持する際も同じ名称
	yellowKeep:     'ptsYellowFinal',
	// step3: 白く描画する際につける一時的名称
	diffKeep:       'ptsDiffKeep',
	// step3: 第二解（ピンク）アニメーション
	pink:           'ptsPink',
	// リカラー（次世代の白点）最終描画
	whiteFinal:     'ptsWhiteFinal'
  };
  
  /**
   * ====================================================
   * 5) エラーメッセージ定義 (ERROR_MESSAGES)
   *    ・逆写像アニメーションが停止されたときのメッセージなど
   * ====================================================
   */
  export const ERROR_MESSAGES = {
	stopped: 'Stopped',  // ユーザーが「Stop」した場合の例外メッセージ
	invalidC: 'Invalid complex number', // 例：Complex の引数が不正
	renderFail: 'Rendering failed',     // 例：Three.js レンダリング中のエラー
  };
  
  /**
   * ====================================================
   * 6) 凡例表示デフォルト (LEGEND_DEFAULT)
   *    ・Z 値スケールの最小/最大値
   * ====================================================
   */
  export const LEGEND_DEFAULT = {
	minZ: 0,
	maxZ: 2
  };
  
// — 床グリッド設定 — 
export const GRID_SIZE           = 10;
export const GRID_DIVISIONS      = 10;
export const GRID_COLOR_CENTERLINE = 0x444444;
export const GRID_COLOR          = 0x888888;

// — 軸ヘルパー設定 — 
export const AXES_SIZE = 6;
// — 床テクスチャ設定 — 
export const GROUND_TEXTURE_OPACITY = 0.05;
export const GROUND_TEXTURE_VISIBLE = true;
export const BG_COLOR_DARK    = '#000011';


// — カメラの注視点（lookAt で使う座標） — 
//   [x, y, z]の配列で指定。今は原点を見せたいので [0, 0, 0] に設定。
export const CAMERA_TARGET = [0, 0, 0];
// — カメラ初期設定 — 
export const CAMERA_INITIAL_POSITION    = [-5, 4, 10];
export const CAMERA_AUTO_ROTATE_ENABLED = true;
export const CAMERA_AUTO_ROTATE_PERIOD  = 200; // 360°にかかる秒数

// — 外部画像パス — 
export const YIN_YANG_SYMBOL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Yin_and_Yang_symbol.svg/1920px-Yin_and_Yang_symbol.svg.png';