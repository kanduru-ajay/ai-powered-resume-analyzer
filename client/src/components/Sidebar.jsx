import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Zap, 
  Users, 
  BookOpen, 
  MessageSquare, 
  History, 
  User,
  Layers,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const { openChat } = useChat();
  const isRecruiter = user?.role === 'recruiter';

  const baseLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resumes', path: '/upload', icon: FileText },
    { name: 'Job Descriptions', path: '/jd', icon: Briefcase },
    { name: 'Analyze', path: '/analyze', icon: Zap },
  ];

  const recruiterLinks = [
    { name: 'Bulk Analysis', path: '/bulk', icon: Layers },
    { name: 'Candidates', path: '/candidates', icon: Users },
  ];

  const generalLinks = [
    { name: 'Recommendations', path: '/recommendations', icon: BookOpen },
    { name: 'Interview Prep', path: '/interview', icon: HelpCircle },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        
        {/* Main Section */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          <div className="space-y-1">
            {baseLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Recruiter Section */}
        {isRecruiter && (
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Recruiter Hub
            </p>
            <div className="space-y-1">
              {recruiterLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights & Tools Section */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Insights & Tools
          </p>
          <div className="space-y-1">
            {generalLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Launcher Card */}
      <div className="pt-4 border-t border-slate-800">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/60 rounded-xl p-3.5 text-center">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold text-white">AI Assistant Ready</h4>
          <p className="text-[11px] text-slate-400 mt-1">Ask questions about your resume or ATS score.</p>
          <button
            onClick={openChat}
            className="w-full mt-3 py-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-brand-600/20 transition-all"
          >
            Launch Assistant
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
