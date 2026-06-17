import * as THREE from "three";

/** Even points on a unit sphere via the Fibonacci spiral. */
export function fibonacciSphere(i: number, n: number): THREE.Vector3 {
  const y = 1 - (i / (n - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = i * 2.399963229728653; // golden angle
  return new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r);
}
