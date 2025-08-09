import { useEffect, useRef } from 'react';

interface FloatingElement {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number; // 0..1
  vx: number;
  vy: number;
  hue: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastMouseRef = useRef({ x: mouseRef.current.x, y: mouseRef.current.y });
  const blobRef = useRef({ x: mouseRef.current.x, y: mouseRef.current.y });
  const elementsRef = useRef<FloatingElement[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const dprRef = useRef<number>(Math.min(window.devicePixelRatio || 1, 2));
  const reducedMotion = useRef<boolean>(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      const dpr = (dprRef.current = Math.min(window.devicePixelRatio || 1, 2));
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const createFloatingElement = (): FloatingElement => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: rand(1.5, 4.5),
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: rand(0.15, 0.55),
      hue: rand(200, 280), // brand range: blue -> purple
    });

    const init = () => {
      elementsRef.current = [];
      const count = reducedMotion.current ? 16 : 38;
      for (let i = 0; i < count; i++) elementsRef.current.push(createFloatingElement());
    };

    const addTrailPoint = (x: number, y: number) => {
      const last = lastMouseRef.current;
      // Interpolate points for smooth trail on fast moves
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.ceil(dist / 12);
      for (let i = 1; i <= steps; i++) {
        const px = last.x + (dx * i) / steps;
        const py = last.y + (dy * i) / steps;
        trailRef.current.push({
          x: px,
          y: py,
          life: 1,
          vx: -dx * 0.02 + (Math.random() - 0.5) * 0.6,
          vy: -dy * 0.02 + (Math.random() - 0.5) * 0.6,
          hue: 210 + (i / Math.max(1, steps)) * 60, // 210->270
        });
      }
      // Limit trail length
      const maxTrail = reducedMotion.current ? 24 : 72;
      if (trailRef.current.length > maxTrail) {
        trailRef.current.splice(0, trailRef.current.length - maxTrail);
      }
      lastMouseRef.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      addTrailPoint(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      mouseRef.current.x = t.clientX;
      mouseRef.current.y = t.clientY;
      addTrailPoint(t.clientX, t.clientY);
    };

    const animate = () => {
      const { width, height } = canvas;
      // Clear
      ctx.clearRect(0, 0, width, height);

      // Easing blob follow
      const blob = blobRef.current;
      const mouse = mouseRef.current;
      const ease = reducedMotion.current ? 0.2 : 0.12;
      blob.x += (mouse.x - blob.x) * ease;
      blob.y += (mouse.y - blob.y) * ease;

      // FLOATING PARTICLES LAYER
      elementsRef.current.forEach((el, index) => {
        const dx = mouse.x - el.x;
        const dy = mouse.y - el.y;
        const distance = Math.hypot(dx, dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          el.x += dx * force * 0.01;
          el.y += dy * force * 0.01;
        }

        el.x += el.speedX;
        el.y += el.speedY;
        if (el.x < 0 || el.x > width / dprRef.current) el.speedX *= -1;
        if (el.y < 0 || el.y > height / dprRef.current) el.speedY *= -1;
        el.x = Math.max(0, Math.min(width / dprRef.current, el.x));
        el.y = Math.max(0, Math.min(height / dprRef.current, el.y));

        const gradient = ctx.createRadialGradient(el.x, el.y, 0, el.x, el.y, el.size * 3.2);
        gradient.addColorStop(0, `hsla(${el.hue}, 80%, 60%, ${el.opacity})`);
        gradient.addColorStop(0.5, `hsla(${el.hue}, 80%, 55%, ${el.opacity * 0.35})`);
        gradient.addColorStop(1, `hsla(${el.hue}, 80%, 45%, 0)`);
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.size * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Connect nearby elements
        elementsRef.current.slice(index + 1).forEach((other) => {
          const ddx = el.x - other.x;
          const ddy = el.y - other.y;
          const d = Math.hypot(ddx, ddy);
          const maxD = 120;
          if (d < maxD) {
            const opacity = (1 - d / maxD) * 0.1;
            ctx.beginPath();
            ctx.moveTo(el.x, el.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(220, 80%, 65%, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // TRAIL LAYER (additive glow)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= reducedMotion.current ? 0.05 : 0.025;
        if (p.life <= 0) continue;
        const r = (1 - p.life) * 18 + 6; // grow then fade
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `hsla(${p.hue}, 90%, 60%, ${0.25 * p.life})`);
        g.addColorStop(0.6, `hsla(${p.hue}, 90%, 55%, ${0.12 * p.life})`);
        g.addColorStop(1, `hsla(${p.hue}, 90%, 45%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      // Remove dead points efficiently
      trailRef.current = trailRef.current.filter((p) => p.life > 0);
      ctx.restore();

      // CURSOR BLOB (soft spotlight with brand gradient)
      const blobRadius = reducedMotion.current ? 70 : 110;
      const mg = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blobRadius);
      mg.addColorStop(0, 'hsla(210, 100%, 60%, 0.18)'); // primary
      mg.addColorStop(0.5, 'hsla(270, 95%, 60%, 0.10)'); // accent
      mg.addColorStop(1, 'hsla(210, 100%, 56%, 0)');
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blobRadius, 0, Math.PI * 2);
      ctx.fillStyle = mg;
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
