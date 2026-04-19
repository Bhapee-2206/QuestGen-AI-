import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Generate from './pages/Generate';
import QuestionBank from './pages/QuestionBank';
import History from './pages/History';
import PaperView from './pages/PaperView';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { auth } from './lib/api';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isDemo = localStorage.getItem('guestMode') === 'true';
      if (isDemo) {
        setSession({ user: { email: 'guest@questgen.ai', full_name: 'Guest User' } });
        setLoading(false);
        return;
      }

      const user = auth.getUser();
      if (user) {
        setSession({ user });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={session ? <Navigate to="/" /> : <Landing />} />
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={session ? <Navigate to="/" /> : <Register />} />

        {/* Protected Routes */}
        <Route path="/" element={session ? <Layout><Dashboard /></Layout> : <Navigate to="/landing" />} />
        <Route path="/generate" element={session ? <Layout><Generate /></Layout> : <Navigate to="/landing" />} />
        <Route path="/bank" element={session ? <Layout><QuestionBank /></Layout> : <Navigate to="/landing" />} />
        <Route path="/history" element={session ? <Layout><History /></Layout> : <Navigate to="/landing" />} />
        <Route path="/paper" element={session ? <Layout><PaperView /></Layout> : <Navigate to="/landing" />} />
        <Route path="/settings" element={session ? <Layout><Settings /></Layout> : <Navigate to="/landing" />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
