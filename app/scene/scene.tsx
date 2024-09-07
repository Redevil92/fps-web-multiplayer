"use client";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Gltf, Environment, Fisheye } from "@react-three/drei";

import Player from "./player";
import CurrentPlayer from "./currentPlayer";

import { useEffect, useState } from "react";

interface PlayerData {
  position: Vector3;
}

export default function FpsScene() {
  const [players, setPlayers] = useState<PlayerData[]>([]);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Canvas
      style={{
        position: "absolute",
        right: "0px",
        width: "70vw",
        height: "100vh",
      }}
      shadows
      onPointerDown={(e) => (e.target as any).requestPointerLock()}
    >
      <Fisheye zoom={0.4}>
        <Environment files="/night.hdr" ground={{ scale: 100 }} />
        <directionalLight
          intensity={0.7}
          castShadow
          shadow-bias={-0.0004}
          position={[-20, 20, 20]}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-20, 20, 20, -20]}
          />
        </directionalLight>
        <ambientLight intensity={0.2} />
        <Physics timeStep="vary">
          <CurrentPlayer />
          {players.map((player, index) => (
            <Player key={index} position={player.position} />
          ))}
          <RigidBody type="fixed" colliders="trimesh">
            <Gltf
              castShadow
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              scale={0.11}
              src="/fantasy_game_inn2-transformed.glb"
            />
          </RigidBody>
        </Physics>
      </Fisheye>
    </Canvas>
  );
}
