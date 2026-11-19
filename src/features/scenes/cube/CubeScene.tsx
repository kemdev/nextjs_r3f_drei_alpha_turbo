import { useMemo } from "react";
import { color, mix } from "three/tsl";
import type { UniformNode } from "three/webgpu";

export default function CubeScene({
  colorNode,
  hoverAmount,
}: {
  colorNode?: UniformNode<"color">;
  hoverAmount?: UniformNode<"float">;
}) {
  const materialColor = useMemo(() => {
    const baseColor = colorNode ?? color("white");
    return hoverAmount ? mix(baseColor, color("#8b2c97"), hoverAmount) : baseColor;
  }, [colorNode, hoverAmount]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial key={materialColor.id} colorNode={materialColor} />
      </mesh>
    </>
  );
}
