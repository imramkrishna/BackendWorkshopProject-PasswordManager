import React, { useState, useEffect } from 'react';
import { usePasswords } from '../contexts/PasswordContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Globe, Mail, Smartphone, CreditCard, Lock } from 'lucide-react';
import { LoadingOverlay } from '../components/Loading';
import axios from 'axios';
import { API_URL } from '../config';

const Dashboard = () => {
  const { passwords, addPassword, updatePassword, deletePassword, setPasswordsFromAPI, loading } = usePasswords();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());

  const [newPassword, setNewPassword] = useState({
    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null,
    title: '',
    website: '',
    email: '',
    username: '',
    password: '',
    notes: '',
    category: 'website'
  });

  useEffect(() => {
    const fetchPasswords = async () => {
      if (!user?.id && !user?._id) {

        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {

          return;
        }
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });


        if (response.data.passwords && Array.isArray(response.data.passwords)) {
          setPasswordsFromAPI(response.data.passwords);
        } else {
          return;
        }

      } catch (error) {
        console.error('Error fetching passwords:', error);
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        }
      }
    };

    fetchPasswords();
  }, [user]);

  const categories = [
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'social', label: 'Social Media', icon: Smartphone },
    { value: 'finance', label: 'Finance', icon: CreditCard },
    { value: 'other', label: 'Other', icon: Lock }
  ];

  const filteredPasswords = passwords.filter(pwd =>
    pwd.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.username?.toLowerCase().includes(searchTerm.toLowerCase())
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
      try {
        const response = await axios.post(`${API_URL}/addPassword`, newPassword, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 200 || response.status === 201) {
          setNewPassword({
            userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null,
            title: '',
            website: '',
            email: '',
            username: '',
            password: '',
            notes: '',
            category: 'website'
          });
          setShowAddModal(false);
          window.location.reload();
        }
      } catch (error) {
        console.error('Error adding password:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      await deletePassword(id);
    }
  };

  // Fix: Improved toggle function with better ID handling
  const togglePasswordVisibility = (passwordId) => {

    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(passwordId)) {
      newVisible.delete(passwordId);
    } else {
      newVisible.add(passwordId);
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
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-white/70">
              You have {passwords.length} password{passwords.length !== 1 ? 's' : ''} in your vault
            </p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col gap-4 mb-8 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 input-field backdrop-blur-lg"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-6 py-3 space-x-2 btn-primary"
            >
              <Plus className="w-5 h-5" />
              <span>Add Password</span>
            </button>
          </div>

          {/* Password Grid */}
          {filteredPasswords.length === 0 ? (
            <div className="py-12 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <h3 className="mb-2 text-xl font-semibold text-white">No passwords found</h3>
              <p className="text-white/60">
                {searchTerm ? 'Try adjusting your search terms.' : 'Add your first password to get started.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPasswords.map((pwd) => {
                const IconComponent = getCategoryIcon(pwd.category);
                const passwordId = pwd.id || pwd._id; // Handle both id formats
                const isVisible = visiblePasswords.has(passwordId);


                return (
                  <div key={passwordId} className="p-6 card group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                          <IconComponent className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{pwd.title}</h3>
                          <p className="text-sm text-white/60">{pwd.website}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 transition-opacity opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => setEditingPassword(pwd)}
                          className="p-2 transition-all rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(passwordId)}
                          className="p-2 transition-all rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {pwd.email && (
                        <div>
                          <label className="block mb-1 text-xs font-medium text-white/60">Email</label>
                          <p className="px-3 py-2 text-sm rounded-lg text-white/90 bg-white/5">{pwd.email}</p>
                        </div>
                      )}

                      {pwd.username && (
                        <div>
                          <label className="block mb-1 text-xs font-medium text-white/60">Username</label>
                          <p className="px-3 py-2 text-sm rounded-lg text-white/90 bg-white/5">{pwd.username}</p>
                        </div>
                      )}

                      <div>
                        <label className="block mb-1 text-xs font-medium text-white/60">Password</label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 px-3 py-2 rounded-lg bg-white/5">
                            <span className="font-mono text-sm text-white/90">
                              {isVisible ? (pwd.password || '••••••••') : '••••••••'}
                            </span>
                          </div>
                          <button
                            onClick={() => togglePasswordVisibility(passwordId)}
                            className="p-2 transition-all rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                          >
                            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {pwd.notes && (
                        <div>
                          <label className="block mb-1 text-xs font-medium text-white/60">Notes</label>
                          <p className="px-3 py-2 text-sm rounded-lg text-white/70 bg-white/5">{pwd.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add/Edit Modal */}
          {(showAddModal || editingPassword) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  {editingPassword ? 'Edit Password' : 'Add New Password'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/80">Title</label>
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
                    <label className="block mb-2 text-sm font-medium text-white/80">Category</label>
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
                    <label className="block mb-2 text-sm font-medium text-white/80">Website (Optional)</label>
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
                    <label className="block mb-2 text-sm font-medium text-white/80">Email (Optional)</label>
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
                    <label className="block mb-2 text-sm font-medium text-white/80">Username (Optional)</label>
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
                    <label className="block mb-2 text-sm font-medium text-white/80">Password</label>
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
                        className="flex-1 font-mono input-field"
                        placeholder="Enter or generate password"
                      />
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="px-4 py-3 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/80">Notes (Optional)</label>
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
                      className="resize-none input-field"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div className="flex pt-4 space-x-4">
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
                      className="flex-1 px-4 py-3 font-semibold text-white transition-all border rounded-lg bg-white/10 hover:bg-white/20 border-white/20"
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