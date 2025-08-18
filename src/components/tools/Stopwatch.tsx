import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LapTime {
  id: number;
  time: number;
  lapTime: number;
}

export const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleStopwatch = () => {
    setIsRunning(!isRunning);
    
    if (!isRunning && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'stopwatch_start', {
        event_category: 'productivity'
      });
    }
  };

  const recordLap = () => {
    if (!isRunning) return;
    
    const lastLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
    const lapTime = time - lastLapTime;
    
    setLaps(prev => [...prev, {
      id: prev.length + 1,
      time: time,
      lapTime: lapTime
    }]);

    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'stopwatch_lap', {
        lap_number: laps.length + 1,
        event_category: 'productivity'
      });
    }
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-6">
      {/* Main Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">Stopwatch</span>
        </div>

        {/* Time Display */}
        <div className="text-5xl font-mono font-bold text-primary">
          {formatTime(time)}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={toggleStopwatch}
            size="lg"
            className="rounded-full w-14 h-14 p-0"
            variant={isRunning ? "secondary" : "default"}
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          {isRunning && (
            <Button
              onClick={recordLap}
              variant="outline"
              size="sm"
              className="rounded-full px-6"
            >
              Lap
            </Button>
          )}

          <Button
            onClick={resetStopwatch}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Lap Times</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {laps.slice().reverse().map((lap, index) => (
              <div 
                key={lap.id} 
                className="flex justify-between items-center text-xs bg-secondary/30 rounded-lg px-3 py-2"
              >
                <span className="font-medium">Lap {lap.id}</span>
                <div className="text-right">
                  <div className="font-mono">{formatTime(lap.lapTime)}</div>
                  <div className="text-muted-foreground font-mono text-[10px]">
                    {formatTime(lap.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};