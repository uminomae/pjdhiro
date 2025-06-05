// js/modules/quantStereo/qt-color-config.js

/**
 * setupColorConfig(scene)
 *
 * Offcanvas 上のカラー入力要素を取得し、
 * 「設定完了」ボタンが押されたときに window._XXX 系のグローバル変数を更新する。
 *
 * @param {HTMLScene} scene  ※scene 自体はここでは直接操作しませんが、必要があれば参照できます
 */
export function setupColorConfig(scene) {
	// Offcanvas の各入力要素を取得
	const inputBgColor     = document.getElementById('input-bg-color');
	const inputSphereColor = document.getElementById('input-sphere-color');
	const inputPeak1Color  = document.getElementById('input-peak1-color');
	const inputPeak2Color  = document.getElementById('input-peak2-color');
	const btnConfigComplete = document.getElementById('config-complete-btn');
  
	if (!inputBgColor || !inputSphereColor || !inputPeak1Color || !inputPeak2Color || !btnConfigComplete) {
	  console.warn('[qt-color-config] Offcanvas のカラー入力要素が見つかりません。ID を確認してください。');
	  return;
	}
  
	// 「設定完了」ボタン押下時に各カラーをグローバルに保存
	btnConfigComplete.addEventListener('click', () => {
	  // 1) 背景色ダーク／ライトを分割して保持
	  //    現状 Offcanvas に「背景色」一つのみなので、暗→白で補間します
	  const bgHex = inputBgColor.value || '#000011';
	  window._bgColorDark  = bgHex;
	  window._bgColorLight = '#ffffff';
  
	  // 2) 球ベース色
	  window._sphereBaseColor = inputSphereColor.value || '#ffffff';
  
	  // 3) ピーク色①・ピーク色②
	  window._peakColor1 = inputPeak1Color.value || '#808080';
	  window._peakColor2 = inputPeak2Color.value || '#000000';
  
	  console.log(
		'[qt-color-config] カラー設定更新: ',
		'_bgColorDark=', window._bgColorDark,
		' _bgColorLight=', window._bgColorLight,
		' _sphereBaseColor=', window._sphereBaseColor,
		' _peakColor1=', window._peakColor1,
		' _peakColor2=', window._peakColor2
	  );
	});
  }
  