import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Shield, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password.trim()
      });

      if (signInError) {
        throw new Error('Email cyangwa ijambo ry\'ibanga sibyo');
      }

      if (!data.user) {
        throw new Error('Ntibishoboye kwinjira. Gerageza nanone.');
      }

      // Check user role for admin login
      const userRole = data.user.user_metadata?.role || 'user';
      if (mode === 'admin' && userRole !== 'admin') {
        throw new Error('Nta burenganzira bwo kwinjira nk\'umuyobozi');
      }

      // Redirect based on role
      navigate(userRole === 'admin' ? '/admin' : '/');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hari ikibazo cyavutse');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.username || !formData.email || !formData.password) {
        throw new Error('Amazina, email na ijambo ry\'ibanga ni ngombwa');
      }

      if (formData.password.length < 6) {
        throw new Error('Ijambo ry\'ibanga rigomba kuba rifite inyuguti 6 cyangwa zirenga');
      }

      // Register new user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password.trim(),
        options: {
          data: {
            username: formData.username.trim(),
            role: 'user'
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('Email yawe isanzwe iri mu bubiko bw\'amakuru');
        }
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('Ntibishoboye kwiyandikisha. Gerageza nanone.');
      }

      // Show success message and switch to login
      setError('Kwiyandikisha byagenze neza! Urashobora kwinjira ubu.');
      setMode('login');
      setFormData(prev => ({ ...prev, password: '' }));
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hari ikibazo cyavutse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center relative">
          {mode !== 'login' && (
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setFormData({ username: '', email: '', password: '' });
              }}
              className="absolute left-0 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Garuka
            </button>
          )}
          {mode === 'register' ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Iyandikishe</h2>
              <p className="mt-2 text-sm text-gray-600">
                Iyandikishe kugira ngo ubashe gukoresha serivisi zacu
              </p>
            </>
          ) : mode === 'admin' ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Injira nk'Umuyobozi</h2>
              <p className="mt-2 text-sm text-gray-600">
                Injiza amakuru yawe y'umuyobozi
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Injira</h2>
              <p className="mt-2 text-sm text-gray-600">
                Injiza amakuru yawe kugira ngo ubashe gukomeza
              </p>
            </>
          )}
        </div>

        {/* Error/Success Message */}
        {error && (
          <div className={`p-3 rounded-lg text-sm ${
            error.includes('byagenze neza')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Mode Selection (Only shown on login) */}
        {mode === 'login' && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setMode('admin');
                setError(null);
                setFormData({ username: '', email: '', password: '' });
              }}
              className="flex items-center px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
            >
              <Shield className="h-5 w-5 mr-2" />
              Injira nk'Umuyobozi
            </button>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={mode === 'register' ? handleSignUp : handleSignIn} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {/* Username field (only shown on register) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Amazina
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Amazina yawe"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email yawe"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Ijambo ry'ibanga
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Ijambo ry'ibanga"
                minLength={6}
              />
            </div>
          </div>

          {/* Submit button and register link */}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {mode === 'register' ? (
                <UserPlus className="h-5 w-5 mr-2" />
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Tegereza...' : mode === 'register' ? 'Iyandikishe' : 'Injira'}
            </button>

            {mode === 'login' && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Nta konti ufite? {' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                      setFormData({ username: '', email: '', password: '' });
                    }}
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    Iyandikishe
                  </button>
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}