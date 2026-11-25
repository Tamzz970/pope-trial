// "Paus yang Mengadili Mayat" - Cadaver Synod 897. 9:16 720x1280 30fps. 14 scenes, cuts on spoken beats (words.json).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, LITE } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Sign, Calendar, Grade, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shaft, Dust, Rug, Plant } from "../style/props";
import { Cam, Key, camAt, FaceGroup, hand, Extrude, Curtain, StreetLamp, StreetSign, Building, HangLamp, Stars } from "../style/extra";
import { Lectern } from "../style/extra";
import { Column, Cathedra, Gavel, Shovel, Torch, Candle, Scroll, Bars, River, Stretcher, Coffin, Stamp, FlatPuppet } from "../style/extra2";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8, WALK = 3.4;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
const monk: Look = { skin: "#f3d5b5", body: "#7a4f2a", outfit: "hoodie", hair: "none", shoe: "#2a1a12" };
const monk2: Look = { skin: "#e0b48c", body: "#5b3b22", outfit: "hoodie", hair: "short", hairColor: "#3a2a1a", shoe: "#2a1a12" };
const priests: Look[] = [
  { skin: "#fbe3c8", body: "#6b2f8f", outfit: "hoodie", hair: "short", hairColor: "#333" }, { skin: "#c98e62", body: "#7a4f2a", outfit: "hoodie", hair: "none" },
  { skin: "#f6d6bd", body: "#2d3142", outfit: "hoodie", hair: "grey" }, { skin: "#8d5a3a", body: "#a3182b", outfit: "hoodie", hair: "short", hairColor: "#111" },
  { skin: "#e0b48c", body: "#6b2f8f", outfit: "hoodie", hair: "none" }, { skin: "#fbe3c8", body: "#7a4f2a", outfit: "hoodie", hair: "swept", hairColor: "#5a3420" },
];
const stefan: Look = { skin: "#f7d4b5", body: "#a3182b", outfit: "blazer", shirt: "#ffd34a", hair: "none", mitre: "#f6f1e4", shoe: "#2a1a12" };
const shroud: Look = { skin: "#b8cba6", body: "#d8d6cc", outfit: "shirt", hair: "grey", shoe: "#2a1a12" };
const corpse: Look = { skin: "#b8cba6", body: "#f4efe0", outfit: "blazer", shirt: "#ffd34a", hair: "grey", mitre: "#f6f1e4", shoe: "#2a1a12" };
const deacon: Look = { skin: "#e0b48c", body: "#f2f2f2", outfit: "hoodie", hair: "short", hairColor: "#3b2a1a", shoe: "#2a1a12" };
const theo: Look = { skin: "#e8c39e", body: "#ffffff", outfit: "blazer", shirt: "#2f8cff", hair: "grey", mitre: "#eaf3ff", shoe: "#2a1a12" };
const guard: Look = { skin: "#f3d5b5", body: "#4b5266", outfit: "blazer", shirt: "#9aa0b8", hair: "none", hat: "#8c92a8", shoe: "#1b1b2a" };
const folk: Look[] = [
  { skin: "#fbe3c8", body: "#e53e3e", outfit: "shirt", hair: "short", hairColor: "#222" }, { skin: "#c98e62", body: "#22a867", outfit: "shirt", hair: "bob", hairColor: "#1a1010" },
  { skin: "#fbe3c8", body: "#f0b429", outfit: "hoodie", hair: "grey" }, { skin: "#8d5a3a", body: "#2f8cff", outfit: "shirt", hair: "swept", hairColor: "#111" },
  { skin: "#f6d6bd", body: "#ff7a29", outfit: "shirt", hair: "short", hairColor: "#3b2a1a" }, { skin: "#e0b48c", body: "#7c4dff", outfit: "hoodie", hair: "bob", hairColor: "#5a3420" },
];

const Scene: React.FC<{ start: number; end: number; first?: boolean; trans?: Trans; bg: string; children: (c: Ctx) => React.ReactNode }> = ({ start, end, first, trans = "ghost", bg, children }) => {
  const { fps } = useVideoConfig(), lead = Math.max(1, Math.round((LEAD * fps) / 30)), tail = Math.max(1, Math.round((TAIL * fps) / 30));
  const from = Math.round(start * fps) - (first ? 0 : lead), dur = Math.round(end * fps) - from + tail;
  return <Sequence from={from} durationInFrames={dur} layout="none"><Inner from={from} first={first} trans={trans} bg={bg} children={children} /></Sequence>;
};
const Inner: React.FC<{ from: number; first?: boolean; trans: Trans; bg: string; children: (c: Ctx) => React.ReactNode }> = ({ from, first, trans, bg, children }) => {
  const { fps } = useVideoConfig(), fr = useCurrentFrame(), t = (fr + from) / fps, f = (fr * 30) / fps, ls = fr / fps; // f = local frame in 30fps units (animation speed is fps-independent)
  const k = first ? 1 : clamp(ls / (8 / 30)), ke = Easing.out(Easing.cubic)(k);
  const sc = !first && trans === "zoom" ? lerp(1.35, 1, ke) : 1;
  const tx = !first && trans === "whip" ? (1 - ke) * 720 : 0, blur = !first && trans === "whip" ? (1 - ke) * 14 : 0;
  return (
    <AbsoluteFill style={{ opacity: first || trans === "flash" || trans === "whip" ? 1 : k, transform: `translateX(${tx}px) scale(${sc})`, background: bg, filter: `saturate(1.32) contrast(1.07) brightness(1.02)${blur > 0.2 ? ` blur(${blur.toFixed(1)}px)` : ""}` }}>
      <ThreeCanvas dpr={LITE ? 0.6 : 1} width={720} height={1280} camera={{ fov: 60, position: [0, 2, 8], near: 0.1, far: 200 }} gl={{ antialias: !LITE }}>
        <color attach="background" args={[bg]} />{children({ t, f })}
      </ThreeCanvas>
      {!first && trans === "flash" ? <AbsoluteFill style={{ background: "#fff", opacity: 1 - clamp(ls / (7 / 30)) }} /> : null}
    </AbsoluteFill>
  );
};
const E = Easing, pop = (t: number, a: number, d = 0.25) => seg(t, a, a + d, E.out(E.back(3)));
const ballistic = (p0: V3, v: V3, dt: number, g = 20, floor = 0.15): V3 => { const d = Math.max(0, dt); const tl = (v[1] + Math.sqrt(v[1] * v[1] + 2 * g * Math.max(0, p0[1] - floor))) / g; const q = Math.min(d, tl); return [p0[0] + v[0] * q, Math.max(floor, p0[1] + v[1] * q - 0.5 * g * q * q), p0[2] + v[2] * q]; };

/* ---------- shared stone hall (basilica interior) ---------- */
const Hall: React.FC<{ t: number; f: number; back?: number; wall?: string; lamps?: boolean; cols?: boolean }> = ({ t, f, back = -12, wall = "#a8875c", lamps = true, cols = true }) => (<>
  <Floor kind="marble" a="#e6d6b4" b="#cdb98e" unit={2.4} w={34} d={34} />
  <WallDoor z={back} W={34} kind="brick" a={wall} b="#9a7a50" base="#5a3a22" />
  <SideWall x={-10} kind="brick" a={wall} b="#9a7a50" /><SideWall x={10} kind="brick" a={wall} b="#9a7a50" />
  {cols ? [-1, 1].map((s) => [-9, -3, 3].map((z) => <Column key={s + "_" + z} p={[s * 6.2, 0, z]} h={9} r={0.55} />)) : null}
  {[-1, 1].map((s) => <React.Fragment key={"w" + s}><Box p={[s * 9.85, 5.6, -3]} s={[0.12, 3.6, 2.0]} color="#3a6fd8" rot={[0, 0, 0]} line={4} /><Shaft p={[s * 7.4, 5.4, -3]} s={[2.6, 12]} rot={[0, 0, -s * 0.5]} color="255,226,140" o={0.2} /></React.Fragment>)}
  {lamps ? [-6, -1].map((z) => <HangLamp key={z} p={[0, 7.4, z]} color="#c9a24a" o={1} />) : null}
  <Candle p={[-3.2, 0, back + 2]} f={f} /><Candle p={[3.2, 0, back + 2]} f={f} /><Dust t={t} n={12} area={[7, 7, 5]} />
</>);

