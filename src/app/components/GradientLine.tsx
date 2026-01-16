import React, { useMemo } from 'react'
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'

/**
 * Custom Gradient Line Component
 * - Takes `startColor` and `endColor` for the gradient
 * - Draws a line with color interpolation between two points
 */
export default function GradientLine({ start, end, startColor, endColor }) {
  const lineRef = React.useRef<THREE.Line>(null)

  // Convert color strings to Three.js Color objects
  const colorStart = new THREE.Color(startColor)
  const colorEnd = new THREE.Color(endColor)

  // Create the geometry only once
  const geometry = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array([...start, ...end])
    const colors = new Float32Array([
      colorStart.r, colorStart.g, colorStart.b, // Start color
      colorEnd.r, colorEnd.g, colorEnd.b // End color
    ])
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return lineGeometry
  }, [start, end, startColor, endColor])

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" vertexColors linewidth={2} transparent opacity={0.3} />
    </line>
  )
}
