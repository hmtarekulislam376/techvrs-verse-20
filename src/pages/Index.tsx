import { useState, useEffect } from 'react';
import { Clock } from '@/components/Clock';
import { ProductivityTools } from '@/components/ProductivityTools';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Navigation } from '@/components/Navigation';
import { Newsletter } from '@/components/Newsletter';
import bgMinimalist1 from '@/assets/bg-minimalist-1.jpg';
import bgTech1 from '@/assets/bg-tech-1.jpg';
import bgAnime1 from '@/assets/bg-anime-1.jpg';

// Background image arrays for rotation
const backgroundImages = {
  minimalist: [bgMinimalist1],
  tech: [bgTech1], 
  anime: [bgAnime1]
};

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState<'minimalist' | 'tech' | 'anime'>('minimalist');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background rotation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => 
        (prev + 1) % backgroundImages[currentTheme].length
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [currentTheme]);

  // Theme change handler
  const handleThemeChange = (theme: 'minimalist' | 'tech' | 'anime') => {
    setCurrentTheme(theme);
    setCurrentBgIndex(0);
    
    // Apply theme class to body
    document.body.className = `theme-${theme}`;
    
    // Track theme change in analytics
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'theme_change', {
        theme_name: theme,
        event_category: 'engagement'
      });
    }
  };

  useEffect(() => {
    // Set initial theme class
    document.body.className = `theme-${currentTheme}`;
  }, []);

  return (
    <div 
      className="min-h-screen transition-all duration-1000 relative"
      style={{
        backgroundImage: `url(${backgroundImages[currentTheme][currentBgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px]" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Auto-hide Theme Switcher */}
      <ThemeSwitcher 
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      
      {/* Auto-hide Music Player */}
      <MusicPlayer />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          
          {/* Live Clock */}
          <Clock />
          
          {/* Single Productivity Tools Container */}
          <ProductivityTools />
          
          {/* Newsletter Signup */}
          <Newsletter />
          
        </div>
      </main>

      {/* SEO Content Section */}
      <section className="relative z-10 bg-background/95 backdrop-blur-md py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Latest Tech Reviews & Insights
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Latest Reviews</h3>
              <p className="text-muted-foreground">
                In-depth analysis of the latest tech products, gadgets, and software solutions.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Tutorials</h3>
              <p className="text-muted-foreground">
                Step-by-step guides to help you master technology and boost productivity.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Industry News</h3>
              <p className="text-muted-foreground">
                Stay updated with the latest trends and developments in the tech world.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-8">Explore Our Content</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://blog.techvrs.com" 
                className="btn-hero"
                onClick={() => {
                  if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
                    (window as any).gtag('event', 'navigation_click', {
                      destination: 'blog',
                      event_category: 'navigation'
                    });
                  }
                }}
              >
                Visit Blog
              </a>
              <a 
                href="https://blog.techvrs.com/cybersecurity" 
                className="btn-glass"
                onClick={() => {
                  if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
                    (window as any).gtag('event', 'navigation_click', {
                      destination: 'cybersecurity',
                      event_category: 'navigation'
                    });
                  }
                }}
              >
                Cybersecurity
              </a>
              <a 
                href="https://blog.techvrs.com/about" 
                className="btn-glass"
                onClick={() => {
                  if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
                    (window as any).gtag('event', 'navigation_click', {
                      destination: 'about',
                      event_category: 'navigation'
                    });
                  }
                }}
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-background/90 backdrop-blur-md py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 TechVRS.com - Tech Verse: Reviews, Solutions & Insights
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="https://blog.techvrs.com/about" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;