/* =================== S1  0 - 4.15  "Roma, Januari tahun 897." =================== */
const K1: Key[] = [{ t: 0, pos: [1.2, 8.6, 14], look: [0, 4.5, -8], fov: 62 }, { t: 2.2, pos: [0.3, 5.2, 9.2], look: [0, 3.6, -8], fov: 58 }, { t: 4.3, pos: [1.6, 3.2, 3.4], look: [0.6, 3.0, -8], fov: 54 }];
const S1 = ({ t, f }: Ctx) => {
  const mv1 = t < 3.4, m1 = -5.4 + 1.5 * Math.min(t, 3.4), m2 = m1 - 1.5, cal = pop(t, 0.9, 0.35);
  return (<>
    <Cam t={t} keys={K1} /><Lights warm="#ffd9a8" />
    <Stars p={[0, 16, -36]} s={[100, 56]} t={t} top="#120a3a" bottom="#4a2f86" /><Ball p={[-10, 15, -34]} r={2.4} color="#fff3c4" /><Glow p={[-10, 15, -33]} r={7} color="rgba(255,240,190,1)" o={0.4} />
    <Floor kind="tile" a="#6a5a84" b="#594a72" unit={2} w={60} d={60} />
    {/* basilica facade */}
    <Box p={[0, 4.6, -11]} s={[14, 9.2, 3]} color="#dcc79e" /><Extrude pts={[[-8, 0], [8, 0], [0, 3.6]]} depth={3} color="#c9ad7a" p={[0, 9.2, -11]} />
    <Box p={[0, 13.4, -11]} s={[0.3, 1.8, 0.3]} color="#ffc928" line={3} /><Box p={[0, 13.7, -11]} s={[1.1, 0.3, 0.3]} color="#ffc928" line={3} />
    {[-5.5, -3.3, 3.3, 5.5].map((x) => <Column key={x} p={[x, 0.5, -8.8]} h={8} r={0.5} />)}
    <Box p={[0, 2.6, -9.4]} s={[3.4, 5.2, 0.4]} color="#5a2e18" /><Box p={[0, 5.4, -9.4]} s={[3.8, 0.4, 0.5]} color="#b89a62" line={3} />
    <Box p={[0, 0.25, -8.2]} s={[16, 0.5, 3.4]} color="#b9a37c" /><Box p={[0, 0.75, -7.2]} s={[13, 0.5, 2.2]} color="#c9b48c" />
    <Glow p={[0, 2.6, -8.6]} r={3.2} color="rgba(255,180,80,1)" o={0.42} />
    {[-1, 1].map((s) => <React.Fragment key={s}><Building p={[s * 12.5, 0, -9]} s={[6, 10, 4]} color={s < 0 ? "#6a4a8c" : "#8c4a6a"} seed={s + 3} lit={0.4} /><Building p={[s * 11, 0, -2]} s={[4, 7, 3]} color={s < 0 ? "#7a5a9c" : "#9c5a7a"} seed={s + 8} lit={0.45} />
      <StreetLamp p={[s * 4.2, 0, -1]} flip={s > 0} h={4.8} /></React.Fragment>)}
    <StreetSign p={[3.4, 0, 0.6]} a="ROMA" h={3.8} />
    {/* calendar banner on two poles */}
    <Cyl p={[-4.9, 2.2, -3.2]} rt={0.07} h={4.4} color="#6b3a1a" line={2} /><Cyl p={[-2.1, 2.2, -3.2]} rt={0.07} h={4.4} color="#6b3a1a" line={2} />
    <group position={[-3.5, 3.8, -3.1]} scale={Math.max(0.01, cal)}><Calendar p={[0, 0, 0]} month="JAN" day="897" s={2.5} /></group>
    {[0, 1].map((i) => { const x = i ? m2 : m1; return <Person key={i} p={[x, 0, -1.6 + i * 0.5]} h={3.1} look={i ? monk2 : monk} f={f} pose={{ mood: "deadpan", walk: x * WALK, speed: mv1 ? 0.75 : 0, armR: i ? undefined : [0.27, 0.5], lookX: 1 }} />; })}
    <FaceGroup p={[m1, 0, -1.6]}><Torch p={hand(3.1, [0.27, 0.5], 0, false, 0.12).map((v, j) => j === 1 ? v + 0.45 : v) as V3} f={f} /></FaceGroup>
    <Dust t={t} n={14} area={[8, 8, 4]} />
  </>);
};

/* =================== S2  4.15 - 8.65  hall of silent clergy =================== */
const K2: Key[] = [{ t: 4.15, pos: [-6.2, 3.6, 5.8], look: [-1.0, 2.8, -5], fov: 62 }, { t: 6.4, pos: [-1.0, 3.2, 7.0], look: [0.4, 2.9, -6], fov: 60 }, { t: 8.75, pos: [5.0, 3.4, 5.8], look: [0.4, 2.9, -6], fov: 60 }];
const S2 = ({ t, f }: Ctx) => {
  const hush = seg(t, 7.0, 7.9, E.inOut(E.sin));
  const rows: { x: number; z: number; i: number }[] = []; for (let r = 0; r < 4; r++) for (const s of [-1, 1]) rows.push({ x: s * 2.6 + s * (r % 2) * 0.3, z: -1.4 - r * 2.6, i: r * 2 + (s > 0 ? 1 : 0) });
  return (<>
    <Cam t={t} keys={K2} /><Lights warm="#ffe4b0" /><Hall t={t} f={f} />
    <Rug p={[0, 0, -3]} s={[3.4, 24]} a="#a3182b" b="#ffc23a" />
    {rows.map((r) => <Person key={r.i} p={[r.x, 0, r.z]} h={3.1} look={priests[r.i % 6]} f={f + r.i * 11} pose={{ mood: "deadpan", flip: r.x > 0, lookX: (r.x > 0 ? -1 : 1) * 0.8 + (1 - hush) * Math.sin(f * 0.11 + r.i * 2) * 1.4, nerv: 0.1 * (1 - hush), sweat: r.i === 3 ? 0.5 * (1 - hush) : 0, arms: "chest", armK: 0.9 }} />)}
    <Curtain p={[0, 5, -11.8]} s={[14, 9]} /><Cathedra p={[0, 0.6, -9]} /><Box p={[0, 0.3, -9]} s={[7, 0.6, 5]} color="#c9b48c" />
    <Glow p={[0, 5, -8]} r={5} color="rgba(255,200,90,1)" o={0.3} />
  </>);
};

/* corpse in the court chair (seat feet hidden inside the chair block) */
const Seated: React.FC<{ p: V3; f: number; t: number; h?: number; flip?: boolean }> = ({ p, f, t, h = 3.1, flip }) => (<>
  <Cathedra p={p} />
  <Person p={[p[0], p[1] + 0.7, p[2] + 0.2]} h={h} look={corpse} f={f} pose={{ mood: "dead", hunch: 1.1, tilt: 0.05 * (flip ? -1 : 1) + Math.sin(f * 0.05) * 0.004, arms: "chest", armK: 1, flip, squash: 0 }} shadow={false} />
  {[0, 1].map((i) => <Ball key={i} p={[p[0] + Math.sin(t * 5 + i * 3) * (0.7 + i * 0.3), p[1] + 4.2 + Math.sin(t * 7 + i) * 0.3, p[2] + 0.5 + Math.cos(t * 5 + i * 3) * 0.5]} r={0.05} color="#111" ink={0.0} />)}
</>);

/* =================== S3  8.65 - 13.45  the dead pope on the judge's chair =================== */
const K3: Key[] = [{ t: 8.65, pos: [0, 3.2, 7.0], look: [0, 2.8, -6], fov: 58 }, { t: 10.9, pos: [0.3, 3.6, 2.4], look: [0, 2.9, -5.8], fov: 52 }, { t: 12.3, pos: [0.15, 3.9, 0.2], look: [0, 3.0, -5.8], fov: 46 }, { t: 13.55, pos: [0.15, 3.9, 0.0], look: [0, 3.0, -5.8], fov: 46 }];
const S3 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K3} /><Lights warm="#ffd9a0" /><Hall t={t} f={f} lamps={false} />
  <Curtain p={[0, 5, -11.8]} s={[16, 10]} color="#8c1224" /><Box p={[0, 0.3, -6]} s={[8, 0.6, 5.4]} color="#c9b48c" /><Seated p={[0, 0.6, -6]} f={f} t={t} />
  <Glow p={[0, 5, -5]} r={5} color="rgba(255,190,80,1)" o={0.35} /><Shaft p={[0, 11, -4]} s={[3, 13]} rot={[0, 0, 0.0]} color="255,235,170" o={0.3} />
  {[-1, 1].map((s) => <Person key={s} p={[s * 3.4, 0, -1.6]} h={3.2} look={priests[s > 0 ? 3 : 1]} f={f} pose={{ mood: "worry", flip: s > 0, lookX: s * -0.9, nerv: 0.3, arms: "chest", armK: 0.7 }} />)}
  <group position={[-4.1, 4.6, -5.2]} scale={Math.max(0.01, pop(t, 12.6, 0.3))}><Sign p={[0, 0, 0]} s={[2.4, 1.2]} text={"7\nBULAN"} bg="#fff" fg="#d11a2a" size={70} /></group>
