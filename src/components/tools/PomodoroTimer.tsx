import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (!isBreak) {
        setSessions(prev => prev + 1);
        setIsBreak(true);
        setTimeLeft(breakTime * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(workTime * 60);
      }
      
      // Track completion in analytics
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'pomodoro_complete', {
          session_type: isBreak ? 'break' : 'work',
          event_category: 'productivity'
        });
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isBreak, workTime, breakTime]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    
    if (!isRunning && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'pomodoro_start', {
        session_type: isBreak ? 'break' : 'work',
        event_category: 'productivity'
      });
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workTime * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100
    : ((workTime * 60 - timeLeft) / (workTime * 60)) * 100;

  return (
    <div className="text-center space-y-6">
      {/* Session Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {isBreak ? 'Break Time' : 'Work Time'}
        </h3>
        <p className="text-sm text-muted-foreground">
          Session {sessions + 1} • {sessions} completed
        </p>
      </div>

      {/* Circular Progress */}
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-secondary"
          />
          {/* Progress circle */}
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
        
        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isBreak ? 'Break' : 'Focus'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={toggleTimer}
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

        <Button
          onClick={resetTimer}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => {
            // Settings modal would open here
            console.log('Settings clicked');
          }}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Settings */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="text-center">
          <div className="text-muted-foreground">Work</div>
          <div className="font-medium">{workTime}m</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">Break</div>
          <div className="font-medium">{breakTime}m</div>
        </div>
      </div>
    </div>
  );
};