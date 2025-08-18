import { useState, useEffect } from 'react';
import { Eye, EyeOff, Headphones, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FocusMode = () => {
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'coffee' | 'nature'>('none');
  const [soundVolume, setSoundVolume] = useState(30);

  const ambientSounds = [
    { id: 'none', name: 'No Sound', icon: '🔇' },
    { id: 'rain', name: 'Rain', icon: '🌧️' },
    { id: 'coffee', name: 'Coffee Shop', icon: '☕' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
  ] as const;

  useEffect(() => {
    if (isFocusActive) {
      // Add focus mode class to body
      document.body.classList.add('focus-mode');
      
      // Track focus mode activation
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'focus_mode_start', {
          ambient_sound: ambientSound,
          sound_volume: soundVolume,
          event_category: 'productivity'
        });
      }
    } else {
      document.body.classList.remove('focus-mode');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('focus-mode');
    };
  }, [isFocusActive, ambientSound, soundVolume]);

  const toggleFocusMode = () => {
    setIsFocusActive(!isFocusActive);
  };

  const handleSoundChange = (sound: typeof ambientSound) => {
    setAmbientSound(sound);
    
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'ambient_sound_change', {
        sound_type: sound,
        event_category: 'productivity'
      });
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Focus Mode Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          {isFocusActive ? (
            <Eye className="w-5 h-5 text-primary" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">
            Focus Mode {isFocusActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Main Focus Button */}
        <div className="relative">
          <Button
            onClick={toggleFocusMode}
            size="lg"
            className={`rounded-full w-32 h-32 text-lg font-semibold transition-all duration-300 ${
              isFocusActive 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse-glow' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isFocusActive ? 'Exit Focus' : 'Start Focus'}
          </Button>
          
          {isFocusActive && (
            <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
          )}
        </div>

        {isFocusActive && (
          <div className="text-sm text-muted-foreground max-w-xs mx-auto">
            Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">ESC</kbd> key or click "Exit Focus" to return to normal mode
          </div>
        )}
      </div>

      {/* Ambient Sounds */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Headphones className="w-4 h-4" />
          <span className="text-sm font-medium">Ambient Sounds</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ambientSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => handleSoundChange(sound.id)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                ambientSound === sound.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              <div className="text-lg mb-1">{sound.icon}</div>
              <div>{sound.name}</div>
            </button>
          ))}
        </div>

        {/* Volume Control */}
        {ambientSound !== 'none' && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Volume</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">0%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume}
                onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {soundVolume}%
            </div>
          </div>
        )}
      </div>

      {/* Focus Tips */}
      <div className="text-xs text-muted-foreground text-left space-y-2 max-w-sm mx-auto">
        <div className="font-medium">Focus Mode Benefits:</div>
        <ul className="space-y-1 text-left">
          <li>• Dims all distracting UI elements</li>
          <li>• Provides calming ambient sounds</li>
          <li>• Helps maintain concentration</li>
          <li>• Reduces visual clutter</li>
        </ul>
      </div>

      {/* Focus Mode Overlay */}
      {isFocusActive && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-2xl font-bold mb-4">Focus Mode Active</div>
            <div className="text-lg mb-6">Eliminate distractions and focus on what matters</div>
            <Button
              onClick={toggleFocusMode}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Exit Focus Mode
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};