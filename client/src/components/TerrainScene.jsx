import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── terrain height function (shared by mesh, drone, trees & village) ──
export function heightAt(x, z) {
  return (
    3.2 * Math.sin(x * 0.11) * Math.cos(z * 0.09) +
    7 * Math.exp(-((x - 9) ** 2 + (z + 6) ** 2) / 70) +
    4.5 * Math.exp(-((x + 14) ** 2 + (z - 10) ** 2) / 110) +
    1.1 * Math.sin(x * 0.32 + z * 0.21) +
    0.5 * Math.cos(x * 0.6 - z * 0.45)
  );
}

export const WATER_LEVEL = -2.1;
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// ───────── shaders ─────────
const terrainVert = /* glsl */ `
  varying float vH; varying vec3 vPos; varying vec3 vNormal;
  void main() { vH = position.y; vPos = position; vNormal = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
// natural hypsometric tint + hillshade + subtle contours
const terrainFrag = /* glsl */ `
  varying float vH; varying vec3 vPos; varying vec3 vNormal;
  float iso(float v) { float g = abs(fract(v - 0.5) - 0.5) / fwidth(v); return 1.0 - min(g, 1.0); }
  void main() {
    float t = clamp((vH + 3.0) / 13.0, 0.0, 1.0);
    vec3 col = mix(vec3(0.09, 0.19, 0.12), vec3(0.17, 0.31, 0.16), smoothstep(0.0, 0.3, t));
    col = mix(col, vec3(0.34, 0.37, 0.19), smoothstep(0.3, 0.55, t));
    col = mix(col, vec3(0.47, 0.39, 0.26), smoothstep(0.55, 0.8, t));
    col = mix(col, vec3(0.66, 0.6, 0.48), smoothstep(0.85, 1.0, t));
    float shade = clamp(dot(normalize(vNormal), normalize(vec3(-0.6, 0.75, -0.3))), 0.0, 1.0);
    col *= (0.42 + 0.58 * shade) * 0.82;
    col = mix(col, vec3(0.72, 0.58, 0.42), iso(vH * 0.5) * 0.18); // contour every 2 m, very light
    float edge = smoothstep(42.0, 22.0, length(vPos.xz));
    gl_FragColor = vec4(col, edge);
  }
`;
const waterVert = /* glsl */ `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const waterFrag = /* glsl */ `
  uniform float uTime; varying vec3 vPos;
  void main() {
    float a = smoothstep(34.0, 18.0, length(vPos.xy)) * 0.75;
    float rip = sin(vPos.x * 1.4 + uTime * 1.1) * sin(vPos.y * 1.1 - uTime * 0.8) * 0.5 + 0.5;
    gl_FragColor = vec4(mix(vec3(0.11, 0.29, 0.38), vec3(0.3, 0.6, 0.72), rip * 0.25), a);
  }
`;

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grd.addColorStop(0, "rgba(0,0,0,0.75)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// ───────── scene pieces ─────────
function Forest() {
  const ref = useRef();
  const items = useMemo(() => {
    const r = rng(11), out = [];
    for (let i = 0; i < 3000 && out.length < 700; i++) {
      const x = (r() - 0.5) * 54, z = (r() - 0.5) * 54;
      if (Math.hypot(x, z) > 26) continue;
      const h = heightAt(x, z);
      if (h < WATER_LEVEL + 0.4 || h > 5.5) continue;
      if (Math.sin(x * 0.21 + 1.3) * Math.cos(z * 0.27) + Math.sin(x * 0.07 - z * 0.11) * 0.6 < 0.15) continue; // woods mask
      if (Math.hypot(x + 4, z - 12) < 4.5) continue; // keep village clear
      out.push({ x, z, h, sc: 0.6 + r() * 0.7, c: r() });
    }
    return out;
  }, []);

  useEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
    const greens = ["#2C5E37", "#386F42", "#45703A", "#2A5236", "#4F7A3E"];
    items.forEach((it, i) => {
      m.compose(new THREE.Vector3(it.x, it.h + 0.55 * it.sc, it.z), q, new THREE.Vector3(it.sc, it.sc * (1 + it.c * 0.6), it.sc));
      ref.current.setMatrixAt(i, m);
      ref.current.setColorAt(i, col.set(greens[Math.floor(it.c * greens.length)]));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={ref} args={[null, null, items.length]}>
      <coneGeometry args={[0.42, 1.2, 6]} />
      <meshLambertMaterial />
    </instancedMesh>
  );
}

function Village() {
  const houses = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: 22 }, () => {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 4;
      const x = -4 + Math.cos(a) * d, z = 12 + Math.sin(a) * d;
      return { x, z, y: heightAt(x, z), w: 0.5 + r() * 0.5, d: 0.5 + r() * 0.6, rot: r() * Math.PI, red: r() < 0.3 };
    });
  }, []);
  return houses.map((h, i) => (
    <mesh key={i} position={[h.x, h.y + 0.2, h.z]} rotation={[0, h.rot, 0]}>
      <boxGeometry args={[h.w, 0.4, h.d]} />
      <meshLambertMaterial color={h.red ? "#8E5733" : "#CFC3A6"} />
    </mesh>
  ));
}

