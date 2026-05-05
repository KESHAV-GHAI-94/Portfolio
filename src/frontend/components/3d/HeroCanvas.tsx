'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const ParticleField = () => {
  const { theme } = useTheme();
  const pointsRef = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particlesCount = 6000;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      // Distribute particles in a larger volume
      const r = 20 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = r * Math.cos(phi); // z

      // Vibrant Multi-color based on theme
      const isDark = theme === 'dark';
      
      // Randomly pick between a few premium hues (Blue, Purple, Pink)
      const hues = [0.6, 0.7, 0.85, 0.1]; // Blue, Purple, Pink, Soft Gold
      const baseHue = hues[Math.floor(Math.random() * hues.length)];
      const hueVariation = (Math.random() - 0.5) * 0.1;
      
      const color = new THREE.Color().setHSL(
        baseHue + hueVariation, 
        isDark ? 0.7 : 0.4, 
        isDark ? Math.random() * 0.4 + 0.4 : Math.random() * 0.3 + 0.2
      );
        
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, [theme]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Slow base rotation
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;

      // Mouse interaction drift
      pointsRef.current.position.x += (mouse.x * 1.5 - pointsRef.current.position.x) * 0.02;
      pointsRef.current.position.y += (mouse.y * 1.5 - pointsRef.current.position.y) * 0.02;

      // Scroll-linked camera drift effect (moving the points relative to camera)
      const scrollY = window.scrollY || 0;
      pointsRef.current.position.z = scrollY * 0.005; 
    }
  });

  // Cleanup geometries/materials on unmount handled by r3f implicitly,
  // but explicitly good practice if we create them manually. 
  // Here we use JSX which automatically disposes elements.
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={theme === 'dark' ? 0.8 : 0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default function HeroCanvas() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!isClient) return null;

  if (isReducedMotion) {
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-900 to-black" />
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
