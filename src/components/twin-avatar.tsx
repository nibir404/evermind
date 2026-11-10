"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const GLB_PATH = "/twin/avatar.glb";

/** What the twin is doing right now. Drives body motion, light and particles. */
export type TwinMode = "idle" | "listening" | "thinking" | "speaking" | "deciding";

const MODE_COLOR: Record<TwinMode, string> = {
  idle: "#8fd8b0",
  listening: "#d4f26a",
  thinking: "#8fd8b0",
  speaking: "#ffffff",
  deciding: "#d4f26a",
};

const HEAD_Y = 1.62; // world height of the head, used by halo and thought particles

function Model({ mode, angle }: { mode: TwinMode; angle: number }) {
  const { scene } = useGLTF(GLB_PATH);
  const root = useRef<THREE.Group>(null);
  const decideStart = useRef<number | null>(null);

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
    const g = root.current;
    if (!g) return;
    const t = clock.elapsedTime;
    if (mode === "deciding" && decideStart.current === null) decideStart.current = t;
    if (mode !== "deciding") decideStart.current = null;

    // Target pose per mode: lean (x), turn offset (y), tilt (z), height (y), scale.
    let lean = 0, turn = 0, tilt = 0, lift = 0, scale = 1;
    switch (mode) {
      case "listening": // leans in, slight attentive tilt
        lean = 0.06; tilt = 0.035; lift = Math.sin(t * 1.4) * 0.004;
        break;
      case "thinking": // looks up and away, slow considered sway
        lean = -0.05; turn = 0.22 + Math.sin(t * 0.7) * 0.08; tilt = -0.04; lift = Math.sin(t * 0.9) * 0.006;
        break;
      case "speaking": // talking rhythm: bob plus small emphatic gestures
        lean = 0.02 + Math.sin(t * 2.8) * 0.014; turn = Math.sin(t * 0.9) * 0.07; tilt = Math.sin(t * 1.6) * 0.012;
        lift = Math.abs(Math.sin(t * 3.6)) * 0.018;
        break;
      case "deciding": { // a firm nod, then stands tall
        const k = Math.min(1, (t - (decideStart.current ?? t)) / 0.9);
        lean = Math.sin(k * Math.PI) * 0.12; lift = 0.01; scale = 1 + Math.sin(k * Math.PI) * 0.015;
        break;
      }
      default: // idle breathing
        lift = Math.sin(t * 1.2) * 0.006; turn = Math.sin(t * 0.35) * 0.04;
    }

    const rate = mode === "deciding" ? 10 : 4;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, angle + turn, rate, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, lean, rate, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, tilt, rate, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, 0.95 + lift, 8, delta);
    const s = THREE.MathUtils.damp(g.scale.x, scale, 8, delta);
    g.scale.setScalar(s);
  });

  return (
    <group ref={root} position={[0, 0.95, 0]}>
      <primitive object={clone} scale={[2.1, 2.1, 2.1]} />
    </group>
  );
}

/** Rim light that changes colour and pulses with the mode. */
function MoodLight({ mode }: { mode: TwinMode }) {
  const light = useRef<THREE.PointLight>(null);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame(({ clock }, delta) => {
    const l = light.current;
    if (!l) return;
    const t = clock.elapsedTime;
    const base = { idle: 1.2, listening: 3.2, thinking: 1.8, speaking: 2.4, deciding: 5 }[mode];
    const pulse = mode === "speaking" ? Math.abs(Math.sin(t * 5.2)) * 1.6
      : mode === "listening" ? (Math.sin(t * 3) + 1) * 0.8
      : mode === "thinking" ? (Math.sin(t * 1.4) + 1) * 0.5 : 0;
    l.intensity = THREE.MathUtils.damp(l.intensity, base + pulse, 6, delta);
    color.set(MODE_COLOR[mode]);
    l.color.lerp(color, Math.min(1, delta * 4));
  });
  return <pointLight ref={light} position={[0, HEAD_Y + 0.3, -1.1]} distance={5} intensity={1.2} color="#8fd8b0" />;
}

