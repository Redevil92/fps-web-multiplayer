"use client";

import { Gltf } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

import * as THREE from "three";

interface PlayerProps {
  position: Vector3;
  playerId: string;
  rotation: THREE.Euler;
}

export default function Player({ position, rotation, playerId }: PlayerProps) {
  return (
    <RigidBody
      key={playerId}
      type="kinematicPosition"
      colliders="trimesh"
      position={position}
    >
      <Gltf
        castShadow
        receiveShadow
        scale={0.315}
        src="/ghost_w_tophat-transformed.glb"
      />
    </RigidBody>
  );
}
