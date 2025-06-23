/*
 * Drawing helpers for HTML Canvas. These utilities were copied from
 * earlier 2D modules and are not currently used by the 3D viewer.
 */

/*
export function drawPoints(ctx, points, color = 'black', diameter = 3) {
        ctx.fillStyle = color;
        const r = diameter / 2;
        for (const pt of points) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2, false);
          ctx.fill();
        }
  }

export function drawPoint(ctx, pt, color = 'black', diameter = 3) {
        ctx.fillStyle = color;
        const r = diameter / 2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2, false);
        ctx.fill();
  }

export function clearCanvas(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
  }
*/
  