// js/3d/d3-config.js

export const FORM_DEFAULTS = {
	re:      -0.4,
	im:       0.6,
	N:       90,
	maxIter:  9
  };
  
  export const DRAW_PARAMS = {
	pointSize: 0.02,
	steps:     30,
	interval:  800
  };
  
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
	// ─── ここから追加 ───
	gridRotationX:   Math.PI / 2,    // グリッドの X 軸回転角度
	containerId:     'canvas-container', // Canvas を埋め込む要素の ID
	defaultStageInit:    'init',     // 初期世代ステージ名
	defaultStageRecolor: 'recolor',  // 再描画ステージ名
	errorStopped:        'Stopped'   // runInverseAnimation 中断時のエラー文字列
	// ─── ここまで追加 ───
  };
  
  export const LEGEND_DEFAULT = {
	minZ: 0,
	maxZ: 2
  };
  