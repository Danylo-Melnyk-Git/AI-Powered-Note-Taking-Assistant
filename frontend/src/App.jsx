import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TranscriptionComponent from './components/TranscriptionComponent';
import SummaryComponent from './components/SummaryComponent';
import KeywordList from './components/KeywordList';
import TopicTags from './components/TopicTags';
import ToastProvider from './components/Common/ToastProvider';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const [noteId, setNoteId] = useState('');

  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={() => window.location.href = '/'} />} />
          <Route path="/register" element={<RegisterPage onRegister={() => window.location.href = '/'} />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<TranscriptionComponent onNoteCreated={setNoteId} />} />
                    <Route path="/summary" element={<SummaryComponent noteId={noteId} />} />
                    <Route path="/keywords" element={<KeywordList noteId={noteId} />} />
                    <Route path="/topics" element={<TopicTags noteId={noteId} />} />
                    {/* Add more protected routes here */}
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ToastProvider>
    </Router>
  );
}
