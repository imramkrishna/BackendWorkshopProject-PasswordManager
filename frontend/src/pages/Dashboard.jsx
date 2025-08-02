import React, { useState } from 'react';
import { usePasswords } from '../contexts/PasswordContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Globe, Mail, Smartphone, CreditCard, Lock } from 'lucide-react';
import { LoadingOverlay } from '../components/Loading';

const Dashboard = () => {
  const { passwords, addPassword, updatePassword, deletePassword, loading } = usePasswords();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());

  const [newPassword, setNewPassword] = useState({
    title: '',
    website: '',
    email: '',
    username: '',
    password: '',
    notes: '',
    category: 'website'
  });

  const categories = [
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'social', label: 'Social Media', icon: Smartphone },
    { value: 'finance', label: 'Finance', icon: CreditCard },
    { value: 'other', label: 'Other', icon: Lock }
  ];

  const filteredPasswords = passwords.filter(pwd =>
    pwd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (editingPassword) {
      setEditingPassword({ ...editingPassword, password });
    } else {
      setNewPassword({ ...newPassword, password });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingPassword) {
      const result = await updatePassword(editingPassword.id, editingPassword);
      if (result.success) {
        setEditingPassword(null);
      }
    } else {
      const result = await addPassword(newPassword);
      if (result.success) {
        setNewPassword({
          title: '',
          website: '',
          email: '',
          username: '',
          password: '',
          notes: '',
          category: 'website'
        });
        setShowAddModal(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      await deletePassword(id);
    }
  };

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
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : Globe;
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-white/70">
              You have {passwords.length} password{passwords.length !== 1 ? 's' : ''} in your vault
            </p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-4 backdrop-blur-lg"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-6 py-3 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Password</span>
            </button>
          </div>

          {/* Passwords Grid */}
          {filteredPasswords.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/40 text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No passwords found' : 'No passwords yet'}
              </h3>
              <p className="text-white/60 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first password to secure your accounts'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary px-6 py-3"
                >
                  Add Your First Password
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPasswords.map((password) => {
                const CategoryIcon = getCategoryIcon(password.category);
                return (
                  <div
                    key={password.id}
                    className="card p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CategoryIcon className="h-8 w-8 text-blue-400" />
                        <div>
                          <h3 className="font-semibold text-white text-lg">{password.title}</h3>
                          {password.website && (
                            <p className="text-white/60 text-sm">{password.website}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingPassword(password)}
                          className="text-white/60 hover:text-blue-400 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(password.id)}
                          className="text-white/60 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {password.email && (
                        <div>
                          <label className="text-white/60 text-xs uppercase tracking-wide">Email</label>
                          <p className="text-white text-sm">{password.email}</p>
                        </div>
                      )}
                      
                      {password.username && (
                        <div>
                          <label className="text-white/60 text-xs uppercase tracking-wide">Username</label>
                          <p className="text-white text-sm">{password.username}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-white/60 text-xs uppercase tracking-wide">Password</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-white text-sm font-mono flex-1">
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
                        <div>
                          <label className="text-white/60 text-xs uppercase tracking-wide">Notes</label>
                          <p className="text-white/80 text-sm">{password.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-white/40 text-xs">
                        Added {new Date(password.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add/Edit Modal */}
          {(showAddModal || editingPassword) && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingPassword ? 'Edit Password' : 'Add New Password'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={editingPassword ? editingPassword.title : newPassword.title}
                      onChange={(e) => {
                        if (editingPassword) {
                          setEditingPassword({ ...editingPassword, title: e.target.value });
                        } else {
                          setNewPassword({ ...newPassword, title: e.target.value });
                        }
                      }}
                      className="input-field"
                      placeholder="e.g., Gmail Account"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                    <select
                      value={editingPassword ? editingPassword.category : newPassword.category}
                      onChange={(e) => {
                        if (editingPassword) {
                          setEditingPassword({ ...editingPassword, category: e.target.value });
                        } else {
                          setNewPassword({ ...newPassword, category: e.target.value });
                        }
                      }}
                      className="input-field"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value} className="bg-gray-800">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Website (Optional)</label>
                    <input
                      type="url"
                      value={editingPassword ? editingPassword.website : newPassword.website}
                      onChange={(e) => {
                        if (editingPassword) {
                          setEditingPassword({ ...editingPassword, website: e.target.value });
                        } else {
                          setNewPassword({ ...newPassword, website: e.target.value });
                        }
                      }}
                      className="input-field"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      value={editingPassword ? editingPassword.email : newPassword.email}
                      onChange={(e) => {
                        if (editingPassword) {
                          setEditingPassword({ ...editingPassword, email: e.target.value });
                        } else {
                          setNewPassword({ ...newPassword, email: e.target.value });
                        }
                      }}
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Username (Optional)</label>
                    <input
                      type="text"
                      value={editingPassword ? editingPassword.username : newPassword.username}
                      onChange={(e) => {
                        if (editingPassword) {
                          setEditingPassword({ ...editingPassword, username: e.target.value });
                        } else {
                          setNewPassword({ ...newPassword, username: e.target.value });
                        }
                      }}
                      className="input-field"
                      placeholder="your_username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        required
                        value={editingPassword ? editingPassword.password : newPassword.password}
                        onChange={(e) => {
                          if (editingPassword) {
                            setEditingPassword({ ...editingPassword, password: e.target.value });
                          } else {
                            setNewPassword({ ...newPassword, password: e.target.value });
                          }
                        }}
                        className="input-field flex-1 font-mono"
                        placeholder="Enter or generate password"
                      />
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Notes (Optional)</label>
                    <textarea
                      value={editingPassword ? editingPassword.notes : newPassword.notes}
                      onChange={(e) => {
                        if (editingPassword) {
                          setEditingPassword({ ...editingPassword, notes: e.target.value });
                        } else {
                          setNewPassword({ ...newPassword, notes: e.target.value });
                        }
                      }}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      {editingPassword ? 'Update Password' : 'Add Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingPassword(null);
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-semibold transition-all border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default Dashboard;