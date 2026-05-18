import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SoundWaveCanvasProps {
  className?: string;
}

export default function SoundWaveCanvas({ className = '' }: SoundWaveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const noteParticlesRef = useRef<THREE.Points | null>(null);
  const bgParticlesRef = useRef<THREE.Points | null>(null);
  const ripplesRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isMouseOver: false });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#050a0f', 10, 50);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor('#050a0f', 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#44ff88', 2, 50);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight('#22ffaa', 1.5, 40);
    pointLight2.position.set(-5, 3, -5);
    scene.add(pointLight2);

    const createNoteParticles = () => {
      const particleCount = 3000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const layer = Math.random() * 2.5;
        const angle = Math.random() * Math.PI * 2;
        const baseRadius = 1.5 + layer * 0.5;
        
        let radius = baseRadius;
        if (angle > Math.PI * 1.5) {
          const innerRadius = baseRadius * 0.3;
          radius = innerRadius + (baseRadius - innerRadius) * ((angle - Math.PI * 1.5) / (Math.PI * 0.5));
        }
        radius *= 0.7 + Math.random() * 0.6;
        
        const x = Math.cos(angle) * radius;
        const y = layer * 0.3 - 0.5;
        const z = Math.sin(angle) * radius;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        colors[i * 3] = 0.3 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.4 + Math.random() * 0.3;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      noteParticlesRef.current = particles;
      return { positions, colors };
    };

    const createRipples = () => {
      const rippleGroup = new THREE.Group();
      
      for (let i = 0; i < 8; i++) {
        const geometry = new THREE.RingGeometry(
          0.5 + i * 0.8, 
          0.7 + i * 0.8, 
          64
        );
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#22cc77'),
          transparent: true,
          opacity: 0.15 - i * 0.015,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = -Math.PI / 2;
        ring.userData = { baseOpacity: 0.15 - i * 0.015, index: i };
        rippleGroup.add(ring);
      }
      
      rippleGroup.position.y = -0.8;
      scene.add(rippleGroup);
      ripplesRef.current = rippleGroup;
      return rippleGroup;
    };

    const createBackgroundParticles = () => {
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const radius = 4 + Math.random() * 12;
        const angle = Math.random() * Math.PI * 2;
        const height = -2 + Math.random() * 6;
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        colors[i * 3] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      bgParticlesRef.current = particles;
      return particles;
    };

    const { positions: originalPositions, colors: originalColors } = createNoteParticles();
    const ripples = createRipples();
    const bgParticles = createBackgroundParticles();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / height) * 2 + 1;
      mouseRef.current.isMouseOver = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isMouseOver = false;
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    let time = 0;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.016;

      const { x: mouseX, y: mouseY, isMouseOver } = mouseRef.current;

      if (noteParticlesRef.current) {
        const positions = noteParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const colors = noteParticlesRef.current.geometry.attributes.color.array as Float32Array;

        for (let i = 0; i < positions.length / 3; i++) {
          const idx = i * 3;
          const originalX = originalPositions[idx];
          const originalY = originalPositions[idx + 1];
          const originalZ = originalPositions[idx + 2];

          let mouseInfluence = 0;
          if (isMouseOver) {
            const dx = originalX - (mouseX * 3);
            const dy = originalY - (mouseY * 2 + 1);
            const dz = originalZ;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            mouseInfluence = Math.max(0, 1 - distance / 6);
          }

          const pulse = Math.sin(time * 2 + i * 0.1) * 0.08;
          const heightMod = 0.3 + (isMouseOver ? mouseInfluence * 0.8 : 0.2);
          
          positions[idx + 1] = originalY + pulse * (1 + heightMod);
          colors[idx + 1] = Math.min(1, 0.7 + (isMouseOver ? mouseInfluence * 0.3 : 0));
        }

        noteParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        noteParticlesRef.current.geometry.attributes.color.needsUpdate = true;
        noteParticlesRef.current.rotation.y += 0.002;
      }

      ripples.children.forEach((ring, i) => {
        const ringMesh = ring as THREE.Mesh;
        const baseOpacity = ringMesh.userData.baseOpacity;
        const wave = Math.sin(time * 1.5 + i * 0.5) * 0.5 + 0.5;
        
        ringMesh.scale.setScalar(1 + wave * 0.15);
        (ringMesh.material as THREE.MeshBasicMaterial).opacity = baseOpacity * (0.6 + wave * 0.4);
      });

      bgParticles.rotation.y += 0.001;
      bgParticles.rotation.z += 0.0005;

      camera.position.x = Math.sin(time * 0.1) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (renderer) {
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
