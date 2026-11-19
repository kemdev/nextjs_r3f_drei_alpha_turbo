import InteractiveSceneObject from "@/components/three/InteractiveSceneObject";
import type { UniformNode } from "three/webgpu";
import CubeScene from "./CubeScene";

export default function CubeDemo({ href, colorNode }: {
  href: string;
  colorNode?: UniformNode<"color">;
}) {
  return (
    <InteractiveSceneObject href={href} hoverScale={1.8} iconStartY={0.8} iconEndY={1.8}>
      {(hoverAmount) => <CubeScene colorNode={colorNode} hoverAmount={hoverAmount} />}
    </InteractiveSceneObject>
  );
}