</>);

/* =================== S4  13.45 - 18.75  Formosus headstone, Stefanus, the dig =================== */
const K4: Key[] = [{ t: 13.45, pos: [-2.8, 2.5, 3.4], look: [-3.3, 2.0, -3.2], fov: 50 }, { t: 15.0, pos: [1.2, 3.2, 7.2], look: [1.8, 2.6, -3.5], fov: 58 }, { t: 17.2, pos: [0.8, 3.6, 8.8], look: [0.8, 1.9, -3.0], fov: 56 }, { t: 18.85, pos: [0.4, 3.8, 9.6], look: [0.5, 1.7, -3.0], fov: 56 }];
const digPhase = (t: number) => (t - 17.7) / 0.95;
const Digger: React.FC<{ p: V3; flip: boolean; t: number; f: number; off: number; look: Look }> = ({ p, flip, t, f, off, look }) => {
  const h = 3.1, dig = t > 17.7, c = dig ? (((digPhase(t) + off) % 1) + 1) % 1 : 0, sgn = flip ? -1 : 1;
  const th = !dig ? 0.12 : c < 0.35 ? 0.65 : c < 0.6 ? lerp(0.65, -0.3, seg(c, 0.35, 0.6, E.inOut(E.sin))) : c < 0.75 ? lerp(-0.3, -1.9, seg(c, 0.6, 0.75, E.out(E.quad))) : lerp(-1.9, 0.65, seg(c, 0.75, 1, E.inOut(E.sin)));
  const rz = th * sgn, hp = hand(h, [0.2, 0.46], 0, flip, 0.12), tip: V3 = [hp[0] + 2.3 * Math.sin(rz), hp[1] - 2.3 * Math.cos(rz), hp[2]];
  const hold = dig && c >= 0.35 && c < 0.75;
  const tThrow = digPhase(t) + off; const air = dig && c >= 0.75 ? ballistic([tip[0], Math.max(0.3, tip[1]), 0], [-sgn * 3.2, 3.5, 0], (c - 0.75) * 0.95, 20, 0.1) : null; void tThrow;
  return (<>
    <Person p={p} h={h} look={look} f={f} pose={{ mood: "deadpan", flip, armR: [0.2, 0.46], armL: [0.08, 0.34], hunch: dig ? 0.6 : 0, squash: dig && c < 0.35 ? 0.04 : 0, nerv: dig ? 0.2 : 0, sweat: dig ? 0.5 : 0 }} />
    <FaceGroup p={p}><group position={hp} rotation={[0, 0, rz]}><group position={[0, -0.8, 0]}><Shovel p={[0, 0, 0]} /></group></group>
      {hold ? <Ball p={[tip[0], tip[1] + 0.15, tip[2] + 0.05]} r={0.2} color="#5a4030" ink={0.03} /> : null}
      {air && c < 0.97 ? <Ball p={air} r={0.2} color="#5a4030" ink={0.03} /> : null}</FaceGroup>
  </>);
};
const S4 = ({ t, f }: Ctx) => {
  const wx = lerp(7.4, 3.5, seg(t, 15.0, 16.4, E.inOut(E.sin))), walking = t > 15.0 && t < 16.4, point = seg(t, 17.2, 17.5);
  return (<>
    <Cam t={t} keys={K4} /><Lights warm="#aac4ff" />
    <Stars p={[0, 14, -26]} s={[80, 44]} t={t} top="#070c1e" bottom="#18305e" /><Ball p={[8, 11, -24]} r={2} color="#e8f0ff" /><Glow p={[8, 11, -23]} r={6} color="rgba(180,210,255,1)" o={0.35} />
    <Floor kind="tile" a="#3d3126" b="#352a20" unit={2.4} w={50} d={50} />
    <Box p={[-3.4, 1.3, -3.4]} s={[1.9, 2.6, 0.5]} color="#aeb3c2" /><Cyl p={[-3.4, 2.6, -3.4]} rt={0.95} h={0.5} color="#aeb3c2" rot={[Math.PI / 2, 0, 0]} />
    <group scale={1 + 0.12 * pop(t, 14.0, 0.3) * (1 - seg(t, 14.4, 14.8))} position={[-3.4, 0, 0]}><Sign p={[0, 1.9, -3.1]} s={[1.6, 0.55]} text="FORMOSUS" bg="#c8ccd8" size={46} /></group>
    {[[-6, -4.6], [-5.6, -8], [4.8, -8.6], [7.5, -5.4]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><Box p={[0, 0.9, 0]} s={[0.22, 1.8, 0.22]} color="#7d8296" line={2} /><Box p={[0, 1.3, 0]} s={[1.0, 0.22, 0.22]} color="#7d8296" line={2} /></group>)}
    <Box p={[0.2, 0.03, -3.2]} s={[3.0, 0.06, 2.0]} color="#120a06" line={1} /><Ball p={[-2.4, 0.15, -5.0]} r={0.9} color="#5a4030" s={[1.7, 0.6, 1]} /><Ball p={[3.2, 0.15, -5.0]} r={0.8} color="#5a4030" s={[1.6, 0.6, 1]} />
    <Cyl p={[-8, 3, -8]} rt={0.3} rb={0.5} h={6} color="#1a1410" /><Ball p={[-8, 6.6, -8]} r={1.6} color="#11261c" s={[1.5, 1, 1]} /><Ball p={[-6.8, 5.8, -8.2]} r={1.1} color="#0f2218" />
    <Digger p={[-1.7, 0, -2.4]} flip={false} t={t} f={f} off={0} look={monk} /><Digger p={[2.0, 0, -2.4]} flip t={t} f={f} off={0.5} look={monk2} />
    <Person p={[wx, 0, -3.8]} h={3.4} look={stefan} f={f} pose={{ mood: t > 17.2 ? "angry" : "smile", flip: true, walk: walking ? wx * WALK : undefined, speed: walking ? 0.8 : 0, arms: "point", armK: point }} />
    <Person p={[wx + 1.5, 0, -3.4]} h={3.0} look={monk} f={f} pose={{ mood: "worry", flip: true, walk: walking ? (wx + 1.5) * WALK : undefined, speed: walking ? 0.8 : 0, armR: [-0.27, 0.5] }} />
    <FaceGroup p={[wx + 1.5, 0, -3.4]}><Torch p={hand(3.0, [-0.27, 0.5], 0, false, 0.12).map((v, j) => j === 1 ? v + 0.45 : v) as V3} f={f} /></FaceGroup>
    <group position={[2.4, 5.6, -4.6]} scale={Math.max(0.01, pop(t, 16.1, 0.3))}><Sign p={[0, 0, 0]} s={[3.4, 0.95]} text="STEFANUS VI" bg="#ffd34a" size={62} /></group>
    <Dust t={t} n={10} area={[6, 6, 3]} color="rgba(190,210,255,.9)" />
  </>);
};

