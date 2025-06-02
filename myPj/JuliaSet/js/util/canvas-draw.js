/**
 * HTML5 Canvas のコンテキストに点（Dots）を描画するユーティリティ群
 */

// (1) 始点から一気に複数の点をかたまりで描く場合
export function drawPoints(ctx, points, color = 'black', diameter = 3) {
	ctx.fillStyle = color;
	const r = diameter / 2;
	for (const pt of points) {
	  // pt は { x: Number, y: Number } の形を想定
	  ctx.beginPath();
	  ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2, false);
	  ctx.fill();
	}
  }
  
  // (2) 単一の点を描く
  export function drawPoint(ctx, pt, color = 'black', diameter = 3) {
	ctx.fillStyle = color;
	const r = diameter / 2;
	ctx.beginPath();
	ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2, false);
	ctx.fill();
  }
  
  // (3) Canvas のクリア
  export function clearCanvas(ctx, width, height) {
	ctx.clearRect(0, 0, width, height);
  }
  