import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { 
  FileText, 
  Sparkles, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Bot, 
  BarChart2, 
  Briefcase,
  Users
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { openChat } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRecruiter = user?.role === 'recruiter';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Resume<span className="text-brand-500">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 -mt-1 font-medium tracking-wide uppercase">
                Recruitment Assistant
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to="/dashboard" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Dashboard
              </Link>

              <Link 
                to="/upload" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/upload') 
                    ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Resumes
              </Link>

              <Link 
                to="/jd" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/jd') 
                    ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Job Descriptions
              </Link>

              <Link 
                to="/analyze" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/analyze') 
                    ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Analyze
              </Link>

              {isRecruiter && (
                <>
                  <Link 
                    to="/bulk" 
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/bulk') 
                        ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Bulk Analysis
                  </Link>
                  <Link 
                    to="/candidates" 
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/candidates') 
                        ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Candidates
                  </Link>
                </>
              )}

              <Link 
                to="/recommendations" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/recommendations') 
                    ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Courses
              </Link>

              <Link 
                to="/interview" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/interview') 
                    ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Interview Prep
              </Link>
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={openChat}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/20 text-brand-400 border border-brand-500/30 hover:bg-brand-600/30 transition-all shadow-sm"
                >
                  <Bot className="w-4 h-4 text-brand-400" />
                  AI Assistant
                </button>

                {/* User Profile Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-brand-400">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize border border-slate-700/60">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-lg shadow-brand-600/20 transition-all transform active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
            Dashboard
          </Link>
          <Link to="/upload" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
            Resumes
          </Link>
          <Link to="/jd" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
            Job Descriptions
          </Link>
          <Link to="/analyze" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
            Analyze Resume
          </Link>
          {isRecruiter && (
            <>
              <Link to="/bulk" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
                Bulk Analysis
              </Link>
              <Link to="/candidates" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
                Candidates
              </Link>
            </>
          )}
          <Link to="/recommendations" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
            Course Recommendations
          </Link>
          <Link to="/interview" className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800">
            Interview Prep
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
