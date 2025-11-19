import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, KeyboardControls } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UI } from './components/UI';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
          { name: 'run', keys: ['Shift'] },
        ]}
      >
        <div className="relative w-full h-full bg-sky-300">
          <Canvas
            shadows
            camera={{ position: [0, 5, 10], fov: 60 }}
            dpr={[1, 1.5]} // Optimization for retina screens
          >
            <Suspense fallback={null}>
              <Experience isPaused={isPaused} />
            </Suspense>
          </Canvas>
          
          <UI isPaused={isPaused} setIsPaused={setIsPaused} />
          <Loader />
        </div>
      </KeyboardControls>
    </>
  );
}