/* =================== S5  18.75 - 22.85  robed corpse carried in a litter, set down before the judges =================== */
const lx5 = (t: number) => -3.2 + 5.4 * seg(t, 18.75, 21.35, E.inOut(E.sin));
const ly5 = (t: number) => 1.25 - 0.5 * seg(t, 21.4, 21.95, E.inOut(E.sin));
const K5: Key[] = [18.75, 19.8, 20.7, 21.4, 22.95].map((tt, i) => ({ t: tt, pos: [lx5(tt) - 0.4, [3.2, 3.4, 3.5, 3.6, 4.2][i], [10.0, 9.8, 9.6, 9.4, 7.6][i]] as V3, look: [lx5(tt) - 0.3, 2.3, -3.2] as V3, fov: 56 }));
const S5 = ({ t, f }: Ctx) => {
  const x = lx5(t), bx = x - 3.0, v = (lx5(t + 0.04) - x) / 0.04, spd = clamp(Math.abs(v) / 2.6), y = ly5(t), mv = t < 21.4;
  const down = seg(t, 21.4, 21.95, E.inOut(E.sin)), up = seg(t, 21.9, 22.1);
  const robed = t >= 19.95, tt = t - 19.55, cape = tt > 0 && t < 20.1 ? ballistic([bx + 0.6, 2.0, -2.4], [(x - (bx + 0.6)) * 2.4, 3.6, -1.7], tt, 11, 3.0) : null;
  const polesY = (yy: number) => yy / 3.1;
  const carrier = (side: number) => ({ x: x + side * 1.75, pose: { mood: "deadpan" as const, flip: side < 0 ? false : true, walk: mv ? (x + side * 1.95) * WALK : undefined, speed: mv ? spd : 0, armR: [-side * 0.1, polesY(y)] as [number, number], armL: [-side * 0.1, polesY(y)] as [number, number], hunch: 0.5 * down * (1 - up), squash: 0.06 * down * (1 - up), nerv: 0.15 } });
  const c1 = carrier(1), c2 = carrier(-1);
  return (<>
    <Cam t={t} keys={K5} /><Lights warm="#ffe0a8" /><Hall t={t} f={f} cols={false} lamps={false} />
    <Rug p={[0, 0, -3]} s={[22, 4]} a="#a3182b" b="#ffc23a" />
    <Box p={[0, 0.85, -7.2]} s={[16, 1.7, 1.2]} color="#6b3a1a" /><Box p={[0, 1.75, -7.2]} s={[16.3, 0.14, 1.4]} color="#c9a24a" line={3} />
    {[-5.6, -2.0, 1.8, 5.4].map((px, i) => <Person key={i} p={[px, 0, -7.9]} h={3.2} look={priests[(i + 2) % 6]} f={f + i * 7} pose={{ mood: i % 2 ? "angry" : "deadpan", arms: "chest", armK: 0.8 }} />)}
    <Column p={[-8, 0, -8]} h={9} r={0.6} /><Column p={[8, 0, -8]} h={9} r={0.6} />
    {/* litter: carried with real hands on the poles; set down on the last beat */}
    <group position={[x, y, -3.0]}>
      {[-0.85, 0.85].map((z) => <Cyl key={z} p={[0, 0, z]} rt={0.07} h={3.6} color="#8a5a2a" line={2} rot={[0, 0, Math.PI / 2]} />)}
      <Box p={[0, 0.1, 0]} s={[1.7, 0.3, 1.5]} color="#7a1424" /><Box p={[0, 0.95, -0.7]} s={[1.7, 1.8, 0.15]} color="#a3182b" /><Box p={[0, 0.55, 0.78]} s={[1.7, 1.4, 0.12]} color="#c9a24a" />
      {[-0.7, 0.7].map((fx) => <Box key={fx} p={[fx, -0.5, 0]} s={[0.3, 0.5, 0.3]} color="#6b3a1a" line={2} />)}
    </group>
    <Person p={[x, y + 0.3, -3.0]} h={3.1} look={robed ? corpse : shroud} f={f} pose={{ mood: "dead", hunch: 1.0, tilt: 0.05 + Math.sin(f * 0.25) * 0.012 * spd, arms: "chest", armK: 1 }} shadow={false} />
    <Person p={[c1.x, 0, -3.0]} h={3.1} look={monk} f={f} pose={c1.pose} /><Person p={[c2.x, 0, -3.0]} h={3.1} look={monk2} f={f} pose={c2.pose} />
    <Person p={[bx, 0, -2.4]} h={3.1} look={priests[0]} f={f} pose={{ mood: robed ? "grin" : "deadpan", walk: mv ? bx * WALK : undefined, speed: mv ? spd : 0, armR: tt > 0 && tt < 0.3 ? [0.3, 0.72] : [0.2, 0.5], armRK: 1 }} />
    {cape ? <Box p={cape} s={[1.1, 0.1, 0.8]} rot={[tt * 9, tt * 4, 0.3]} color="#a3182b" /> : null}
    <Glow p={[x, 3.4, -2.6]} r={2.2} color="rgba(255,255,255,1)" o={t >= 19.95 ? 0.9 * Math.exp(-(t - 19.95) * 9) : 0} />
    {[-1, 1].map((s) => <Candle key={s} p={[s * 7, 0, -6]} f={f} h={2.4} />)}
  </>);
};

/* =================== S6  22.85 - 26.85  the charges: stamp, stamp =================== */
const stampY = (t: number, th: number, ly: number) => t < th - 0.22 ? 7.2 : t < th ? lerp(7.2, ly + 0.45, ((t - (th - 0.22)) / 0.22) ** 2) : lerp(ly + 0.45, 7.2, seg(t, th + 0.05, th + 0.45, E.out(E.cubic)));
const K6: Key[] = [{ t: 22.85, pos: [0, 5.2, 10.4], look: [0, 4.0, -4.8], fov: 58 }, { t: 24.0, pos: [0.0, 4.4, 9.0], look: [0, 3.9, -4.8], fov: 54 }, { t: 26.95, pos: [0.0, 4.2, 8.0], look: [0, 3.7, -4.8], fov: 52 }];
const S6 = ({ t, f }: Ctx) => {
  const open = seg(t, 22.9, 23.65, E.out(E.cubic)), k1 = pop(t, 24.0, 0.3) * (t >= 24.0 ? 1 : 0), k2 = pop(t, 25.9, 0.3) * (t >= 25.9 ? 1 : 0);
  return (<>
    <Cam t={t} keys={K6} impacts={[[24.0, 0.05], [25.9, 0.05]]} /><Lights warm="#ffc890" />
    <Floor kind="tile" a="#2a2038" b="#231a30" unit={2.2} w={34} d={30} /><WallDoor z={-8} W={34} kind="plain" a="#3b2a52" b="#3b2a52" base="#1a1226" /><SideWall x={-9} kind="plain" a="#33244a" b="#33244a" /><SideWall x={9} kind="plain" a="#33244a" b="#33244a" />
    {[-6.5, 6.5].map((x) => <Torch key={x} p={[x, 4.6, -7.6]} f={f + x} s={1.6} />)}
    <Box p={[0, 4.0, -5.1]} s={[4.2, 6.2, 0.2]} color="#7a4a22" line={3} />
    <Scroll p={[0, 4.0, -4.9]} w={3.4} open={open} lines={[{ text: "SUMPAH PALSU", k: k1 }, { text: "TAKHTA ILEGAL", k: k2 }]} />
    <group position={[0, stampY(t, t < 25.2 ? 24.0 : 25.9, t < 25.2 ? 4.7 : 3.5), -4.5]}><Stamp p={[0, 0, 0]} s={1.1} /></group>
    <Glow p={[0, 4.6, -4.2]} r={4.5} color="rgba(255,150,60,1)" o={0.22} />
    <Person p={[-3.0, 0, -3.6]} h={3.5} look={stefan} f={f} pose={{ mood: "angry", arms: "point", armK: seg(t, 23.2, 23.5), nerv: 0.2 }} />
    {[0, 1].map((i) => <Person key={i} p={[3.0 + i * 1.5, 0, -3.6 - i * 1.2]} h={3.1} look={priests[i + 3]} f={f + i * 9} pose={{ mood: "worry", flip: true, lookX: -1, nerv: 0.3, arms: "chest", armK: 0.8 }} />)}
    <Dust t={t} n={12} area={[6, 7, 3]} color="rgba(255,200,140,.9)" />
  </>);
};

