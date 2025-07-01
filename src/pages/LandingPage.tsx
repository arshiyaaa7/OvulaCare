import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BoltBadge, BuiltWithBoltButton } from '@/components/ui/bolt-elements';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowRight, 
  ActivitySquare, 
  BookHeart, 
  Calendar, 
  Compass,
  Star,
  Sparkles,
  MessageCircle,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, FEATURES, TESTIMONIALS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="relative"
  >
    {children}
  </motion.div>
);

const SparkleAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [0, 1, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="h-4 w-4 text-pink-300" />
      </motion.div>
    ))}
  </div>
);

const InteractiveFeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const Icon = 
    feature.icon === 'ActivitySquare' ? ActivitySquare : 
    feature.icon === 'BookHeart' ? BookHeart : 
    feature.icon === 'Compass' ? Compass : Calendar;

  const emojis = ['🩺', '💖', '🧘‍♀️', '📅'];
  const gradients = [
    'from-pink-100 to-rose-100',
    'from-lavender-100 to-purple-100', 
    'from-teal-100 to-cyan-100',
    'from-pink-100 to-lavender-100'
  ];

  const links = ['/symptom-checker', '/journal', '/dashboard', '/cycle-tracker'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: "0 25px 50px rgba(236, 72, 153, 0.15)",
        transition: { duration: 0.3 }
      }}
      className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg border border-white/30 hover:border-pink-200/60 transition-all duration-300 cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-lavender-100 shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <Icon className="h-6 w-6 text-pink-600 group-hover:text-pink-700 transition-colors duration-300" />
          </div>
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{emojis[index]}</span>
        </div>
        
        <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-gray-800">{feature.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
        
        <Link to={links[index]}>
          <motion.div 
            className="flex items-center text-pink-600 font-medium group-hover:text-pink-700 text-sm"
            whileHover={{ x: 3 }}
          >
            <span>→ Explore</span>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial, isActive }: { testimonial: typeof TESTIMONIALS[0]; isActive: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        scale: isActive ? 1 : 0.95,
        filter: isActive ? "blur(0px)" : "blur(1px)"
      }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-xl border transition-all duration-500",
        isActive ? "border-pink-200 shadow-2xl" : "border-white/20"
      )}
    >
      <div className="mb-6 flex text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
      </div>
      
      <blockquote className="mb-6 text-lg font-medium text-gray-800 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>
      
      <div className="flex items-center space-x-4">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="h-14 w-14 rounded-full object-cover ring-4 ring-pink-100"
        />
        <div>
          <p className="font-bold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">PCOS Warrior</p>
        </div>
      </div>
    </motion.div>
  );
};

const AIPreviewCard = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-pink-50/90 backdrop-blur-sm p-8 shadow-2xl border border-white/30"
  >
    <div className="absolute top-4 right-4">
      <div className="flex space-x-2">
        <div className="h-3 w-3 rounded-full bg-red-400"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
        <div className="h-3 w-3 rounded-full bg-green-400"></div>
      </div>
    </div>
    
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-lavender-400 flex items-center justify-center">
          <Heart className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">LIA - Your AI Companion</p>
          <div className="flex items-center text-sm text-green-600">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            Online
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-pink-100 to-lavender-100 rounded-2xl p-4 max-w-xs">
          <p className="text-sm text-gray-800">
            Hi there! 💕 I'm here to support you on your PCOS journey. How are you feeling today?
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 max-w-xs ml-auto shadow-sm">
          <p className="text-sm text-gray-800">
            I've been feeling overwhelmed lately with my symptoms...
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-pink-100 to-lavender-100 rounded-2xl p-4 max-w-xs">
          <p className="text-sm text-gray-800">
            I understand. Let's work through this together. Would you like to start with some journaling or check your symptoms? 🌸
          </p>
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-pink-100">
      <div className="flex space-x-2">
        <Button size="sm" variant="ghost" className="text-pink-600">
          <MessageCircle className="h-4 w-4 mr-1" />
          Chat
        </Button>
      </div>
      <span className="text-xs text-gray-500">Powered by AI</span>
    </div>
  </motion.div>
);

