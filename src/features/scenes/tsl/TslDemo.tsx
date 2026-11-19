import InteractiveSceneObject from "@/components/three/InteractiveSceneObject";
import type { UniformNode } from "three/webgpu";
import TslScene from "./TslScene";

export default function TslDemo({ href, blue }: {
  href: string;
  blue?: UniformNode<"float">;
}) {
  return (
    <InteractiveSceneObject href={href} hoverScale={1.2} iconStartY={1.5} iconEndY={2.2}>
      {(hoverAmount) => <TslScene blue={blue} hoverAmount={hoverAmount} />}
    </InteractiveSceneObject>
  );
}
