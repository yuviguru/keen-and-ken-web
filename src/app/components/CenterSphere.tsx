import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CenterSphere() {
  return <SphereMesh />;
}

function SphereMesh() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (sphereRef.current) {
      const maxScale = 10; // Increase maximum scale
      const maxZPosition = 0; // Adjust maximum z-position to prevent moving too far forward
      const scale = Math.min(
        1 + (scrollY.current / window.innerHeight) * 1.3,
        maxScale
      ); // Adjust scaling factor
      sphereRef.current.scale.set(scale, scale, scale);
      sphereRef.current.position.z = Math.min(
        -1 + scrollY.current / 200,
        maxZPosition
      ); // Adjust z-position logic
    }
  });

  return (
    <mesh ref={sphereRef} position={[30, 50, -1]} castShadow receiveShadow>
      <sphereGeometry args={[50, 128, 128]} />
      <meshPhysicalMaterial
        color="#937bd8"
        metalness={0.7}
        roughness={0.2}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
