import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChat } from '@/components/AIChat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AssistantAvatar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed positioning chat button with proper margins */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
        style={{ 
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600 text-white font-semibold py-3 px-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
          size="lg"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Feeling overwhelmed? Let's talk</span>
        </Button>
      </motion.div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pink-500" />
              Chat with Lia - Your AI Companion
            </DialogTitle>
            <DialogDescription>
              Share your thoughts and feelings. Lia is here to support you on your PCOS journey.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <AIChat />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}