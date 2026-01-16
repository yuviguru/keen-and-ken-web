import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles() {
  const ref = useRef<THREE.Points>(null)

  // Generate valid random positions for particles
  const positions = useMemo(() => {
    const count = 2000 // Number of points
    const spread = 150 // Spread range (increase to make particles cover more space)
    const depth = 40 // Z depth to create depth effect
    const particles = new Float32Array(count * 3) // Must be count * 3 for x, y, z

    for (let i = 0; i < count * 3; i += 3) {
      particles[i] = (Math.random() - 0.5) * spread // X-axis (-spread/2 to spread/2)
      particles[i + 1] = (Math.random() - 0.5) * spread // Y-axis (-spread/2 to spread/2)
      particles[i + 2] = (Math.random() - 0.5) * depth // Z-axis (-depth/2 to depth/2)
    }

    return particles
  }, [])

  // Subtle floating effect
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002 // Very slow rotation for depth effect
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.1) * 2 // Gentle up/down floating
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3} // Each vertex has x, y, z
        />
      </bufferGeometry>
      <pointsMaterial size={0.4} transparent opacity={0.5} color="white" />
    </points>
  )
}
