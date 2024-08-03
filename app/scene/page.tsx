"use client";
import { Canvas } from "@react-three/fiber";
import Cube from "./cube";

export default function Scene() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[0, 0, 0]} />
      <Cube></Cube>
    </Canvas>
  );
}
