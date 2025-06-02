// js/controller/legend-ui.js

import { LEGEND_DEFAULT } from '../../3d/d3-config.js';
import { drawLegend, hideLegend } from '../../util/legend.js';

const chkLegend = document.getElementById('chk-legend');

if (chkLegend) {
  // ページ読み込み時は d3-ui.js 側で一度表示／非表示を決めているので、ここでは
  // 「チェックが変わった瞬間」に対応する処理だけを登録
  chkLegend.addEventListener('change', () => {
    if (chkLegend.checked) {
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    } else {
      hideLegend();
    }
  });

  // ウィンドウリサイズ時にも凡例を再描画したい場合は次のようにするとよい
  window.addEventListener('resize', () => {
    if (chkLegend.checked) {
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    }
  });
}
