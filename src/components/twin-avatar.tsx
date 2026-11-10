"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Group, MathUtils } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type V3 = [number, number, number];
function Form({ position=[0,0,0], scale=[1,1,1], color, roughness=.7 }: {position?:V3;scale?:V3;color:string;roughness?:number}) {
 return <mesh position={position} scale={scale} castShadow receiveShadow><sphereGeometry args={[1,40,32]}/><meshStandardMaterial color={color} roughness={roughness}/></mesh>;
}
/* Solid geometry on every side. A local, stylized stand-in until the approved
   likeness-preserving GLB can be generated. No portrait plane or CSS rotation. */
function Avatar({speaking,angle}:{speaking:boolean;angle:number}) {
 const root=useRef<Group>(null);const head=useRef<Group>(null);
 useFrame(({clock},delta)=>{if(!root.current)return;root.current.rotation.y=MathUtils.damp(root.current.rotation.y,angle,8,delta);if(head.current)head.current.rotation.z=speaking?Math.sin(clock.elapsedTime*1.3)*.015:0;});
 const skin="#bd8669",suit="#17283e",hair="#252b2d";
 return <group ref={root} position={[0,-.13,0]}>
  <Form position={[0,.65,0]} scale={[.66,.77,.32]} color={suit}/>
  <Form position={[0,.1,0]} scale={[.55,.24,.3]} color={suit}/>
  <Form position={[0,1.4,0]} scale={[.17,.24,.17]} color={skin}/>
  <Form position={[0,1.16,.29]} scale={[.16,.26,.04]} color="#b6cce5"/>
  <Form position={[0,1.15,.34]} scale={[.048,.18,.018]} color="#26466a"/>
  {([-1,1] as const).map(side=><group key={side}>
   <Form position={[side*.62,.8,0]} scale={[.2,.53,.22]} color={suit}/>
   <Form position={[side*.66,.3,.08]} scale={[.15,.17,.14]} color={skin}/>
   <mesh position={[side*.24,1.12,.315]} rotation={[0,0,side*-.35]}><boxGeometry args={[.18,.5,.05]}/><meshStandardMaterial color="#22354c"/></mesh>
  </group>)}
  {[.42,.69].map(y=><Form key={y} position={[.03,y,.32]} scale={[.023,.023,.009]} color="#080d15"/>)}
  <Form position={[-.3,1.18,.33]} scale={[.032,.032,.01]} color="#D4F26A" roughness={.3}/>
  <group ref={head} position={[0,1.83,0]}>
   <Form scale={[.3,.39,.285]} color={skin}/>
   <Form position={[0,.245,-.025]} scale={[.294,.18,.27]} color={hair}/>
   <Form position={[0,.07,-.19]} scale={[.28,.28,.11]} color={hair}/>
   <Form position={[0,-.20,.13]} scale={[.225,.145,.17]} color="#7b7a72"/>
   <Form position={[0,-.16,.242]} scale={[.18,.12,.055]} color={skin}/>
   {([-1,1] as const).map(side=><group key={side}>
    <Form position={[side*.3,-.015,0]} scale={[.055,.105,.065]} color={skin}/>
    <Form position={[side*.112,.025,.255]} scale={[.065,.03,.025]} color="#e5ded1"/>
    <Form position={[side*.112,.025,.278]} scale={[.021,.024,.008]} color="#302b25"/>
    <Form position={[side*.112,.087,.262]} scale={[.072,.013,.018]} color={hair}/>
    <Form position={[side*.18,-.07,.21]} scale={[.085,.07,.045]} color={skin}/>
   </group>)}
   <Form position={[0,-.025,.29]} scale={[.045,.095,.065]} color={skin}/>
   <Form position={[0,-.15,.294]} scale={[.082,speaking?.013:.008,.012]} color="#623d36"/>
   <Form position={[0,-.25,.225]} scale={[.10,.055,.025]} color="#a8a69b"/>
  </group>
 </group>;
}
function View({zoom,reset}:{zoom:number;reset:number}) {
 const controls=useRef<OrbitControlsImpl>(null);
 useEffect(()=>{const c=controls.current;if(c){c.object.position.set(0,1.45,4.5/zoom);c.target.set(0,1.05,0);c.update();}},[zoom,reset]);
 return <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom={false} minPolarAngle={.55} maxPolarAngle={2.1} target={[0,1.05,0]} enableDamping/>;
}
export default function TwinAvatar({speaking=false,zoom=1}:{speaking?:boolean;zoom?:number}) {
 const [angle,setAngle]=useState(0);const [reset,setReset]=useState(0);
 return <div className="twin-3d" role="group" aria-label="Interactive solid 3D demo avatar. Drag to orbit, or use rotation buttons.">
 <Canvas shadows dpr={[1,1.5]} camera={{position:[0,1.45,4.5],fov:36}} gl={{alpha:true,antialias:true}} fallback={<p className="demo-note">3D requires WebGL. Continue using the conversation controls below.</p>}>
  <ambientLight intensity={1.2}/><hemisphereLight args={["#e9f4ee","#29382b",1.5]}/><directionalLight position={[3,5,4]} intensity={2.4} castShadow/><directionalLight position={[-3,2,-3]} intensity={2} color="#8fd8b0"/>
  <Suspense fallback={null}><Avatar speaking={speaking} angle={angle}/><ContactShadows position={[0,-.26,0]} opacity={.3} scale={4} blur={2.5} far={3}/></Suspense><View zoom={zoom} reset={reset}/>
 </Canvas>
 <div className="twin-orbit-controls"><button aria-label="Rotate avatar left" onClick={()=>setAngle(a=>a-Math.PI/4)}>←</button><button onClick={()=>{setAngle(0);setReset(x=>x+1);}}>Front</button><button aria-label="Rotate avatar right" onClick={()=>setAngle(a=>a+Math.PI/4)}>→</button></div>
 <span className="twin-model-caption">3D demo avatar</span>
 </div>;
}
