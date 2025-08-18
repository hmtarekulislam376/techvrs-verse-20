import { useState } from 'react';
import { PomodoroTimer } from '@/components/tools/PomodoroTimer';
import { Stopwatch } from '@/components/tools/Stopwatch';
import { CountdownTimer } from '@/components/tools/CountdownTimer';
import { FocusMode } from '@/components/tools/FocusMode';
import { Timer, Clock, Hourglass, Focus } from 'lucide-react';

const tools = [
  { id: 'pomodoro', name: 'Pomodoro Timer', icon: Timer, component: PomodoroTimer },
  { id: 'stopwatch', name: 'Stopwatch', icon: Clock, component: Stopwatch },
  { id: 'countdown', name: 'Countdown Timer', icon: Hourglass, component: CountdownTimer },
  { id: 'focus', name: 'Focus Mode', icon: Focus, component: FocusMode },
];

export const ProductivityTools = () => {
  const [selectedTool, setSelectedTool] = useState('pomodoro');

  const handleToolChange = (toolId: string) => {
    setSelectedTool(toolId);
    
    // Track tool selection in analytics
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'productivity_tool_select', {
        tool_name: toolId,
        event_category: 'productivity'
      });
    }
  };

  const SelectedComponent = tools.find(tool => tool.id === selectedTool)?.component || PomodoroTimer;

  return (
    <div className="productivity-container animate-fade-in">
      {/* Tool Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 border-b border-border/50 pb-4">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolChange(tool.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTool === tool.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden sm:inline">{tool.name}</span>
              <span className="sm:hidden">{tool.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Tool Content */}
      <div className="tool-content">
        <SelectedComponent />
      </div>
    </div>
  );
};