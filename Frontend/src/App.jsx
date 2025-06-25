import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateEvent from './pages/CreateEvent';
import Registrations from './pages/Registrations';
import EventHistory from './pages/EventHistory';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Only Routes */}
          <Route
            path="/create-event"
            element={
              <PrivateRoute requireAdmin={true}>
                <CreateEvent />
              </PrivateRoute>
            }
          />
          <Route
            path="/registrations"
            element={
              <PrivateRoute requireAdmin={true}>
                <Registrations />
              </PrivateRoute>
            }
          />

          {/* Participant Only Routes */}
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <EventHistory />
              </PrivateRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;