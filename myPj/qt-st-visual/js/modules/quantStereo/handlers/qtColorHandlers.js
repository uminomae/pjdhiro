// js/core/handlers/colorHandlers.js
export function getColorHandlers(renderer) {
  return [
    {
      selector: '#input-bg-color',
      type: 'input',
      handler: e => {
        const c = e.target.value;
        window._bgColorDark  = c;
        window._bgColorLight = c;
        renderer.setClearColor(c);
      }
    },
    {
      selector: '#input-sphere-color',
      type: 'input',
      handler: e => {
        window._sphereBaseColor = e.target.value;
      }
    },
    {
      selector: '#input-peak1-color',
      type: 'input',
      handler: e => {
        window._peakColor1 = e.target.value;
      }
    },
    {
      selector: '#input-peak2-color',
      type: 'input',
      handler: e => {
        window._peakColor2 = e.target.value;
      }
    }
  ];
}
