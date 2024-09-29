"use client";
import {
  onPlayerJoin,
  insertCoin,
  isHost,
  myPlayer,
  Joystick,
  PlayerState,
  useMultiplayerState,
} from "playroomkit";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";

import {
  Gltf,
  Environment,
  Fisheye,
  SoftShadows,
  PerformanceMonitor,
} from "@react-three/drei";
import { CharacterController } from "./components/CharacterController";
import { Physics } from "@react-three/rapier";
import { BulletHit } from "./components/BulletHit";
import { Bullet } from "./components/Bullet";
import { WorldMap } from "./components/Map";
import BulletData from "./models/BulletData";
import HitData from "./models/HitData";

export default function Home() {
  const [players, setPlayers] = useState<
    { state: PlayerState; joystick: Joystick }[]
  >([]);
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const start = async () => {
    await insertCoin();

    onPlayerJoin((state) => {
      // Joystick will only create UI for current player (myPlayer)
      // For others, it will only sync their state
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "fire", label: "Fire" }],
      });
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  };

  useEffect(() => {
    start();
  }, []);

  const [bullets, setBullets] = useState<BulletData[]>([]);
  const [hits, setHits] = useState<HitData[]>([]);

  const [networkBullets, setNetworkBullets] = useMultiplayerState(
    "bullets",
    []
  );
  const [networkHits, setNetworkHits] = useMultiplayerState("hits", []);

  const onFire = (bullet: BulletData) => {
    setBullets((bullets) => [...bullets, bullet]);
  };

  const onHit = (bulletId: string, position: Vector3) => {
    setBullets((bullets) => bullets.filter((bullet) => bullet.id !== bulletId));
    setHits((hits) => [...hits, { id: bulletId, position } as HitData]);
  };

  const onHitEnded = (hitId: string) => {
    setHits((hits) => hits.filter((h) => h.id !== hitId));
  };

  useEffect(() => {
    setNetworkBullets(bullets);
  }, [bullets]);

  useEffect(() => {
    setNetworkHits(hits);
  }, [hits]);

  const onKilled = (_victim: PlayerState, killerId: string) => {
    const killerState = players.find((p) => p.state.id === killerId)?.state!;
    killerState.setState("kills", killerState.state.kills + 1);
  };

  return (
    <main>
      <Canvas
        shadows
        camera={{ position: [0, 30, 0], fov: 30, near: 2 }}
        dpr={[1, 1.5]} // optimization to increase performance on retina/4k devices
        style={{ width: "100vw", height: "100vh" }}
      >
        <color attach="background" args={["#242424"]} />
        <SoftShadows size={42} />
        <PerformanceMonitor
          // Detect low performance devices
          onDecline={(fps) => {
            setDowngradedPerformance(true);
          }}
        />
        <Suspense>
          <Physics>
            <WorldMap />
            {players.map(({ state, joystick }, index) => (
              <CharacterController
                key={state.id}
                state={state}
                userPlayer={state.id === myPlayer()?.id}
                joystick={joystick}
                onKilled={onKilled}
                onFire={onFire}
                downgradedPerformance={downgradedPerformance}
              />
            ))}
            {(isHost() ? bullets : (networkBullets as BulletData[])).map(
              (bullet) => (
                <Bullet
                  key={bullet.id}
                  {...bullet}
                  onHit={(position: Vector3) => onHit(bullet.id, position)}
                />
              )
            )}
            {(isHost() ? hits : (networkHits as HitData[])).map(
              (hit: HitData) => (
                <BulletHit
                  key={hit.id}
                  {...hit}
                  onEnded={() => onHitEnded(hit.id)}
                />
              )
            )}
            <Environment preset="sunset" />
          </Physics>
        </Suspense>
      </Canvas>
    </main>
  );
}
