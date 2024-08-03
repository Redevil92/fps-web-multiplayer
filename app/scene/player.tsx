"use client";

import { Gltf } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

interface PlayerProps {
  position: Vector3;
}

export default function Player({ position }: PlayerProps) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <Gltf
        castShadow
        receiveShadow
        scale={0.315}
        position={position}
        src="/ghost_w_tophat-transformed.glb"
      />
    </RigidBody>
  );
}
