import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Loading from '../components/Loading';
import axios from 'axios';
import { API_URL } from '../config';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      navigate('/dashboard');
      login(response.data.user.email, response.data.user.password, response.data.user.name, response.data.user._id);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please try again.');
      return;

    }

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading text="Signing you in..." />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mb-2 text-4xl font-bold text-white">Welcome Back</h2>
          <p className="text-white/70">Sign in to access your secure vault</p>
        </div>

        <div className="p-8 border bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-center text-red-200 border rounded-lg bg-red-500/20 border-red-500/30">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white/80">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-white/40" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 pr-4 input-field"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-white/40" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-12 input-field"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute transition-colors transform -translate-y-1/2 right-3 top-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="text-blue-600 rounded border-white/20 bg-white/10 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-white/70">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-400 transition-colors hover:text-blue-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-400 transition-colors hover:text-blue-300">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;