import { Html, type HtmlProps } from "@react-three/drei/core";
import React from "react";

type Props = {
  icon: React.ReactNode;
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  dreiHtmlProps?: HtmlProps;
};

export default function NavigatingIcon({ icon, divProps, dreiHtmlProps }: Props) {
  return (
    <Html
      position={[0, 0, 0]}
      transform
      {...dreiHtmlProps}
      pointerEvents="none"
    >
      <div {...divProps} aria-hidden="true">{icon}</div>
    </Html>
  );
}

