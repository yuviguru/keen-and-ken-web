"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import TrianglesBG from "./TrianglesBG";
// import { SoftShadows, OrbitControls } from "@react-three/drei";
import Particles from "./Particles";
import CenterSphere from "./CenterSphere";

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        shadows
        gl={{ alpha: true }}
        style={{ background: "#111", position: "fixed" }}
        camera={{ position: [0, 0, 100], fov: 60 }}
      >
        {/* <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          intensity={1.5}
          penumbra={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        /> */}
        <ambientLight intensity={0.7} />

        {/* The group of angled triangles */}
        <TrianglesBG />
        <CenterSphere />
        <Particles />
      </Canvas>
    </div>
  );
}
