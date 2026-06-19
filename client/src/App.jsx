import React, { useState, useEffect } from 'react';
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';
import { USERS } from "./mockData";
import { AdminDashboard } from './AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';

export default function App(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [viewWorkspace, setviewWorkspace] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setviewWorkspace(false);
  };

  if (user === null){
    return <Login onLogin={setUser}/>
  }

  if (viewWorkspace) {
    if (user.role === 'admin') {
      return <div className='min-h-screen bg-zinc-950text-white p-8'>Admin Dashboard Placeholder</div>;
    }
    return <EmployeeDashboard user={user} onLogout={handleLogout}/>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}