/* =================== S7  26.85 - 31.25  the deacon who must defend a dead man =================== */
const K7: Key[] = [{ t: 26.85, pos: [0, 4.4, 9.0], look: [0.4, 3.4, -4.5], fov: 58 }, { t: 28.2, pos: [-2.2, 3.6, 3.4], look: [-2.7, 3.4, -3.6], fov: 52 }, { t: 29.55, pos: [-1.0, 3.9, 3.0], look: [-1.0, 3.5, -4.0], fov: 52 }, { t: 30.2, pos: [2.6, 4.3, 1.6], look: [3.3, 3.9, -5.2], fov: 44 }, { t: 31.35, pos: [2.8, 4.4, 1.3], look: [3.3, 3.9, -5.2], fov: 42 }];
const S7 = ({ t, f }: Ctx) => {
  const pt = seg(t, 27.35, 27.7), gulp = t > 27.7 && t < 28.4, brave = t >= 28.4 && t < 29.7, shr = seg(t, 30.3, 30.7);
  return (<>
    <Cam t={t} keys={K7} /><Lights warm="#ffe4b0" /><Hall t={t} f={f} />
    <Curtain p={[0, 5, -11.8]} s={[16, 10]} color="#2c3f8c" /><Box p={[3.4, 0.3, -5.5]} s={[6, 0.6, 4.6]} color="#c9b48c" /><Seated p={[3.4, 0.6, -5.5]} f={f} t={t} />
    <Lectern p={[-0.9, 0, -3.3]} h={1.6} label="LEX" />
    <Person p={[-2.7, 0, -3.6]} h={3.2} look={deacon} f={f} pose={{ mood: gulp ? "gulp" : brave ? "worry" : t >= 29.7 ? "deadpan" : "smile", nerv: gulp ? 0.9 : 0.5, sweat: t > 27.7 ? 1 : 0, lookX: t >= 29.7 ? 1.2 : 0, arms: t >= 30.3 ? "shrug" : brave ? "chest" : undefined, armK: t >= 30.3 ? shr : 0.9, hunch: gulp ? 0.8 : 0 }} />
    <Person p={[0.5, 0, -1.8]} h={3.6} look={priests[2]} f={f} pose={{ mood: "angry", flip: true, arms: "point", armK: pt * (1 - seg(t, 28.5, 28.9)) }} />
    <Glow p={[-2.7, 6.5, -3.4]} r={3.2} color="rgba(255,250,200,1)" o={0.4} />
    {[3, 1].map((i) => <Person key={i} p={[-6 + i * 0.4, 0, -4.5 - i]} h={3.0} look={priests[i]} f={f + i * 5} pose={{ mood: "deadpan", lookX: 1, arms: "chest", armK: 0.7 }} />)}
  </>);
};

/* =================== S8  31.25 - 37.35  Stefanus screams at the corpse; GUILTY =================== */
const K8: Key[] = [{ t: 31.25, pos: [4.2, 1.5, 3.2], look: [1.0, 3.0, -4.2], fov: 62 }, { t: 33.3, pos: [3.4, 1.8, 3.6], look: [0.4, 3.6, -4.4], fov: 58 }, { t: 35.2, pos: [1.8, 2.2, 5.0], look: [0.2, 3.3, -4.4], fov: 54 }, { t: 36.4, pos: [0.6, 2.4, 5.6], look: [0, 3.4, -4.4], fov: 54 }, { t: 37.45, pos: [0.3, 2.5, 5.4], look: [0, 3.6, -4.4], fov: 56 }];
const S8 = ({ t, f }: Ctx) => {
  const yell = t >= 31.9 && t < 34.5, flick = Math.sin(f * 1.7) > 0, slam = t >= 36.4 ? 1 : 0, hy = t < 35.9 ? 0.85 : t < 36.4 ? lerp(0.85, 0.85, 1) : lerp(0.85, 0.6, seg(t, 36.3, 36.45, E.in(E.quad))) ;
  const rec = t > 36.45 ? 0.6 + 0.12 * Math.exp(-(t - 36.45) * 8) * Math.sin((t - 36.45) * 30) * 0 : hy;
  return (<>
    <Cam t={t} keys={K8} impacts={[[36.45, 0.07]]} fovKick={[36.45]} /><Lights warm="#ffcf90" /><Hall t={t} f={f} />
    <Curtain p={[0, 5, -11.8]} s={[16, 10]} color="#a3182b" /><Box p={[-3.6, 0.3, -6]} s={[6, 0.6, 4.6]} color="#c9b48c" /><Seated p={[-3.6, 0.6, -6]} f={f} t={t} />
    {[0, 1, 2, 3, 4].map((i) => <Person key={i} p={[-5.5 + i * 2.3, 0, -8.2 - (i % 2) * 0.8]} h={3.0} look={priests[i % 6]} f={f + i * 13} pose={{ mood: yell ? "shock" : "worry", nerv: 0.4, lookX: 0, arms: "head", armK: yell ? 0.7 : 0 }} />)}
    <Box p={[0.35, 0.5, -4.2]} s={[1.0, 1.0, 1.0]} color="#7a4a22" line={3} />
    <Person p={[-0.4, 0, -4.2]} h={3.2} look={monk} f={f} pose={{ mood: t >= 36.4 ? "angry" : "deadpan", armR: [0.18, rec], armRK: 1, nerv: 0.1 }} />
    <FaceGroup p={[-0.4, 0, -4.2]}><Gavel p={hand(3.2, [0.18, rec], 0, false, 0.12).map((v, j) => j === 1 ? v : v) as V3} rot={[0, 0, Math.PI]} s={1} /></FaceGroup>
    <Glow p={[0.35, 1.2, -3.7]} r={2.4} color="rgba(255,255,255,1)" o={t >= 36.45 ? 0.9 * Math.exp(-(t - 36.45) * 8) : 0} />
    <Person p={[2.7, 0, -2.2]} h={4.0} look={stefan} f={f} pose={{ mood: yell ? (flick ? "shock" : "angry") : t >= 34.5 ? "grin" : "angry", flip: true, arms: yell ? "up" : "chest", armK: yell ? 0.9 : 1, tilt: yell ? 0.05 * Math.sin(f * 1.7) : -0.06, nerv: yell ? 0.8 : 0, sweat: yell ? 0.8 : 0, lookX: -1, hunch: yell ? 0.2 : 0 }} />
    <group position={[0, 5.6, -3.0]} rotation={[0, 0, -0.09]} scale={Math.max(0.01, pop(t, 36.5, 0.3))}><Sign p={[0, 0, 0]} s={[4.4, 1.3]} text="BERSALAH" bg="#d11a2a" fg="#ffffff" size={78} /></group>
  </>);
};

const Mitre3D: React.FC<{ p: V3; rot?: V3; s?: number; sy?: number }> = ({ p, rot, s = 1, sy = 1 }) => (
  <group position={p} rotation={rot} scale={[s, s * sy, s]}><Extrude pts={[[-0.55, 0], [-0.5, 1.0], [-0.15, 1.35], [0, 1.05], [0.15, 1.35], [0.5, 1.0], [0.55, 0]]} depth={0.5} color="#f6f1e4" line={3} /><Box p={[0, 0.12, 0]} s={[1.14, 0.22, 0.56]} color="#ffc928" line={2} /></group>
);
const nomitre: Look = { ...corpse, mitre: undefined };

/* =================== S9  37.35 - 40.7  papacy annulled: BATAL, mitre and robe stripped =================== */
const K9: Key[] = [{ t: 37.35, pos: [0, 2.6, 8.4], look: [0, 4.0, -5.5], fov: 60 }, { t: 39.0, pos: [0, 3.0, 6.4], look: [0, 4.0, -5.5], fov: 56 }, { t: 40.8, pos: [0.3, 3.4, 5.6], look: [0, 3.8, -5.5], fov: 52 }];
const S9 = ({ t, f }: Ctx) => {
  const gm = seg(t, 38.9, 39.2), gc = seg(t, 39.5, 39.8), mt = t - 39.2, ct = t - 39.7;
  const look = t < 39.2 ? corpse : t < 39.75 ? nomitre : shroud;
  const mitrePos = mt > 0 && mt < 1.2 ? ballistic([1.6, 5.2, -5.0], [-4.5, 6.5, 1.5], mt, 20, 0.3) : null;
  const capePos = ct > 0 && ct < 1.2 ? ballistic([-1.8, 4.2, -5.0], [5.5, 4.5, 0.8], ct, 20, 0.3) : null;
  return (<>
    <Cam t={t} keys={K9} impacts={[[38.2, 0.06]]} /><Lights warm="#ffd8a0" /><Hall t={t} f={f} />
    <Curtain p={[0, 5, -11.8]} s={[16, 10]} color="#2c3f8c" /><Box p={[0, 0.3, -6]} s={[8, 0.6, 5.4]} color="#c9b48c" />
    <Cathedra p={[0, 0.6, -6]} /><Person p={[0, 1.3, -5.8]} h={3.1} look={look} f={f} pose={{ mood: "dead", hunch: 1.1, tilt: 0.05, arms: "chest", armK: 1 }} shadow={false} />
    <Person p={[-2.1, 0, -4.6]} h={3.3} look={guard} f={f} pose={{ mood: "angry", armR: [0.36, 0.64], armRK: gc, armL: [0.3, 0.72], armLK: 0, lookX: 1, hunch: 0.3 * gc }} />
    <Person p={[2.1, 0, -4.6]} h={3.3} look={guard} f={f} pose={{ mood: "angry", flip: true, armR: [0.34, 0.8], armRK: gm, lookX: 1, hunch: 0.3 * gm }} />
    {mitrePos ? <Mitre3D p={mitrePos} rot={[mt * 9, mt * 6, 0]} s={0.9} /> : null}
    {capePos ? <Box p={capePos} s={[1.6, 0.1, 1.1]} rot={[ct * 8, ct * 5, 0.4]} color="#a3182b" /> : null}
    <Glow p={[0, 3.6, -5.2]} r={2.6} color="rgba(255,255,255,1)" o={(t >= 39.2 ? 0.7 * Math.exp(-(t - 39.2) * 10) : 0) + (t >= 39.75 ? 0.8 * Math.exp(-(t - 39.75) * 10) : 0)} />
    <group position={[0, 7.4, -5.5]}><Sign p={[0, 0, 0]} s={[4.6, 1.0]} text="PAUS FORMOSUS" bg="#ffd34a" size={62} />
      <group scale={Math.max(0.01, pop(t, 38.2, 0.25))} position={[0, 0, 0.3]} rotation={[0, 0, 0.12]}><Sign p={[0, 0, 0]} s={[3.6, 1.1]} text="BATAL" bg="#d11a2a" fg="#fff" size={92} /></group></group>
  </>);
};

