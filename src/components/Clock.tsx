import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('Loading...');

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Get user's timezone/location
    const getLocation = async () => {
      try {
        // Try to get timezone from Intl API
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const parts = timezone.split('/');
        const city = parts[parts.length - 1].replace('_', ' ');
        const region = parts[0];
        
        setLocation(`${city}, ${region}`);
      } catch (error) {
        setLocation('Unknown Location');
      }
    };

    getLocation();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="clock-display animate-fade-in">
      <div className="clock-time animate-pulse-glow">
        {formatTime(time)}
      </div>
      <div className="clock-date">
        {formatDate(time)}
      </div>
      <div className="clock-location flex items-center justify-center gap-1">
        <MapPin className="w-3 h-3" />
        <span>Current time in {location}</span>
      </div>
    </div>
  );
};