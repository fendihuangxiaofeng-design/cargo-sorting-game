import { useEffect, useRef } from 'react';

interface SoundWaveCanvasProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  velocity: number;
  amplitude: number;
  frequency: number;
  phase: number;
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
      const spacing = 3;
      const rows = Math.floor(canvas.height / spacing);
      const cols = Math.floor(canvas.width / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * spacing,
            y: j * spacing,
            originalX: i * spacing,
            originalY: j * spacing,
            velocity: 0,
            amplitude: 0,
            frequency: 0.02 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2,
          });
        }
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
      ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY, isMouseOver } = mouseRef.current;

      particlesRef.current.forEach((particle) => {
        const dx = particle.originalX - mouseX;
        const dy = particle.originalY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = isMouseOver ? 300 : 150;
        const influence = Math.max(0, 1 - distance / maxDistance);

        const targetAmplitude = isMouseOver ? influence * 50 : influence * 20;
        particle.amplitude += (targetAmplitude - particle.amplitude) * 0.08;

        particle.phase += particle.frequency;
        const wave = Math.sin(particle.phase + time * 0.02) * particle.amplitude;

        particle.x = particle.originalX + wave * 0.3;
        particle.y = particle.originalY + wave;

        if (particle.amplitude > 0.5) {
          const alpha = Math.min(1, particle.amplitude / 30);
          const hue = 220 + particle.amplitude * 1.5;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 1 + particle.amplitude * 0.03, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
          ctx.fill();

          if (particle.amplitude > 15) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2 + particle.amplitude * 0.05, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue + 20}, 90%, 70%, ${alpha * 0.5})`;
            ctx.fill();
          }
        }
      });

      for (let i = 0; i < 5; i++) {
        const y = canvas.height * (0.3 + i * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, y);

        for (let x = 0; x < canvas.width; x += 2) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = isMouseOver ? 400 : 200;
          const influence = Math.max(0, 1 - distance / maxDistance);
          const amplitude = isMouseOver ? influence * 60 : influence * 25;
          
          const waveY = y + Math.sin(x * 0.01 + time * 0.03 + i) * amplitude;
          ctx.lineTo(x, waveY);
        }

        const hue = 240 + i * 20;
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
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
      style={{ background: 'linear-gradient(to bottom, #0a0a0f, #0f0f1a)' }}
    />
  );
}
