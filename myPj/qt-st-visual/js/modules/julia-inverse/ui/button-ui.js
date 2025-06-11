// js/3d/ui/button-ui.js

import { DRAW_PARAMS, LEGEND_DEFAULT, FORM_DEFAULTS } from '../d3-config.js';
import { Complex }                                  from '../util/complex-number.js';
import { runInverseAnimation }                      from '..d3-renderer.js';
import { drawLegend }                               from './d3-legend-sub.js';
import { switchToTopView } from './legend-ui.js'; // あるいは定義したファイルを参照
import * as THREE from 'three';                  // three.js を参照可能に




(function attach2DViewListener() {
  // 1) まずは即座にボタン要素を探してみる
  const btnTopView = document.getElementById('btn-top-view');

  if (btnTopView) {
    // 見つかった → ここでイベントリスナーをひとつだけ貼る
    console.log('[button-ui] btn-top-view を発見、クリックリスナーを貼ります');
    btnTopView.addEventListener('click', () => {
      console.log('▶ button-ui: 2D view ボタンがクリックされました');
      switchToTopView();
    });
  } else {
    // まだ見つからない → 50ms 後に再試行
    // （offcanvas や partial 挿入が完了していない可能性があるため）
    setTimeout(attach2DViewListener, 50);
  }
})();


// ──────────────────────────────────────────────────────
// （1）グローバルに使う状態・パラメータを定義
// ──────────────────────────────────────────────────────

// 3D 用：現在のフォーム入力値（設定完了ボタンを押したときに更新する）
const AppConfig3D = {
  currentCRe:     FORM_DEFAULTS.re,
  currentCIm:     FORM_DEFAULTS.im,
  currentN:       FORM_DEFAULTS.N,
  currentMaxIter: FORM_DEFAULTS.maxIter,
};

// 進行中／一時停止／停止フラグ
window.isRunning = false; // アニメーション実行中か
window.isPaused  = false; // Pause 中か
window.isStopped = false; // Stop 指示が出たか

// ──────────────────────────────────────────────────────
// （2）「設定完了」ボタンのクリック処理を追加
// ──────────────────────────────────────────────────────

// Offcanvas 内の「設定完了」ボタンを取得
const configCompleteBtn = document.getElementById('config-complete-btn');
if (configCompleteBtn) {
  configCompleteBtn.addEventListener('click', () => {
    // 1) 進行中のアニメーションを止める
    window.isStopped = true;
    window.isPaused  = false;
    window.isRunning = false;

    // 2) シーン（canvas）を真っさらに戻す
    if (window.scene) {
      const toRemove = [];
      window.scene.traverse((obj) => {
        if (obj.isPoints) {
          toRemove.push(obj);
        }
      });
      toRemove.forEach((p) => window.scene.remove(p));
    }

     // WebGLRenderer のバッファもクリアして、真っ白あるいは背景色だけの状態にする
     if (window.renderer) {
       window.renderer.clear();
     }

    // 3) Run／Pause／Stop ボタンの表示・状態をリセット
    const btnRun   = document.getElementById('btn-run');
    const btnPause = document.getElementById('btn-pause');
    const btnStop  = document.getElementById('btn-stop');

    if (btnPause) {
      btnPause.classList.add('d-none');
      btnPause.textContent = 'Pause';
      btnPause.disabled    = false;
    }
    if (btnRun) {
      btnRun.classList.remove('d-none');
      btnRun.textContent = 'Run';
      btnRun.disabled    = false;
    }
    if (btnStop) {
      btnStop.disabled = true;
    }

    // 4) ステータス表示を「(待機中)」に戻す
    const status = document.getElementById('status');
    if (status) {
      status.textContent = '(待機中)';
      status.classList.remove('status-stopped');
    }

    // 5) 凡例を初期状態に戻す
    drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);

    // 6) フォーム入力値を AppConfig3D にコピーしておく
    //    （次回 Run を押したときにここから読み取る）
    const reInput   = document.getElementById('input-re');
    const imInput   = document.getElementById('input-im');
    const nInput    = document.getElementById('input-n');
    const iterInput = document.getElementById('input-iter');

    const newRe   = reInput   ? parseFloat(reInput.value)   : FORM_DEFAULTS.re;
    const newIm   = imInput   ? parseFloat(imInput.value)   : FORM_DEFAULTS.im;
    const newN    = nInput    ? parseInt(nInput.value,  10) : FORM_DEFAULTS.N;
    const newIter = iterInput ? parseInt(iterInput.value, 10) : FORM_DEFAULTS.maxIter;

    AppConfig3D.currentCRe     = isNaN(newRe)   ? FORM_DEFAULTS.re   : newRe;
    AppConfig3D.currentCIm     = isNaN(newIm)   ? FORM_DEFAULTS.im   : newIm;
    AppConfig3D.currentN       = isNaN(newN)    ? FORM_DEFAULTS.N    : newN;
    AppConfig3D.currentMaxIter = isNaN(newIter) ? FORM_DEFAULTS.maxIter : newIter;

    // Offcanvas は data-bs-dismiss="offcanvas" で自動的に閉じる
  });
}


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
      status.classList.remove('status-stopped');

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
        // ここには基本的に来ない（Stop 時は runInverseAnimation が例外を投げずに return するため）
        console.error('[button-ui] Unexpected error in runInverseAnimation:', err);
        window.isRunning = false;
        btnPause.classList.add('d-none');
        btnPause.textContent = 'Pause';
        btnRun.textContent   = 'Run';
        btnRun.classList.remove('d-none');
        status.textContent = '(エラー発生)';
        status.classList.add('status-stopped');
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
    if (window.scene) {
      const toRemove = [];
      window.scene.traverse(obj => {
        if (obj.isPoints) toRemove.push(obj);
      });
      toRemove.forEach(p => window.scene.remove(p));
    }

    btnPause.classList.add('d-none');
    btnPause.textContent = 'Pause';
    btnRun.textContent   = 'Run';
    btnRun.classList.remove('d-none');
    status.textContent = '(停止中)';
    status.classList.add('status-stopped');

    // 凡例を初期状態（config 由来）に戻す
    drawLegend(LEGEND_DEFAULT.minZ, LEGEND_DEFAULT.maxZ);

    // フォームを初期値に戻す
    document.getElementById('input-re').value   = FORM_DEFAULTS.re;
    document.getElementById('input-im').value   = FORM_DEFAULTS.im;
    document.getElementById('input-n').value    = FORM_DEFAULTS.N;
    document.getElementById('input-iter').value = FORM_DEFAULTS.maxIter;
  });
}
