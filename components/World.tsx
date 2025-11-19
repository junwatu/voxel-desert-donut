import React, { useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Chunk } from './Chunk';

const CHUNK_SIZE = 16; // Blocks per chunk side
const RENDER_DISTANCE = 3; // Radius of chunks to render (3 means 7x7 grid)

export const World: React.FC = () => {
  const { camera } = useThree();
  const [currentChunk, setCurrentChunk] = useState({ x: 0, z: 0 });

  useFrame(() => {
    // Calculate which chunk the camera is currently in
    const x = Math.floor(camera.position.x / CHUNK_SIZE);
    const z = Math.floor(camera.position.z / CHUNK_SIZE);

    if (x !== currentChunk.x || z !== currentChunk.z) {
      setCurrentChunk({ x, z });
    }
  });

  // Generate keys for visible chunks
  const chunks = useMemo(() => {
    const keys = [];
    for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
      for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
        keys.push({
          x: currentChunk.x + x,
          z: currentChunk.z + z,
          key: `${currentChunk.x + x}:${currentChunk.z + z}`
        });
      }
    }
    return keys;
  }, [currentChunk]);

  return (
    <group>
      {chunks.map((chunk) => (
        <Chunk 
          key={chunk.key} 
          chunkX={chunk.x} 
          chunkZ={chunk.z} 
          size={CHUNK_SIZE} 
        />
      ))}
    </group>
  );
};