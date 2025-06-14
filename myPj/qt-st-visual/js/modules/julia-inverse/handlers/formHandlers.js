// modules/julia-inverse/ui/handlers/formHandlers.js

import { toggleLegend } from '../ui/d3-legend-sub.js';

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
      handler:  e => { e.preventDefault(); onReset(); }
    },
    {
      // 数値入力が変わったらリセット
      selector: '#input-re, #input-im, #input-n, #input-iter',
      type:     'change',
      handler:  () => onReset()
    },
    {
      // 凡例トグル
      selector: '#chk-legend',
      type:     'change',
      handler:  () => { toggleLegend(); onReset(); }
    },
    {
      // 「設定完了」ボタン
      selector: '#config-complete-btn',
      type:     'click',
      handler:  () => onReset()
    }
  ];
}
