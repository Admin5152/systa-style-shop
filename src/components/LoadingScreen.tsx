import { useState, useEffect } from "react";
import loadingVideo from "@/assets/loading-video.mp4";
import { Button } from "@/components/ui/button";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onLoadingComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    if (isVideoEnded || minTimeElapsed) {
      setFadeOut(true);
      const fadeTimer = setTimeout(() => {
        onLoadingComplete();
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [isVideoEnded, minTimeElapsed, onLoadingComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      onLoadingComplete();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-full h-full max-w-[160px] max-h-[160px]">
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
        </div>
      </div>
      
      {/* Skip button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-white/70 hover:text-white hover:bg-white/10"
      >
        Skip
      </Button>
    </div>
  );
}
