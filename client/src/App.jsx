import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';


export default function App(){
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route
          path='/employee-dashboard'
          element={user ? <EmployeeDashboard user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/admin-dashboard'
          element={user ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </Router>
  );
}