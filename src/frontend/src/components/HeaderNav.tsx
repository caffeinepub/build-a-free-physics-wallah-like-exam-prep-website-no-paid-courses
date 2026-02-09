import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Search, Menu, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function HeaderNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery } });
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    return routerState.location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/generated/logo-wordmark.dim_1200x300.png" 
              alt="Exam Prep" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/courses') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              All Courses
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses, chapters, lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm"
                />
              </div>
            </form>
            <nav className="flex flex-col space-y-2 px-2">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/courses" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/courses') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                All Courses
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
