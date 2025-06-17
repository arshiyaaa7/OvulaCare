import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader } from './card';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Input } from './input';

export function AssistantAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showInitialMessage, setShowInitialMessage] = useState(false);

  useEffect(() => {
    // Show initial message after 3 seconds
    const timer = setTimeout(() => {
      setShowInitialMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {showInitialMessage && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4"
          >
            <Card className="w-64 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm">Feeling overwhelmed? Let's talk 💬</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="mb-4"
        >
          <Card className="w-80 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="https://images.pexels.com/photos/7275385/pexels-photo-7275385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                  <AvatarFallback>LIA</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold">LIA</h4>
                  <p className="text-xs text-muted-foreground">Your AI Companion</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    Hi! I'm LIA, your personal PCOS support companion. How can I help you today?
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowInitialMessage(false);
          }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}