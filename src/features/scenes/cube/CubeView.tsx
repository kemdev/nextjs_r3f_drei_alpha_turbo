"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import SceneInspector from "@/components/three/SceneInspector";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { color, uniform } from "three/tsl";

const CubeScene = dynamic(() => import("./CubeScene"), { ssr: false });

export default function CubeView() {
  const cubeColor = useMemo(() => uniform(color(0x679cf4)), []);
  return (
    <SceneCanvas camera={{ position: [0, 0, 10] }}>
      <SceneInspector
        configure={(inspector) => {
          const material = inspector
            .createParameters("Cube")
            .addFolder("Material");
          material.addColor(cubeColor, "value").name("Color");
        }}
      />
      <CubeScene colorNode={cubeColor} href="/" />
    </SceneCanvas>
  );
}
