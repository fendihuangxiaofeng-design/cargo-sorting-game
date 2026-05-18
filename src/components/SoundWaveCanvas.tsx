import { useEffect, useRef } from 'react';

interface SoundWaveCanvasProps {
  className?: string;
}

interface WaveBar {
  x: number;
  baseHeight: number;
  currentHeight: number;
  targetHeight: number;
  frequency: number;
  phase: number;
}

export default function SoundWaveCanvas({ className = '' }: SoundWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isMouseOver: false });
  const barsRef = useRef<WaveBar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBars();
    };

    const initBars = () => {
      const bars: WaveBar[] = [];
      const barCount = Math.floor(canvas.width / 3);
      
      for (let i = 0; i < barCount; i++) {
        bars.push({
          x: i * 3,
          baseHeight: 20 + Math.random() * 30,
          currentHeight: 20,
          targetHeight: 20,
          frequency: 0.05 + Math.random() * 0.03,
          phase: Math.random() * Math.PI * 2,
        });
      }
      barsRef.current = bars;
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
      ctx.fillStyle = '#0a141a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY, isMouseOver } = mouseRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width);
      gradient.addColorStop(0, 'rgba(20, 40, 30, 0.3)');
      gradient.addColorStop(1, 'rgba(5, 15, 20, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      barsRef.current.forEach((bar) => {
        const dx = bar.x - (isMouseOver ? mouseX : centerX);
        const dy = canvas.height / 2 - (isMouseOver ? mouseY : centerY);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = isMouseOver ? 400 : 500;
        const influence = Math.max(0, 1 - distance / maxDistance);

        const baseInfluence = isMouseOver ? influence : 0.3 + influence * 0.4;
        const wavePhase = time * bar.frequency + bar.phase;
        const waveOffset = Math.sin(wavePhase) * 15;
        
        bar.targetHeight = bar.baseHeight + baseInfluence * (250 + waveOffset);
        bar.currentHeight += (bar.targetHeight - bar.currentHeight) * 0.1;

        const barHeight = Math.max(5, bar.currentHeight);
        const barWidth = 2.5;
        
        const gradientY = canvas.height - barHeight;
        const barGradient = ctx.createLinearGradient(bar.x, gradientY, bar.x, canvas.height);
        
        const brightness = Math.min(1, 0.3 + baseInfluence * 0.7);
        const innerGlow = `rgba(180, 255, 100, ${brightness})`;
        const outerGlow = `rgba(50, 150, 120, ${brightness * 0.5})`;
        const baseColor = `rgba(20, 60, 50, ${brightness * 0.8})`;
        
        barGradient.addColorStop(0, innerGlow);
        barGradient.addColorStop(0.6, outerGlow);
        barGradient.addColorStop(1, baseColor);

        ctx.fillStyle = barGradient;
        ctx.fillRect(bar.x - barWidth / 2, canvas.height - barHeight, barWidth, barHeight);

        if (barHeight > 80) {
          const glowSize = Math.min(20, barHeight * 0.15);
          const glowGradient = ctx.createRadialGradient(bar.x, canvas.height - barHeight, 0, bar.x, canvas.height - barHeight, glowSize);
          glowGradient.addColorStop(0, `rgba(180, 255, 100, ${brightness * 0.8})`);
          glowGradient.addColorStop(0.5, `rgba(50, 200, 150, ${brightness * 0.3})`);
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGradient;
          ctx.fillRect(bar.x - glowSize, canvas.height - barHeight - glowSize, glowSize * 2, glowSize * 2);
        }
      });

      for (let ring = 0; ring < 6; ring++) {
        const ringRadius = 80 + ring * 70 + ((time * 2 + ring * 50) % 100);
        const ringAlpha = Math.max(0.05, 0.3 - ring * 0.04);
        
        ctx.beginPath();
        ctx.arc(isMouseOver ? mouseX : centerX, isMouseOver ? mouseY : centerY, ringRadius, 0, Math.PI * 2);
        
        const ringGradient = ctx.createRadialGradient(
          isMouseOver ? mouseX : centerX,
          isMouseOver ? mouseY : centerY,
          ringRadius - 5,
          isMouseOver ? mouseX : centerX,
          isMouseOver ? mouseY : centerY,
          ringRadius + 5
        );
        ringGradient.addColorStop(0, 'transparent');
        ringGradient.addColorStop(0.5, `rgba(80, 220, 150, ${ringAlpha})`);
        ringGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = ringGradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const particleCount = 100;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.005;
        const radius = 100 + ((time * 3 + i * 10) % 400);
        const px = (isMouseOver ? mouseX : centerX) + Math.cos(angle) * radius;
        const py = (isMouseOver ? mouseY : centerY) + Math.sin(angle) * radius;
        
        const brightness = Math.max(0.1, 0.8 - radius / 500);
        
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 255, 120, ${brightness})`;
        ctx.fill();
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
      style={{ background: '#0a141a' }}
    />
  );
}
