import React, { useRef } from 'react';
import { Sky, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Color, FogExp2, Vector3 } from 'three';
import { World } from './World';
import { DonutRain } from './DonutRain';
import { Player } from './Player';

interface ExperienceProps {
  isPaused: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({ isPaused }) => {
  // Desert aesthetic configuration
  const fogColor = new Color('#ffddaa');

  return (
    <>
      {/* Environment */}
      <Sky 
        sunPosition={[100, 20, 100]} 
        turbidity={10} 
        rayleigh={2} 
        mieCoefficient={0.005} 
        mieDirectionalG={0.8} 
      />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[50, 50, 25]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50, 0.1, 100]} />
      </directionalLight>
      
      <fogExp2 attach="fog" color={fogColor} density={0.02} />

      {/* Game Logic */}
      <Player isPaused={isPaused} />
      <World />
      <DonutRain count={150} range={60} />
    </>
  );
};