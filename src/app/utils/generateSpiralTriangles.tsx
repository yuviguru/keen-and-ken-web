/**
 * Generates triangles that grow in size while rotating slightly to create a spiral effect.
 * @param count Number of triangles (e.g., 50).
 * @param scaleStep Incremental scale factor per step (default 0.08).
 * @param angleStep Rotation increment in radians per step (default 0.05 radians).
 * @returns An array of triangles in [ [ [x,y,z], [x,y,z], [x,y,z] ], ...]
 */
export function generateSpiralTriangles(
  count: number,
  scaleStep: number = 0.08,
  angleStep: number = 0.05 // Small rotation step in radians
): [number, number, number][][] {
  // Base triangle (starting shape)
  const size = 3
  const baseTriangle: [number, number, number][] = [
    [-size, 0, 0],  // Left vertex
    [size, size * Math.sqrt(3), 0],  // Top vertex (height maintains equilateral proportions)
    [size * 2, 0, 0],  // Right vertex
  ]

  // Find the centroid of the base triangle
  const centerX = (baseTriangle[0][0] + baseTriangle[1][0] + baseTriangle[2][0]) / 3
  const centerY = (baseTriangle[0][1] + baseTriangle[1][1] + baseTriangle[2][1]) / 3

  const triangles: [number, number, number][][] = []

  for (let i = 0; i < count; i++) {
    // Incremental scaling for gradual growth
    const scale = 1 + i * scaleStep
    // Calculate rotation angle for this step
    const angle = i * angleStep

    const scaledTriangle = baseTriangle.map(([x, y, z]) => {
      const dx = x - centerX
      const dy = y - centerY

      // Scale outward
      let newX = centerX + dx * scale
      let newY = centerY + dy * scale

      // Apply rotation transformation using 2D rotation matrix
      const rotatedX = centerX + (newX - centerX) * Math.cos(angle) - (newY - centerY) * Math.sin(angle)
      const rotatedY = centerY + (newX - centerX) * Math.sin(angle) + (newY - centerY) * Math.cos(angle)

      return [rotatedX, rotatedY, z] as [number, number, number]
    })

    triangles.push(scaledTriangle)
  }

  return triangles
}
