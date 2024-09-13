"use client";

import { socket } from "@/socket";
import { Gltf, KeyboardControls } from "@react-three/drei";

import Controller from "ecctrl";
import {
  LegacyRef,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Euler,
  Group,
  Mesh,
  Object3DEventMap,
  Quaternion,
  Vector3,
} from "three";
import { RoomContext } from "../context/roomContext";

export default function Player() {
  const ref = useRef<Group<Object3DEventMap>>(null);
  const [playerSpeed, setPlayerSpeed] = useState(5);
  const [playerPosition, setPlayerPosition] = useState(new Vector3(0, 10, 0));

  const roomContext = useContext(RoomContext);

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];

  useEffect(() => {
    function refresh() {
      emitPlayerMove();
      setTimeout(refresh, 20);
      // ...
    }

    // initial call, or just call refresh directly
    setTimeout(refresh, 20);
  }, []);

  function keyboardControlsHandler(name: string, pressed: boolean) {
    //emitPlayerMove();
  }

  function emitPlayerMove() {
    const playerPosition = ref.current?.getWorldPosition(new Vector3());
    const playerRotation = ref?.current?.getWorldQuaternion(new Quaternion());
    // TODO: include rotation in the player data

    if (playerPosition && playerRotation && socket.id) {
      console.log(
        playerRotation,
        new Euler().setFromQuaternion(playerRotation)
      );
      socket.emit("move", roomContext.selectedRoom, {
        playerId: socket.id,
        playerPosition: [playerPosition.x, playerPosition.y, playerPosition.z],
        playerRotation: new Euler().setFromQuaternion(playerRotation),
      });
    }
  }

  function updateGlftHandler(event: Group<Object3DEventMap>) {
    console.log("UPDATE", event);
  }

  return (
    <KeyboardControls onChange={keyboardControlsHandler} map={keyboardMap}>
      <Controller maxVelLimit={5} position={playerPosition}>
        <Gltf
          ref={ref}
          castShadow
          receiveShadow
          scale={0.315}
          position={[0, -0.55, 0]}
          src="/ghost_w_tophat-transformed.glb"
          onUpdate={updateGlftHandler}
        />
      </Controller>
    </KeyboardControls>
  );
}
