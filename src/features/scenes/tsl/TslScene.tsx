import { useLocalNodes } from "@react-three/tsl";
import { mix, uv, vec3 } from "three/tsl";
import { DoubleSide, type UniformNode } from "three/webgpu";

export default function TslScene({
  blue,
  hoverAmount,
}: {
  blue?: UniformNode<"float">;
  hoverAmount?: UniformNode<"float">;
}) {
  const { gradient } = useLocalNodes(() => {
    const coordinates = uv();
    const baseColor = vec3(coordinates.x, coordinates.y, blue ?? 0);
    return {
      gradient: hoverAmount ? mix(baseColor, baseColor.oneMinus(), hoverAmount) : baseColor,
    };
  }, [blue, hoverAmount]);

  return (
    <mesh>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial key={gradient.id} colorNode={gradient} side={DoubleSide} />
    </mesh>
  );
}
