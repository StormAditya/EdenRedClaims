import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { getAuthHeader } from "../Utils/auth";
import Sidebar from "./Sidebar";

const AdminUsers = ({ user, onLogout }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        "http://localhost:5050/api/admin-dashboard/users",
        { headers: getAuthHeader() }
      );
      setUsers(Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []));
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }; 

  const removeUser = async (userToDelete) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.delete(
        "http://localhost:5050/api/admin-dashboard/users",
        {
          headers: getAuthHeader(),
          data: { id: userToDelete },
        }
      );
      if (response.data?.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to delete user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userToUpdate) => {
    navigate(`/admin-dashboard/updateUser/${userToUpdate}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        isSidebarVisible={isSidebarVisible} 
        setSidebarVisible={setSidebarVisible} 
      />

      <div className="flex-1 p-6 md:p-12 overflow-y-auto relative">
        {!isSidebarVisible && (
          <button
            onClick={() => setSidebarVisible(true)}
            className="hidden md:flex fixed top-6 left-6 z-40 text-zinc-400 hover:text-white p-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl transition"
            title="Show Sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <div className={`max-w-7xl mx-auto transition-all duration-300 ${!isSidebarVisible ? "md:pl-12" : ""}`}>
          <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Admin Portal
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Welcome back,{" "}
                <span className="text-cyan-400 font-medium">{user?.name}</span>
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-4 py-2 text-xs font-bold tracking-wider uppercase border border-zinc-800 rounded-lg transition"
            >
              Sign Out
            </button>
          </header>

          <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Users
              </h2>
              <div className="flex flex-row gap-3">
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full inline-flex font-medium items-center justify-center h-8.5">
                  {users.length} Total Users
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 mb-6 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
                {errorMessage}
              </p>
            )}

            {loading && (
              <p className="text-cyan-500 mb-6 text-sm animate-pulse">
                Fetching records...
              </p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="pb-3 font-medium">User ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email ID</th>
                    <th className="pb-3 font-medium">Balance</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-sm">
                  {users.map((u) => (
                    <tr
                      key={u.user_id || u.id}
                      className="group hover:bg-zinc-900/20 transition-colors"
                    >
                      <td className="py-4 font-mono font-medium text-zinc-400">
                        {u.id}
                      </td>
                      <td
                        className="py-4 text-zinc-400 max-w-xs truncate pr-4"
                        title={u.name}
                      >
                        {u.name}
                      </td>
                      <td
                        className="py-4 text-zinc-400 max-w-xs truncate pr-4"
                        title={u.email_id}
                      >
                        {u.email_id}
                      </td>
                      <td className="py-4 font-bold text-white">
                        Rs.{(u.balance === null || u.balance === undefined) ? 0 : u.balance.toFixed(2)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide
                            ${u.user_type === "employee" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : ""}
                            ${u.user_type === "admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" : ""}
                          `}
                        >
                          {u.user_type}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 pl-2">
                          <div 
                            className={`w-6 h-6 flex justify-center items-center rounded-md 
                              ${user?.userID === u.id
                                ? "bg-gray-500 cursor-not-allowed pointer-events-none"
                                : "bg-red-500 cursor-pointer"
                              }`}
                            onClick={() => {
                              if (user?.userID !== u.id) removeUser(u.id);
                            }}
                          >
                            <img
                              src="/images/trashIcon.svg"
                              alt="Delete"
                              className="w-4 h-4"
                            />
                          </div>
                          <div 
                            className={`w-6 h-6 flex justify-center items-center rounded-md
                              ${user?.userID === u.id
                                ? "bg-gray-500 cursor-not-allowed pointer-events-none"
                                : "bg-yellow-500 cursor-pointer"
                              }`}
                            onClick={() => {
                              if (user?.userID !== u.id) handleEdit(u.id);
                            }}
                          >
                            <img
                              src="/images/editIcon.svg"
                              alt="Edit"
                              className="w-4 h-4"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && !loading && (
                <div className="text-center py-12 text-zinc-500 text-sm">
                  No users exist
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default AdminUsers;