import { useEffect, useRef, useState, CSSProperties } from 'react';

type DepthTextProps = {
  text: string;
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  fontSize?: string;
  fontWeight?: number;
  shadow?: boolean;
};

export default function DepthText({
  text,
  layers = 24,
  depth = 2,
  faceColor = '#f8fafc',
  depthColor = '#7c3aed',
  tilt = 6,
  pointerTracking = false,
  smoothing = 0.15,
  perspective = 900,
  autoOrbit = false,
  orbitSpeed = 0.3,
  fontSize = 'clamp(2.5rem, 10vw, 6rem)',
  fontWeight = 900,
  shadow = false,
}: DepthTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: tilt, y: 0 });
  const currentRef = useRef({ x: tilt, y: 0 });
  const rafRef = useRef<number>();
  const orbitAngleRef = useRef(0);
  const [rotation, setRotation] = useState({ x: tilt, y: 0 });

  useEffect(() => {
    const animate = () => {
      if (autoOrbit) {
        orbitAngleRef.current += orbitSpeed;
        targetRef.current = {
          x: tilt + Math.sin(orbitAngleRef.current * 0.02) * 10,
          y: Math.sin(orbitAngleRef.current * 0.03) * 18,
        };
      }

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * smoothing;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * smoothing;

      setRotation({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [autoOrbit, orbitSpeed, smoothing, tilt]);

  useEffect(() => {
    if (!pointerTracking) return;
    const el = containerRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetRef.current = {
        x: tilt - py * 20,
        y: px * 24,
      };
    };

    const handlePointerLeave = () => {
      targetRef.current = { x: tilt, y: 0 };
    };

    window.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [pointerTracking, tilt]);

  const wrapperStyle: CSSProperties = {
    perspective: `${perspective}px`,
    display: 'inline-block',
  };

  const stackStyle: CSSProperties = {
    position: 'relative',
    transformStyle: 'preserve-3d',
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    fontSize,
    fontWeight,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  };

  const layerElements = Array.from({ length: layers }, (_, i) => {
    const z = -i * depth;
    const t = i / Math.max(layers - 1, 1);
    const color = interpolateColor(faceColor, depthColor, t);
    const isFace = i === 0;

    const layerStyle: CSSProperties = {
      position: i === 0 ? 'relative' : 'absolute',
      top: 0,
      left: 0,
      color,
      transform: `translateZ(${z}px)`,
      textShadow: shadow && isFace ? '0 12px 30px rgba(0,0,0,0.45)' : undefined,
      userSelect: 'none',
    };

    return (
      <span key={i} style={layerStyle}>
        {text}
      </span>
    );
  });

  return (
    <div ref={containerRef} style={wrapperStyle}>
      <div style={stackStyle}>{layerElements}</div>
    </div>
  );
}

function interpolateColor(from: string, to: string, t: number): string {
  const f = hexToRgb(from);
  const tt = hexToRgb(to);
  if (!f || !tt) return from;
  const r = Math.round(f.r + (tt.r - f.r) * t);
  const g = Math.round(f.g + (tt.g - f.g) * t);
  const b = Math.round(f.b + (tt.b - f.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}
