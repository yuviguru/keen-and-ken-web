'use client'
import React from 'react'
import * as THREE from 'three'
import { generateSpiralTriangles } from '../utils/generateSpiralTriangles'
import GradientLine from './GradientLine'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function TrianglesBG() {
	const groupRef = useRef<THREE.Group>(null)
  // Generate our 50 nested triangles with rotation effect
  const TRI_DEFS = generateSpiralTriangles(50, 1, 0.045) // Adjust scale & rotation
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0002 // Very slow rotation
	  const scale = 1 + Math.sin(clock.elapsedTime * 0.2) * 0.1 // Gentle breathing
	  groupRef.current.scale.set(scale, scale, 1)
    }
  })

  return (
    <group  position={[20, 10, 0]} ref={groupRef}>
      {TRI_DEFS.map((triangle, i) => {
        const [p0, p1, p2] = triangle
        return (
          <React.Fragment key={i}>
             <GradientLine start={p0} end={p1} startColor="#F42A8B" endColor="#F42A8B" />
            
            {/* Two gradient lines */}
            <GradientLine start={p1} end={p2} startColor="#F42A8B" endColor="#1F89DB" />
            <GradientLine start={p2} end={p0} startColor="#1F89DB" endColor="#F42A8B" />
          </React.Fragment>
        )
      })}
    </group>
  )
}
