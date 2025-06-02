// js/controller/button-controller.js

// Three.js 関連ロジックは d3-app.js がすでに読み込まれている前提です。
// ここでは、画面上のボタン要素を取得してイベント登録だけ行います。

const btnRun   = document.getElementById('btn-run');
const btnPause = document.getElementById('btn-pause');
const btnStop  = document.getElementById('btn-stop');
const status   = document.getElementById('status');

// d3-app.js で定義されているグローバル関数 runInverseAnimation などを呼び出す
// （d3-app.js を先に読み込む必要があるので、index.html の <script> の順序に注意）

if (btnRun) {
  btnRun.addEventListener('click', async () => {
    // d3-app.js 側で window.isRunning などを制御している
    // d3-app.js の btnRun イベントと重複しないよう、このファイルではあくまで HTML のボタン表示／非表示を切り替えるだけにする

    if (!window.isRunning) {
      // モジュール側で定義している runInverseAnimation を呼び出す
      const inputRe   = document.getElementById('input-re');
      const inputIm   = document.getElementById('input-im');
      const inputN    = document.getElementById('input-n');
      const inputIter = document.getElementById('input-iter');

      const cre     = parseFloat(inputRe.value);
      const cim     = parseFloat(inputIm.value);
      const c       = new window.Complex(cre, cim);  // d3-app.js で Complex をグローバル公開していれば可
      const N       = parseInt(inputN.value, 10);
      const maxIter = parseInt(inputIter.value, 10);

      window.isRunning = true;
      window.isPaused  = false;
      window.isStopped = false;

      btnRun.classList.add('d-none');
      btnPause.classList.remove('d-none');
      status.textContent = '(実行中…)';

      try {
        const { minZ, maxZ, totalPoints } = await window.runInverseAnimation(c, N, maxIter, 800);
        window.isRunning = false;

        btnPause.classList.add('d-none');
        btnPause.textContent = 'Pause';
        btnRun.textContent   = 'Run';
        btnRun.classList.remove('d-none');
        status.textContent = `(完了: N=${N}, maxIter=${maxIter}, 点数=${totalPoints})`;

        // 凡例再描画
        window.drawLegend(minZ, maxZ);
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
      status.textContent   = '(実行中…)';
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
      status.textContent   = '(実行中…)';
    }
  });
}

if (btnStop) {
  btnStop.addEventListener('click', () => {
    window.isStopped = true;
    window.isPaused  = false;
    window.isRunning = false;

    // Three.js のシーン上のポイント群をクリア
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

    // 凡例だけ初期状態に戻す
    window.drawLegend(0, 2);

    // フォーム項目を初期値に戻す（HTML 側のデフォルト値に合わせる）
    document.getElementById('input-re').value   = '-0.4';
    document.getElementById('input-im').value   = '0.6';
    document.getElementById('input-n').value    = '90';
    document.getElementById('input-iter').value = '12';
  });
}
