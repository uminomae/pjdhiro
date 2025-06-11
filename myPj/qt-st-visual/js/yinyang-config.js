// js/yinyang-config.js

/**
 * 共通設定ファイル
 *  - IDやURL、モジュールパスなどの Magic Number / リテラルをまとめる
 */

export const DEFAULT_ALG = 'qt-st';   // デフォルトのアルゴリズムキー

/**
 * アルゴリズムキー → モジュールパス のマッピング
 * （loadAlgModule() で使います）
 */
export const ALG_MODULE_PATHS = {
  'qt-st': '../modules/quantStereo/qt-main.js',
  'julia-inverse': '../modules/julia-inverse/julia-main.js'
};

/**
 * URLクエリ「alg」に対応しないキーが来たときに使うデフォルトパス
 */
export const ALG_FALLBACK_PATH = ALG_MODULE_PATHS[DEFAULT_ALG];

/**
 * threeInit.js で使う設定
 */
export const THREE_INIT = {
  CANVAS_CONTAINER_ID: 'canvas-container',
  LEGEND_CANVAS_ID:    'legend-canvas'   // 今回は使っていませんが一応定義
};

/**
 * qt-st-load-partials.js で使う partial ファイルのパス
 *  ※algキーに応じた切り替えもここにまとめておく
 */
export const PARTIALS_PATHS = {
  navbar: {
    'qt-st': './partials/qt-navbar.html',
    'julia-inverse': './partials/d3-julia-navbar.html'
  },
  offcanvas: {
    'qt-st': './partials/qt-offcanvas.html',
    'julia-inverse': './partials/d3-julia-offcanvas.html'
  },
  main: {
    'qt-st': './partials/qt-main.html',
    'julia-inverse': './partials/d3-julia-main.html'
  },
  canvasContainer: {
    'qt-st': './partials/qt-canvas-container.html',
    'julia-inverse': './partials/d3-julia-canvas-container.html'
  }
};

/**
 * UI 周りの DOM ID（必要な要素が増えたらここに追加する）
 */
export const UI_DOM_IDS = {
  SLIDER_I:   'input-i-scale',
  LABEL_I:    'label-i-scale',
  SLIDER_K:   'input-k-scale',
  LABEL_K:    'label-k-scale',
  BTN_NEXT_Q: 'btn-next-q',
  BTN_TOP:    'btn-top-view',
  VAL_ALPHA:  'val-alpha',
  VAL_BETA:   'val-beta',
  VAL_GAMMA:  'val-gamma',
  VAL_DELTA:  'val-delta'
};

/**
 * 点群生成時に使う分割数などのパラメータ
 */
export const POINTCLOUD_PARAMS = {
  RES_THETA: 40,
  RES_PHI:   40,
  PROJECTION: 'north'
};
