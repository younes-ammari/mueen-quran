import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Html, OrbitControls } from "@react-three/drei";
import Model from "./Model";
import FloatingResult from "./FloatingResult";
import FaceExpressions from "./FaceExpressions";
import Environment from "./Environment";
import BodyScreen from "./BodyScreen";
import { useRecitation } from "../utils/context/RecitationContext";

export default function CanvasView() {
  const fbxF = useLoader(FBXLoader, ".././models/robot 3.fbx");
  const fbxFEnv = useLoader(FBXLoader, ".././models/environment/Environment 6.fbx");

  const { userText } = useRecitation();
  return (
    <div className="canvas-wrapper" style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={5} />
        {/* <spotLight position={[111, 111, 111]} angle={0.3} intensity={2} /> */}
        {/* <pointLight position={[99, 99, 99]} intensity={9} /> */}
        <Suspense fallback={null}>
          <Model object={fbxFEnv} />
          {/* <Model object={fbxF} /> */}
          <FaceExpressions />
          <BodyScreen userText={userText} />
          <OrbitControls
            // minDistance={10}
            // maxDistance={55}
            // enableZoom={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
