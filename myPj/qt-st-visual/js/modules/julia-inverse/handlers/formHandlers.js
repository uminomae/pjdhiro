// modules/julia-inverse/ui/handlers/formHandlers.js

import { toggleLegend } from '../ui/d3-legend-sub.js';
import { resetModule }  from '../julia-main.js';

/**
 * Offcanvas 内フォームのハンドラ一覧を返す
 * @param {Function} onReset - reset() コールバック
 */
export function getFormHandlers(onReset) {
  return [
    {
      selector: '#offcanvasForm form',
      type:     'submit',
      handler:  e => { e.preventDefault(); onReset(); }
    },
    {
      selector: '#input-re, #input-im, #input-n, #input-iter',
      type:     'change',
      handler:  () => onReset()
    },
    {
      selector: '#chk-legend',
      type:     'change',
      handler:  () => { toggleLegend(); onReset(); }
    },
    {
      selector: '#config-complete-btn',
      type:     'click',
      handler:  () => onReset()
    }
  ];
}
