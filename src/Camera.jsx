import {
  PerspectiveCamera,
  useGLTF,
  useKeyboardControls,
  useAnimations,
} from "@react-three/drei";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import assets from "./assets";

extend({ OrbitControls });

console.log(assets[0].path);
let girlPosition = new THREE.Vector3();
let cameraTarget = new THREE.Vector3();
let cameraPosition = new THREE.Vector3();
let model;

const Camera = () => {
  const girl = useRef();
  model = useGLTF(assets[1].path);
  //   const Model = () => {
  //     model = useGLTF(assets[1].path);
  //     return <primitive object={model.scene} ref={girl} />;
  //   };

  const { actions } = useAnimations(model.animations, model.scene);

  const cam = useRef();
  const currentAction = useRef("");

  const { camera, gl } = useThree();

  //   console.log(cam.current);
  //   console.log(girl.current);

  const event = (e) => {};

  const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 100, 10));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());

  const [, get] = useKeyboardControls();

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, shift } = get();
    let action = "";
    if (forward || backward || left || right) {
      action = "Walk";
      if (shift) {
        action = "Run";
      }
    } else {
      action = "Idle";
    }
    if (currentAction.current != action) {
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
  });

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, shift } = get();

    girlPosition = girl.current.position;

    // cameraPosition.copy(girlPosition);
    // cameraPosition.z += 5;
    // cameraPosition.y += 2;

    // cameraTarget.copy(girlPosition);

    // state.camera.position.copy(cameraPosition);
    // state.camera.lookAt(cameraTarget);

    let moveDistance = 5 * delta;
    let rotateAngle = (Math.PI / 2) * delta;

    let relativeCameraOffset = new THREE.Vector3(0, 2, 4);
    // let relativeCameraOffset = new THREE.Vector3();

    let cameraOffset = relativeCameraOffset.applyMatrix4(
      girl.current.matrixWorld
    );
    // console.log(cameraOffset);

    // state.camera.position.x = cameraOffset.x;
    // state.camera.position.y = cameraOffset.y;
    // state.camera.position.z = cameraOffset.z;
    // state.camera.lookAt(girlPosition);

    smoothCameraPosition.lerp(cameraOffset, 2.5 * delta);
    // cameraOffset.lerp(smoothCameraPosition, 5 * delta);
    smoothCameraTarget.lerp(girlPosition, 2.5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    if (forward) {
      model.scene.translateZ(-moveDistance);
    }
    if (backward) {
      model.scene.translateZ(moveDistance);
    }
    if (left) {
      //   cam.current.rotation.y += 0.1;
      model.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    }
    if (right) {
      model.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    }
  });

  return (
    <>
      {/* <orbitControls args={[camera, gl]} /> */}
      <PerspectiveCamera makeDefault ref={cam} position={[0, 0, 5]} fov={75} />
      <mesh position-y={-3} rotation-x={-Math.PI * 0.5} scale={50}>
        <planeGeometry />
        <meshBasicMaterial color="yellow" />
      </mesh>
      {/* <Model /> */}
      <primitive object={model.scene} ref={girl} position={[0, 0, 25]} />
    </>
  );
};

export default Camera;
