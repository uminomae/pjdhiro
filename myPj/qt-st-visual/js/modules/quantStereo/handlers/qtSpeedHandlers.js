// js/core/handlers/speedHandlers.js

export function getSpeedHandlers(animController) {
  return [
    {
      selector: '#speed-input',
      type: 'change',
      handler: e => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v > 0) {
        animController.etSpeedMultiplier(v);
      } else {
        e.target.value = '1';
        animController.setSpeedMultiplier(1);
      }
      }
    },
    {
      selector: '.speed-preset-btn',
      type: 'click',
      handler: e => {
      const btn = e.target.closest('.speed-preset-btn');
      if (!(btn instanceof HTMLElement)) return;
      const v = parseFloat(btn.dataset.speed);
      if (!isNaN(v)) {
        const inp = document.getElementById('speed-input');
        if (inp instanceof HTMLInputElement) inp.value = String(v);
        animController.setSpeedMultiplier(v);
      }
      }
    },
    {
      selector: '#texture-speed-input',
      type: 'change',
      handler: e => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v)) {
        animController.setTextureSpeed(v);
      } else {
        e.target.value = '0';
        animController.setTextureSpeed(v);
      }
      }
    },
    {
      selector: '.texture-preset-btn',
      type: 'click',
      handler: e => {
      const btn = e.target.closest('.texture-preset-btn');
      if (!(btn instanceof HTMLElement)) return;
      const v = parseFloat(btn.dataset.speed);
      if (!isNaN(v)) {
        const inp = document.getElementById('texture-speed-input');
        if (inp instanceof HTMLInputElement) inp.value = String(v);
        animController.setTextureSpeed(v);
      }
      }
    }
  ];
}

