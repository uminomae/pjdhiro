// js/modules/quantStereo/qt-controls.js
import {
	CAMERA_AUTO_ROTATE_ENABLED,
	CAMERA_AUTO_ROTATE_PERIOD,
	CAMERA_POLAR_ANGLE,
	CAMERA_AZIMUTH_ANGLE
  } from './qt-config.js';
  
  // 垂直往復トグル用の関数を import
  import { setEnableVertical } from './qt-animation-loop.js';
  
  /**
   * initializeControls(controls)
   * ──────────────────────────────────────────────────────────
   * ・OrbitControls の自動回転 on/off/速度設定
   * ・Polar／Azimuth の回転制限
   * ・水平回転チェックボックス (toggle-camera-horizontal) の change イベント登録
   * ・垂直往復チェックボックス (toggle-camera-vertical) の change イベント登録
   */
  export function initializeControls(controls) {
	// 「水平回転」チェックボックスを先に取得
	const elHoriz = document.getElementById('toggle-camera-horizontal');
	if (elHoriz instanceof HTMLInputElement) {
	  controls.autoRotate = elHoriz.checked && CAMERA_AUTO_ROTATE_ENABLED;
	} else {
	  // チェックボックスが存在しなければ、手動回転だけ有効化
	  controls.enableRotate = true;
	}
  
	// 自動回転 on/off と速度設定
	if (CAMERA_AUTO_ROTATE_ENABLED && controls.enableRotate) {
	  controls.autoRotate      = true;
	  controls.autoRotateSpeed = 360 / CAMERA_AUTO_ROTATE_PERIOD;
	} else {
	  controls.autoRotate = false;
	}
  
	// 極角（PolarAngle） / 方位角（AzimuthAngle）の制限
	controls.minPolarAngle   = CAMERA_POLAR_ANGLE.MIN;
	controls.maxPolarAngle   = CAMERA_POLAR_ANGLE.MAX;
	controls.minAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MIN;
	controls.maxAzimuthAngle = CAMERA_AZIMUTH_ANGLE.MAX;
  
	// 「水平回転」チェックボックスの change イベント登録
	if (elHoriz instanceof HTMLInputElement) {
	  elHoriz.addEventListener('change', () => {
		controls.enableRotate = true;
		controls.autoRotate   = elHoriz.checked && CAMERA_AUTO_ROTATE_ENABLED;
	  });
	}
  
	// 「垂直往復」チェックボックスの取得 & イベント登録
	const elVert = document.getElementById('toggle-camera-vertical');
	if (elVert instanceof HTMLInputElement) {
	  // 初期状態を垂直往復フラグに反映
	  setEnableVertical(elVert.checked);
	  elVert.addEventListener('change', () => {
		setEnableVertical(elVert.checked);
	  });
	}
  }
  