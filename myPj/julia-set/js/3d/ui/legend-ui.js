// js/3d/ui/legend-ui.js

import { LEGEND_DEFAULT } from '../d3-config.js';
import { drawLegend, hideLegend, showLegend } from '../../util/legend.js';

/**
 * Offcanvas 内の <input id="chk-legend"> を使って、
 * 解除 → hideLegend(), ON → showLegend()→drawLegend() を行う。
 * また、ウィンドウリサイズ時にチェックが ON なら再描画を行う。
 *
 * このファイルは「Offcanvas が DOM に挿入された直後」に一度だけ読み込まれることを
 * 想定しており、そのタイミングで document.getElementById('chk-legend') が必ず存在する
 * のを前提としています。
 */
export function initLegendToggle() {
  const chkLegend = document.getElementById('chk-legend');
  if (!chkLegend) {
    console.warn('initLegendToggle: chk-legend が見つかりません');
    return;
  }

  // チェックボックスが変更されたら実行
  chkLegend.addEventListener('change', () => {
    if (chkLegend.checked) {
      // ON → Canvas を一度表示状態にしてから描画
      showLegend();
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    } else {
      // OFF → Canvas を非表示
      hideLegend();
    }
  });

  // ウィンドウリサイズ時に、チェックが ON の場合は再描画
  window.addEventListener('resize', () => {
    if (chkLegend.checked) {
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    }
  });
}

// ※ 「イベントデリゲーション」を使いたい場合は、冒頭で
//    document.addEventListener('change', ...) の形に変更すれば
//    実質どんなタイミングでも動作します。
//    ただし現状は「Offcanvas が挿入された直後にこのファイルが読み込まれる」
 //   ことを前提にしているため、直接 getElementById() で OK にしています。
