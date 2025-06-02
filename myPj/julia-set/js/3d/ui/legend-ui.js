// js/3d/ui/legend-ui.js

import { LEGEND_DEFAULT }         from '../d3-config.js';
import { drawLegend, hideLegend } from '../../util/legend.js';

const chkLegend = document.getElementById('chk-legend');

if (chkLegend) {
  chkLegend.addEventListener('change', () => {
    if (chkLegend.checked) {
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    } else {
      hideLegend();
    }
  });

  window.addEventListener('resize', () => {
    if (chkLegend.checked) {
      drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
    }
  });
}
