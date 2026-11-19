import { OrbitControls } from "@react-three/drei/core";
import { Canvas, useThree } from "@react-three/fiber";
import type { WebGPUCanvasProps } from "@react-three/fiber/webgpu";

function CanvasOrbitControls() {
  // The Inspector shares the wrapper and needs its own pointer events.
  const canvas = useThree((state) => state.renderer.domElement);
  return <OrbitControls domElement={canvas} />;
}

export default function SceneCanvas({
  children,
  ...props
}: WebGPUCanvasProps) {
  return (
    <Canvas {...props}>
      {children}
      <CanvasOrbitControls />
    </Canvas>
  );
}
