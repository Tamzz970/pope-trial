// Extra props v5 (pope-trial video). Reusable: Column, Cathedra, Gavel, Shovel, Tomb, Scroll, Torch, Bars, River, Stretcher, Coffin, Candle, Stamp, Pile.
import React from "react";
import { Box, Cyl, Ball, CanvasPlane, INK, LITE } from "./toon";
import { V3 } from "./kit";
import { Glow } from "./props";

export const Column: React.FC<{ p: V3; h?: number; r?: number; color?: string; cap?: string }> = ({ p, h = 8, r = 0.5, color = "#d9c9a8", cap = "#b89a62" }) => (
  <group position={p}><Box p={[0, 0.25, 0]} s={[r * 2.6, 0.5, r * 2.6]} color={cap} line={3} /><Cyl p={[0, h / 2, 0]} rt={r} rb={r * 1.08} h={h - 1} color={color} /><Box p={[0, h - 0.3, 0]} s={[r * 2.8, 0.6, r * 2.8]} color={cap} line={3} /></group>
);
// papal chair: seat block top at y = 1.3; puppet feet at y=0.7 are hidden inside the block (seated look)
export const Cathedra: React.FC<{ p: V3; red?: string; gold?: string }> = ({ p, red = "#a0202e", gold = "#ffc23a" }) => (
  <group position={p}>
    <Box p={[0, 0.25, 0.2]} s={[3.2, 0.5, 2.4]} color="#8a6a3a" /><Box p={[0, 0.9, 0.2]} s={[2.6, 0.8, 2.0]} color={red} />
    <Box p={[0, 3.2, -0.8]} s={[2.6, 4.2, 0.4]} color={red} /><Box p={[0, 5.45, -0.8]} s={[3.0, 0.5, 0.6]} color={gold} />
    <Ball p={[-1.35, 5.85, -0.8]} r={0.26} color={gold} /><Ball p={[1.35, 5.85, -0.8]} r={0.26} color={gold} />
    <Box p={[-1.45, 1.7, 0.2]} s={[0.4, 0.9, 2.0]} color={gold} /><Box p={[1.45, 1.7, 0.2]} s={[0.4, 0.9, 2.0]} color={gold} />
    <CanvasPlane p={[0, 4.2, -0.58]} s={[1.5, 1.5]} px={[200, 200]} draw={(c, W, H) => { c.fillStyle = red; c.fillRect(0, 0, W, H); c.fillStyle = gold; c.fillRect(W / 2 - 14, 30, 28, 140); c.fillRect(W / 2 - 50, 66, 100, 26); }} />
  </group>
);
export const Gavel: React.FC<{ p: V3; rot?: V3; s?: number; color?: string }> = ({ p, rot, s = 1, color = "#6b3a1a" }) => (
  <group position={p} rotation={rot} scale={s}><Cyl p={[0, 0, 0]} rt={0.09} h={1.6} color={color} line={2} /><Cyl p={[0, 0.8, 0]} rt={0.3} h={0.8} color="#8a5a2a" line={3} rot={[0, 0, Math.PI / 2]} /></group>
);
export const Shovel: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}><Cyl p={[0, 0, 0]} rt={0.05} h={2.2} color="#8a5a2a" line={2} /><Box p={[0, -1.25, 0]} s={[0.5, 0.55, 0.06]} color="#aab2c4" line={2} /></group>
);
export const Torch: React.FC<{ p: V3; f: number; s?: number }> = ({ p, f, s = 1 }) => (
  <group position={p} scale={s}><Cyl p={[0, 0, 0]} rt={0.05} h={1.0} color="#6b3a1a" line={2} /><Ball p={[0, 0.62 + Math.sin(f * 0.7) * 0.03, 0]} r={0.17} color="#ffb21a" s={[1, 1.5 + Math.sin(f * 0.9) * 0.15, 1]} ink={0.03} /><Glow p={[0, 0.7, 0.1]} r={1.0} color="rgba(255,170,60,1)" o={0.55 + Math.sin(f * 0.8) * 0.1} /></group>
);
export const Candle: React.FC<{ p: V3; f: number; h?: number }> = ({ p, f, h = 1.8 }) => (
  <group position={p}><Cyl p={[0, h / 2, 0]} rt={0.07} rb={0.28} h={h} color="#c9a24a" line={2} /><Cyl p={[0, h + 0.2, 0]} rt={0.09} h={0.4} color="#fff6dc" line={2} /><Glow p={[0, h + 0.55, 0.05]} r={0.7} color="rgba(255,200,90,1)" o={0.6 + Math.sin(f * 0.6 + p[0]) * 0.1} /></group>
);
export const Tomb: React.FC<{ p: V3; lid?: number; label?: string }> = ({ p, lid = 0, label = "FORMOSUS" }) => (
  <group position={p}><Box p={[0, 0.6, 0]} s={[3.6, 1.2, 1.9]} color="#a9adb8" />
    <CanvasPlane p={[0, 0.62, 0.97]} s={[2.6, 0.7]} px={[520, 140]} draw={(c, W, H) => { c.fillStyle = "#7d8296"; c.fillRect(0, 0, W, H); c.strokeStyle = INK; c.lineWidth = 8; c.strokeRect(4, 4, W - 8, H - 8); c.fillStyle = "#1b1f33"; c.font = "900 72px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(label, W / 2, H / 2 + 4); }} />
    <Box p={[lid * 2.2, 1.3 + Math.min(lid, 0.3) * 0.5, 0]} s={[3.8, 0.24, 2.1]} color="#c3c7d2" rot={[0, 0, lid * 0.4]} /></group>
);
export const Scroll: React.FC<{ p: V3; w?: number; open: number; lines: { text: string; k: number; color?: string }[]; rot?: V3 }> = ({ p, w = 3.2, open, lines, rot }) => {
  const H = 4.4 * Math.max(0.02, open);
  return (<group position={p} rotation={rot}>
    <CanvasPlane p={[0, 0, 0]} s={[w, H]} px={[320, Math.max(8, Math.round(440 * Math.max(0.02, open)))]} frame="#7a4a22" draw={(c, W, Hh) => { c.fillStyle = "#f6e7c1"; c.fillRect(0, 0, W, Hh); c.strokeStyle = "rgba(120,80,30,.4)"; c.lineWidth = 3; for (let y = 24; y < Hh; y += 28) { c.beginPath(); c.moveTo(24, y); c.lineTo(W - 24 - (y * 7) % 60, y); c.stroke(); }
      lines.forEach((l, i) => { if (l.k <= 0) return; const y = 440 * 0.34 + i * 120; if (y > Hh) return; c.save(); c.translate(W / 2, y); const sc = 1.5 - 0.5 * l.k; c.scale(sc, sc); c.globalAlpha = Math.min(1, l.k * 1.6); c.rotate(-0.06); c.strokeStyle = l.color ?? "#d11a2a"; c.lineWidth = 9; const tw = 296; c.strokeRect(-tw / 2, -40, tw, 80); c.fillStyle = l.color ?? "#d11a2a"; c.font = "900 29px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(l.text, 0, 3); c.restore(); }); }} />
    <Cyl p={[0, H / 2, 0.02]} rt={0.14} h={w + 0.3} color="#7a4a22" line={2} rot={[0, 0, Math.PI / 2]} /><Cyl p={[0, -H / 2, 0.02]} rt={0.14} h={w + 0.3} color="#7a4a22" line={2} rot={[0, 0, Math.PI / 2]} />
  </group>);
};
export const Bars: React.FC<{ p: V3; w: number; h: number; n?: number }> = ({ p, w, h, n = 9 }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => <Cyl key={i} p={[-w / 2 + (i * w) / (n - 1), h / 2, 0]} rt={0.07} h={h} color="#6f7788" line={2} />)}<Box p={[0, h, 0]} s={[w + 0.3, 0.2, 0.25]} color="#4b5266" line={2} /><Box p={[0, 0.1, 0]} s={[w + 0.3, 0.2, 0.25]} color="#4b5266" line={2} /><Box p={[0, h * 0.5, 0]} s={[w, 0.12, 0.14]} color="#4b5266" line={2} /></group>
);
export const River: React.FC<{ p: V3; s: [number, number]; t: number; a?: string; b?: string; rings?: { x: number; z: number; t0: number }[] }> = ({ p, s, t, a = "#2a6fd6", b = "#8fd0ff", rings = [] }) => (
  <CanvasPlane p={p} rot={[-Math.PI / 2, 0, 0]} s={s} px={[256, Math.round(256 * s[1] / s[0])]} draw={(c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, "#1b4aa8"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.strokeStyle = b; c.lineWidth = 4; c.lineCap = "round"; for (let r = 0; r < 9; r++) { c.beginPath(); for (let x = 0; x <= W; x += 8) { const y = ((r + 0.5) / 9) * H + Math.sin(x * 0.05 + t * 2.2 + r * 1.7) * 4; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
    for (const q of rings) { const u = (t - q.t0) / 1.1; if (u < 0 || u > 1) continue; c.strokeStyle = `rgba(255,255,255,${1 - u})`; c.lineWidth = 5; c.beginPath(); c.ellipse(((q.x / s[0]) + 0.5) * W, ((q.z / s[1]) + 0.5) * H, 8 + u * 60, 5 + u * 36, 0, 0, 7); c.stroke(); }
  }} />
);
export const Stretcher: React.FC<{ p: V3; len?: number }> = ({ p, len = 3.8 }) => (
  <group position={p}><Cyl p={[0, 0, 0.35]} rt={0.07} h={len + 0.8} color="#8a5a2a" line={2} rot={[0, 0, Math.PI / 2]} /><Cyl p={[0, 0, -0.35]} rt={0.07} h={len + 0.8} color="#8a5a2a" line={2} rot={[0, 0, Math.PI / 2]} /><Box p={[0, 0.02, 0]} s={[len, 0.06, 0.72]} color="#d8d2c0" line={2} /></group>
);
export const Coffin: React.FC<{ p: V3; rot?: V3 }> = ({ p, rot }) => (
  <group position={p} rotation={rot}><Box p={[0, 0, 0]} s={[3.4, 0.7, 1.1]} color="#7a4a22" /><Box p={[0, 0.38, 0]} s={[3.5, 0.1, 1.2]} color="#8a5a2a" line={3} /><Box p={[0, 0.46, 0]} s={[0.18, 0.04, 0.9]} color="#ffc23a" line={1} /><Box p={[-0.5, 0.46, 0]} s={[0.9, 0.04, 0.18]} color="#ffc23a" line={1} /></group>
);
export const Stamp: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}><Box p={[0, 0, 0]} s={[1.5, 0.25, 0.9]} color="#a31a2a" /><Cyl p={[0, 0.55, 0]} rt={0.2} h={0.9} color="#6b3a1a" line={2} /><Ball p={[0, 1.08, 0]} r={0.28} color="#6b3a1a" ink={0.04} /></group>
);
// upright puppet drawn on a flat plane that can ROTATE about its feet (lying on a stretcher, being lifted into a chair)
import { drawPuppet, Look, Pose } from "./puppet";
export const FlatPuppet: React.FC<{ p: V3; h: number; look: Look; pose: Omit<Pose, "t"> & { t?: number }; f: number; ang?: number; children?: React.ReactNode }> = ({ p, h, look, pose, f, ang = 0, children }) => (
  <group position={p} rotation={[0, 0, ang]}>
    <CanvasPlane p={[0, h * 0.483, 0]} s={[h * 512 / 768, h]} px={LITE ? [320, 480] : [512, 768]} draw={(c, W, H) => drawPuppet(c, W, H, look, { ...pose, t: pose.t ?? f })} />{children}
  </group>
);
