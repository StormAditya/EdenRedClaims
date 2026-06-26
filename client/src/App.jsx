import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import ClaimUpdate from './components/Employee/ClaimUpdate'
import AddClaim from './components/Employee/AddClaim';
import UserUpdate from './components/Admin/UserUpdate';
import AdminClaims from './components/Admin/AdminClaims';
import AdminUsers from './components/Admin/AdminUsers';
import AdminHome from './components/Admin/AdminHome';
import AdminCreateUser from './components/Admin/AdminCreateUser';

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

        <Route 
          path='/admin-dashboard'
          element={user && user.role === 'admin' ? <AdminHome user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />

        <Route path='/admin-dashboard/users/updateUser/:userid'
          element={user && user.role === 'admin' ? <UserUpdate user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />

        <Route path='/admin-dashboard/users'
          element={user && user.role === 'admin' ? <AdminUsers user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />
        
        <Route path='/admin-dashboard/claims'
          element={user && user.role === 'admin' ? <AdminClaims user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />


        <Route path='/admin-dashboard/users/createUser'
          element={user && user.role === 'admin' ? <AdminCreateUser user={user} onLogout={handleLogout} /> : <Navigate to='/login' replace />}
        />
      </Routes>
    </Router>
  );
}