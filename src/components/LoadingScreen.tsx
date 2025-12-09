import { useState, useEffect } from "react";
import loadingVideo from "@/assets/loading-video.mp4";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onLoadingComplete, minDuration = 3000 }: LoadingScreenProps) {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    if (isVideoEnded || minTimeElapsed) {
      const fadeTimer = setTimeout(() => {
        onLoadingComplete();
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [isVideoEnded, minTimeElapsed, onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fade-in">
      <div className="relative w-full h-full max-w-[140px] max-h-[140px]">


        <video
          autoPlay
          muted
          playsInline
          onEnded={() => setIsVideoEnded(true)}
          className="w-full h-full object-contain"
        >
          <source src={loadingVideo} type="video/mp4" />
        </video>
        
        {/* Loading indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-white/80 text-sm font-medium tracking-wide">SYSTA | SYSTA</p>
        </div>
      </div>
    </div>
  );
}
