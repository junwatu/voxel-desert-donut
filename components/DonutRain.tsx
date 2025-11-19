import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DonutRainProps {
  count: number;
  range: number;
}

export const DonutRain: React.FC<DonutRainProps> = ({ count, range }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();

  // Store individual donut state (position, rotation speed, velocity)
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * range,
        20 + Math.random() * 30, // Start high up
        (Math.random() - 0.5) * range
      ),
      velocity: 2 + Math.random() * 3,
      rotationAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
      rotationSpeed: Math.random() * 2,
      rotation: new THREE.Quaternion(),
      scale: 0.5 + Math.random() * 1.5,
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6) // Random sweet colors
    }));
  }, [count, range]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Update Y Position (Fall)
      particle.position.y -= particle.velocity * delta;

      // Respawn logic relative to camera
      // If it falls too low or gets too far behind camera
      const floorThreshold = camera.position.y - 10;
      
      // Check distance to camera on X/Z plane to keep rain around player
      const dx = particle.position.x - camera.position.x;
      const dz = particle.position.z - camera.position.z;
      
      // Wrap around logic: if particle is too far, move it to the other side
      // This creates an infinite field feeling without respawning excessively
      if (dx > range / 2) particle.position.x -= range;
      if (dx < -range / 2) particle.position.x += range;
      if (dz > range / 2) particle.position.z -= range;
      if (dz < -range / 2) particle.position.z += range;

      // Reset height if it hits "ground" (approximated)
      if (particle.position.y < -5) {
         particle.position.y = 30 + Math.random() * 10;
         // Re-center slightly around camera x/z to ensure density
         particle.position.x = camera.position.x + (Math.random() - 0.5) * range;
         particle.position.z = camera.position.z + (Math.random() - 0.5) * range;
      }

      // Rotate
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.scale);
      
      // Add rotation
      const rotStep = particle.rotationSpeed * delta;
      const qStep = new THREE.Quaternion().setFromAxisAngle(particle.rotationAxis, rotStep);
      particle.rotation.multiply(qStep);
      dummy.quaternion.copy(particle.rotation);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      // meshRef.current!.setColorAt(i, particle.color); // Needs instanceColor usage
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  // Set initial colors once
  React.useLayoutEffect(() => {
      if(meshRef.current) {
          particles.forEach((p, i) => meshRef.current!.setColorAt(i, p.color));
          meshRef.current.instanceColor!.needsUpdate = true;
      }
  }, [particles]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Torus Geometry for Donuts: radius, tube, radialSegments, tubularSegments */}
      <torusGeometry args={[0.6, 0.25, 8, 16]} />
      <meshStandardMaterial flatShading roughness={0.2} metalness={0.1} />
    </instancedMesh>
  );
};