/* =================== S10  40.7 - 42.75  thrown into the Tiber =================== */
const REL = 41.3, K10: Key[] = [{ t: 40.7, pos: [0.4, 3.8, 10.4], look: [0.2, 1.0, -3.0], fov: 62 }, { t: 42.0, pos: [1.2, 5.0, 8.4], look: [0.6, -0.8, -5.5], fov: 58 }, { t: 42.8, pos: [1.2, 5.4, 8.0], look: [0.6, -1.2, -5.8], fov: 58 }];
const S10 = ({ t, f }: Ctx) => {
  const wind = seg(t, 40.7, 41.2, E.inOut(E.sin)), pl = t < REL, dt = t - REL;
  const hx = -1.0, hy = pl ? lerp(2.4, 1.7, wind) : 0;
  const air = !pl ? ballistic([hx, 2.0, -0.6], [0.9, 3.0, -3.6], dt, 20, -2.6) : [hx, hy, -0.6] as V3;
  const landed = !pl && air[1] <= -2.58, sink = landed ? Math.min(1, (dt - 0.86) * 1.5) : 0;
  const tl = (3.0 + Math.sqrt(9 + 2 * 20 * 4.6)) / 20, tLand = REL + tl;
  return (<>
    <Cam t={t} keys={K10} impacts={[[tLand, 0.04]]} /><Lights warm="#ffcf99" />
    <Stars p={[0, 14, -34]} s={[100, 56]} t={t} top="#2a2f7a" bottom="#ff9a5a" n={0} />
    <River p={[0, -2.6, -12]} s={[46, 24]} t={t} rings={[{ x: air[0], z: air[2] + 12 - 12, t0: tLand }, { x: air[0], z: air[2] + 12 - 12, t0: tLand + 0.25 }]} />
    <Box p={[0, -0.3, 0]} s={[18, 0.6, 3.8]} color="#b9a37c" /><Box p={[0, 0.5, -1.7]} s={[18, 1.0, 0.4]} color="#a58f68" /><Box p={[-6, -1.9, 0]} s={[1.8, 3.2, 3.6]} color="#8e7a56" /><Box p={[6, -1.9, 0]} s={[1.8, 3.2, 3.6]} color="#8e7a56" />
    {[-1, 1].map((s) => <Building key={s} p={[s * 14, -2.6, -16]} s={[7, 11, 5]} color={s < 0 ? "#6a4a8c" : "#8c4a6a"} seed={s + 11} lit={0.5} />)}
    <StreetLamp p={[-7.5, 0, 0.8]} h={4.2} on={1} /><StreetLamp p={[7.5, 0, 0.8]} h={4.2} on={1} flip />
    <FlatPuppet p={[air[0], air[1] - sink * 1.4, air[2]]} h={3.0} look={shroud} f={f} ang={pl ? -Math.PI / 2 : -Math.PI / 2 + Math.min(dt, tl) * 3.0} pose={{ mood: "dead", arms: "chest", armK: 1 }} />
    <Person p={[-2.2, 0, 0.6]} h={3.3} look={guard} f={f} pose={{ mood: "deadpan", armR: [0.17, 0.66 - 0.18 * wind], armL: [0.17, 0.66 - 0.18 * wind], hunch: 0.4 * wind * (pl ? 1 : 0.2), lookX: 1 }} />
    <Person p={[2.4, 0, 0.6]} h={3.3} look={guard} f={f} pose={{ mood: "deadpan", flip: true, armR: [0.17, 0.66 - 0.18 * wind], armL: [0.17, 0.66 - 0.18 * wind], hunch: 0.4 * wind * (pl ? 1 : 0.2), lookX: 1 }} />
    <Glow p={[air[0], -2.5, air[2]]} r={2.2} color="rgba(220,240,255,1)" o={t >= tLand ? 0.8 * Math.exp(-(t - tLand) * 7) : 0} />
    <group position={[3.4, 1.7, -1.6]} scale={Math.max(0.01, pop(t, 42.0, 0.3))}><Sign p={[0, 0, 0]} s={[2.6, 0.8]} text="TIBER" bg="#2f8cff" fg="#fff" size={80} /></group>
  </>);
};

/* =================== S11  42.75 - 46.7  Rome will not forgive: the mob =================== */
const K11: Key[] = [{ t: 42.75, pos: [-2.4, 2.0, 7.6], look: [0.5, 3.2, -6], fov: 62 }, { t: 45.0, pos: [0.4, 2.7, 6.2], look: [0.2, 3.4, -6], fov: 58 }, { t: 46.8, pos: [0.2, 3.4, 5.0], look: [0, 3.8, -6], fov: 56 }];
const S11 = ({ t, f }: Ctx) => {
  const jump = (i: number) => { const c = clamp((t - (46.1 + i * 0.015)) / 0.45); return t >= 46.1 && t < 46.6 ? Math.sin(c * Math.PI) * 0.8 : 0; };
  const rage = seg(t, 43.6, 45.6);
  const mob = Array.from({ length: 9 }, (_, i) => ({ x: -5.6 + i * 1.4 + ((i * 7) % 3) * 0.2, z: -2 - (i % 3) * 1.8, i }));
  return (<>
    <Cam t={t} keys={K11} /><Lights warm="#ff9a5a" />
    <Floor kind="tile" a="#4a3a52" b="#3d2f45" unit={2} w={50} d={40} />
    <WallDoor z={-12} W={50} kind="plain" a="#2a1f3a" b="#2a1f3a" base="#140e20" />
    {[-1, 1].map((s) => <React.Fragment key={s}><Building p={[s * 9, 0, -9]} s={[6, 12, 4]} color={s < 0 ? "#7a4a8c" : "#8c4a5a"} seed={s + 5} lit={0.5} /><Building p={[s * 3.2, 0, -11]} s={[4, 9, 3]} color={s < 0 ? "#5a3a7c" : "#7c3a4a"} seed={s + 9} lit={0.4} /></React.Fragment>)}
    <StreetSign p={[0, 0, -9.5]} a="ROMA" h={4.6} /><Glow p={[0, 4, -5]} r={7} color="rgba(255,90,40,1)" o={0.16 + 0.2 * rage} />
    {mob.map((m) => <Person key={m.i} p={[m.x, jump(m.i), m.z]} sy={0} h={3.1} look={folk[m.i % 6]} f={f + m.i * 7} pose={{ mood: t > 43.6 ? "angry" : "worry", arms: "up", armK: seg(t, 43.2 + (m.i % 4) * 0.12, 43.6 + (m.i % 4) * 0.12) * (0.75 + 0.25 * Math.sin(f * 0.45 + m.i)), squash: jump(m.i) > 0 ? 0.05 : 0, nerv: 0.35 * rage }} />)}
    {[1, 3, 5, 7].map((i) => { const m = mob[i]; return <FaceGroup key={i} p={[m.x, jump(m.i), m.z]}><Torch p={hand(3.1, [0.2, 0.95], 0, false, 0.12).map((v, j) => j === 1 ? v + 0.5 : v) as V3} f={f + i} s={1.1} /></FaceGroup>; })}
    <Dust t={t} n={16} area={[8, 8, 4]} color="rgba(255,170,90,.9)" fall />
  </>);
};

