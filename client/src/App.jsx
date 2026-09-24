import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ResumeUploadPage from './pages/ResumeUploadPage';
import JdInputPage from './pages/JdInputPage';
import AnalyzePage from './pages/AnalyzePage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import BulkAnalysisPage from './pages/BulkAnalysisPage';
import CandidatesPage from './pages/CandidatesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';

// Dashboard router depending on user role
const DashboardSwitch = () => {
  const { user } = useAuth();
  if (user?.role === 'recruiter' || user?.role === 'admin') {
    return <RecruiterDashboard />;
  }
  return <CandidateDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardSwitch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <ResumeUploadPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jd"
              element={
                <ProtectedRoute>
                  <JdInputPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <AnalyzePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analysis/:id"
              element={
                <ProtectedRoute>
                  <AnalysisResultPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bulk"
              element={
                <ProtectedRoute>
                  <BulkAnalysisPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/candidates"
              element={
                <ProtectedRoute>
                  <CandidatesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <InterviewPrepPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Integrated Floating AI Chatbot Widget */}
          <ChatbotWidget />
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
