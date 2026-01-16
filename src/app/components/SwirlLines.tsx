'use client'
import * as React from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Creates an array of Vector3 points in a spiral pattern.
 */
function generateSpiralPoints(
  revolutions = 1.5,
  pointsPerRev = 100,
  radiusStart = 1,
  radiusEnd = 5
) {
  const points = []
  const totalPoints = Math.floor(revolutions * pointsPerRev)
  for (let i = 0; i < totalPoints; i++) {
    const t = i / (totalPoints - 1) // 0..1
    const angle = t * revolutions * Math.PI * 2
    const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, t)
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    points.push(new THREE.Vector3(x, y, 0))
  }
  return points
}

/**
 * Renders multiple swirl lines spinning slowly.
 */
export default function SwirlLines() {
  const swirlRef = React.useRef<THREE.Group>(null!)

  // Slowly rotate the swirl group
  useFrame(() => {
    if (swirlRef.current) {
      swirlRef.current.rotation.z += 0.0015
    }
  })

  // We'll stack multiple swirl lines with slight Z offsets
  const linesCount = 3
  const lines = []
  for (let i = 0; i < linesCount; i++) {
    const points = generateSpiralPoints()
    lines.push(
      <Line
        key={i}
        points={points}
        color="#ff00ff"
        lineWidth={2}
        dashed={false}
        position={[0, 0, -i * 0.2]}
      />
    )
  }

  return <group ref={swirlRef}>{lines}</group>
}
