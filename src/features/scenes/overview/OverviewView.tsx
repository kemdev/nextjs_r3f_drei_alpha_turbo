"use client";
import SceneCanvas from "@/components/three/SceneCanvas";
import CubeScene from "../cube/CubeScene";
import TslScene from "../tsl/TslScene";

export default function OverviewView() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 15], fov: 50 }}>
      <group position={[-2.5, 0, 0]}>
        <TslScene href="/tsl" />
      </group>
      <group position={[2.5, 0, 0]}>
        <CubeScene href="/cube" />
      </group>
    </SceneCanvas>
  );
}
