import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, Heart, Bot } from 'lucide-react';
import { sendAIMessage } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  suggestions?: string[];
}

export function AIChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi there! I'm Lia, your AI companion. I'm here to support you on your PCOS journey. How are you feeling today? 💕",
      timestamp: new Date(),
      suggestions: ["I'm feeling good", "I'm struggling today", "Tell me about PCOS", "Help me track symptoms"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendAIMessage(content, {
        userId: user.id,
        recentMessages: messages.slice(-5) // Send last 5 messages for context
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
        sentiment: response.sentiment,
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI Chat error:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember that you're doing great! 💕",
        timestamp: new Date(),
        suggestions: ["Try again", "Visit dashboard", "Check symptoms", "Write in journal"]
      };

      setMessages(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "Connection issue",
        description: "Unable to connect to AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-lavender-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <Heart className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center">
              <span>Lia - Your AI Companion</span>
              <div className="ml-2 h-2 w-2 rounded-full bg-green-400"></div>
            </div>
            <div className="text-sm opacity-90">Always here to support you</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center mb-1">
                      <Bot className="h-4 w-4 text-pink-500 mr-1" />
                      <span className="text-xs text-gray-500">Lia</span>
                      {message.sentiment && (
                        <Badge className={`ml-2 text-xs ${getSentimentColor(message.sentiment)}`}>
                          {message.sentiment}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-pink-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {message.type === 'ai' && message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={isLoading}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm">Lia is typing...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Lia is here to provide support and information. For medical advice, please consult your healthcare provider.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}