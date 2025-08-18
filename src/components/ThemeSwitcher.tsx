import { useState, useEffect, useRef } from 'react';
import { Palette } from 'lucide-react';

interface ThemeSwitcherProps {
  currentTheme: 'minimalist' | 'tech' | 'anime';
  onThemeChange: (theme: 'minimalist' | 'tech' | 'anime') => void;
}

export const ThemeSwitcher = ({ currentTheme, onThemeChange }: ThemeSwitcherProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const themes = [
    { id: 'minimalist', name: 'Minimalist', color: '#3498db' },
    { id: 'tech', name: 'Tech', color: '#00d4ff' },
    { id: 'anime', name: 'Anime', color: '#ff6b9d' }
  ] as const;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerHeight } = window;
      
      // Show if mouse is in middle-left area (within 100px from left edge, middle 40% of screen height)
      const middleStart = innerHeight * 0.3;
      const middleEnd = innerHeight * 0.7;
      
      if (clientX < 100 && clientY > middleStart && clientY < middleEnd) {
        setIsVisible(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (!isHovered) {
        // Hide after delay if not hovering
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 1000);
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
    }, 3000);
  };

  return (
    <>
      {/* Enhanced hover hint - theme icon indicator on left side */}
      <div className="fixed left-2 top-1/2 transform -translate-y-1/2 z-40">
        <div className="theme-switcher-icon w-4 h-10 rounded-r-full flex items-center justify-center">
          <Palette className="w-3 h-3 text-primary-foreground" />
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className={`fixed left-5 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="theme-switcher-highlight p-4 rounded-xl shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">Change Theme</span>
          </div>
          
          <div className="flex flex-col gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                currentTheme === theme.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary/50'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white/50"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};