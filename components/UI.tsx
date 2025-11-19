import React from 'react';

interface UIProps {
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
}

export const UI: React.FC<UIProps> = ({ isPaused, setIsPaused }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
            VOXEL<span className="text-yellow-300">DESERT</span>
          </h1>
          <p className="text-white/80 text-sm font-mono mt-1 bg-black/20 inline-block px-2 py-1 rounded">
            Procedurally Generated &middot; Infinite &middot; Donuts
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 text-white text-xs font-mono max-w-xs pointer-events-auto">
           <p className="mb-2 font-bold text-yellow-300">CONTROLS</p>
           <ul className="space-y-1">
             <li><span className="bg-white/20 px-1 rounded">MOUSE</span> Look around</li>
             <li><span className="bg-white/20 px-1 rounded">CLICK</span> Capture mouse</li>
             <li><span className="bg-white/20 px-1 rounded">ESC</span> Release mouse</li>
             <li>Auto-walking enabled.</li>
           </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center pointer-events-auto">
          {!isPaused && (
            <div className="text-white/50 text-xs font-mono animate-pulse">
              Generating new chunks...
            </div>
          )}
      </div>
    </div>
  );
};