import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePasswords } from '../contexts/PasswordContext';
import { User, Mail, Calendar, Shield, Eye, EyeOff, Globe, Smartphone, CreditCard, Lock, Download } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { passwords } = usePasswords();
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());

  const togglePasswordVisibility = (id) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      website: Globe,
      email: Mail,
      social: Smartphone,
      finance: CreditCard,
      other: Lock
    };
    return icons[category] || Globe;
  };

  const getCategoryStats = () => {
    const stats = {};
    passwords.forEach(pwd => {
      stats[pwd.category] = (stats[pwd.category] || 0) + 1;
    });
    return stats;
  };

  const exportPasswords = () => {
    const dataStr = JSON.stringify(passwords, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `securevault-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
              <div className="flex items-center space-x-4 text-white/60">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span>Security Overview</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Passwords</span>
                  <span className="text-2xl font-bold text-blue-400">{passwords.length}</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-white/80 font-medium">By Category</h3>
                  {Object.entries(categoryStats).map(([category, count]) => {
                    const IconComponent = getCategoryIcon(category);
                    return (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-white/60" />
                          <span className="text-white/70 capitalize">{category}</span>
                        </div>
                        <span className="text-white/80">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={exportPasswords}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-3 rounded-lg transition-all flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Passwords</span>
                </button>
                <button className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-4 py-3 rounded-lg transition-all">
                  Change Master Password
                </button>
                <button className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-500/30 px-4 py-3 rounded-lg transition-all">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Passwords List */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">All Passwords</h2>
              
              {passwords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-white/40 text-6xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No passwords yet</h3>
                  <p className="text-white/60">Add your first password to get started</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {passwords.map((password) => {
                    const CategoryIcon = getCategoryIcon(password.category);
                    return (
                      <div
                        key={password.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <CategoryIcon className="h-6 w-6 text-blue-400" />
                            <div>
                              <h3 className="font-semibold text-white">{password.title}</h3>
                              {password.website && (
                                <p className="text-white/60 text-sm">{password.website}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-white/40 capitalize bg-white/10 px-2 py-1 rounded">
                            {password.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {password.email && (
                            <div>
                              <label className="text-white/60 text-xs uppercase tracking-wide">Email</label>
                              <p className="text-white">{password.email}</p>
                            </div>
                          )}
                          
                          {password.username && (
                            <div>
                              <label className="text-white/60 text-xs uppercase tracking-wide">Username</label>
                              <p className="text-white">{password.username}</p>
                            </div>
                          )}

                          <div>
                            <label className="text-white/60 text-xs uppercase tracking-wide">Password</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-white font-mono text-sm flex-1">
                                {visiblePasswords.has(password.id) ? password.password : '••••••••••••'}
                              </p>
                              <button
                                onClick={() => togglePasswordVisibility(password.id)}
                                className="text-white/60 hover:text-white transition-colors"
                              >
                                {visiblePasswords.has(password.id) ? 
                                  <EyeOff className="h-4 w-4" /> : 
                                  <Eye className="h-4 w-4" />
                                }
                              </button>
                            </div>
                          </div>

                          {password.notes && (
                            <div className="md:col-span-2">
                              <label className="text-white/60 text-xs uppercase tracking-wide">Notes</label>
                              <p className="text-white/80 text-sm">{password.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/40">
                          <span>Added {new Date(password.createdAt).toLocaleDateString()}</span>
                          {password.updatedAt !== password.createdAt && (
                            <span>Updated {new Date(password.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;