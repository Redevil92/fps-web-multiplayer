"use client";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Gltf, Environment, Fisheye } from "@react-three/drei";

import Player from "./player";
import CurrentPlayer from "./currentPlayer";

import { useContext, useEffect, useState } from "react";
import { socket } from "@/socket";
import { RoomContext } from "../context/roomContext";
import { PlayerData } from "@/socketInterfaces";
import { Euler, Quaternion } from "three";

export default function FpsScene() {
  const [players, setPlayers] = useState<PlayerData[]>([]);

  const roomContext = useContext(RoomContext);

  useEffect(() => {
    // create players with default position
    const playersData: PlayerData[] = roomContext.roomPlayers.map(
      (playerId: string) => ({
        playerPosition: [0, 0, 0],
        playerRotation: [0, 0, 0, 0],
        playerId,
      })
    );

    setPlayers(playersData);

    // get position of players in the room
    socket.on("move", onPlayerMove);

    return () => {
      socket.off("move", onPlayerMove);
    };
  }, []);

  const onPlayerMove = (playerData: PlayerData) => {
    const playersData = [...players];
    const index = playersData.findIndex(
      (p) => p.playerId == playerData.playerId
    );

    if (index !== -1) {
      playersData[index] = playerData;
    } else {
      playersData.push(playerData);
    }
    console.log(playersData);
    setPlayers(playersData);
  };

  return (
    <>
      {/* LIST:
      {players.map((player, index) => (
        <div key={player.playerId}>
          {player.playerId}::{player.playerPosition}
        </div>
      ))} */}
      <Canvas
        style={{
          position: "absolute",
          right: "0px",
          top: "60px",
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
            {/* <Player position={[0, 0, 0]} playerId="2"></Player> */}

            {players.map((player, index) => (
              <Player
                playerId={player.playerId}
                key={index}
                position={player.playerPosition}
                rotation={player.playerRotation}
              />
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
    </>
  );
}
