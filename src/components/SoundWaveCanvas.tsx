import { useEffect, useRef } from 'react';

interface SoundWaveCanvasProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export default function SoundWaveCanvas({ className = '' }: SoundWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isMouseOver: false });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const noteShape = (angle: number, radius: number) => {
        const innerRadius = radius * 0.3;
        if (angle > Math.PI * 1.5) {
          return innerRadius + (radius - innerRadius) * ((angle - Math.PI * 1.5) / (Math.PI * 0.5));
        }
        return radius;
      };

      for (let i = 0; i < 800; i++) {
        const layer = Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;
        const baseRadius = 80 + layer * 30;
        const radius = noteShape(angle, baseRadius) * (0.8 + Math.random() * 0.4);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.6;
        
        const greenShade = Math.floor(150 + Math.random() * 105);
        const alpha = 0.4 + Math.random() * 0.6;
        
        particles.push({
          x,
          y,
          z: layer,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 2 + layer + Math.random() * 2,
          color: `rgba(${greenShade}, 255, ${100 + Math.random() * 50}, ${alpha})`,
        });
      }

      for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 200 + Math.random() * 200;
        particles.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius * 0.6,
          z: 0,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: 1 + Math.random() * 2,
          color: `rgba(${80 + Math.random() * 50}, ${180 + Math.random() * 50}, ${100 + Math.random() * 30}, ${0.2 + Math.random() * 0.3})`,
        });
      }

      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isMouseOver = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isMouseOver = false;
    };

    let time = 0;

    const animate = () => {
      ctx.fillStyle = '#050a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const { x: mouseX, y: mouseY, isMouseOver } = mouseRef.current;

      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width);
      bgGradient.addColorStop(0, 'rgba(20, 40, 30, 0.5)');
      bgGradient.addColorStop(0.5, 'rgba(10, 25, 20, 0.3)');
      bgGradient.addColorStop(1, 'rgba(5, 10, 15, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let ring = 0; ring < 8; ring++) {
        const ringRadius = 60 + ring * 45 + ((time * 2 + ring * 30) % 60);
        const ringAlpha = Math.max(0.03, 0.25 - ring * 0.03);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        
        const ringGradient = ctx.createRadialGradient(
          centerX, centerY, ringRadius - 8,
          centerX, centerY, ringRadius + 8
        );
        ringGradient.addColorStop(0, 'transparent');
        ringGradient.addColorStop(0.5, `rgba(60, 200, 120, ${ringAlpha})`);
        ringGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = ringGradient;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      particlesRef.current.sort((a, b) => a.z - b.z);

      particlesRef.current.forEach((particle) => {
        const dx = particle.x - (isMouseOver ? mouseX : centerX);
        const dy = particle.y - (isMouseOver ? mouseY : centerY);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = isMouseOver ? 350 : 400;
        const mouseInfluence = Math.max(0, 1 - distance / maxDistance);

        const targetX = particle.x + particle.vx + (isMouseOver ? -dx * 0.001 * mouseInfluence : 0);
        const targetY = particle.y + particle.vy + (isMouseOver ? -dy * 0.001 * mouseInfluence : 0);

        particle.x += (targetX - particle.x) * 0.05;
        particle.y += (targetY - particle.y) * 0.05;

        const pulse = Math.sin(time * 0.03 + particle.z * 2 + particle.x * 0.01) * 0.3 + 0.7;
        const size = particle.size * pulse * (1 + mouseInfluence * 0.5);
        
        const shadowOffset = particle.z * 2;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 3
        );
        
        const brightnessBoost = mouseInfluence * 0.4;
        const alphaMatch = particle.color.match(/[\d.]+(?=\))/);
        const currentAlpha = alphaMatch ? parseFloat(alphaMatch[0]) : 0.5;
        const newAlpha = Math.min(1, currentAlpha + brightnessBoost);
        gradient.addColorStop(0, particle.color.replace(/[\d.]+\)$/, `${newAlpha})`));
        gradient.addColorStop(0.5, `rgba(40, 150, 100, ${0.2 + brightnessBoost * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(particle.x + shadowOffset * 0.5, particle.y + shadowOffset * 0.5, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + brightnessBoost})`;
        ctx.fill();
      });

      if (isMouseOver) {
        for (let ring = 0; ring < 5; ring++) {
          const ringRadius = 20 + ring * 20 + ((time * 4 + ring * 25) % 40);
          const ringAlpha = Math.max(0.1, 0.5 - ring * 0.08);
          
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, ringRadius, 0, Math.PI * 2);
          
          const ringGradient = ctx.createRadialGradient(
            mouseX, mouseY, ringRadius - 4,
            mouseX, mouseY, ringRadius + 4
          );
          ringGradient.addColorStop(0, 'transparent');
          ringGradient.addColorStop(0.5, `rgba(180, 255, 120, ${ringAlpha})`);
          ringGradient.addColorStop(1, 'transparent');
          
          ctx.strokeStyle = ringGradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
