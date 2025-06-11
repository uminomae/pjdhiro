// js/core/handlers/topViewHandlers.js
import { UI_DOM_IDS }     from '../qt-config.js';

export function getTopViewHandlers(camera, controls) {
  return [{
    // selector: '#btn-top-view',
    selector: `#${UI_DOM_IDS.BTN_TOP}`,
    type: 'click',
    handler: () => {
    camera.position.set(0,5,0);
    camera.up.set(0,0,-1);
    camera.lookAt(0,0,0);
    controls.update();
    }
  }];
}