/* =================== S12  46.7 - 50.45  prison, then months pass =================== */
const K12: Key[] = [{ t: 46.7, pos: [3.2, 3.2, 7.0], look: [0.4, 2.8, -3], fov: 58 }, { t: 48.6, pos: [0.6, 3.1, 6.0], look: [0, 2.6, -3], fov: 52 }, { t: 49.1, pos: [0.3, 3.2, 6.6], look: [0, 1.5, -3], fov: 54 }, { t: 50.55, pos: [0.0, 3.2, 6.0], look: [0, 1.3, -3], fov: 52 }];
const MONTHS = ["JAN", "APR", "JUN", "AGU"];
const S12 = ({ t, f }: Ctx) => {
  const sx = lerp(5.4, 0.3, seg(t, 46.7, 47.6, E.inOut(E.sin))), walk = t < 47.6, gate = lerp(4.2, 0, seg(t, 47.7, 48.0, E.in(E.quad)));
  const gone = t >= 49.0, dark = t >= 48.6 && t < 49.0 ? 0.35 : 1, mi = Math.min(3, Math.floor((t - 49.0) / 0.45)), mk = mi < 0 ? 0 : seg(t, 49.0 + mi * 0.45, 49.0 + mi * 0.45 + 0.18);
  const killer = seg(t, 48.2, 48.8, E.inOut(E.sin));
  return (<>
    <Cam t={t} keys={K12} impacts={[[48.0, 0.05]]} />
    <ambientLight intensity={1.3 * (gone ? 0.5 : dark)} /><directionalLight position={[2, 6, 5]} intensity={1.0 * (gone ? 0.45 : dark)} color="#b8c6ff" />
    <Floor kind="tile" a="#4a5260" b="#434a58" unit={2} w={30} d={26} /><WallDoor z={-6.5} W={30} kind="brick" a="#59627a" b="#4d566c" base="#2a2f40" /><SideWall x={-7} kind="brick" a="#59627a" b="#4d566c" /><SideWall x={7} kind="brick" a="#59627a" b="#4d566c" />
    <Box p={[-4.2, 0.55, -4.6]} s={[3.0, 1.1, 1.6]} color="#7a6a52" /><Box p={[4.8, 0.3, -5.4]} s={[1.2, 0.6, 1.2]} color="#6b5a46" /><Cyl p={[-5.5, 0.4, -2.8]} rt={0.35} h={0.8} color="#5a6a8c" />
    <Box p={[3.6, 5.2, -6.3]} s={[1.6, 2.0, 0.3]} color="#1b2238" line={3} /><Shaft p={[2.2, 5, -4]} s={[2.0, 9]} rot={[0, 0, 0.55]} color="170,190,255" o={0.22 * (gone ? 0.6 : 1)} />
    <group position={[-1.6, 4.9, -6.2]} scale={[1, gone && mk < 1 ? Math.max(0.05, mk) : 1, 1]}><Calendar p={[0, 0, 0]} month={MONTHS[Math.max(0, mi)] ?? "JAN"} day="897" s={2.4} /></group>
    {!gone ? <Person p={[sx, 0, -3.2]} h={3.3} look={stefan} f={f} pose={{ mood: t < 47.7 ? "worry" : "gulp", flip: true, walk: walk ? sx * WALK : undefined, speed: walk ? 0.7 : 0, hunch: 0.5, nerv: 0.9, sweat: 1, tilt: t > 47.7 ? -0.05 : 0 }} /> : <Mitre3D p={[0.3, 0.25, -1.4]} rot={[-1.35, 0.2, 0.3]} s={0.8} />}
    {!gone ? <Person p={[lerp(8, 1.8, killer), 0, -4.4]} h={3.3} look={{ ...monk2, body: "#14101e", skin: "#c8a888" }} f={f} pose={{ mood: "deadpan", flip: true, walk: killer > 0 && killer < 1 ? lerp(8, 1.8, killer) * WALK : undefined, speed: killer > 0 && killer < 1 ? 0.7 : 0, armR: [-0.1, 0.5] }} /> : null}
    <Person p={[5.2, 0, -2.0]} h={3.3} look={guard} f={f} pose={{ mood: "deadpan", flip: true, lookX: -1, armR: t < 47.7 ? [-0.18, 0.5] : undefined, armRK: 1 }} />
    {!gone ? <Glow p={[0.3, 4.2, -3.2]} r={3} color="rgba(255,200,120,1)" o={0.25 * dark} /> : null}
    <Bars p={[-3.2, 0, 2.4]} w={5.2} h={7.6} n={7} /><Bars p={[3.1, 0, 2.4]} w={5.2} h={7.6} n={7} />
    <Bars p={[gate + 0.0, 0, 2.5]} w={2.2} h={7.6} n={4} />
  </>);
};

/* =================== S13  50.45 - 56.65  next pope annuls, reburial, ban (dawn graveyard) =================== */
const tx13 = (t: number) => t < 52.3 ? -5.6 : lerp(-5.6, 3.6, seg(t, 52.3, 54.3, E.inOut(E.sin)));
const K13: Key[] = [{ t: 50.45, pos: [-4.6, 3.4, 9.0], look: [-5.2, 2.6, -3], fov: 58 }, { t: 51.8, pos: [-4.0, 3.6, 8.2], look: [-5.0, 2.8, -3], fov: 54 }, { t: 53.0, pos: [-0.6, 4.0, 10.4], look: [0.0, 1.6, -3], fov: 58 }, { t: 54.6, pos: [2.0, 3.8, 10.2], look: [2.6, 2.2, -3], fov: 58 }, { t: 56.7, pos: [2.8, 3.6, 8.4], look: [3.4, 2.6, -3], fov: 54 }];
const S13 = ({ t, f }: Ctx) => {
  const wk = t >= 52.3 && t < 54.3, x = tx13(t), fall = seg(t, 52.0, 52.5, E.in(E.cubic)), stampT = 51.3;
  const lower = seg(t, 52.9, 54.1, E.inOut(E.sin)), sgn = pop(t, 55.1, 0.35);
  const stampYv = t < stampT - 0.22 ? 8.2 : t < stampT ? lerp(8.2, 4.15, ((t - (stampT - 0.22)) / 0.22) ** 2) : lerp(4.15, 8.2, seg(t, stampT + 0.05, stampT + 0.45, E.out(E.cubic)));
  return (<>
    <Cam t={t} keys={K13} impacts={[[stampT, 0.05]]} /><Lights warm="#ffe2b0" />
    <Stars p={[0, 14, -30]} s={[100, 50]} t={t} top="#ff9a5a" bottom="#ffe9a8" n={0} /><Ball p={[10, 9, -28]} r={3} color="#fff3c4" /><Glow p={[10, 9, -27]} r={9} color="rgba(255,230,160,1)" o={0.5} />
    <Floor kind="tile" a="#6b8a4a" b="#5f7e42" unit={2.4} w={60} d={40} />
    <Box p={[0.2, 0.03, -3.2]} s={[3.2, 0.06, 2.0]} color="#120a06" line={1} /><Ball p={[-2.2, 0.15, -4.4]} r={0.9} color="#6b4a32" s={[1.7, 0.6, 1]} /><Ball p={[2.9, 0.15, -4.4]} r={0.8} color="#6b4a32" s={[1.6, 0.6, 1]} />
    <Cyl p={[-9, 3, -9]} rt={0.3} rb={0.5} h={6} color="#5a3a1a" /><Ball p={[-9, 6.6, -9]} r={1.8} color="#3f8a3a" s={[1.5, 1, 1]} /><Ball p={[8.6, 4, -9]} r={1.5} color="#4f9a44" />
    {/* decree board: stamped BATAL, then topples */}
    <group position={[-5.4, 0, -3.8]} rotation={[0, 0, -fall * 1.45]}><Box p={[0, 2.4, 0]} s={[2.8, 4.2, 0.2]} color="#7a4a22" line={3} /><Sign p={[0, 2.5, 0.14]} s={[2.4, 3.4]} text={"SINODE\n897"} bg="#f6e7c1" fg="#1a1226" size={64} />
      <group scale={Math.max(0.01, pop(t, stampT, 0.2))} position={[0, 2.0, 0.3]} rotation={[0, 0, 0.18]}><Sign p={[0, 0, 0]} s={[2.2, 0.9]} text="BATAL" bg="#d11a2a" fg="#fff" size={80} /></group></group>
    <group position={[-5.4, stampYv, -3.2]}><Stamp p={[0, 0, 0]} s={1.1} /></group>
    {/* grave: Formosus laid back by two monks with ropes */}
    <Coffin p={[0.2, 1.7 - 2.1 * lower, -3.2]} />
    {[[-1.9, monk], [2.3, monk2]].map(([px, lk], i) => <React.Fragment key={i}><Person p={[px as number, 0, -2.4]} h={3.1} look={lk as Look} f={f} pose={{ mood: "deadpan", flip: i === 1, armR: [0.2, 0.5 - 0.1 * lower], armL: [0.12, 0.5 - 0.1 * lower], hunch: 0.3 }} />
      <Cyl p={[(px as number) + (i ? -1.2 : 1.2), 1.6, -2.8]} rt={0.025} h={1.2} color="#c9a24a" line={1} rot={[0, 0, i ? 0.5 : -0.5]} /></React.Fragment>)}
    <Person p={[x, 0, -3.8]} h={3.5} look={theo} f={f} pose={{ mood: t >= 55.1 ? "smile" : "deadpan", walk: wk ? x * WALK : undefined, speed: wk ? 0.8 : 0, armR: t >= 55.1 ? undefined : undefined, arms: t >= 54.8 ? "point" : undefined, armK: seg(t, 54.8, 55.1), flip: wk ? false : t >= 54.8 }} />
    <group position={[5.2, 0, -3.4]} scale={Math.max(0.01, sgn)}><Cyl p={[0, 1.7, 0]} rt={0.09} h={3.4} color="#6b3a1a" line={2} /><Sign p={[0, 3.6, 0.1]} s={[3.2, 1.4]} text={"DILARANG\nMENGADILI MAYAT"} bg="#fff" fg="#d11a2a" size={32} /></group>
    <Dust t={t} n={10} area={[7, 6, 3]} color="rgba(255,235,160,.9)" />
  </>);
};

