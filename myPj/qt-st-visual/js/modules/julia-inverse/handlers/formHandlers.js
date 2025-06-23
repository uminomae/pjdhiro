// modules/julia-inverse/ui/handlers/formHandlers.js

import { toggleLegend } from '../ui/d3-legend-sub.js';
import { FORM_DEFAULTS, DRAW_PARAMS } from '../d3-config.js';

/**
 * Offcanvas フォーム内の各要素に紐づくハンドラを返す
 * @param {Function} onReset - 描画リセットを呼ぶコールバック
 */
export function getFormHandlers(onReset) {
  return [
    {
      // <form> 自身の submit
      selector: 'form',
      type:     'submit',
      handler:  e => {
        e.preventDefault();
        updateDefaults();
        onReset();
      }
    },
    {
      // 凡例トグル
      selector: '#chk-legend',
      type:     'change',
      handler:  () => { toggleLegend(); onReset(); }

    },
    {
      // interval speed input
      selector: '#input-interval',
      type:     'change',
      handler:  e => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v > 0) {
          DRAW_PARAMS.interval = v;
        } else {
          e.target.value = String(DRAW_PARAMS.interval);
        }
      }

    },
    {
      // 設定完了ボタン
      selector: '#config-complete-btn',
      type:     'click',
      handler:  () => {
        updateDefaults();
        onReset();
      }

    }
  ];
}

function updateDefaults() {
  const getNumber = (id, parse) => {
    const el = document.getElementById(id);
    if (!(el instanceof HTMLInputElement)) return null;
    const v = parse(el.value);
    return isNaN(v) ? null : v;
  };
  const re   = getNumber('input-re',   parseFloat);
  const im   = getNumber('input-im',   parseFloat);
  const n    = getNumber('input-n',    v => parseInt(v, 10));
  const iter = getNumber('input-iter', v => parseInt(v, 10));
  const interval = getNumber('input-interval', v => parseInt(v, 10));

  if (re   !== null) FORM_DEFAULTS.re      = re;
  if (im   !== null) FORM_DEFAULTS.im      = im;
  if (n    !== null) FORM_DEFAULTS.N       = n;
  if (iter !== null) FORM_DEFAULTS.maxIter = iter;
  if (interval !== null) DRAW_PARAMS.interval = interval;
}
