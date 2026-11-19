"use client";
import SceneCanvas from "@/components/three/SceneCanvas";
import CubeDemo from "../cube/CubeDemo";
import TslDemo from "../tsl/TslDemo";

export default function OverviewView() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 15], fov: 50 }}>
      <group position={[-2.5, 0, 0]}>
        <TslDemo href="/tsl" />
      </group>
      <group position={[2.5, 0, 0]}>
        <CubeDemo href="/cube" />
      </group>
    </SceneCanvas>
  );
}
