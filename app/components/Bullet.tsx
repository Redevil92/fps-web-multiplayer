import { RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { isHost } from "playroomkit";
import { useEffect, useRef } from "react";
import { MeshBasicMaterial, Vector3 } from "three";
import { WEAPON_OFFSET } from "./CharacterController";
import BulletData from "../models/BulletData";

const BULLET_SPEED = 20;

const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

interface BulletPropsInterface {
  playerId: string;
  angle: any;
  position: Vector3;
  onHit: (position: Vector3) => void;
}

interface RigidBodyUserData {
  type: "bullet";
  playerId: string;
  damage: number;
}

export const Bullet = ({
  playerId,
  angle,
  position,
  onHit,
}: BulletPropsInterface) => {
  const rigidbody = useRef<RapierRigidBody | null>(null);

  useEffect(() => {
    const audio = new Audio("/audios/rifle.mp3");
    audio.play();
    const velocity = {
      x: Math.sin(angle) * BULLET_SPEED,
      y: 0,
      z: Math.cos(angle) * BULLET_SPEED,
    };

    rigidbody.current!.setLinvel(velocity, true);
  }, []);

  return (
    <group position={[position.x, position.y, position.z]} rotation-y={angle}>
      <group
        position-x={WEAPON_OFFSET.x}
        position-y={WEAPON_OFFSET.y}
        position-z={WEAPON_OFFSET.z}
      >
        <RigidBody
          ref={rigidbody}
          gravityScale={0}
          onIntersectionEnter={(e) => {
            if (
              isHost() &&
              (e.other.rigidBody!.userData as RigidBodyUserData)?.type !==
                "bullet"
            ) {
              rigidbody.current!.setEnabled(false);
              onHit(vec3(rigidbody.current!.translation()));
            }
          }}
          sensor
          userData={
            {
              type: "bullet",
              playerId,
              damage: 10,
            } as RigidBodyUserData
          }
        >
          <mesh position-z={0.25} material={bulletMaterial} castShadow>
            <boxGeometry args={[0.05, 0.05, 0.5]} />
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
};
