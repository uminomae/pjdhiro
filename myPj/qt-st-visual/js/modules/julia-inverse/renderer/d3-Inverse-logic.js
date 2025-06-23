/*
 * Deprecated helper functions for inverse generation.
 * These utilities are no longer referenced in the current codebase
 * but are preserved here as a reference.  The implementation is
 * completely commented out.
 */

/*
import { Complex } from '../util/complex-number.js';

export function computeInverseGeneration(wPoints, c) {
  const nextGen = [];
  for (const w of wPoints) {
    const diff = w.sub(c);
    const r    = diff.abs();
    let phi    = Math.atan2(diff.im, diff.re);
    if (phi < 0) phi += 2 * Math.PI;

    const sqrtR = Math.sqrt(r);
    const phi0  = phi / 2;
    const phi1  = phi / 2 + Math.PI;

    const z0 = new Complex(
      sqrtR * Math.cos(phi0),
      sqrtR * Math.sin(phi0)
    );
    const z1 = new Complex(
      sqrtR * Math.cos(phi1),
      sqrtR * Math.sin(phi1)
    );
    nextGen.push(z0, z1);
  }
  return nextGen;
}
*/
