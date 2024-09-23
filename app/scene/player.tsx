"use client";

import { Gltf } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

import * as THREE from "three";

interface PlayerProps {
  position: Vector3;
  playerId: string;
  rotation: Vector3;
}

export default function Player({ position, rotation, playerId }: PlayerProps) {
  const testRef = useRef();

  useEffect(() => {
    setInterval(function () {
      // code to be executed repeatedly
      console.log(position);
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
      <Gltf
        castShadow
        receiveShadow
        scale={0.315}
        src="/ghost_w_tophat-transformed.glb"
      />
    </RigidBody>
  );
}
