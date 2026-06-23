import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import ClaimUpdate from './components/ClaimUpdate'
import AddClaim from './components/AddClaim';

export default function App(){
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

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
        <Route 
          path='/login' 
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        
        <Route path='/register' element={<Register />} />

        <Route
          path='/employee-dashboard'
          element={user && user.role !== 'admin' ? <EmployeeDashboard user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />
        
        <Route
          path='/admin-dashboard'
          element={user && user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />

        <Route 
          path='*' 
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} replace />
            ) : (
              <Navigate to='/login' replace />
            )
          } 
        />

        <Route path='/employee-dashboard/updateClaim/:claimID' 
          element={user && user.role !== 'admin' ? <ClaimUpdate user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />

        <Route path='/employee-dashboard/addClaim'
          element={user && user.role !== 'admin' ? <AddClaim user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />
      </Routes>
    </Router>
  );
}