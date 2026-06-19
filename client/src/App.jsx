import React, { useState, useEffect } from 'react';
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';
import { USERS } from "./mockData";

export default function App(){
  const [user, setUser] = useState(null);

  const [viewWorkspace, setviewWorkspace] = useState(false);

  const userRole = user?.role ?? user?.user_type;

  const handleLogout = () => {
    setUser(null);
    setviewWorkspace(false);
  };

  if (user === null){
    return <Login onLogin={setUser}/>
  }

  if (viewWorkspace) {
    if (userRole === 'admin') {
      return <div className='min-h-screen bg-zinc-950 text-white p-8'>Admin Dashboard Placeholder</div>;
    }
    return <EmployeeDashboard user={user} onLogout={handleLogout}/>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center px-4 font-sans">

      {/* Session details card */}
      <div className="w-full max-w-md bg-blue-950/40 backdrop-blur-md border border-blue-500/30 rounded-2xl p-8 text-center shadow-2xl shadow-blue-950/50">
        <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">
          Authenticated
        </h1>
        <p className='text-sm text-zinc-400 mt-2 font-medium'>
          Your details
        </p>

        {/* Profile output card */}
        <div className="my-6 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2 text-left">
          <p className='text-sm text-zinc-300'>
            <span className='font-bold text-cyan-300'>Identity:</span> {user.name}
          </p>
          <p className='text-sm text-zinc-300'>
            <span className='font-bold text-cyan-300'>Username:</span> {user.name}
          </p>
          <p className='text-sm text-zinc-300'>
            <span className='font-bold text-cyan-300'>Assigned role:</span> {" "}
            <span className='uppercase text-xs font-extrabold tracking-wider bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-zinc-200'>
              {userRole}
            </span>
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={() => setviewWorkspace(true)}
          className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 hover:border-emerald-500/60 text-emerald-400 font-bold py-3 px-4 rounded-lg text-sm tracking-wide uppercase transition duration-200 cursor-pointer shadow-lg shadow-emerald-950/30"
        >
          Continue
        </button>
      </div>
    </div>
  );
}