// modules/julia-inverse/ui/handlers/formHandlers.js

import { toggleLegend } from '../ui/d3-legend-sub.js';
import { FORM_DEFAULTS } from '../d3-config.js';

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
        // onReset();
      }
    },
    // {
    //   // 凡例トグル
    //   selector: '#chk-legend',
    //   type:     'change',
    //   handler:  () => { toggleLegend(); onReset(); }

    // },
    {
      // 入力値変更時にデフォルト値を更新
      selector: '#input-re',
      type:     'change',
      handler:  updateDefaults
    },
    {
      selector: '#input-im',
      type:     'change',
      handler:  updateDefaults
    },
    {
      selector: '#input-n',
      type:     'change',
      handler:  updateDefaults
    },
    {
      selector: '#input-iter',
      type:     'change',
      handler:  updateDefaults
    },
    {
      // 設定完了ボタン
      selector: '#config-complete-btn',
      type:     'click',
      handler:  () => {
        updateDefaults();
        onReset();
        const btnRun    = document.getElementById('btn-run');
        const btnPause  = document.getElementById('btn-pause');
        const btnResume = document.getElementById('btn-resume');
        if (btnRun)    btnRun.classList.remove('d-none');
        if (btnPause)  btnPause.classList.add('d-none');
        if (btnResume) btnResume.classList.add('d-none');
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

  if (re   !== null) FORM_DEFAULTS.re      = re;
  if (im   !== null) FORM_DEFAULTS.im      = im;
  if (n    !== null) FORM_DEFAULTS.N       = n;
  if (iter !== null) FORM_DEFAULTS.maxIter = iter;
}
