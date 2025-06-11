// js/core/handlers/cameraHandlers.js

export function getCameraHandlers({ controls, animController }) {
  return [
    {
      selector: '#toggle-camera-horizontal',
      type: 'change',
      handler: e => {
        controls.enableRotate = true;
        controls.autoRotate   = e.target.checked;
      }
    },
    {
      selector: '#toggle-camera-vertical',
      type: 'change',
      handler: e => {
        animController.setEnableVertical(e.target.checked);
      }
    }
  ];
}
