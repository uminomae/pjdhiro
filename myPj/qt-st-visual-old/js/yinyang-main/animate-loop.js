// /js/main/animateLoop.js

/**
 * アニメーションループを開始する
 * @param {object} context  { scene, camera, renderer, controls }
 */
export function startLoop({ scene, camera, renderer, controls }) {
	console.log('[animate-loop] startLoop() を実行');
  
	function animate() {
	  controls.update();
	  renderer.render(scene, camera);
	  requestAnimationFrame(animate);
	}
	animate();
  }
  