"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import SceneInspector from "@/components/three/SceneInspector";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { uniform } from "three/tsl";

const TslScene = dynamic(() => import("./TslScene"), { ssr: false });

export default function TslView() {
  const blue = useMemo(() => uniform(0.35), []);

  return (
    <SceneCanvas camera={{ position: [0, 0, 10] }}>
      <SceneInspector
        configure={(inspector) => {
          const gradient = inspector
            .createParameters("TSL scene")
            .addFolder("Gradient");
          gradient.add(blue, "value", 0, 1, 0.01).name("Blue channel");
        }}
      />
      <TslScene blue={blue} href="/" />
    </SceneCanvas>
  );
}
