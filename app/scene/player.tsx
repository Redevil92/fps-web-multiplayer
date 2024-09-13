"use client";

import { Gltf } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Euler, Quaternion } from "three";

interface PlayerProps {
  position: Vector3;
  rotation: Euler;
}

export default function Player({ position, rotation }: PlayerProps) {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <Gltf
        castShadow
        receiveShadow
        scale={0.315}
        position={position}
        rotation={rotation}
        src="/ghost_w_tophat-transformed.glb"
      />
    </RigidBody>
  );
}
