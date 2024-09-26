"use client";

import { Gltf, Text } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber";
import { quat, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

import * as THREE from "three";

interface PlayerProps {
  position: Vector3;
  playerId: string;
  rotation: THREE.Quaternion;
}

export default function Player({ position, rotation, playerId }: PlayerProps) {
  const testRef = useRef<RapierRigidBody | null>(null);

  useEffect(() => {
    const newQuaternion = new THREE.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );

    testRef.current?.setNextKinematicRotation(newQuaternion);
  }, [rotation]);

  return (
    <RigidBody
      key={playerId}
      type="kinematicPosition"
      colliders="trimesh"
      position={position}
      ref={testRef}
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
