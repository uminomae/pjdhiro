// modules/julia-inverse/ui/handlers/getRunHandlers.js

import { Complex }                    from '../util/complex-number.js';
import { DRAW_PARAMS }                from '../d3-config.js';
import { resetModule }                from '../julia-main.js';

export function getRunHandlers(loopCtrl) {
  return [
    {
      selector: '#btn-run',
      type: 'click',
      handler: async () => {
        const btnRun    = document.getElementById('btn-run');
        const btnPause  = document.getElementById('btn-pause');

        // ① Run は隠して、Pause を表示
        btnRun.classList.add('d-none');
        btnPause.classList.remove('d-none');

        // ② 既存アニメーションをキャンセルして、新規に実行
        loopCtrl.cancel();
        const reVal   = parseFloat(document.getElementById('input-re').value);
        const imVal   = parseFloat(document.getElementById('input-im').value);
        const c       = new Complex(reVal, imVal);
        const N       = parseInt(document.getElementById('input-n').value, 10);
        const maxIter = parseInt(document.getElementById('input-iter').value, 10);

        await loopCtrl.runInverseAnimation(c, N, maxIter, DRAW_PARAMS.interval);

        // ③ アニメーション完了時は、元に戻す
        btnPause.classList.add('d-none');
        btnRun.classList.remove('d-none');
      }
    },
    {
      selector: '#btn-pause',
      type: 'click',
      handler: () => {
        const btnPause  = document.getElementById('btn-pause');
        const btnResume = document.getElementById('btn-resume');

        loopCtrl.pause();
        btnPause.classList.add('d-none');
        btnResume.classList.remove('d-none');
      }
    },
    {
      selector: '#btn-resume',
      type: 'click',
      handler: () => {
        const btnPause  = document.getElementById('btn-pause');
        const btnResume = document.getElementById('btn-resume');

        loopCtrl.resume();
        btnResume.classList.add('d-none');
        btnPause.classList.remove('d-none');
      }
    },
    {
      selector: '#btn-reset',
      type: 'click',
      handler: () => {
        const btnRun    = document.getElementById('btn-run');
        const btnPause  = document.getElementById('btn-pause');
        const btnResume = document.getElementById('btn-resume');

        resetModule();
        // リセット時は初期状態に戻す
        btnRun.classList.remove('d-none');
        btnPause.classList.add('d-none');
        btnResume.classList.add('d-none');
      }
    }
  ];
}
