// js/3d/ui/button-ui.js

import { DRAW_PARAMS, LEGEND_DEFAULT, FORM_DEFAULTS } from '../d3-config.js';
import { Complex }                                  from '../../util/complex-number.js';
import { runInverseAnimation }                      from '../d3-renderer.js';
import { drawLegend, hideLegend }                   from '../../util/legend.js';

const btnRun   = document.getElementById('btn-run');
const btnPause = document.getElementById('btn-pause');
const btnStop  = document.getElementById('btn-stop');
const status   = document.getElementById('status');

if (btnRun) {
  btnRun.addEventListener('click', async () => {
    // ── シーン内の既存の点群をすべて削除 ──
    if (window.scene) {
      const toRemove = [];
      window.scene.traverse(obj => {
        if (obj.isPoints) toRemove.push(obj);
      });
      toRemove.forEach(p => window.scene.remove(p));
    }

    // ── 実行中でなければ逆写像アニメーションを開始 ──
    if (!window.isRunning) {
      const cre     = parseFloat(document.getElementById('input-re').value);
      const cim     = parseFloat(document.getElementById('input-im').value);
      const c       = new Complex(cre, cim);
      const N       = parseInt(document.getElementById('input-n').value,  10);
      const maxIter = parseInt(document.getElementById('input-iter').value, 10);

      window.isRunning = true;
      window.isPaused  = false;
      window.isStopped = false;

      btnRun.classList.add('d-none');
      btnPause.classList.remove('d-none');
      status.textContent = '(実行中...)';

      try {
        const { minZ, maxZ, totalPoints } = await runInverseAnimation(
          c,
          N,
          maxIter,
          DRAW_PARAMS.interval
        );
        window.isRunning = false;

        btnPause.classList.add('d-none');
        btnPause.textContent = 'Pause';
        btnRun.textContent   = 'Run';
        btnRun.classList.remove('d-none');
        status.textContent = `(完了: N=${N}, maxIter=${maxIter}, 点数=${totalPoints})`;

        // 凡例を再描画
        drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);
      } catch (err) {
        window.isRunning = false;
        btnPause.classList.add('d-none');
        btnPause.textContent = 'Pause';
        btnRun.textContent   = 'Run';
        btnRun.classList.remove('d-none');
        status.textContent = '(Stopped)';
      }
    } else if (window.isPaused) {
      window.isPaused = false;
      btnPause.textContent = 'Pause';
      status.textContent   = '(実行中...)';
    }
  });
}

if (btnPause) {
  btnPause.addEventListener('click', () => {
    if (!window.isPaused) {
      window.isPaused = true;
      btnPause.textContent = 'Resume';
      status.textContent   = '(Paused)';
    } else {
      window.isPaused = false;
      btnPause.textContent = 'Pause';
      status.textContent   = '(実行中...)';
    }
  });
}

if (btnStop) {
  btnStop.addEventListener('click', () => {
    window.isStopped = true;
    window.isPaused  = false;
    window.isRunning = false;

    // Three.js シーンのすべての点群を削除
    const toRemove = [];
    window.scene.traverse(obj => {
      if (obj.isPoints) toRemove.push(obj);
    });
    toRemove.forEach(p => window.scene.remove(p));

    btnPause.classList.add('d-none');
    btnPause.textContent = 'Pause';
    btnRun.textContent   = 'Run';
    btnRun.classList.remove('d-none');
    status.textContent = '(待機中)';

    // 凡例を初期状態（config 由来）に戻す
    drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);

    // フォームを初期値に戻す
    document.getElementById('input-re').value   = FORM_DEFAULTS.re;
    document.getElementById('input-im').value   = FORM_DEFAULTS.im;
    document.getElementById('input-n').value    = FORM_DEFAULTS.N;
    document.getElementById('input-iter').value = FORM_DEFAULTS.maxIter;
  });
}
