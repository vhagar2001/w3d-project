import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import islandScene from "../assets/3d/sum.glb";



export function Island({
    isRotating,
    setIsRotating,
    setCurrentStage,
    currentFocusPoint,
    ...props
  })
  {
    const islandRef = useRef();
  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.95;

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Remove event listeners when component unmounts
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // This function is called on each frame update
  useFrame(() => {
    // If not rotating, apply damping to slow down the rotation (smoothly)
    if (!isRotating) {
      // Apply damping factor
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      islandRef.current.rotation.y += rotationSpeed.current;
    } else {
      // When rotating, determine the current stage based on island's orientation
      const rotation = islandRef.current.rotation.y;

      /**
       * Normalize the rotation value to ensure it stays within the range [0, 2 * Math.PI].
       * The goal is to ensure that the rotation value remains within a specific range to
       * prevent potential issues with very large or negative rotation values.
       *  Here's a step-by-step explanation of what this code does:
       *  1. rotation % (2 * Math.PI) calculates the remainder of the rotation value when divided
       *     by 2 * Math.PI. This essentially wraps the rotation value around once it reaches a
       *     full circle (360 degrees) so that it stays within the range of 0 to 2 * Math.PI.
       *  2. (rotation % (2 * Math.PI)) + 2 * Math.PI adds 2 * Math.PI to the result from step 1.
       *     This is done to ensure that the value remains positive and within the range of
       *     0 to 2 * Math.PI even if it was negative after the modulo operation in step 1.
       *  3. Finally, ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) applies another
       *     modulo operation to the value obtained in step 2. This step guarantees that the value
       *     always stays within the range of 0 to 2 * Math.PI, which is equivalent to a full
       *     circle in radians.
       */
      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });



return (
    <group ref={islandRef} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Plane"
          castShadow
          receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials["Material.004"]}
          position={[-0.594, 0.292, 1.363]}
          rotation={[0, -0.807, 0]}
          scale={0.977}
        >
          <mesh
            name="Plane001"
            castShadow
            receiveShadow
            geometry={nodes.Plane001.geometry}
            material={materials["Material.004"]}
            position={[0.993, 0.319, -0.066]}
            rotation={[0, 0.42, 0]}
          />
          <mesh
            name="Plane002"
            castShadow
            receiveShadow
            geometry={nodes.Plane002.geometry}
            material={materials["Material.005"]}
            position={[0.559, 0.038, 0]}
          />
          <mesh
            name="Plane003"
            castShadow
            receiveShadow
            geometry={nodes.Plane003.geometry}
            material={materials["Material.004"]}
            position={[-0.992, 0.319, -0.066]}
            rotation={[-Math.PI, 1.215, 0]}
            scale={-1}
          />
        </mesh>
        <mesh
          name="Sphere"
          castShadow
          receiveShadow
          geometry={nodes.Sphere.geometry}
          material={materials["Material.001"]}
          rotation={[0, -0.428, 0]}
          scale={0.926}
        >
          <mesh
            name="Sphere001"
            castShadow
            receiveShadow
            geometry={nodes.Sphere001.geometry}
            material={materials["Material.002"]}
          />
          <group
            name="Vert"
            position={[-0.014, -0.001, 0.008]}
            rotation={[0, 0.504, -0.375]}
          >
            <mesh
              name="Vert001"
              castShadow
              receiveShadow
              geometry={nodes.Vert001.geometry}
              material={materials["Material.009"]}
            />
            <mesh
              name="Vert001_1"
              castShadow
              receiveShadow
              geometry={nodes.Vert001_1.geometry}
              material={materials["Material.010"]}
            />
          </group>
          <mesh
            name="Vert002"
            castShadow
            receiveShadow
            geometry={nodes.Vert002.geometry}
            material={nodes.Vert002.material}
            position={[0.055, -0.155, 0.029]}
            rotation={[0.562, -0.828, 0.51]}
            scale={1.13}
          >
            <mesh
              name="Circle"
              castShadow
              receiveShadow
              geometry={nodes.Circle.geometry}
              material={materials["Material.008"]}
              position={[0, 2.291, 0]}
            />
            <mesh
              name="Circle001"
              castShadow
              receiveShadow
              geometry={nodes.Circle001.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
            />
            <mesh
              name="Circle002"
              castShadow
              receiveShadow
              geometry={nodes.Circle002.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
            />
            <mesh
              name="Circle003"
              castShadow
              receiveShadow
              geometry={nodes.Circle003.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[0, -Math.PI / 6, 0]}
            />
            <mesh
              name="Circle004"
              castShadow
              receiveShadow
              geometry={nodes.Circle004.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[0, -Math.PI / 3, 0]}
            />
            <mesh
              name="Circle005"
              castShadow
              receiveShadow
              geometry={nodes.Circle005.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[0, -Math.PI / 2, 0]}
            />
            <mesh
              name="Circle006"
              castShadow
              receiveShadow
              geometry={nodes.Circle006.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[Math.PI, -Math.PI / 3, Math.PI]}
            />
            <mesh
              name="Circle007"
              castShadow
              receiveShadow
              geometry={nodes.Circle007.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[Math.PI, -Math.PI / 6, Math.PI]}
            />
            <mesh
              name="Circle008"
              castShadow
              receiveShadow
              geometry={nodes.Circle008.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[Math.PI, 0, Math.PI]}
            />
            <mesh
              name="Circle009"
              castShadow
              receiveShadow
              geometry={nodes.Circle009.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[-Math.PI, Math.PI / 6, -Math.PI]}
            />
            <mesh
              name="Circle010"
              castShadow
              receiveShadow
              geometry={nodes.Circle010.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[-Math.PI, Math.PI / 3, -Math.PI]}
            />
            <mesh
              name="Circle011"
              castShadow
              receiveShadow
              geometry={nodes.Circle011.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
              name="Circle012"
              castShadow
              receiveShadow
              geometry={nodes.Circle012.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[0, Math.PI / 3, 0]}
            />
            <mesh
              name="Circle013"
              castShadow
              receiveShadow
              geometry={nodes.Circle013.geometry}
              material={materials["Material.007"]}
              position={[0, 2.291, 0]}
              rotation={[0, Math.PI / 6, 0]}
            />
          </mesh>
        </mesh>
        <mesh
          name="Circle014"
          castShadow
          receiveShadow
          geometry={nodes.Circle014.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          name="Plane004"
          castShadow
          receiveShadow
          geometry={nodes.Plane004.geometry}
          material={materials["Material.006"]}
          position={[1.734, -0.01, -0.243]}
          rotation={[-Math.PI, 0.424, -Math.PI]}
          scale={0.834}
        >
          <mesh
            name="Plane005"
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials["Material.007"]}
            position={[0, 0.192, 0.005]}
          />
        </mesh>
        <mesh
          name="Plane006"
          castShadow
          receiveShadow
          geometry={nodes.Plane006.geometry}
          material={materials["Material.011"]}
        />
        <mesh
          name="Circle015"
          castShadow
          receiveShadow
          geometry={nodes.Circle015.geometry}
          material={materials["Material.006"]}
          position={[2.301, 0, 0.349]}
          scale={0.803}
        />
        <mesh
          name="Circle016"
          castShadow
          receiveShadow
          geometry={nodes.Circle016.geometry}
          material={materials["Material.006"]}
          position={[1.274, 0, -1.225]}
          scale={0.427}
        />
        <mesh
          name="Circle017"
          castShadow
          receiveShadow
          geometry={nodes.Circle017.geometry}
          material={materials["Material.006"]}
          position={[1.599, 0, 1.844]}
          scale={0.336}
        />
        <mesh
          name="Circle018"
          castShadow
          receiveShadow
          geometry={nodes.Circle018.geometry}
          material={materials["Material.006"]}
          position={[-1.467, 0, -0.84]}
          scale={0.336}
        />
        <group name="Empty004" rotation={[0, -0.945, 0]} />
      </group>
    </group>
  );
  }
export default Island ;