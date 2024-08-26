"use client";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import {
  Gltf,
  Environment,
  Fisheye,
  KeyboardControls,
} from "@react-three/drei";
import Controller from "ecctrl";
import Player from "./player";
import CurrentPlayer from "./currentPlayer";

import { socket } from "@/socket";
import { useEffect } from "react";

export default function FpsScene() {
  useEffect(() => {
    socket.on("message", displayMessage);

    return () => {
      socket.off("message", displayMessage);
    };
  }, []);

  function displayMessage(message: { message: string }) {
    console.log("MESSAGES", message);
  }

  const players: { position: Vector3 }[] = [
    { position: [1, -0.55, 0] },
    { position: [2, -0.55, 0] },
  ];

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
