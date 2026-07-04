/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
}

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize stars
    const stars: Star[] = [];
    const colors = ['#ffffff', '#e0f2fe', '#fed7aa', '#fbcfe8', '#e9d5ff'];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Initialize slow passing clouds
    const clouds: Cloud[] = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        scale: Math.random() * 1.5 + 0.8,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.08 + 0.03
      });
    }

    // Floating particles (fairy dust)
    const particles: Particle[] = [];
    const addParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        color: `rgba(244, 63, 94, ${Math.random() * 0.4 + 0.2})`, // soft rose
        life: Math.random() * 150 + 50
      });
    };

    // Trigger occasional floating particles from bottom
    let particleTimer = 0;

    // Handle resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Create rich deep background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040209'); // rich midnight violet-black
      bgGrad.addColorStop(0.5, '#0b0c1e'); // deep galaxy blue
      bgGrad.addColorStop(1, '#1a102f'); // warm horizon purple
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Twinkling Stars
      stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.1) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Star glow for larger stars
        if (star.size > 1.4) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = star.color;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }
        ctx.restore();
      });

      // 2. Draw Ambient Floating Particles (Fairy Dust)
      particleTimer++;
      if (particleTimer % 15 === 0) {
        addParticle(Math.random() * width, height + 10);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.003;
        p.life--;

        if (p.alpha <= 0 || p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Soft Passing Clouds
      clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > width + 200) {
          cloud.x = -200;
        }

        ctx.save();
        ctx.globalAlpha = cloud.opacity;
        ctx.fillStyle = '#cbd5e1';
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#94a3b8';

        // Draw cloud puff cluster
        ctx.beginPath();
        const startX = cloud.x;
        const startY = cloud.y;
        const s = cloud.scale;

        ctx.arc(startX, startY, 40 * s, 0, Math.PI * 2);
        ctx.arc(startX + 45 * s, startY - 10 * s, 50 * s, 0, Math.PI * 2);
        ctx.arc(startX + 90 * s, startY, 40 * s, 0, Math.PI * 2);
        ctx.arc(startX + 45 * s, startY + 20 * s, 45 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="stars-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
