import { Complex }                    from '../util/complex-number.js';
import { DRAW_PARAMS, FORM_DEFAULTS } from '../d3-config.js';

/**
 * Run/Pause/Resume/Stop ボタンのハンドラ一覧
 * @param {D3RendererModule} rendererModule
 * @param {LoopController}   loopCtrl
 */
export function getRunHandlers(rendererModule, loopCtrl) {
  return [
    {
      selector: '#btn-run',
      type:     'click',
      handler:  async () => {
        const btn = document.getElementById('btn-run');

        // 1) 初回 Run
        if (!rendererModule.isStarted) {
          rendererModule.isStarted = true;
          rendererModule.isPaused  = false;
          btn.textContent = 'Pause';

          // 前の結果をクリア
          rendererModule.dispose();

          // フォームからパラメータ取得
          const re   = parseFloat(document.getElementById('input-re').value);
          const im   = parseFloat(document.getElementById('input-im').value);
          const c    = new Complex(re, im);
          const N    = parseInt(document.getElementById('input-n').value,  10) || FORM_DEFAULTS.N;
          const maxI = parseInt(document.getElementById('input-iter').value, 10) || FORM_DEFAULTS.maxIter;

          // アニメーション実行＆描画ループ開始
          try {
            await rendererModule.runInverseAnimation(c, N, maxI, DRAW_PARAMS.interval);
            loopCtrl.start();
          } catch (err) {
            console.error('[RunHandler] runInverseAnimation error', err);
            rendererModule.isStarted = false;
            btn.textContent = 'Run';
          }
          return;
        }

        // 2) Running → Pause
        if (!rendererModule.isPaused) {
          rendererModule.isPaused = true;
          loopCtrl.stop();
          btn.textContent = 'Resume';
          return;
        }

        // 3) Resumed → Pause 再開
        rendererModule.isPaused = false;
        loopCtrl.start();
        btn.textContent = 'Pause';
      }
    },
    {
      selector: '#btn-stop',
      type:     'click',
      handler:  () => {
        // 完全リセット
        rendererModule.isPaused  = false;
        rendererModule.isStarted = false;
        loopCtrl.stop();
        rendererModule.dispose();
        const btn = document.getElementById('btn-run');
        if (btn) btn.textContent = 'Run';
      }
    }
  ];
}
