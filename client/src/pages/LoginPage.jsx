import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Loader2, UserCheck, ShieldAlert } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo fill buttons
  const fillDemoCandidate = () => {
    setEmail('candidate@example.com');
    setPassword('password123');
  };

  const fillDemoRecruiter = () => {
    setEmail('recruiter@example.com');
    setPassword('password123');
  };

  const handleDemoLogin = async (demoEmail, demoRole) => {
    setError('');
    setLoading(true);
    try {
      // First attempt login; if fails, attempt auto-register demo account
      try {
        await login(demoEmail, 'password123');
      } catch (err) {
        // Auto register fallback demo
        const API = (await import('../services/api')).default;
        await API.post('/auth/register', {
          name: demoRole === 'recruiter' ? 'Demo Recruiter' : 'Demo Candidate',
          email: demoEmail,
          password: 'password123',
          role: demoRole
        });
        await login(demoEmail, 'password123');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Resume<span className="text-brand-500">AI</span></span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Sign in to your account</h2>
        <p className="text-xs text-slate-400 mt-1">Access your ATS resume analytics and AI recruitment assistant</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 space-y-6">
          
          {error && (
            <div className="bg-rose-950/70 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Bar */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick Demo Auto-Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('candidate@example.com', 'candidate')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-brand-900/40 text-brand-300 border border-slate-700/80 rounded-lg text-xs font-semibold transition-all"
              >
                Candidate Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('recruiter@example.com', 'recruiter')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-indigo-900/40 text-indigo-300 border border-slate-700/80 rounded-lg text-xs font-semibold transition-all"
              >
                Recruiter Demo
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1 block w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-brand-400 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
