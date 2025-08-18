import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import techvrsLogo from '@/assets/techvrs-logo.png';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: 'https://blog.techvrs.com', label: 'Blog' },
    { href: 'https://blog.techvrs.com/about', label: 'About' },
    { href: 'https://blog.techvrs.com/cybersecurity', label: 'Cybersecurity' },
    { href: 'https://blog.techvrs.com/update', label: 'Updates' },
  ];

  return (
    <nav className="relative z-50 glass-card mx-4 mt-4 rounded-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="https://techvrs.com"
            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
          >
            <img 
              src={techvrsLogo} 
              alt="TechVRS - Tech Reviews and Solutions" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">TechVRS</h1>
              <p className="text-xs text-muted-foreground">Tech Verse</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};