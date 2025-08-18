import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
      
      // Track newsletter signup in analytics
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'newsletter_signup', {
          email_provided: true,
          event_category: 'engagement'
        });
      }
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-6 rounded-xl max-w-md mx-auto mt-8 text-center animate-fade-in">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
        <p className="text-muted-foreground text-sm">
          You've successfully subscribed to our newsletter. Get ready for the latest tech insights!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl max-w-md mx-auto mt-8 animate-fade-in">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Get Latest Tech Updates</h3>
        <p className="text-muted-foreground text-sm">
          Subscribe to our newsletter for the latest reviews, tutorials, and tech insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !email}
          className="w-full btn-hero"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-3">
        No spam, unsubscribe at any time. Privacy policy applies.
      </p>
    </div>
  );
};