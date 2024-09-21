"use client";

import { Box, Gltf } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber";
import { quat, RigidBody } from "@react-three/rapier";
import {} from "@react-three/rapier";
import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

interface PlayerProps {
  position: Vector3;
  playerId: string;
  // rotation: Euler;
}

export default function Player({ position, playerId }: PlayerProps) {
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