export function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-lavender-50 to-teal-50 py-20 md:py-32">
        <SparkleAnimation />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <FloatingElement>
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-100 to-lavender-100 px-6 py-2 text-sm font-medium text-pink-800 shadow-lg">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Supporting 10,000+ women with PCOS</span>
                </div>
              </FloatingElement>
              
              <FloatingElement delay={0.2}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                  {APP_NAME}
                  <span className="block text-2xl sm:text-3xl md:text-4xl font-medium bg-gradient-to-r from-pink-600 via-lavender-600 to-teal-600 bg-clip-text text-transparent mt-4">
                    {APP_TAGLINE}
                  </span>
                </h1>
              </FloatingElement>
              
              <FloatingElement delay={0.4}>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-lg">
                  Transform your PCOS journey with AI-powered support, personalized insights, 
                  and a community that truly understands. You're not alone in this. 💕
                </p>
              </FloatingElement>
              
              <FloatingElement delay={0.6}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600 text-white font-semibold px-6 sm:px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <span className="text-center">Feeling overwhelmed? Let's talk 💬</span>
                        <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                      </Button>
                    </motion.div>
                  </Link>
                  
                  <Link to="/about">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full sm:w-auto border-2 border-pink-300 text-pink-700 hover:bg-pink-50 font-semibold px-6 sm:px-8 py-4 rounded-2xl"
                      >
                        Learn More
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </FloatingElement>
              
              <FloatingElement delay={0.8}>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-2" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span>10k+ Community</span>
                  </div>
                </div>
              </FloatingElement>
            </div>
            
            <div className="relative">
              <FloatingElement delay={0.4}>
                <div className="relative">
                  <img 
                    src="https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Diverse women supporting each other"
                    className="rounded-3xl shadow-2xl w-full h-[400px] sm:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent rounded-3xl"></div>
                  
                  {/* Floating AI Preview */}
                  <div className="absolute -bottom-6 -left-6 w-72 sm:w-80 hidden lg:block">
                    <AIPreviewCard />
                  </div>
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-pink-200 opacity-20 blur-3xl"></div>
        <div className="absolute -right-24 top-1/2 h-96 w-96 rounded-full bg-teal-200 opacity-20 blur-3xl"></div>
      </section>

      {/* Built with Bolt Button - Below navigation */}
      <section className="py-4 bg-white border-b">
        <div className="container flex justify-center">
          <BuiltWithBoltButton />
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Explore Our AI-Powered Tools
              </h2>
              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 leading-relaxed">
                Supporting your mental, physical & emotional wellbeing.
              </p>
            </motion.div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {FEATURES.map((feature, index) => (
              <InteractiveFeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-lavender-500 hover:from-pink-600 hover:to-lavender-600 text-white font-semibold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-pink-100 opacity-30 blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-lavender-100 opacity-30 blur-2xl"></div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-24 bg-gradient-to-br from-pink-50 via-lavender-50 to-teal-50 relative overflow-hidden">
        <SparkleAnimation />
        
        <div className="container relative z-10">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Stories of Hope & Healing
              </h2>
              <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-600 leading-relaxed">
                Real women, real stories, real transformation. Join thousands who have found 
                support, understanding, and healing through OvulaCare AI.
              </p>
            </motion.div>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <TestimonialCard 
                  key={testimonial.name} 
                  testimonial={testimonial} 
                  isActive={index === currentTestimonial}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="rounded-full p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex space-x-2 items-center">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300",
                      index === currentTestimonial 
                        ? "bg-pink-500 w-8" 
                        : "bg-pink-200 hover:bg-pink-300"
                    )}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="rounded-full p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-lavender-500 to-teal-500 p-8 sm:p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <SparkleAnimation />
            
            <div className="relative z-10 mx-auto max-w-4xl text-white">
              <h2 className="mb-6 text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
                Join the Movement
              </h2>
              <p className="mb-8 text-lg sm:text-xl md:text-2xl opacity-90 leading-relaxed">
                Begin your healing journey today. Join thousands of women who have found 
                support, understanding, and personalized guidance through OvulaCare AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-white text-pink-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-2xl shadow-xl"
                    >
                      Start Your Journey 🌸
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                
                <Link to="/community">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl"
                    >
                      Join Community
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm opacity-80">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Privacy first</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Supportive community</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}