"use client";

import { Gltf } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber";
import { quat, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

import * as THREE from "three";

interface PlayerProps {
  position: Vector3;
  playerId: string;
  // rotation: Euler;
}

export default function Player({ position, playerId }: PlayerProps) {
  const testRef = useRef(null);
  const [newPosition, setNewPosition] = useState(position);
  const [moveUp, setMoveUp] = useState(false);

  // useEffect(() => {
  //   if (testRef.current && testRef.current.position) {
  //     testRef.current.position.x = position.x;
  //     testRef.current.position.y = position.y;
  //     testRef.current.position.z = position.z;
  //   }
  // }, [position]);

  useEffect(() => {
    if (testRef.current) {
      console.log(testRef.current);
      // const curRotation = quat(testRef.current.rotation());
      // const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      //   new THREE.Vector3(0, 1, 0),
      //   delta * 2
      // );
      //curRotation.multiply(incrementRotation);
      testRef.current.setNextKinematicTranslation(position);
    }
  }, [position]);

  return (
    <RigidBody
      key={playerId}
      type="kinematicPosition"
      colliders="trimesh"
      ref={testRef}
    >
      <Gltf
        castShadow
        receiveShadow
        scale={0.315}
        // rotation={rotation}
        src="/ghost_w_tophat-transformed.glb"
      />
    </RigidBody>
  );
}
