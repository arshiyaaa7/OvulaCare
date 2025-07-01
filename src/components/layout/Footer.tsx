import { Heart, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Link to="/" className="inline-flex items-center space-x-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-lavender-500 shadow-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {APP_NAME} <span className="text-pink-300">❤️</span>
                </span>
              </Link>
              
              <p className="text-gray-200 leading-relaxed text-base max-w-md mx-auto lg:mx-0 mb-6">
                Empowering women with PCOS through AI-powered support, personalized insights, 
                and a compassionate community. Your healing journey starts here. 💕
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-sm">
                <div className="flex items-center text-gray-200">
                  <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                  <span className="font-medium">10,000+ women supported</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <Heart className="h-4 w-4 text-pink-400 mr-2" />
                  <span className="font-medium">HIPAA compliant</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center lg:text-left"
            >
              <h3 className="font-semibold text-lg text-white mb-4">Features</h3>
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/symptom-checker" 
                  className="text-gray-200 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center lg:justify-start group text-sm"
                >
                  <span className="text-base mr-2">🩺</span>
                  <span>Symptom Checker</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden" />
                </Link>
                <Link 
                  to="/journal" 
                  className="text-gray-200 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center lg:justify-start group text-sm"
                >
                  <span className="text-base mr-2">💖</span>
                  <span>AI Journaling</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden" />
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-200 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center lg:justify-start group text-sm"
                >
                  <span className="text-base mr-2">🧘‍♀️</span>
                  <span>PCOS Type Guide</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden" />
                </Link>
                <Link 
                  to="/cycle-tracker" 
                  className="text-gray-200 hover:text-pink-300 transition-colors duration-200 flex items-center justify-center lg:justify-start group text-sm"
                >
                  <span className="text-base mr-2">📅</span>
                  <span>Period Tracker</span>
                  <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden" />
                </Link>
              </nav>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h3 className="font-semibold text-lg text-white mb-4">Support</h3>
              <nav className="flex flex-col space-y-3">
                <Link to="/privacy" className="text-gray-200 hover:text-pink-300 transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-200 hover:text-pink-300 transition-colors duration-200 text-sm">
                  Terms of Service
                </Link>
                <Link to="/about" className="text-gray-200 hover:text-pink-300 transition-colors duration-200 text-sm">
                  About Us
                </Link>
                <Link to="/contact" className="text-gray-200 hover:text-pink-300 transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </nav>
            </motion.div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center lg:text-left"
            >
              <h3 className="font-semibold text-lg text-white mb-4 flex items-center justify-center lg:justify-start">
                <Mail className="h-5 w-5 mr-2 text-pink-400" />
                Join the Movement
              </h3>
              <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                Get weekly tips, success stories, and early access to new features. 
                Join our community of strong women! 🌸
              </p>
              
              <form className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-pink-400 focus:ring-pink-400/20 text-sm h-11"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-11"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              
              <p className="text-gray-300 text-xs mt-3">
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
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center lg:items-start space-y-3">
              <p className="text-center lg:text-left text-gray-300 text-sm">
                &copy; {currentYear} <span className="font-bold text-white">{APP_NAME} <span className="text-pink-300">❤️</span></span>. Made with 💕 for women everywhere.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400">
                <span className="flex items-center">
                  <span className="mr-1">🔒</span>
                  HIPAA Compliant
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center">
                  <span className="mr-1">🌍</span>
                  Global Community
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center">
                  <span className="mr-1">💝</span>
                  Always Free to Start
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-gray-400">
              <span>Powered by</span>
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-medium text-gray-200 hover:text-pink-300 transition-colors ml-1"
              >
                <span className="mx-1">⚡ Bolt.new</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}