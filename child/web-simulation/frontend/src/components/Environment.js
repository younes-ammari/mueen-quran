import React from 'react'
import Model from './Model';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';


export default function Environment() {

    // const objF = useLoader(OBJLoader, "../assets/3d/environment/Environment 3.obj");
    const objF = useLoader(OBJLoader, ".././models/environment/Environment 3.obj");
  return (
    <Model object={objF} />
  )
}
