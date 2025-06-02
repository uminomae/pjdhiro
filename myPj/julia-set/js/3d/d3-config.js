// js/3d/d3-config.js

export const FORM_DEFAULTS = {
	re:       -0.4,  // Re(c) の初期値
	im:        0.6,  // Im(c) の初期値
	N:        90,    // ポイント数の初期値
	maxIter:   9     // 最大世代数の初期値
  };
  
  // runInverseAnimation 等で使う「点サイズ」「補間ステップ数」「インターバル時間」
  export const DRAW_PARAMS = {
	pointSize: 0.02,  // 各ステップで使う Three.Points のサイズ
	steps:     30,    // 補間アニメーション時の分割数
	interval:  800    // 世代間インターバル (ms)
  };
  
  // Three.js カメラ初期位置・背景色・軸サイズなど
  export const CAMERA_PARAMS = {
	position: { x: -3, y: -7, z: 7 },
	up:       { x: 0, y: 0, z: 1 },
	lookAt:   { x: 0, y: 0, z: 0 },
	fov:      45,
	near:     0.1,
	far:      1000
  };
  
  // 背景色やグリッドサイズ
  export const SCENE_PARAMS = {
	backgroundColor: 0x111111,
	axesSize:        3,
	gridSize:        4,
	gridDivisions:   20,
	gridColorMajor:  0x333333,
	gridColorMinor:  0x222222
  };
  
  export const LEGEND_DEFAULT = {
	minZ: 0,
	maxZ: 2
  };