import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const titleText = "VIRALVERSE";
  const subtitleText = "WELCOME TO WORLD OF HAPPINESS";
  
  // State to track which droplets have landed
  const [landedIndices, setLandedIndices] = useState<number[]>([]);
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Rain State
  const [rainDrops, setRainDrops] = useState<{id: number, left: number, delay: number, duration: number, color: string}[]>([]);

  const colors = [
    '#00f3ff', // Neon Blue
    '#bc13fe', // Neon Purple
    '#0aff0a', // Neon Green
    '#ff00ff', // Neon Pink
    '#ff0055', // Neon Red
    '#ffd700', // Gold
    '#ff8c00', // Orange
    '#00f3ff', // Repeat Blue
    '#bc13fe', // Repeat Purple
    '#0aff0a', // Repeat Green
  ];

  useEffect(() => {
    // Initialize Rain Drops
    const drops = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // %
        delay: Math.random() * 2, // s
        duration: 0.5 + Math.random() * 0.8, // s
        color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setRainDrops(drops);

    // 1. Sequence the droplets
    titleText.split('').forEach((_, index) => {
      const dropDuration = 800; // matches css animation duration
      const delay = index * 200; // Staggered fall

      setTimeout(() => {
        setLandedIndices(prev => [...prev, index]);
      }, delay + dropDuration - 50); // Slightly before end to trigger morph
    });

    // 2. Trigger Subtitle & Audio
    // Wait for all letters to drop (approx 10 letters * 200ms + 800ms) = ~2.8s
    const subtitleDelay = 2500;
    
    const audioTimer = setTimeout(() => {
      setShowSubtitle(true);
      playWelcomeAudio();
    }, subtitleDelay);

    // 3. Complete Animation
    const completeTimer = setTimeout(onComplete, 6500); // Allow time for subtitle to read

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(completeTimer);
      window.speechSynthesis.cancel(); // Stop audio if unmounted
    };
  }, [onComplete]);

  const playWelcomeAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Welcome to world of happiness");
      
      // Attempt to find a pleasant voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Google US English'));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.pitch = 1.1; // Slightly higher pitch for friendliness
      utterance.rate = 0.9;  // Slightly slower for soothing effect
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-dark-800 via-black to-black"></div>
      
      {/* Rain/Water Effect Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
          {rainDrops.map(drop => (
              <div 
                key={drop.id}
                className="rain-streak rounded-full"
                style={{
                    left: `${drop.left}%`,
                    height: `${Math.random() * 20 + 10}vh`, // varying lengths
                    animationDuration: `${drop.duration}s`,
                    animationDelay: `${drop.delay}s`,
                    color: drop.color,
                    background: `linear-gradient(to bottom, transparent, ${drop.color})`,
                    boxShadow: `0 0 5px ${drop.color}`
                }}
              />
          ))}
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-4xl h-[400px] flex flex-col items-center justify-center z-10">
        
        {/* 1. TITLE LETTERS (Droplets -> Text) */}
        <div className="flex justify-center items-center gap-1 md:gap-3 h-32 w-full relative">
          {titleText.split('').map((char, i) => {
             const isLanded = landedIndices.includes(i);
             const color = colors[i % colors.length];
             
             return (
               <div key={i} className="relative w-8 md:w-16 h-full flex justify-center">
                 {/* The Droplet */}
                 <div 
                    className={`letter-drop ${isLanded ? 'opacity-0' : 'animate-drop-land'}`}
                    style={{
                      backgroundColor: color,
                      animationDelay: `${i * 0.2}s`,
                      // Calculate left position for absolute fall, but we are using flex container relative
                      // Actually, we want them to fall into their specific slots.
                      // Since it's inside a flex container, let's assume the drop is absolutely positioned relative to this slot
                      left: '50%',
                      marginLeft: '-20px', // half width
                    }}
                 >
                   <span>{char}</span>
                 </div>

                 {/* The Final Morph Text (Appears when landed) */}
                 <h1 
                    className={`text-4xl md:text-7xl font-black absolute top-1/2 -translate-y-1/2 transition-all duration-500 ${isLanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                    style={{ 
                      color: color,
                      textShadow: `0 0 25px ${color}`,
                    }}
                 >
                   {char}
                 </h1>
               </div>
             );
          })}
        </div>

        {/* 2. SUBTITLE IMPRINT */}
        <div className="mt-8 h-12 flex flex-wrap justify-center gap-[4px] px-4 relative z-20">
          {showSubtitle && subtitleText.split('').map((char, i) => (
            <span 
              key={i}
              className="imprint-letter text-sm md:text-xl font-bold tracking-[0.1em] uppercase font-mono"
              style={{ 
                color: colors[(i * 2) % colors.length], // Varied colors
                animationDelay: `${i * 0.05}s`, // Typing effect speed
                textShadow: `0 0 5px ${colors[(i * 2) % colors.length]}`
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

      </div>

      {/* Subtle Loading Indicator at Bottom */}
      <div className="absolute bottom-10 w-full flex justify-center opacity-50">
         <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
         <div className="w-1 h-1 bg-white rounded-full animate-ping delay-75 ml-2"></div>
         <div className="w-1 h-1 bg-white rounded-full animate-ping delay-150 ml-2"></div>
      </div>
    </div>
  );
};