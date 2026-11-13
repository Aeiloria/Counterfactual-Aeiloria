/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FreedomBondSnapshot, StateClassification, Vector3D } from '../../types/freedomBond';
import { useTheme } from '../../context/ThemeContext';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Shield, Eye } from 'lucide-react';

interface BondCanvas3DProps {
  snapshot: FreedomBondSnapshot;
}

export const BondCanvas3D: React.FC<BondCanvas3DProps> = ({ snapshot }) => {
  const { isLight } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Orbit Camera Angles
  const [rotX, setRotX] = useState<number>(0.25);
  const [rotY, setRotY] = useState<number>(-0.45);
  const [zoom, setZoom] = useState<number>(75);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Animation frame ref
  const animTimeRef = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  // Mouse handlers for Orbit Controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotY(prev => prev + dx * 0.008);
    setRotX(prev => Math.max(-1.4, Math.min(1.4, prev + dy * 0.008)));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom(prev => Math.max(35, Math.min(150, prev - e.deltaY * 0.05)));
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setRotX(0.25);
    setRotY(-0.45);
    setZoom(75);
  };

  // Project 3D to 2D screen coordinate
  const project3D = useCallback((
    point: Vector3D,
    width: number,
    height: number,
    rx: number,
    ry: number,
    zScale: number
  ) => {
    // Rotation around Y
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x1 = point.x * cosY + point.z * sinY;
    const z1 = -point.x * sinY + point.z * cosY;

    // Rotation around X
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y2 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;

    // Perspective projection
    const cameraDistance = 9.0;
    const perspectiveFactor = cameraDistance / (cameraDistance + z2);

    const screenX = width / 2 + x1 * zScale * perspectiveFactor;
    const screenY = height / 2 - y2 * zScale * perspectiveFactor;

    return {
      x: screenX,
      y: screenY,
      zDepth: z2,
      scale: perspectiveFactor
    };
  }, []);

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isActive = true;

    const render = () => {
      if (!isActive) return;
      animTimeRef.current += 0.02;
      const tAnim = animTimeRef.current;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, width * 0.7
      );
      if (isLight) {
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(1, '#e2e8f0');
      } else {
        bgGrad.addColorStop(0, '#0c1322');
        bgGrad.addColorStop(1, '#050811');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw 3D Spatial Grid on floor (Y = -1.6)
      ctx.strokeStyle = isLight ? 'rgba(148, 163, 184, 0.25)' : 'rgba(30, 41, 59, 0.45)';
      ctx.lineWidth = 1;
      const gridSize = 5;
      const gridStep = 1.0;
      const floorY = -1.6;

      ctx.beginPath();
      for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
        const p1 = project3D({ x: gx, y: floorY, z: -gridSize }, width, height, rotX, rotY, zoom);
        const p2 = project3D({ x: gx, y: floorY, z: gridSize }, width, height, rotX, rotY, zoom);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      for (let gz = -gridSize; gz <= gridSize; gz += gridStep) {
        const p1 = project3D({ x: -gridSize, y: floorY, z: gz }, width, height, rotX, rotY, zoom);
        const p2 = project3D({ x: gridSize, y: floorY, z: gz }, width, height, rotX, rotY, zoom);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();

      // Node A and Node B projected positions
      const projA = project3D(snapshot.node_a.position, width, height, rotX, rotY, zoom);
      const projB = project3D(snapshot.node_b.position, width, height, rotX, rotY, zoom);

      // INTERACTION LINK / LATTICE / TRACE RENDERING
      const classification = snapshot.state_classification;
      const isSelfSustaining = classification === 'SELF_SUSTAINING';
      const isForced = classification === 'FORCED';
      const isAdapted = classification === 'ADAPTED';

      if (isSelfSustaining) {
        // IRIDESCENT CYAN-WHITE CRYSTAL LATTICE (Directive requirement)
        const latticeSegments = 14;
        const latticeRadius = 24 * projA.scale;

        // Draw outer resonating aura
        ctx.save();
        const auraGrad = ctx.createLinearGradient(projA.x, projA.y, projB.x, projB.y);
        auraGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
        auraGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
        auraGrad.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
        ctx.strokeStyle = auraGrad;
        ctx.lineWidth = 14 * projA.scale;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(projA.x, projA.y);
        ctx.lineTo(projB.x, projB.y);
        ctx.stroke();
        ctx.restore();

        // Faceted crystal vertices along link
        ctx.save();
        for (let i = 0; i <= latticeSegments; i++) {
          const ratio = i / latticeSegments;
          const lx = projA.x + (projB.x - projA.x) * ratio;
          const ly = projA.y + (projB.y - projA.y) * ratio;

          // Perpendicular offset for crystalline lattice structure
          const perpAngle = Math.atan2(projB.y - projA.y, projB.x - projA.x) + Math.PI / 2;
          const oscOffset = Math.sin(tAnim * 3 + ratio * Math.PI * 4) * (latticeRadius * 0.7);

          const c1x = lx + Math.cos(perpAngle) * oscOffset;
          const c1y = ly + Math.sin(perpAngle) * oscOffset;
          const c2x = lx - Math.cos(perpAngle) * oscOffset;
          const c2y = ly - Math.sin(perpAngle) * oscOffset;

          // Prismatic lattice struts
          ctx.strokeStyle = `hsla(${180 + Math.sin(tAnim + ratio * 3) * 30}, 90%, 85%, 0.8)`;
          ctx.lineWidth = 1.8 * projA.scale;
          ctx.beginPath();
          ctx.moveTo(c1x, c1y);
          ctx.lineTo(c2x, c2y);
          ctx.stroke();

          // Connect along lattice facet
          if (i > 0) {
            const prevRatio = (i - 1) / latticeSegments;
            const prevLx = projA.x + (projB.x - projA.x) * prevRatio;
            const prevLy = projA.y + (projB.y - projA.y) * prevRatio;
            const prevOsc = Math.sin(tAnim * 3 + prevRatio * Math.PI * 4) * (latticeRadius * 0.7);
            const prevC1x = prevLx + Math.cos(perpAngle) * prevOsc;
            const prevC1y = prevLy + Math.sin(perpAngle) * prevOsc;

            ctx.beginPath();
            ctx.moveTo(prevC1x, prevC1y);
            ctx.lineTo(c1x, c1y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.stroke();
          }

          // Shimmer diamond nodes
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(c1x, c1y, 2.5 * projA.scale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Central iridescent core beam
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 3.5 * projA.scale;
        ctx.beginPath();
        ctx.moveTo(projA.x, projA.y);
        ctx.lineTo(projB.x, projB.y);
        ctx.stroke();
        ctx.restore();

      } else if (isForced) {
        // COLLAPSING DASHED GREY TRACE (Directive requirement)
        ctx.save();
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = -tAnim * 15;
        ctx.strokeStyle = isLight ? 'rgba(100, 116, 139, 0.85)' : 'rgba(148, 163, 184, 0.65)';
        ctx.lineWidth = 2.2 * projA.scale;

        // Jagged breakdown / shear deflection
        const numBreaks = 10;
        ctx.beginPath();
        ctx.moveTo(projA.x, projA.y);
        for (let j = 1; j < numBreaks; j++) {
          const ratio = j / numBreaks;
          const mx = projA.x + (projB.x - projA.x) * ratio;
          const my = projA.y + (projB.y - projA.y) * ratio;
          const jitter = (Math.sin(j * 17 + tAnim * 8) * 12) * projA.scale;
          ctx.lineTo(mx, my + jitter);
        }
        ctx.lineTo(projB.x, projB.y);
        ctx.stroke();

        // Fracture spark particles
        for (let s = 0; s < 5; s++) {
          const spRatio = (tAnim * 0.4 + s * 0.2) % 1.0;
          const sx = projA.x + (projB.x - projA.x) * spRatio;
          const sy = projA.y + (projB.y - projA.y) * spRatio;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, sy, 2 * projA.scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

      } else if (isAdapted) {
        // ADAPTED: Amber-gold dynamic equilibrium band
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
        ctx.lineWidth = 3.0 * projA.scale;
        ctx.beginPath();
        ctx.moveTo(projA.x, projA.y);
        const midX = (projA.x + projB.x) / 2;
        const midY = (projA.y + projB.y) / 2 + Math.sin(tAnim * 2) * 15;
        ctx.quadraticCurveTo(midX, midY, projB.x, projB.y);
        ctx.stroke();
        ctx.restore();

      } else {
        // BASELINE: Neutral muted coordinate ray
        ctx.save();
        ctx.strokeStyle = isLight ? 'rgba(148, 163, 184, 0.4)' : 'rgba(51, 65, 85, 0.5)';
        ctx.lineWidth = 1.5 * projA.scale;
        ctx.beginPath();
        ctx.moveTo(projA.x, projA.y);
        ctx.lineTo(projB.x, projB.y);
        ctx.stroke();
        ctx.restore();
      }

      // INFLUENCE VECTOR V1 RENDER (When V1 > 0)
      if (snapshot.influence_magnitude > 0.05) {
        ctx.save();
        const v1ScreenDir = {
          x: projB.x - projA.x,
          y: projB.y - projA.y
        };
        const len = Math.sqrt(v1ScreenDir.x * v1ScreenDir.x + v1ScreenDir.y * v1ScreenDir.y);
        if (len > 0.001) {
          const uX = v1ScreenDir.x / len;
          const uY = v1ScreenDir.y / len;
          const arrowLen = Math.min(len * 0.6, snapshot.influence_magnitude * 45 * projA.scale);
          const startX = projA.x + uX * 28 * projA.scale;
          const startY = projA.y + uY * 28 * projA.scale;
          const endX = startX + uX * arrowLen;
          const endY = startY + uY * arrowLen;

          // Draw vector arrow
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = '#38bdf8';
          ctx.lineWidth = 2.5 * projA.scale;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Arrowhead
          const headLen = 9 * projA.scale;
          const arrowAngle = Math.atan2(uY, uX);
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - headLen * Math.cos(arrowAngle - Math.PI / 6),
            endY - headLen * Math.sin(arrowAngle - Math.PI / 6)
          );
          ctx.lineTo(
            endX - headLen * Math.cos(arrowAngle + Math.PI / 6),
            endY - headLen * Math.sin(arrowAngle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();

          // Vector Label V1
          ctx.font = `bold ${Math.round(11 * projA.scale)}px monospace`;
          ctx.fillStyle = isLight ? '#0369a1' : '#7dd3fc';
          ctx.fillText(`V₁ (|V|=${snapshot.influence_magnitude.toFixed(2)})`, (startX + endX) / 2, (startY + endY) / 2 - 10);
        }
        ctx.restore();
      }

      // RENDER NODE A
      renderNode(ctx, projA, snapshot.node_a.label, snapshot.node_a.autonomy_radius, snapshot.node_a.capacity_index, '#06b6d4', '#0284c7', tAnim, isLight);

      // RENDER NODE B
      const nodeBColor = isForced ? '#f43f5e' : isSelfSustaining ? '#10b981' : isAdapted ? '#f59e0b' : '#3b82f6';
      renderNode(ctx, projB, snapshot.node_b.label, snapshot.node_b.autonomy_radius, snapshot.node_b.capacity_index, nodeBColor, '#1d4ed8', tAnim, isLight);

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      isActive = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [snapshot, rotX, rotY, zoom, isLight, project3D]);

  // Helper to render an Agent Node sphere & sovereign hull
  const renderNode = (
    ctx: CanvasRenderingContext2D,
    proj: { x: number; y: number; scale: number },
    label: string,
    radius: number,
    capacity: number,
    primaryColor: string,
    secondaryColor: string,
    tAnim: number,
    light: boolean
  ) => {
    const baseR = 18 * proj.scale;
    const boundaryR = baseR * (radius * 1.35);

    ctx.save();

    // 1. Sovereign Boundary Hull (autonomy field)
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, boundaryR, 0, Math.PI * 2);
    ctx.strokeStyle = primaryColor;
    ctx.globalAlpha = 0.35 + Math.sin(tAnim * 2) * 0.1;
    ctx.lineWidth = 1.2 * proj.scale;
    ctx.stroke();

    // Boundary dashed orbit
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, boundaryR + 5 * proj.scale, 0, Math.PI * 2);
    ctx.globalAlpha = 0.2;
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Core Solid Sphere with Gradient
    ctx.globalAlpha = 1.0;
    const sphereGrad = ctx.createRadialGradient(
      proj.x - baseR * 0.3,
      proj.y - baseR * 0.3,
      baseR * 0.1,
      proj.x,
      proj.y,
      baseR
    );
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.3, primaryColor);
    sphereGrad.addColorStop(1, secondaryColor);

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, baseR, 0, Math.PI * 2);
    ctx.fill();

    // Specular shine ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.2 * proj.scale;
    ctx.stroke();

    // 3. Node Label & Telemetry Badge
    ctx.font = `bold ${Math.round(11 * proj.scale)}px monospace`;
    ctx.fillStyle = light ? '#0f172a' : '#f8fafc';
    ctx.textAlign = 'center';
    ctx.fillText(label, proj.x, proj.y + boundaryR + 15 * proj.scale);

    ctx.font = `${Math.round(9 * proj.scale)}px monospace`;
    ctx.fillStyle = light ? '#475569' : '#94a3b8';
    ctx.fillText(`Cap: ${(capacity * 100).toFixed(1)}% | Rad: ${radius.toFixed(2)}`, proj.x, proj.y + boundaryR + 26 * proj.scale);

    ctx.restore();
  };

  return (
    <div className={`relative w-full h-[460px] rounded-xl border overflow-hidden shadow-xl select-none ${
      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
    }`}>
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={960}
        height={460}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-auto">
        <div className={`px-2.5 py-1 rounded-md border font-mono text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm ${
          isLight
            ? 'bg-white/90 border-slate-300 text-slate-800'
            : 'bg-slate-900/80 border-slate-700 text-slate-200'
        }`}>
          <Eye className="w-3.5 h-3.5 text-cyan-500" />
          <span>3D STATE-SPACE PROJECTOR</span>
        </div>

        <button
          onClick={handleResetCamera}
          className={`p-1.5 rounded-md border text-xs font-mono transition-colors backdrop-blur-md cursor-pointer ${
            isLight
              ? 'bg-white/80 border-slate-300 text-slate-700 hover:bg-slate-100'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Reset Camera View"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* State Classification Hologram Tag (Directive exact rendering) */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-2 ${
          snapshot.state_classification === 'SELF_SUSTAINING'
            ? isLight
              ? 'bg-cyan-50 border-cyan-400 text-cyan-900 shadow-cyan-100'
              : 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-cyan-950/60 ring-1 ring-cyan-400/50'
            : snapshot.state_classification === 'FORCED'
            ? isLight
              ? 'bg-rose-50 border-rose-400 text-rose-900'
              : 'bg-rose-950/90 border-rose-500 text-rose-200 ring-1 ring-rose-500/40'
            : snapshot.state_classification === 'ADAPTED'
            ? isLight
              ? 'bg-amber-50 border-amber-400 text-amber-900'
              : 'bg-amber-950/90 border-amber-500 text-amber-200'
            : isLight
            ? 'bg-slate-100 border-slate-300 text-slate-800'
            : 'bg-slate-900/80 border-slate-700 text-slate-300'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            snapshot.state_classification === 'SELF_SUSTAINING'
              ? 'bg-cyan-400 animate-ping'
              : snapshot.state_classification === 'FORCED'
              ? 'bg-rose-500'
              : snapshot.state_classification === 'ADAPTED'
              ? 'bg-amber-400'
              : 'bg-slate-400'
          }`} />
          <span>CLASSIFICATION: {snapshot.state_classification}</span>
        </div>
      </div>

      {/* Interaction Hint Bottom Left */}
      <div className={`absolute bottom-3 left-3 text-[10px] font-mono pointer-events-none ${
        isLight ? 'text-slate-500' : 'text-slate-500'
      }`}>
        <span>Orbit: Click+Drag | Zoom: Scroll Wheel | Real-time 60fps</span>
      </div>

      {/* Visual Classification Indicator Key Bottom Right */}
      <div className={`absolute bottom-3 right-3 p-2 rounded-lg border text-[10px] font-mono backdrop-blur-md pointer-events-none hidden sm:flex items-center gap-3 ${
        isLight ? 'bg-white/80 border-slate-200 text-slate-600' : 'bg-slate-900/80 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>SELF_SUSTAINING (Crystal Lattice)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>FORCED (Dashed Grey Trace)</span>
        </div>
      </div>
    </div>
  );
};
