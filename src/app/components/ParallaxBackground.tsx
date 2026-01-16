'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParallaxBackground() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (groupRef.current) {
      groupRef.current.position.x = pointer.x * 5; // Move left-right
      groupRef.current.position.y = pointer.y * 2; // Move up-down
    }
  });

  return (
    <group ref={groupRef}>
      {/* Grid Lines */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>

      {/* Star Field */}
      <points position={[0, 0, -15]}>
        <sphereGeometry args={[50, 32, 32]} />
        <pointsMaterial color="#ffffff" size={0.05} transparent opacity={0.5} />
      </points>
    </group>
  );
}
