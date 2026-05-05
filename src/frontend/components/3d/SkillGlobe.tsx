'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TrackballControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

type Skill = {
  id: number;
  name: string;
  icon: string | null;
  proficiency: number;
  category: string;
};

function SkillNode({ skill, position }: { 
  skill: Skill, 
  position: THREE.Vector3
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={ref} position={position}>
      <Html center distanceFactor={15}>
        <div 
          className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <div className={`p-0 rounded-lg border transition-all duration-300 overflow-hidden ${hovered ? 'bg-foreground border-foreground scale-125' : 'bg-card-bg border-border scale-100'}`}>
            {skill.icon && skill.icon.startsWith('http') ? (
              <img 
                src={skill.icon} 
                alt={skill.name} 
                className="w-10 h-10 object-cover pointer-events-none" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-2xl w-10 h-10 flex items-center justify-center pointer-events-none">💻</span>';
                }}
              />
            ) : (
              <span className="text-2xl w-10 h-10 flex items-center justify-center pointer-events-none">
                {skill.icon || '💻'}
              </span>
            )}
          </div>
          
          <div 
            className={`mt-2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-xl transition-opacity duration-200 pointer-events-none uppercase tracking-tighter ${hovered ? 'opacity-100' : 'opacity-0'}`}
          >
            {skill.name}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Cloud({ skills, radius }: { skills: Skill[], radius: number }) {
  const group = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => {
    const temp: { position: THREE.Vector3, skill: Skill }[] = [];
    const numSkills = skills.length;
    if (numSkills === 0) return temp;

    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    for (let i = 0; i < numSkills; i++) {
      const y = 1 - (i / (numSkills - 1)) * 2; 
      const r = Math.sqrt(1 - y * y); 
      const theta = phi * i; 
      
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      
      temp.push({
        position: new THREE.Vector3(x * radius, y * radius, z * radius),
        skill: skills[i]
      });
    }
    return temp;
  }, [skills, radius]);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <SkillNode 
          key={i} 
          skill={node.skill}
          position={node.position} 
        />
      ))}
    </group>
  );
}

export default function SkillGlobe({ skills }: { skills: Skill[] }) {
  const { theme } = useTheme();
  
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-transparent">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={theme === 'dark' ? 1.5 : 0.8} />
        <pointLight position={[10, 10, 10]} intensity={theme === 'dark' ? 1 : 0.5} />
        <Cloud skills={skills} radius={5} />
        <TrackballControls noPan noZoom rotateSpeed={2} />
      </Canvas>
    </div>
  );
}
