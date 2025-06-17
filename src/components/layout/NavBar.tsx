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
  Users
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
    await signOut();
    navigate('/');
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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getUserDisplayName()}</p>
                      {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Log in
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {getUserDisplayName().charAt(0).toUpperCase()}
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
                    <Button>Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}