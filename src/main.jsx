import { KeyboardControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Debug, Physics, RigidBody } from "@react-three/rapier";
import React from "react";
import ReactDOM from "react-dom/client";
import Camera from "./Camera";
import "./index.css";
import Interface from "./Interface";

const Model = () => {
  const env = useGLTF("src/assets/environment_final01.glb");
  return <primitive object={env.scene} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <KeyboardControls
    map={[
      { name: "forward", keys: ["ArrowUp", "w", "W"] },
      { name: "backward", keys: ["ArrowDown", "s", "S"] },
      { name: "left", keys: ["ArrowLeft", "a", "A"] },
      { name: "right", keys: ["ArrowRight", "d", "D"] },
      { name: "jump", keys: ["Space"] },
      { name: "shift", keys: ["Shift"] },
    ]}
  >
    <Canvas>
      <ambientLight />
      <Camera />
      <Physics>
        <Debug />
        {/* <RigidBody type="fixed"> */}
        <Model />
        {/* </RigidBody> */}
      </Physics>
    </Canvas>
    {/* <Interface /> */}
  </KeyboardControls>
);
