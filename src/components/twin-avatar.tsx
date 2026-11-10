"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const GLB_PATH = "/twin/avatar.glb";

function Model({ speaking, angle }: { speaking: boolean; angle: number }) {
  const { scene } = useGLTF(GLB_PATH);
  const root = useRef<THREE.Group>(null);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    // Smooth orbit rotation towards button angle
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, angle, 8, delta);

    // Subtle breathing / speaking motion
    const t = clock.elapsedTime;
    if (speaking) {
      root.current.position.y = 0.95 + Math.sin(t * 3.5) * 0.015;
      root.current.rotation.x = Math.sin(t * 2.8) * 0.012;
      root.current.rotation.z = Math.sin(t * 1.5) * 0.008;
    } else {
      root.current.position.y = 0.95 + Math.sin(t * 1.2) * 0.006;
      root.current.rotation.x = 0;
      root.current.rotation.z = 0;
    }
  });

  return (
    <group ref={root} position={[0, 0.95, 0]}>
      <primitive object={clone} scale={[2.1, 2.1, 2.1]} />
    </group>
  );
}

function View({ zoom, reset }: { zoom: number; reset: number }) {
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    const c = controls.current;
    if (c) {
      c.object.position.set(0, 1.45, 4.5 / zoom);
      c.target.set(0, 1.05, 0);
      c.update();
    }
  }, [zoom, reset]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom={false}
      minPolarAngle={0.55}
      maxPolarAngle={2.1}
      target={[0, 1.05, 0]}
      enableDamping
    />
  );
}

export default function TwinAvatar({
  speaking = false,
  zoom = 1,
  angle = 0,
  reset = 0,
}: {
  speaking?: boolean;
  zoom?: number;
  angle?: number;
  reset?: number;
}) {
  return (
    <div className="twin-3d" role="group" aria-label="Interactive 3D digital twin avatar. Drag to orbit.">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.45, 4.5], fov: 36 }}
        gl={{ alpha: true, antialias: true }}
        fallback={<p className="demo-note">3D requires WebGL. Continue using the conversation controls below.</p>}
      >
        <ambientLight intensity={1.3} />
        <hemisphereLight args={["#f0f7f2", "#1e3328", 1.6]} />
        <directionalLight position={[3, 5, 4]} intensity={2.6} castShadow />
        <directionalLight position={[-3, 2, -3]} intensity={1.8} color="#8fd8b0" />
        <directionalLight position={[0, -2, 2]} intensity={0.6} color="#ffffff" />
        <Suspense fallback={null}>
          <Model speaking={speaking} angle={angle} />
          <ContactShadows position={[0, -0.15, 0]} opacity={0.4} scale={4} blur={2.2} far={3} />
        </Suspense>
        <View zoom={zoom} reset={reset} />
      </Canvas>
    </div>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload(GLB_PATH);
}
