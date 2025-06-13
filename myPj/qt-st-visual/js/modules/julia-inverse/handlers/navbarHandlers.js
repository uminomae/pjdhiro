// modules/julia-inverse/ui/handlers/navbarHandlers.js

// import { startLoop, pauseLoop, stopLoop } from '../../d3-renderer.js';
import { initThree, animateLoop } from '../d3-renderer.js';


/**
 * Navbar 上の Run/Pause/Stop ボタンハンドラ一覧を返す
 */
export function getNavbarHandlers() {
  return [
    { selector: '#btn-run',   type: 'click', handler: () => animateLoop() },
    { selector: '#btn-pause', type: 'click', handler: () => pauseLoop() },
    { selector: '#btn-stop',  type: 'click', handler: () => stopLoop() }
  ];
}
