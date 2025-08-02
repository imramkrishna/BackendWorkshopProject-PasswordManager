import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, User, LogOut, Home, Layout, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-black/30 backdrop-blur-xl border-white/10 shadow-lg">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 text-white transition-all duration-300 hover:text-blue-300 group"
              onClick={closeMobileMenu}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SecureVault
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden space-x-1 md:flex">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/dashboard')
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'
                      }`}
                  >
                    <Layout className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/profile')
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'
                      }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 space-x-2 font-medium transition-all duration-300 rounded-xl text-white/80 hover:text-red-300 hover:bg-red-500/10 hover:shadow-md group"
                  >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/')
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md'
                      }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 font-medium transition-all duration-300 rounded-xl text-white/80 hover:text-white hover:bg-white/10 hover:shadow-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105 transform"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="relative p-2 text-white transition-all duration-300 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 relative">
                  <Menu
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                      }`}
                  />
                  <X
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
          } overflow-hidden bg-black/40 backdrop-blur-xl border-t border-white/10`}>
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Welcome back!</p>
                    <p className="text-white/60 text-sm">{user.name}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive('/dashboard')
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Layout className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive('/profile')
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 space-x-3 font-medium transition-all duration-300 rounded-xl text-white/80 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive('/')
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-4 py-3 space-x-3 font-medium transition-all duration-300 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-5 h-5 rotate-180" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full px-4 py-3 mt-2 font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;