import { Html } from "@react-three/drei";
import React from "react";
import FloatingResult from "./FloatingResult";
import { RecitationProvider } from "../utils/context/RecitationContext";

export default function BodyScreen({ userText }) {
  return (
    <Html
      position={[2.28, 2.255, -0.728]}
      transform
      scale={0.062}
      // rotation={[0.09, -29.88, 0.01]}
      rotation={[-0.20, -29.85, -0.00, "YXZ"]}
      center
      zIndexRange={[1, 0]}
    >
      <div className="body-screen-content">
        {/* Remove FloatingResult from here */}
        <div className="floating-result-wrapper">
          <RecitationProvider>
            <FloatingResult userText={userText} />
          </RecitationProvider>
        </div>
      </div>
    </Html>
  );
}
