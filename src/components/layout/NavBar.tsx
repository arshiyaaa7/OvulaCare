import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Calendar, 
  BookHeart, 
  Activity, 
  Users,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { APP_NAME } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <User className="mr-2 h-4 w-4" /> },
    { label: 'Symptom Checker', href: '/symptom-checker', icon: <Activity className="mr-2 h-4 w-4" /> },
    { label: 'Journal', href: '/journal', icon: <BookHeart className="mr-2 h-4 w-4" /> },
    { label: 'Cycle Tracker', href: '/cycle-tracker', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { label: 'Community', href: '/community', icon: <Users className="mr-2 h-4 w-4" /> },
  ];

  const getUserDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <nav className="flex justify-between items-center h-16">
          {/* Left side - Logo + Navigation (when logged in) */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
            </Link>

            {/* Desktop Navigation - Only show when logged in */}
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Auth buttons (when not logged in) or User profile (when logged in) + Bolt badge */}
          <div className="flex items-center space-x-4">
            {user ? (
              // When logged in: Show user profile dropdown
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 group"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-lavender-500 text-white font-medium text-sm ring-2 ring-pink-200 transition-all duration-200 group-hover:ring-pink-300">
                        {getUserInitials()}
                      </div>
                      <ChevronDown className="absolute -bottom-1 -right-1 h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-lavender-500 text-white font-medium text-sm">
                        {getUserInitials()}
                      </div>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{getUserDisplayName()}</p>
                        {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // When not logged in: Show auth buttons
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Log in
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Bolt.new Badge - Always in the right corner */}
            <div className="hidden md:flex flex-shrink-0">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14"
                title="Powered by Bolt.new"
              >
                <img
                  src="/bolt-logo.png"
                  alt="Powered by Bolt.new"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 py-4">
                  <Link 
                    to="/" 
                    className="flex items-center space-x-2"
                    onClick={() => setOpen(false)}
                  >
                    <Heart className="h-6 w-6 text-pink-500" />
                    <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
                  </Link>
                  
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 pb-4 border-b">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-lavender-500 text-white font-medium text-sm">
                          {getUserInitials()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{getUserDisplayName()}</span>
                          {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
                        </div>
                      </div>
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center py-2 text-sm font-medium transition-colors hover:text-primary"
                          onClick={() => setOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start text-red-500"
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="py-2 text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link 
                        to="/signup"
                        onClick={() => setOpen(false)}
                      >
                        <Button className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600">
                          Sign up
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  {/* Bolt Badge for mobile */}
                  <div className="pt-4 border-t flex justify-center">
                    <a
                      href="https://bolt.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12"
                      title="Powered by Bolt.new"
                    >
                      <img
                        src="/bolt-logo.png"
                        alt="Powered by Bolt.new"
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                      />
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}