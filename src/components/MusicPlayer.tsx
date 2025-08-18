import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, ChevronUp, ChevronDown } from 'lucide-react';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-hide logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Show if mouse is near bottom-right corner
      if (clientX > innerWidth - 100 && clientY > innerHeight - 100) {
        setIsVisible(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (!isHovered) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          setIsExpanded(false);
        }, 2000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsExpanded(false);
    }, 5000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Here you would integrate with YouTube API
    console.log('Toggle play:', !isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      ref={playerRef}
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isExpanded ? (
        // Expanded Player
        <div className="glass-card p-4 rounded-xl shadow-xl w-72">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Background Music</span>
            </div>
            <button
              onClick={toggleExpanded}
              className="p-1 rounded hover:bg-secondary/50 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Now Playing */}
            <div className="text-xs text-muted-foreground">
              Now Playing: Lofi Hip Hop Mix
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2 flex-1">
                <button onClick={toggleMute} className="p-1">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="flex-1 h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {isMuted ? 0 : volume}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/3 transition-all duration-1000" />
            </div>
          </div>
        </div>
      ) : (
        // Minimized Player
        <button
          onClick={toggleExpanded}
          className={`glass-card p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200 ${
            isPlaying ? 'animate-pulse-glow' : ''
          }`}
        >
          <Music className="w-5 h-5 text-primary" />
        </button>
      )}

      {/* Hidden YouTube Player (would be implemented with YouTube IFrame API) */}
      <div className="hidden">
        {/* YouTube iframe would go here */}
      </div>
    </div>
  );
};