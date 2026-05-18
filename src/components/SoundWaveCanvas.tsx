import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SoundWaveCanvasProps {
  className?: string;
  imageUrl?: string;
}

export default function SoundWaveCanvas({ className = '', imageUrl }: SoundWaveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const uniformsRef = useRef<any>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, -500, 350);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeIntersect = new THREE.Vector3();
    const mouse = new THREE.Vector2();

    const createNoteParticles = () => {
      const particleCount = 15000;
      const positions = [];
      const colors = [];
      const baseZs = [];

      const noteShape = (angle: number, radius: number) => {
        const innerRadius = radius * 0.35;
        if (angle > Math.PI * 1.5) {
          return innerRadius + (radius - innerRadius) * ((angle - Math.PI * 1.5) / (Math.PI * 0.5));
        }
        return radius;
      };

      const spacing = 3.5;
      const particleResX = Math.sqrt(particleCount / 2);
      const particleResY = Math.floor(particleResX * 0.6);
      const offsetX = (particleResX * spacing) / 2;
      const offsetY = (particleResY * spacing) / 2;

      for (let y = 0; y < particleResY; y++) {
        for (let x = 0; x < particleResX; x++) {
          const nx = x / particleResX;
          const ny = y / particleResY;
          const angle = nx * Math.PI * 2;
          const radius = noteShape(angle, 100) * 0.8 + Math.random() * 20;

          const pX = Math.cos(angle) * radius;
          const pY = Math.sin(angle) * radius * 0.6;
          const brightness = 0.4 + Math.random() * 0.6;
          const pZ = brightness * 80;

          positions.push(pX, pY, 0);
          colors.push(0.3 + Math.random() * 0.2, 0.7 + Math.random() * 0.3, 0.4 + Math.random() * 0.2);
          baseZs.push(pZ);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('baseZ', new THREE.Float32BufferAttribute(baseZs, 1));

      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uHoverRadius: { value: 120.0 },
        uHoverLift: { value: 100.0 }
      };
      uniformsRef.current = uniforms;

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uHoverRadius;
          uniform float uHoverLift;

          attribute vec3 color;
          attribute float baseZ;

          varying vec3 vColor;

          void main() {
            vColor = color;
            vec3 pos = position;

            pos.z += baseZ;

            float distCenter = length(pos.xy);
            pos.z += sin(pos.x * 0.02 + uTime) * cos(pos.y * 0.02 + uTime) * 10.0;

            float distMouse = distance(pos.xy, uMouse);
            if(distMouse < uHoverRadius) {
              float influence = 1.0 - (distMouse / uHoverRadius);
              influence = smoothstep(0.0, 1.0, influence);
              pos.z += influence * uHoverLift;
              vColor = mix(vColor, vec3(1.0, 1.0, 1.0), influence * 0.4);
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 4.0 * (600.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if(dist > 0.5) discard;
            
            float alpha = 1.0 - (dist * 2.0);
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(geometry, material);
      particles.rotation.x = Math.PI / 12;
      scene.add(particles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (uniformsRef.current) {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, planeIntersect);
        uniformsRef.current.uMouse.value.set(planeIntersect.x, planeIntersect.y);
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    createNoteParticles();

    const clock = new THREE.Clock();
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      targetX = (mouseX - window.innerWidth / 2) * 0.2;
      targetY = (mouseY - window.innerHeight / 2) * 0.2;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.z = 350 + (targetY * -0.5);
      camera.lookAt(0, 0, 0);

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value = clock.getElapsedTime();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
