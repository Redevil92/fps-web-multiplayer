"use client";

import { Gltf, Text } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

import * as THREE from "three";

interface PlayerProps {
  position: Vector3;
  playerId: string;
  rotation: THREE.Quaternion;
}

export default function Player({ position, rotation, playerId }: PlayerProps) {
  const testRef = useRef();

  useEffect(() => {
    setInterval(function () {
      // code to be executed repeatedly
      console.log(playerId, "ROT", rotation);
      // const newRotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);
      //  setEulerAngle(newRotation);
    }, 1000);
  }, []);

  return (
    <RigidBody
      key={playerId}
      type="kinematicPosition"
      colliders="trimesh"
      position={position}
    >
      {rotation && (
        <Text position={[0, 2, 0]}>{`${rotation[0]
          .toFixed(2)
          .toString()}-${rotation[1].toFixed(2).toString()}-${rotation[2]
          .toFixed(2)
          .toString()}`}</Text>
      )}

      <Gltf
        castShadow
        receiveShadow
        scale={0.315}
        src="/ghost_w_tophat-transformed.glb"
      />
    </RigidBody>
  );
}
