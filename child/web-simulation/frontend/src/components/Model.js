import React from "react";
import { useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

function Model({ scale = 0.05, object }) {
  const fbxF = useLoader(FBXLoader, "./models/robot 3.fbx");
  // const fbxF = useLoader(FBXLoader, "./models/environment/Environment 3.fbx");

  return <primitive object={object || fbxF} scale={[scale, scale, scale]} />;
}

export default Model;
