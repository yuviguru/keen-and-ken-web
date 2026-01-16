'use client';
import { useEffect, useState } from 'react';

export default function LightStreaks() {
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(Math.random() * 0.5 + 0.3);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Light streaks */}
      <div
        className="absolute left-[-50px] top-[10%] w-[200px] h-[600px] bg-gradient-to-b from-[#ff00ff66] to-[#ff00ff00] 
        rotate-[-30deg] opacity-40 blur-lg"
        style={{ opacity }}
      />
      <div
        className="absolute left-[-30px] top-[50%] w-[180px] h-[500px] bg-gradient-to-b from-[#00ffff66] to-[#00ffff00] 
        rotate-[-20deg] opacity-30 blur-lg"
        style={{ opacity: opacity - 0.1 }}
      />
    </div>
  );
}
