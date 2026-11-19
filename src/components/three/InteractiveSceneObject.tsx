import NavigatingIcon from "@/components/ui/NavigatingIcon";
import { animated, useReducedMotion, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { CornerUpRight, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { uniform } from "three/tsl";
import type { UniformNode } from "three/webgpu";

type Props = {
  href: string;
  hoverScale: number;
  iconStartY: number;
  iconEndY: number;
  children: (hoverAmount: UniformNode<"float">) => ReactNode;
};

export default function InteractiveSceneObject({
  href,
  hoverScale,
  iconStartY,
  iconEndY,
  children,
}: Props) {
  const router = useRouter();
  const canvas = useThree((state) => state.renderer.domElement);
  const reducedMotion = useReducedMotion() === true;
  const [hovered, setHovered] = useState(false);
  const hoverAmount = useMemo(() => uniform(0), []);

  useEffect(() => {
    if (!hovered) return;
    const previousCursor = canvas.style.cursor;
    canvas.style.cursor = "pointer";

    return () => {
      canvas.style.cursor = previousCursor;
    };
  }, [canvas, hovered]);

  const { scale } = useSpring({
    scale: hovered && !reducedMotion ? hoverScale : 1,
    amount: hovered ? 1 : 0,
    immediate: reducedMotion,
    onChange: ({ value }) => {
      hoverAmount.value = value.amount;
    },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const icon = useSpring({
    scale: hovered ? 1 : 0,
    positionY: hovered || reducedMotion ? iconEndY : iconStartY,
    immediate: reducedMotion,
    config: { mass: 2, tension: 250, friction: 26 },
  });

  return (
    <group>
      <animated.group scale={icon.scale} position-y={icon.positionY}>
        <NavigatingIcon icon={href === "/" ? <Undo2 /> : <CornerUpRight />} />
      </animated.group>
      <animated.group
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
        {children(hoverAmount)}
      </animated.group>
    </group>
  );
}