/* =================== S14a  56.65 - 59.95  humans judge an empty chair =================== */
const K14: Key[] = [{ t: 56.65, pos: [3.8, 6.4, 9.4], look: [-1.0, 2.2, -6], fov: 62 }, { t: 58.3, pos: [2.0, 4.2, 6.6], look: [-1.0, 3.0, -6], fov: 56 }, { t: 60.05, pos: [0.4, 3.6, 5.0], look: [-1.0, 3.2, -6], fov: 50 }];
const S14a = ({ t, f }: Ctx) => {
  const pt = seg(t, 58.9, 59.2), bob = (i: number) => Math.sin(f * 0.3 + i) * 0.03 * seg(t, 57.7, 58.4);
  const crowd = Array.from({ length: 8 }, (_, i) => ({ x: i < 4 ? -6.4 + i * 1.5 : 1.2 + (i - 4) * 1.6, z: -1.8 - (i % 2) * 1.6, i }));
  return (<>
    <Cam t={t} keys={K14} /><Lights warm="#ffd8a0" /><Hall t={t} f={f} lamps={false} cols={false} />
    <Curtain p={[0, 5, -11.8]} s={[16, 10]} color="#8c1224" /><Box p={[-1.0, 0.3, -7.2]} s={[6, 0.6, 4.2]} color="#c9b48c" /><Cathedra p={[-1.0, 0.6, -7.2]} />
    <Shaft p={[-1, 10, -5]} s={[3.4, 13]} color="255,235,170" o={0.3} /><Glow p={[-1, 4, -6]} r={4} color="rgba(255,190,80,1)" o={0.25} />
    {crowd.map((c) => <Person key={c.i} p={[c.x, 0, c.z]} h={3.1} look={priests[c.i % 6]} f={f + c.i * 5} pose={{ mood: pt > 0.5 ? "angry" : "deadpan", flip: c.x > -1, arms: "point", armK: pt, squash: bob(c.i), lookX: c.x > -1 ? -1 : 1 }} />)}
  </>);
};

/* =================== S14b  59.95 - 63.0  history swings the gavel =================== */
const K15: Key[] = [{ t: 59.95, pos: [0, 3.4, 9.5], look: [0, 3.4, -3], fov: 56 }, { t: 61.3, pos: [0.2, 3.4, 8.2], look: [0, 3.2, -3], fov: 52 }, { t: 63.1, pos: [0, 4.4, 13], look: [0, 3.0, -3], fov: 58 }];
const S14b = ({ t, f }: Ctx) => {
  const gy = t < 61.0 ? 9.6 + Math.sin(t * 2) * 0.04 : t < 61.2 ? lerp(9.6, 10.4, seg(t, 61.0, 61.2, E.out(E.cubic))) : t < 61.3 ? lerp(10.4, 5.1, ((t - 61.2) / 0.1) ** 2) : 5.1 + 0.18 * Math.exp(-(t - 61.3) * 9) * Math.abs(Math.sin((t - 61.3) * 14));
  const sq = t >= 61.3 ? 1 - 0.8 * seg(t, 61.3, 61.36, E.out(E.cubic)) : 1;
  return (<>
    <Cam t={t} keys={K15} impacts={[[61.3, 0.09]]} fovKick={[61.3]} />
    <ambientLight intensity={0.9} /><directionalLight position={[2, 9, 5]} intensity={1.0} color="#ffe9b8" />
    <Floor kind="marble" a="#2a2150" b="#221a44" unit={2.4} w={40} d={30} /><WallDoor z={-9} W={40} kind="plain" a="#150e30" b="#150e30" base="#0a0618" />
    <Box p={[0, 0.7, -3]} s={[3.4, 1.4, 2.4]} color="#9aa0b8" /><Box p={[0, 1.45, -3]} s={[3.8, 0.2, 2.8]} color="#c9a24a" line={3} />
    <group position={[0, 0, 0]} scale={Math.max(0.01, pop(t, 60.2, 0.3))}><Sign p={[0, 0.75, -1.78]} s={[2.8, 0.8]} text="SEJARAH" bg="#ffc23a" fg="#1a1226" size={78} /></group>
    <Mitre3D p={[0, 1.55, -3]} s={1.0} sy={sq} />
    <Gavel p={[0, gy, -3]} rot={[0, 0, Math.PI]} s={3.0} /><Glow p={[0, 2.2, -2.2]} r={3.5} color="rgba(255,240,200,1)" o={t >= 61.3 ? 0.9 * Math.exp(-(t - 61.3) * 7) : 0} />
    <Glow p={[0, 3.6, -3]} r={7} color="rgba(255,210,120,1)" o={0.2} /><Dust t={t} n={14} area={[7, 8, 3]} color="rgba(255,230,160,.9)" fall />
  </>);
};

const CUTS = [0, 4.15, 8.65, 13.45, 18.75, 22.85, 26.85, 31.25, 37.35, 40.7, 42.75, 46.7, 50.45, 56.65, 59.95, 63.1];
const TINT = ["rgba(90,60,200,.08)", "rgba(255,180,70,.06)", "rgba(255,140,40,.08)", "rgba(40,80,200,.10)", "rgba(255,190,90,.06)", "rgba(220,90,60,.08)", "rgba(255,200,100,.05)", "rgba(255,60,40,.08)", "rgba(40,60,160,.08)", "rgba(255,150,80,.08)", "rgba(255,90,40,.10)", "rgba(60,80,160,.10)", "rgba(255,210,120,.08)", "rgba(255,170,60,.06)", "rgba(90,50,200,.10)"];
export const PopeTrial: React.FC = () => {
  const { fps } = useVideoConfig(), f = useCurrentFrame(), t = f / fps, ci = Math.max(0, CUTS.findIndex((c, i) => t >= c && t < CUTS[i + 1]));
  const sc = (n: number, bg: string, C: React.FC<Ctx>, trans: Trans = "ghost") => <Scene key={n} start={CUTS[n]} end={CUTS[n + 1]} bg={bg} trans={trans} first={n === 0}>{(c) => <C {...c} />}</Scene>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      {sc(0, "#1d1646", S1)}{sc(1, "#3a2a14", S2)}{sc(2, "#3a0a14", S3, "zoom")}{sc(3, "#0c1830", S4, "flash")}{sc(4, "#3a2a14", S5, "whip")}{sc(5, "#2a2038", S6)}
      {sc(6, "#3a2a14", S7, "zoom")}{sc(7, "#3a0a14", S8, "flash")}{sc(8, "#14204a", S9, "whip")}{sc(9, "#ff9a5a", S10)}{sc(10, "#2a1f3a", S11, "zoom")}{sc(11, "#2a2f40", S12, "flash")}
      {sc(12, "#ffcf8a", S13)}{sc(13, "#3a0a14", S14a, "whip")}{sc(14, "#0a0618", S14b, "flash")}
      <Grade t={t} shaft={false} tint={TINT[ci] ?? TINT[0]} />
      <Captions />
    </AbsoluteFill>
  );
};
