import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { fbm } from '../utils/noise';

interface PlayerProps {
  isPaused: boolean;
}

export const Player: React.FC<PlayerProps> = ({ isPaused }) => {
  const { camera } = useThree();
  const speed = 4.0; // Walking speed
  const bobSpeed = 8;
  const bobAmount = 0.15;
  
  // State for smooth movement
  const position = useRef(new Vector3(0, 10, 0));
  
  useFrame((state, delta) => {
    if (isPaused) return;

    // Auto-walk forward (negative Z in Threejs)
    // We simply move the camera position along its forward vector, but flattened on Y
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0; // Keep movement horizontal
    forward.normalize();

    position.current.addScaledVector(forward, speed * delta);

    // Terrain following logic
    // Calculate height at current X,Z
    // We duplicate the scale logic from Chunk.tsx here to match terrain height
    const scale = 0.03;
    const noiseVal = fbm(position.current.x * scale, position.current.z * scale);
    const terrainHeight = Math.floor(noiseVal * 15); 
    
    // Camera height (Player eye level)
    const targetY = terrainHeight + 2.5; 
    
    // Simple interpolation for smooth terrain traversal
    position.current.y += (targetY - position.current.y) * 5 * delta;

    // View Bobbing
    const time = state.clock.getElapsedTime();
    const bobOffset = Math.sin(time * bobSpeed) * bobAmount;

    // Apply to camera
    camera.position.set(position.current.x, position.current.y + bobOffset, position.current.z);
  });

  return (
    // PointerLock allows the user to look around with the mouse
    <PointerLockControls />
  );
};