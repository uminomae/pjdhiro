/*
 * Helper for syncing form defaults. The current UI module performs
 * this logic internally, so this standalone utility is no longer used.
 */

/*
import { FORM_DEFAULTS, LEGEND_DEFAULT } from './d3-config.js';

export function syncFormDefaults() {
  const setVal = (sel, v) => {
    const el = document.querySelector(sel);
    if (el instanceof HTMLInputElement) el.value = v;
  };
  setVal('#input-re',   FORM_DEFAULTS.re);
  setVal('#input-im',   FORM_DEFAULTS.im);
  setVal('#input-n',    FORM_DEFAULTS.N);
  setVal('#input-iter', FORM_DEFAULTS.maxIter);

  const chk = document.getElementById('chk-legend');
  if (chk instanceof HTMLInputElement) chk.checked = LEGEND_DEFAULT.enabled;
}
*/
