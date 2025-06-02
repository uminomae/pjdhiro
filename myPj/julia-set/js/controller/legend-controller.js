// js/controller/legend-controller.js

import { drawLegend, showLegend, hideLegend } from '../util/legend.js';

// ページロード時に凡例を初期表示
window.addEventListener('DOMContentLoaded', () => {
  showLegend();
  drawLegend(); 
});

// ウィンドウリサイズ時にも再描画
window.addEventListener('resize', () => {
  drawLegend();
});

// 「凡例表示」チェックボックス に連動して表示/非表示
const chkLegend = document.getElementById('chk-legend');
if (chkLegend) {
  chkLegend.addEventListener('change', () => {
    if (chkLegend.checked) {
      showLegend();
      drawLegend();
    } else {
      hideLegend();
    }
  });
}
