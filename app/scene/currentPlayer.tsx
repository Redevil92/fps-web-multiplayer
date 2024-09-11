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
import { Group, Mesh, Object3DEventMap, Vector3 } from "three";
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

  function keyboardControlsHandler(name: string, pressed: boolean) {
    console.log("ROOM", roomContext.selectedRoom);
    console.log(name, pressed, ref.current);
    const playerPosition = ref.current?.getWorldPosition(new Vector3());
    console.log(socket);
    socket.emit(
      "message",
      { message: socket.id + "-->" + JSON.stringify(playerPosition) },
      ""
    );
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
