"use client";

// Three.js knowledge brain — neurons coloured by type, matching Paper 05.08.
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type NeuronType = "principle" | "decision" | "memory" | "person" | "source";
export type Neuron = { id: string; label: string; type: NeuronType };

export const typeColor: Record<NeuronType, string> = {
  principle: "#D4F26A",
  decision: "#8FD8B0",
  memory: "#F4F7EC",
  person: "#E9A23B",
  source: "#8FA8FF",
};

// brain-ish ellipsoid, each type biased to a region (like lobes)
const region: Record<NeuronType, [number, number, number]> = {
  principle: [-1.4, 0.3, 0.2],
  decision: [0.2, 0.7, 0],
  memory: [-0.2, -0.4, 0.3],
  person: [1.0, -1.0, 0],
  source: [1.6, 0.4, -0.1],
};

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function buildField(n: number) {
  const types: NeuronType[] = ["principle", "decision", "memory", "person", "source"];
  const pts: { p: THREE.Vector3; t: NeuronType; s: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = types[i % 5];
    const [cx, cy, cz] = region[t];
    const p = new THREE.Vector3(cx + (rand(i) - 0.5) * 1.9, cy + (rand(i + 7) - 0.5) * 1.4, cz + (rand(i + 13) - 0.5) * 1.6);
    // clamp into the brain silhouette
    const k = (p.x / 2.6) ** 2 + (p.y / 1.6) ** 2 + (p.z / 1.4) ** 2;
    if (k > 1) p.multiplyScalar(1 / Math.sqrt(k));
    pts.push({ p, t, s: 0.018 + rand(i + 3) * 0.028 });
  }
  return pts;
}

function Field({ labels, selected, onSelect }: { labels: (Neuron & { at: number })[]; selected?: string; onSelect: (id: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const field = useMemo(() => buildField(140), []);
  const dust = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 900; i++) {
      const v = new THREE.Vector3(rand(i * 3) - 0.5, rand(i * 5) - 0.5, rand(i * 7) - 0.5).multiply(new THREE.Vector3(5.2, 3.2, 2.8));
      arr.push(v.x, v.y, v.z);
    }
    return new Float32Array(arr);
  }, []);
  const edges = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    field.forEach((a, i) => {
      let c = 0;
      for (let j = i + 1; j < field.length && c < 3; j++) {
        if (a.p.distanceTo(field[j].p) < 0.62) {
          pts.push(a.p, field[j].p);
          c++;
        }
      }
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [field]);
  const sel = labels.find((l) => l.id === selected);
  const selEdges = useMemo(() => {
    if (!sel) return null;
    const a = field[sel.at].p;
    const pts: THREE.Vector3[] = [];
    field
      .map((f) => f.p)
      .sort((x, y) => x.distanceTo(a) - y.distanceTo(a))
      .slice(1, 8)
      .forEach((b) => pts.push(a, b));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [sel, field]);

  useFrame(({ clock }, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.04;
      group.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.012} color="#8FD8B0" transparent opacity={0.35} />
      </points>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#8FD8B0" transparent opacity={0.16} />
      </lineSegments>
      {selEdges && (
        <lineSegments geometry={selEdges}>
          <lineBasicMaterial color="#D4F26A" transparent opacity={0.9} />
        </lineSegments>
      )}
      {field.map((f, i) => {
        const lab = labels.find((l) => l.at === i);
        const active = lab && lab.id === selected;
        return (
          <group key={i} position={f.p}>
            <mesh
              onClick={lab ? (e) => (e.stopPropagation(), onSelect(lab.id)) : undefined}
              onPointerOver={lab ? () => (document.body.style.cursor = "pointer") : undefined}
              onPointerOut={() => (document.body.style.cursor = "")}
            >
              <sphereGeometry args={[active ? 0.09 : f.s, 16, 16]} />
              <meshBasicMaterial color={typeColor[f.t]} />
            </mesh>
            <mesh>
              <sphereGeometry args={[(active ? 0.09 : f.s) * 2.2, 16, 16]} />
              <meshBasicMaterial color={typeColor[f.t]} transparent opacity={active ? 0.22 : 0.07} depthWrite={false} />
            </mesh>
            {active && (
              <mesh rotation={[0, 0, 0]}>
                <ringGeometry args={[0.16, 0.175, 48]} />
                <meshBasicMaterial color="#D4F26A" side={THREE.DoubleSide} />
              </mesh>
            )}
            {lab && (
              <Html position={[0.14, 0, 0]} style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
                {active ? (
                  <div style={{ background: "#D4F26A", color: "#111113", borderRadius: 4, padding: "6px 10px", whiteSpace: "nowrap", fontFamily: "system-ui", transform: "translateY(-50%)" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{lab.label}</div>
                    <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "#0E5A43" }}>{lab.type.toUpperCase()} · SELECTED</div>
                  </div>
                ) : (
                  <div style={{ border: `1px solid ${typeColor[lab.type]}66`, background: "#0E2E25CC", color: lab.type === "person" ? "#E9A23B" : "#DDEFE4", borderRadius: 4, padding: "3px 8px", fontSize: 11, whiteSpace: "nowrap", fontFamily: "system-ui", transform: "translateY(-50%)" }}>
                    {lab.label} · {lab.type[0].toUpperCase() + lab.type.slice(1)}
                  </div>
                )}
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function BrainGraph(props: { labels: (Neuron & { at: number })[]; selected?: string; onSelect: (id: string) => void; zoom?: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 6.2 / (props.zoom ?? 1)], fov: 42 }} dpr={[1, 2]}>
      <Field {...props} />
      <OrbitControls enablePan={false} enableDamping minDistance={3.5} maxDistance={9} />
    </Canvas>
  );
}
