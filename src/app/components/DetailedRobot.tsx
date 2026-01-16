import React from 'react'
import { Box, Sphere, Cylinder, Torus, Cone } from '@react-three/drei'

export default function DetailedRobot() {
  return (
    <group position={[0, -2, -100]}>
      {/* Head */}
      <Sphere args={[1.2, 64, 64]} position={[0, 4.5, 0]}>
        <meshStandardMaterial color="silver" roughness={0.3} metalness={0.8} />
      </Sphere>

      {/* Eyes (Glowing Effect) */}
      <Sphere args={[0.2, 32, 32]} position={[-0.5, 4.6, 1]} >
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={1.5} />
      </Sphere>
      <Sphere args={[0.2, 32, 32]} position={[0.5, 4.6, 1]} >
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={1.5} />
      </Sphere>

      {/* Body */}
      <Box args={[2, 3, 1]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="gray" roughness={0.4} metalness={0.7} />
      </Box>

      {/* Chest Circuit Panel */}
      <Box args={[1.5, 1.5, 0.2]} position={[0, 2.6, 0.51]}>
        <meshStandardMaterial color="blue" emissive="blue" emissiveIntensity={0.7} />
      </Box>

      {/* Shoulders */}
      <Cylinder args={[0.6, 0.6, 0.8, 32]} position={[-1.6, 3.2, 0]}>
        <meshStandardMaterial color="silver" metalness={0.8} />
      </Cylinder>
      <Cylinder args={[0.6, 0.6, 0.8, 32]} position={[1.6, 3.2, 0]}>
        <meshStandardMaterial color="silver" metalness={0.8} />
      </Cylinder>

      {/* Arms */}
      <Cylinder args={[0.3, 0.3, 2.5, 32]} position={[-2.3, 2, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color="gray" roughness={0.5} metalness={0.7} />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 2.5, 32]} position={[2.3, 2, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color="gray" roughness={0.5} metalness={0.7} />
      </Cylinder>

      {/* Elbow Joints */}
      <Sphere args={[0.4, 32, 32]} position={[-2.8, 1, 0]}>
        <meshStandardMaterial color="silver" />
      </Sphere>
      <Sphere args={[0.4, 32, 32]} position={[2.8, 1, 0]}>
        <meshStandardMaterial color="silver" />
      </Sphere>

      {/* Forearms */}
      <Cylinder args={[0.25, 0.25, 2, 32]} position={[-3.2, 0, 0]} rotation={[0, 0, -0.1]}>
        <meshStandardMaterial color="gray" roughness={0.5} metalness={0.7} />
      </Cylinder>
      <Cylinder args={[0.25, 0.25, 2, 32]} position={[3.2, 0, 0]} rotation={[0, 0, 0.1]}>
        <meshStandardMaterial color="gray" roughness={0.5} metalness={0.7} />
      </Cylinder>

      {/* Hands */}
      <Torus args={[0.4, 0.15, 16, 100]} position={[-3.5, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="silver" />
      </Torus>
      <Torus args={[0.4, 0.15, 16, 100]} position={[3.5, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="silver" />
      </Torus>

      {/* Legs */}
      <Cylinder args={[0.5, 0.5, 3, 32]} position={[-0.7, -2, 0]}>
        <meshStandardMaterial color="darkgray" metalness={0.5} />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 3, 32]} position={[0.7, -2, 0]}>
        <meshStandardMaterial color="darkgray" metalness={0.5} />
      </Cylinder>

      {/* Feet */}
      <Box args={[1.2, 0.5, 2]} position={[-0.7, -3.8, 0]}>
        <meshStandardMaterial color="black" />
      </Box>
      <Box args={[1.2, 0.5, 2]} position={[0.7, -3.8, 0]}>
        <meshStandardMaterial color="black" />
      </Box>

      {/* Antennas */}
      <Cone args={[0.2, 1, 16]} position={[-0.5, 5.3, 0]}>
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={1.0} />
      </Cone>
      <Cone args={[0.2, 1, 16]} position={[0.5, 5.3, 0]}>
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={1.0} />
      </Cone>
    </group>
  )
}
