import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { fbm } from '../utils/noise';

interface ChunkProps {
  chunkX: number;
  chunkZ: number;
  size: number;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Colors palette
const COLOR_SAND = new THREE.Color('#e6c288');
const COLOR_SAND_DARK = new THREE.Color('#dcb274');
const COLOR_ROCK = new THREE.Color('#998a76');
const COLOR_CACTUS = new THREE.Color('#5e9c68');

export const Chunk: React.FC<ChunkProps> = React.memo(({ chunkX, chunkZ, size }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate voxel data for this chunk
  const data = useMemo(() => {
    const voxels = [];
    const startX = chunkX * size;
    const startZ = chunkZ * size;
    const scale = 0.03; // Noise scale

    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const worldX = startX + x;
        const worldZ = startZ + z;

        // Get height from noise
        const noiseVal = fbm(worldX * scale, worldZ * scale);
        // Map noise -1..1 to height 0..15
        const height = Math.floor(noiseVal * 15);
        
        // Terrain blocks (fill down to avoid gaps if looking from side, 
        // but for optimization we often just render top layer or a few layers deep.
        // For this aesthetic, let's just render the top block to save massive performance costs
        // or maybe 2 layers deep to hide gaps on steep slopes)
        
        // Type of block
        let color = COLOR_SAND;
        if (height > 10) color = COLOR_ROCK;
        else if (Math.random() > 0.8) color = COLOR_SAND_DARK;

        // Add Top Block
        voxels.push({ x: worldX, y: height, z: worldZ, color });

        // Fill gaps on steep slopes (simple heuristic: add block below)
        voxels.push({ x: worldX, y: height - 1, z: worldZ, color: COLOR_SAND_DARK });

        // Chance for scenery (Cactus)
        // Only on sand, rare chance, simple vertical stack
        if (height <= 10 && Math.random() < 0.01) {
           const cactusHeight = 2 + Math.floor(Math.random() * 3);
           for(let h = 1; h <= cactusHeight; h++) {
              voxels.push({ x: worldX, y: height + h, z: worldZ, color: COLOR_CACTUS });
           }
           // Cactus arms? Maybe too complex for simple voxel loop, keeping it columnar
        }
      }
    }
    return voxels;
  }, [chunkX, chunkZ, size]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    data.forEach((voxel, i) => {
      tempObject.position.set(voxel.x, voxel.y, voxel.z);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      meshRef.current!.setColorAt(i, voxel.color);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

  }, [data]);

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, data.length]} 
      castShadow 
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial flatShading roughness={1} />
    </instancedMesh>
  );
});