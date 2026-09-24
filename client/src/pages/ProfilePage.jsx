import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { User, Mail, Shield, Calendar, Sparkles } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto space-y-8 overflow-x-hidden">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-brand-400" />
              User Profile & Settings
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              View your account credentials and system privileges.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
              <div className="w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/40 flex items-center justify-center font-bold text-2xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700 capitalize">
                  Role: {user?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-medium block">Email Address</span>
                <p className="font-bold text-white text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-400" />
                  {user?.email}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-medium block">Account Created</span>
                <p className="font-bold text-white text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-brand-950/40 border border-brand-500/30 p-4 rounded-xl text-xs text-brand-300 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-400 shrink-0" />
              <div>
                <p className="font-bold">System Status: Active</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Connected to ResumeAI Backend API with JWT Token session persistence.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
