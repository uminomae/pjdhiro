// js/core/handlers/cameraHandlers.js
import { setEnableVertical } from '../qt-animation-loop.js';

export function getCameraHandlers(controls) {
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
        setEnableVertical(e.target.checked);
      }
    }
  ];
}