/** Floor ring: ripples while listening, spins while thinking, flashes on a decision. */
function StateRing({ mode }: { mode: TwinMode }) {
  const ring = useRef<THREE.Mesh>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    color.set(MODE_COLOR[mode]);
    if (ring.current) {
      const m = ring.current.material as THREE.MeshBasicMaterial;
      m.color.lerp(color, Math.min(1, delta * 4));
      const target = { idle: 0.18, listening: 0.6, thinking: 0.45, speaking: 0.35 + Math.abs(Math.sin(t * 5.2)) * 0.3, deciding: 0.9 }[mode];
      m.opacity = THREE.MathUtils.damp(m.opacity, target, 6, delta);
      ring.current.rotation.z += delta * (mode === "thinking" ? 1.6 : 0.2);
    }
    if (ripple.current) {
      const m = ripple.current.material as THREE.MeshBasicMaterial;
      const active = mode === "listening" || mode === "deciding" || mode === "speaking";
      const speed = mode === "deciding" ? 1.4 : mode === "listening" ? 0.9 : 0.6;
      const p = (t * speed) % 1;
      ripple.current.scale.setScalar(1 + p * 0.9);
      m.color.copy(color);
      m.opacity = active ? (1 - p) * 0.55 : THREE.MathUtils.damp(m.opacity, 0, 6, delta);
    }
  });
  return (
    <group position={[0, -0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ring}>
        <ringGeometry args={[0.78, 0.8, 96, 1, 0, Math.PI * 1.6]} />
        <meshBasicMaterial transparent opacity={0.18} color="#8fd8b0" depthWrite={false} />
      </mesh>
      <mesh ref={ripple}>
        <ringGeometry args={[0.8, 0.815, 96]} />
        <meshBasicMaterial transparent opacity={0} color="#d4f26a" depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Small "thought" points that orbit the head while the twin is thinking. */
function ThoughtOrbit({ mode }: { mode: TwinMode }) {
  const group = useRef<THREE.Group>(null);
  const dots = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ phase: (i / 7) * Math.PI * 2, r: 0.42 + (i % 3) * 0.06, y: (i % 2) * 0.08 })), []);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const on = mode === "thinking" ? 1 : 0;
    dots.forEach((d, i) => {
      const m = refs.current[i];
      if (!m) return;
      const a = d.phase + t * 1.1;
      m.position.set(Math.cos(a) * d.r, HEAD_Y + 0.1 + d.y + Math.sin(a * 2) * 0.04, Math.sin(a) * d.r);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, on * (0.5 + 0.5 * Math.sin(a * 3)), 5, delta);
    });
    if (group.current) group.current.visible = true;
  });
  return (
    <group ref={group}>
      {dots.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} color="#d4f26a" depthWrite={false} />
        </mesh>
      ))}
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
  mode,
  speaking = false,
  zoom = 1,
  angle = 0,
  reset = 0,
}: {
  mode?: TwinMode;
  /** @deprecated use mode */
  speaking?: boolean;
  zoom?: number;
  angle?: number;
  reset?: number;
}) {
  const m: TwinMode = mode ?? (speaking ? "speaking" : "idle");
  return (
    <div className="twin-3d" role="group" aria-label={`Interactive 3D digital twin avatar, ${m}. Drag to orbit.`}>
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
        <MoodLight mode={m} />
        <Suspense fallback={null}>
          <Model mode={m} angle={angle} />
          <ContactShadows position={[0, -0.15, 0]} opacity={0.4} scale={4} blur={2.2} far={3} />
        </Suspense>
        <StateRing mode={m} />
        <ThoughtOrbit mode={m} />
        <View zoom={zoom} reset={reset} />
      </Canvas>
    </div>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload(GLB_PATH);
}
