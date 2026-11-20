import NavigatingIcon from "@/components/ui/NavigatingIcon";
import { animated, useReducedMotion, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { CornerUpRight, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLocalNodes } from "@react-three/tsl";
import { mix, uniform, uv, vec3 } from "three/tsl";
import { DoubleSide, type UniformNode } from "three/webgpu";

export default function TslScene({ href, blue }: {
  href: string;
  blue?: UniformNode<"float">;
}) {
  const router = useRouter();
  const canvas = useThree((state) => state.renderer.domElement);
  const reducedMotion = useReducedMotion() === true;
  const [hovered, setHovered] = useState(false);
  const hoverAmount = useMemo(() => uniform(0), []);

  const { gradient } = useLocalNodes(() => {
    const coordinates = uv();
    const baseColor = vec3(coordinates.x, coordinates.y, blue ?? 0);
    return { gradient: mix(baseColor, baseColor.oneMinus(), hoverAmount) };
  }, [blue, hoverAmount]);

  useEffect(() => {
    if (!hovered) return;
    const previousCursor = canvas.style.cursor;
    canvas.style.cursor = "pointer";
    return () => {
      canvas.style.cursor = previousCursor;
    };
  }, [canvas, hovered]);

  const { scale } = useSpring({
    scale: hovered && !reducedMotion ? 1.2 : 1,
    amount: hovered ? 1 : 0,
    immediate: reducedMotion,
    onChange: ({ value }) => {
      hoverAmount.value = value.amount;
    },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const icon = useSpring({
    scale: hovered ? 1 : 0,
    positionY: hovered || reducedMotion ? 2.2 : 1.5,
    immediate: reducedMotion,
    config: { mass: 2, tension: 250, friction: 26 },
  });

  return (
    <group>
      <animated.group scale={icon.scale} position-y={icon.positionY}>
        <NavigatingIcon icon={href === "/" ? <Undo2 /> : <CornerUpRight />} />
      </animated.group>
      <animated.mesh
        scale={scale}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          router.push(href);
        }}
      >
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial key={gradient.id} colorNode={gradient} side={DoubleSide} />
      </animated.mesh>
    </group>
  );
}