/** A quadcopter built from primitives: body, arms, motors, props + blur discs, skids, gimbal camera, nav lights. */
function Drone({ droneRef, propsRef, strobeRef }) {
  const arms = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  return (
    <group ref={droneRef} scale={1.7}>
      {/* body */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.28, 1.25]} />
        <meshStandardMaterial color="#3A3F44" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.17, -0.05]}>
        <boxGeometry args={[0.7, 0.1, 0.9]} />
        <meshStandardMaterial color="#D8DCDF" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* gimbal camera */}
      <mesh position={[0, -0.25, 0.5]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* arms, motors, props */}
      {arms.map(([sx, sz], i) => (
        <group key={i}>
          <mesh position={[sx * 0.55, 0.05, sz * 0.6]} rotation={[0, Math.atan2(sx, sz), 0]}>
            <boxGeometry args={[0.1, 0.08, 1.0]} />
            <meshStandardMaterial color="#2A2E32" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[sx * 0.95, 0.12, sz * 1.0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.16, 12]} />
            <meshStandardMaterial color="#1D2023" metalness={0.7} roughness={0.3} />
          </mesh>
          <group position={[sx * 0.95, 0.22, sz * 1.0]}>
            <mesh ref={(el) => (propsRef.current[i] = el)}>
              <boxGeometry args={[0.95, 0.015, 0.07]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.5, 24]} />
              <meshBasicMaterial color="#CFD6DA" transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      ))}
      {/* landing skids */}
      {[-0.32, 0.32].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.3, 0]}>
            <boxGeometry args={[0.04, 0.32, 0.04]} />
            <meshStandardMaterial color="#2A2E32" />
          </mesh>
          <mesh position={[x, -0.46, 0]}>
            <boxGeometry args={[0.05, 0.04, 0.9]} />
            <meshStandardMaterial color="#2A2E32" />
          </mesh>
        </group>
      ))}
      {/* navigation lights: red port, green starboard, white strobe */}
      <mesh position={[-0.95, 0.05, 1.05]}><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#FF3B30" /></mesh>
      <mesh position={[0.95, 0.05, 1.05]}><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#34C759" /></mesh>
      <mesh ref={strobeRef} position={[0, 0.1, -0.68]}><sphereGeometry args={[0.07, 8, 8]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
    </group>
  );
}

function buildPath() {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const z = -18 + i * 7;
    (i % 2 ? [22, -22] : [-22, 22]).forEach((x) => pts.push(new THREE.Vector3(x, heightAt(x, z) + 8, z)));
  }
  return new THREE.CatmullRomCurve3(pts, true, "centripetal", 0.35);
}

function Scene({ reduce }) {
  const droneRef = useRef();
  const propsRef = useRef([]);
  const strobeRef = useRef();
  const shadowRef = useRef();
  const look = useRef(new THREE.Vector3());
  const camTarget = useRef(new THREE.Vector3());
  const { camera, pointer } = useThree();
  const curve = useMemo(buildPath, []); // flight path is used for motion only — never drawn
  const shadowTex = useMemo(makeShadowTexture, []);
  const waterUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(84, 84, 140, 140);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, heightAt(p.getX(i), p.getZ(i)));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const u = (t * (reduce ? 0.004 : 0.01)) % 1;
    const p = curve.getPointAt(u);
    const tan = curve.getTangentAt(u);
    const d = droneRef.current;
    if (d) {
      d.position.set(p.x, p.y + Math.sin(t * 1.6) * 0.12, p.z);
      // yaw towards travel direction, slight bank & pitch like a real multirotor
      const yaw = Math.atan2(tan.x, tan.z);
      d.rotation.set(0.12, yaw, 0, "YXZ");
    }
    propsRef.current.forEach((pr, i) => pr && (pr.rotation.y += dt * (i % 2 ? -45 : 45)));
    if (strobeRef.current) strobeRef.current.visible = t % 1.2 < 0.08;
    if (shadowRef.current) shadowRef.current.position.set(p.x, Math.max(heightAt(p.x, p.z), WATER_LEVEL) + 0.06, p.z);
    waterUniforms.uTime.value = t;

    // slow orbit + pointer parallax; gaze drifts toward the drone so it stays readable
    const a = t * 0.02;
    camTarget.current.set(Math.sin(a) * 38 + pointer.x * 5, 24 + pointer.y * 3, Math.cos(a) * 38);
    camera.position.lerp(camTarget.current, 0.03);
    look.current.lerp(new THREE.Vector3(p.x * 0.35, 1.5, p.z * 0.35), 0.03);
    camera.lookAt(look.current);
  });

  return (
    <>
      <ambientLight intensity={0.75} color="#E3EBD9" />
      <directionalLight position={[-12, 20, -6]} intensity={1.6} color="#FFF1D6" />
      <hemisphereLight args={["#CFE3F0", "#2B3A22", 0.35]} />
      <mesh geometry={geo}>
        <shaderMaterial vertexShader={terrainVert} fragmentShader={terrainFrag} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_LEVEL, 0]} renderOrder={1}>
        <planeGeometry args={[72, 72, 1, 1]} />
        <shaderMaterial vertexShader={waterVert} fragmentShader={waterFrag} uniforms={waterUniforms} transparent depthWrite={false} />
      </mesh>
      <Forest />
      <Village />
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.55} />
      </mesh>
      <Drone droneRef={droneRef} propsRef={propsRef} strobeRef={strobeRef} />
    </>
  );
}

/** 3D terrain with a survey drone. Stops rendering while off-screen. */
export default function TerrainScene() {
  const host = useRef();
  const [visible, setVisible] = useState(true);
  const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(host.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 24, 38], fov: 40, near: 0.1, far: 300 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene reduce={reduce} />
      </Canvas>
    </div>
  );
}
