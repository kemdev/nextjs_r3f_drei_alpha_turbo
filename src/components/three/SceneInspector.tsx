import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Inspector } from "three/addons/inspector/Inspector.js";

export default function SceneInspector({
  configure,
}: {
  configure: (inspector: Inspector) => void;
}) {
  const renderer = useThree((state) => state.renderer);

  useEffect(() => {
    // Rebind controls when Fast Refresh supplies new scene uniforms.
    const previous = renderer.inspector;
    const inspector = new Inspector();
    configure(inspector);
    renderer.inspector = inspector;

    return () => {
      if (renderer.inspector === inspector) renderer.inspector = previous;
    };
  }, [configure, renderer]);

  return null;
}
