// modules/julia-inverse/ui/handlers/canvasHandlers.js

/**
 * Canvas-container 上の 2D view ボタンハンドラ一覧を返す
 * @param {Function} onTopView - 2D view コールバック
 */
export function getCanvasHandlers(onTopView) {
	return [
	  {
		selector: '#btn-top-view',
		type:     'click',
		handler:  () => onTopView()
	  }
	];
  }
  