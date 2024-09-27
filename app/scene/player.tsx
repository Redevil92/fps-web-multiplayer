"use client";

import { Gltf, Text } from "@react-three/drei";
import { Quaternion, useFrame, Vector3 } from "@react-three/fiber";
import { quat, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

import * as THREE from "three";

interface PlayerProps {
  position: Vector3;
  playerId: string;
  rotation: [number, number, number, number];
}

export default function Player({ position, rotation, playerId }: PlayerProps) {
  const testRef = useRef<RapierRigidBody | null>(null);

  useEffect(() => {
    const newQuaternion = new THREE.Quaternion(
      rotation[0],
      rotation[1],
      rotation[2],
      rotation[3]
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
