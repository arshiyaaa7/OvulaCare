import React from 'react';
import { Heart, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white footer-wellness">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container relative z-10 py-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="flex items-center justify-center space-x-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-lavender-500 shadow-lg">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="footer-brand">
                  OvulaCare <span className="heart">❤️</span>
                </span>
              </Link>
              
              <p className="text-center text-gray-300 leading-relaxed max-w-md mx-auto">
                Empowering women with PCOS through AI-powered support, personalized insights, 
                and a compassionate community. Your healing journey starts here. 💕
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1"></div>
                  <span>10,000+ women supported</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-3 w-3 text-pink-400 mr-1" />
                  <span>HIPAA compliant</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-semibold mb-2 text-center">Features</h3>
              <nav className="flex flex-col space-y-1">
                <Link 
                  to="/symptom-checker" 
                  className="text-gray-300 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span>🩺</span>
                  <span className="ml-1">Symptom Checker</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link 
                  to="/journal" 
                  className="text-gray-300 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span>💖</span>
                  <span className="ml-1">AI Journaling</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span>🧘‍♀️</span>
                  <span className="ml-1">PCOS Type Guide</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link 
                  to="/cycle-tracker" 
                  className="text-gray-300 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center group"
                >
                  <span>📅</span>
                  <span className="ml-1">Period Tracker</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </nav>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-semibold mb-2 text-center">Support</h3>
              <nav className="flex flex-col space-y-1">
                <Link to="/privacy" className="text-gray-300 hover:text-pink-300 transition-colors duration-200 text-center">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-300 hover:text-pink-300 transition-colors duration-200 text-center">
                  Terms of Service
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-pink-300 transition-colors duration-200 text-center">
                  About Us
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-pink-300 transition-colors duration-200 text-center">
                  Contact
                </Link>
              </nav>
            </motion.div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-semibold mb-2 flex items-center justify-center">
                <Mail className="h-4 w-4 mr-1 text-pink-400" />
                Join the Movement
              </h3>
              <p className="text-gray-300 mb-2 text-center leading-relaxed">
                Get weekly tips, success stories, and early access to new features. 
                Join our community of strong women! 🌸
              </p>
              
              <form className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20 text-xs"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: '#f9c2c2 !important',
                    color: '#4a4a4a !important',
                    borderRadius: '12px !important',
                    fontWeight: 'bold !important',
                    padding: '8px 16px !important'
                  }}
                >
                  Subscribe
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </form>
              
              <p className="text-gray-400 mt-1 text-center">
                No spam, ever. Unsubscribe anytime. 💕
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 md:flex-row"
        >
          <div className="flex flex-col items-center space-y-1 md:flex-row md:space-y-0 md:space-x-3">
            <p className="text-center text-gray-400">
              &copy; {currentYear} <span className="footer-brand">OvulaCare <span className="heart">❤️</span></span>. Made with 💕 for women everywhere.
            </p>
            <div className="flex items-center space-x-2 text-gray-500">
              <span>🔒 HIPAA Compliant</span>
              <span>•</span>
              <span>🌍 Global Community</span>
              <span>•</span>
              <span>💝 Always Free to Start</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400">
            <span>Powered by</span>
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center font-medium text-white hover:text-pink-300 transition-colors"
            >
              <span className="mx-1">⚡ Bolt.new</span>
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}