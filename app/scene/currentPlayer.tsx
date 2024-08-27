"use client";

import { Gltf, KeyboardControls } from "@react-three/drei";

import Controller from "ecctrl";

export default function Player() {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];

  function keyboardControlsHandler(name: string, pressed: boolean) {
    console.log(name, pressed);
  }

  return (
    <KeyboardControls onChange={keyboardControlsHandler} map={keyboardMap}>
      <Controller maxVelLimit={5}>
        <Gltf
          castShadow
          receiveShadow
          scale={0.315}
          position={[0, -0.55, 0]}
          src="/ghost_w_tophat-transformed.glb"
        />
      </Controller>
    </KeyboardControls>
  );
}
