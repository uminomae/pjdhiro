// js/drawArcs.js
export function drawArc(ctx, arc, cx, cy, scale, color, lineWidth = 1) {
	const pts = arc.samplePoints();
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	for (let i = 0; i < pts.length; i++) {
	  const { x, y } = pts[i].toCanvasCoord(cx, cy, scale);
	  if (i === 0) {
		ctx.moveTo(x, y);
	  } else {
		ctx.lineTo(x, y);
	  }
	}
	ctx.stroke();
  }
  