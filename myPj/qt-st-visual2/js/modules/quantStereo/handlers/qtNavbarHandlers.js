// js/core/handlers/navbarHandlers.js

import { startAnimation, pauseAnimation, resumeAnimation, stopAnimation } from '../qt-animation.js';
import { resetModule }   from '../qt-main.js';
import { BG_COLOR_DARK } from '../qt-config.js';
import * as THREE        from 'three';

/**
 * UIControlsModule インスタンスを受け取り、
 * #navbar 配下のハンドラ配列を返します。
 * @param {import('../UIControlsModule.js').UIControlsModule} ctx
 */
export function getNavbarHandlers(ctx) {
  return [
    {
      selector: '#btn-run',
      type: 'click',
      handler: () => {
        const btnRun   = document.getElementById('btn-run');
        const btnPause = document.getElementById('btn-pause');
        if (btnRun && btnPause) {
          btnRun.classList.add('d-none');
          btnPause.classList.remove('d-none');
        }
        if (!ctx._hasStarted) {
          startAnimation(ctx.scene, ctx.camera, ctx.controls);
          ctx._hasStarted = true;
        } else {
          resumeAnimation(ctx.scene, ctx.camera, ctx.controls);
        }
      }
    },
    {
      selector: '#btn-pause',
      type: 'click',
      handler: () => {
        const btnRun   = document.getElementById('btn-run');
        const btnPause = document.getElementById('btn-pause');
        if (btnRun && btnPause) {
          btnPause.classList.add('d-none');
          btnRun.classList.remove('d-none');
        }
        pauseAnimation();
      }
    },
    {
      selector: '#btn-reset',
      type: 'click',
      handler: () => {
        const btnRun   = document.getElementById('btn-run');
        const btnPause = document.getElementById('btn-pause');
        if (btnRun && btnPause) {
          btnRun.classList.add('d-none');
          btnPause.classList.remove('d-none');
        }
        // モジュール単位で再初期化
        resetModule({
          scene:    ctx.scene,
          camera:   ctx.camera,
          renderer: ctx.renderer,
          controls: ctx.controls
        });

        // 再度アニメーション開始
        startAnimation(ctx.scene, ctx.camera, ctx.controls);
        ctx._hasStarted = true;
      }
    }
  ];
}
