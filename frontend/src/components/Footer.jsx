import React from 'react';
import { Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl text-white">SecureVault</span>
            </div>
            <p className="text-white/60 mb-4 max-w-md">
              Your trusted password manager that keeps your digital life secure and organized. 
              Built with privacy and security as our top priorities.
            </p>
            <div className="flex items-center text-white/60 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-400" />
              <span>for your security</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2 text-white/60">
              <li className="hover:text-white transition-colors cursor-pointer">Password Generator</li>
              <li className="hover:text-white transition-colors cursor-pointer">Secure Storage</li>
              <li className="hover:text-white transition-colors cursor-pointer">Auto-fill</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cross-platform Sync</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-white/60">
              <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 SecureVault. All rights reserved. Your security is our mission.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;