export type Camera = {
  x: number;      // world offset X
  y: number;      // world offset Y
  scale: number;  // zoom level
};

/**
 * Convert screen (SVG pixel) coordinates to world coordinates
 */
export function screenToWorld(
  screenX: number,
  screenY: number,
  camera: Camera
) {
  return {
    x: (screenX - camera.x) / camera.scale,
    y: (screenY - camera.y) / camera.scale
  };
}

/**
 * Convert world coordinates to screen (SVG pixel) coordinates
 */
export function worldToScreen(
  worldX: number,
  worldY: number,
  camera: Camera
) {
  return {
    x: worldX * camera.scale + camera.x,
    y: worldY * camera.scale + camera.y
  };
}

/**
 * Clamp zoom level so UI does not explode
 */
export function clampScale(scale: number) {
  return Math.min(3, Math.max(0.3, scale));
}

/**
 * Create a new camera centered on a world point
 */
export function centerCameraOn(
  camera: Camera,
  worldX: number,
  worldY: number,
  viewportWidth: number,
  viewportHeight: number
): Camera {
  const newScale = Math.max(camera.scale, 1.2);

  return {
    x: viewportWidth / 2 - worldX * newScale,
    y: viewportHeight / 2 - worldY * newScale,
    scale: newScale
  };
}

/**
 * Compute a new camera transform for a zoom wheel movement
 * mouseX / mouseY are in SVG pixel space (relative to the SVG bounding rect)
 */
export function zoomAtPoint(
  camera: Camera,
  mouseX: number,
  mouseY: number,
  deltaY: number
): Camera {
  const zoomIntensity = 0.05;
  const direction = deltaY > 0 ? -1 : 1;
  const factor = 1 + zoomIntensity * direction;

  const newScale = clampScale(camera.scale * factor);

  const worldX = (mouseX - camera.x) / camera.scale;
  const worldY = (mouseY - camera.y) / camera.scale;

  return {
    x: mouseX - worldX * newScale,
    y: mouseY - worldY * newScale,
    scale: newScale
  };
}
