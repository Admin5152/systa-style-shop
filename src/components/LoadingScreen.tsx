import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onLoadingComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsedTime / minDuration) * 100));
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          onLoadingComplete();
        }, 500); // Wait for fade out animation
      }
    }, 20); // Update frequently for smooth counting

    return () => clearInterval(interval);
  }, [minDuration, onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-background text-foreground flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="font-heading text-4xl tracking-widest uppercase">
        LOADING... {progress}%
      </div>
    </div>
  );
}
