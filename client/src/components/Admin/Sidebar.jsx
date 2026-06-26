import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, Users, FileText, LogOut, ChevronLeft } from "lucide-react";

const Sidebar = ({ user, onLogout, isSidebarVisible, setSidebarVisible }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
      <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center w-full sticky top-0 z-40">
        <div className="text-sm font-black tracking-wider text-white uppercase">
          Portal
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-zinc-400 hover:text-white p-1 bg-zinc-950 border border-zinc-800 rounded-lg transition"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      <div 
        className={`fixed inset-y-0 left-0 transform h-screen bg-zinc-900 border-r border-zinc-800 p-5 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full"} 
          md:relative md:translate-x-0 
          ${isSidebarVisible ? "md:w-64" : "md:w-0 md:p-0 md:border-r-0 overflow-hidden"}
        `}
      >
        <div className="space-y-6">
          <div className="hidden md:flex justify-between items-center px-2 py-2 border-b border-zinc-800">
            <span className="text-md font-black tracking-wider text-white uppercase">
              Admin
            </span>
            <button 
              onClick={() => setSidebarVisible(false)}
              className="hidden md:flex text-zinc-400 hover:text-white p-1 hover:bg-zinc-950 rounded-lg transition"
              title="Hide Sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <nav className="space-y-1.5">
            <Link 
              to="/admin-dashboard" 
              className="w-full flex items-center space-x-3 py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wide text-zinc-400 hover:bg-zinc-950 hover:text-zinc-100 transition"
              onClick={() => setIsOpen(false)}
            >
              <Home size={18} />
              <span>Overview</span>
            </Link>

            <Link 
              to="/admin-dashboard/users" 
              className="w-full flex items-center space-x-3 py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wide text-zinc-400 hover:bg-zinc-950 hover:text-zinc-100 transition"
              onClick={() => setIsOpen(false)}
            >
              <Users size={18} />
              <span>Users</span>
            </Link>

            <Link 
              to="/admin-dashboard/claims" 
              className="w-full flex items-center space-x-3 py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wide text-zinc-400 hover:bg-zinc-950 hover:text-zinc-100 transition"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={18} />
              <span>Claims</span>
            </Link>
          </nav>
        </div>
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div className="px-4 text-xs text-zinc-400 truncate">
            Admin: <span className="text-cyan-400 font-medium block mt-0.5">{user?.name}</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 py-2.5 px-4 rounded-xl text-sm font-bold text-zinc-400 hover:bg-zinc-950 hover:text-red-400 border border-transparent hover:border-zinc-800 transition"
          >
            <LogOut size={18} />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
    );
};
export default Sidebar;
