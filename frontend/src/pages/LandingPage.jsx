import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Smartphone, Cloud, Zap, CheckCircle, Star } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Lock,
      title: 'Bank-Level Security',
      description: 'Your passwords are protected with AES-256 encryption, the same standard used by banks and governments.'
    },
    {
      icon: Cloud,
      title: 'Seamless Sync',
      description: 'Access your passwords across all devices with real-time synchronization and offline access.'
    },
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'Zero-knowledge architecture means we never see your passwords. Only you have access to your data.'
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Works everywhere - desktop, mobile, tablets. One secure vault for all your devices.'
    },
    {
      icon: Zap,
      title: 'Auto-Fill & Generate',
      description: 'Automatically fill forms and generate strong, unique passwords for every account.'
    },
    {
      icon: Shield,
      title: 'Breach Monitoring',
      description: 'Get alerts if your accounts are compromised in data breaches and take action immediately.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'SecureVault has completely transformed how I manage my digital security. The interface is intuitive and I feel completely safe.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      content: 'Finally, a password manager that doesn\'t compromise on security or usability. Highly recommended for teams.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Designer',
      content: 'The design is beautiful and the functionality is exactly what I needed. Worth every penny!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Shield className="h-20 w-20 text-blue-400 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Digital Life,
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Secured</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Store, generate, and manage all your passwords with military-grade security. 
              One vault. Infinite protection. Peace of mind.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/register" 
              className="btn-primary px-8 py-4 rounded-xl text-lg"
            >
              Start Free Today
            </Link>
            <Link 
              to="/login" 
              className="btn-secondary px-8 py-4 rounded-xl text-lg"
            >
              Sign In
            </Link>
          </div>

          <div className="text-white/60 text-sm">
            <p>✓ Free forever plan available  ✓ No credit card required  ✓ 30-day money-back guarantee</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose SecureVault?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Built by security experts, designed for everyone. Experience the perfect balance of security and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card p-8 hover:transform hover:scale-105"
              >
                <feature.icon className="h-12 w-12 text-blue-400 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-blue-400">10M+</div>
              <div className="text-white/70">Passwords Secured</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-purple-400">500K+</div>
              <div className="text-white/70">Happy Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-teal-400">99.9%</div>
              <div className="text-white/70">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-400">0</div>
              <div className="text-white/70">Security Breaches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-white/70">
              Join thousands of satisfied users who trust SecureVault with their digital security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Join millions of users who trust SecureVault to protect their most important accounts. 
            Start your free account today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="btn-primary px-8 py-4 rounded-xl text-lg"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="text-white/80 hover:text-white underline text-lg"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;