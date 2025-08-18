import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const CountdownTimer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [label, setLabel] = useState('');
  const intervalRef = useRef<NodeJS.Timeout>();

  const totalTime = hours * 3600 + minutes * 60 + seconds;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            
            // Track completion in analytics
            if (typeof (window as any).gtag !== 'undefined') {
              (window as any).gtag('event', 'countdown_complete', {
                duration_seconds: totalTime,
                event_category: 'productivity'
              });
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
  }, [isRunning, timeLeft, totalTime]);

  const startTimer = () => {
    if (totalTime === 0) return;
    
    setTimeLeft(totalTime);
    setIsRunning(true);
    setIsFinished(false);

    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'countdown_start', {
        duration_seconds: totalTime,
        has_label: !!label,
        event_category: 'productivity'
      });
    }
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      startTimer();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustTime = (type: 'hours' | 'minutes' | 'seconds', increment: boolean) => {
    if (isRunning) return;
    
    const change = increment ? 1 : -1;
    
    switch (type) {
      case 'hours':
        setHours(Math.max(0, Math.min(23, hours + change)));
        break;
      case 'minutes':
        setMinutes(Math.max(0, Math.min(59, minutes + change)));
        break;
      case 'seconds':
        setSeconds(Math.max(0, Math.min(59, seconds + change)));
        break;
    }
  };

  const progress = timeLeft > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <div className="text-center space-y-6">
      {/* Timer Label */}
      <div className="space-y-2">
        <Input
          placeholder="Add a label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="text-center"
          disabled={isRunning}
        />
      </div>

      {/* Time Display */}
      {timeLeft > 0 ? (
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${isFinished ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                {formatTime(timeLeft)}
              </div>
              {label && (
                <div className="text-xs text-muted-foreground mt-1">
                  {label}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Time Setup
        <div className="space-y-4">
          <div className="text-lg font-medium text-muted-foreground">Set Timer</div>
          
          <div className="flex items-center justify-center gap-4">
            {/* Hours */}
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 rounded-full mb-2"
                onClick={() => adjustTime('hours', true)}
                disabled={isRunning}
              >
                <Plus className="w-3 h-3" />
              </Button>
              <div className="text-2xl font-mono font-bold w-12">
                {hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground mb-2">hours</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 rounded-full"
                onClick={() => adjustTime('hours', false)}
                disabled={isRunning}
              >
                <Minus className="w-3 h-3" />
              </Button>
            </div>

            <div className="text-2xl font-bold text-muted-foreground">:</div>

            {/* Minutes */}
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 rounded-full mb-2"
                onClick={() => adjustTime('minutes', true)}
                disabled={isRunning}
              >
                <Plus className="w-3 h-3" />
              </Button>
              <div className="text-2xl font-mono font-bold w-12">
                {minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground mb-2">mins</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 rounded-full"
                onClick={() => adjustTime('minutes', false)}
                disabled={isRunning}
              >
                <Minus className="w-3 h-3" />
              </Button>
            </div>

            <div className="text-2xl font-bold text-muted-foreground">:</div>

            {/* Seconds */}
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 rounded-full mb-2"
                onClick={() => adjustTime('seconds', true)}
                disabled={isRunning}
              >
                <Plus className="w-3 h-3" />
              </Button>
              <div className="text-2xl font-mono font-bold w-12">
                {seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground mb-2">secs</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 rounded-full"
                onClick={() => adjustTime('seconds', false)}
                disabled={isRunning}
              >
                <Minus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="rounded-full w-14 h-14 p-0"
          variant={isRunning ? "secondary" : "default"}
          disabled={totalTime === 0 && timeLeft === 0}
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>

        <Button
          onClick={resetTimer}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {isFinished && (
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 font-semibold">⏰ Time's up!</div>
          {label && <div className="text-red-500 text-sm">{label}</div>}
        </div>
      )}
    </div>
  );
};