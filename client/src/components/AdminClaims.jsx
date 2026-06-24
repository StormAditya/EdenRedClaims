import React from "react";
import axios from "axios";
import Select from "react-select";

import { getAuthHeader } from "./auth";
import { useState, useEffect } from "react";
import { customSelectStyles, options } from "../assets/selectstyle";
import { useNavigate } from "react-router-dom";

const AdminClaims = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [claims, setClaims] = useState([]);
  const [categories, setCategories] = useState([]); // Fixed: renamed to plural for consistency

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        "http://localhost:5050/api/admin-dashboard/users",
        {
          headers: getAuthHeader(),
        },
      );
      setUsers(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to fetch Users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(
        "http://localhost:5050/api/admin-dashboard/claims",
        {
          headers: getAuthHeader(),
        },
      );
      setClaims(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to fetch Claims.");
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler for approving or rejecting a claim
  const handleStatusUpdate = async (claimId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5050/api/admin-dashboard/claims/`,
        {
          claim_id: claimId,
          status_id: newStatus,
        },
        {
          headers: getAuthHeader(),
        },
      );

      console.log(`Claim ${claimId} status updated to: ${newStatus}`);
      fetchClaims();
    } catch (err) {
      console.error(err);
      setErrorMessage(`Failed to update claim to ${newStatus}.`);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/category');
      setCategories(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to fetch categories.");
      setCategories([]); // Fixed state setter call here
    }
  }; // Fixed: Removed the stray duplicate closure syntax that was right below this line

  useEffect(() => {
    fetchUsers();
    fetchClaims();
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-5">
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

      <div className="lg:col-span-2 bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Claims
          </h2>
          <div className="flex flex-row gap-3"></div>
        </div>

        {errorMessage && (
          <p className="text-red-500 mb-4 text-sm">{errorMessage}</p>
        )}
        {loading && (
          <p className="text-cyan-500 mb-4 text-sm">
            Loading dashboard data...
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="pb-3 font-medium">Claim ID</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Submission Date</th>
                <th className="pb-3 font-medium">Actions</th>
                <th className="pb-3 font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm">
              {claims.map((claim) => (
                <tr
                  key={claim.id}
                  className="border-b border-zinc-800 hover:bg-zinc-900/20 transition"
                >
                  <td className="py-3">{claim.id}</td>
                  <td className="py-3">{users.find((user) => user.id === claim.user_id)?.name || 'Unknown'}</td>
                  {/* Fixed array matching to match the renamed categories state */}
                  <td className="py-3">{categories.find((cat) => cat.id === claim.category_id)?.category_name || 'Unknown'}</td>
                  <td className="py-3  max-w-xs truncate">
                    {claim.description}
                  </td>
                  <td className="py-3 font-semibold text-white">
                    Rs. {claim.claim_amount}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        claim.status_id === 2
                          ? "bg-emerald-500/10 text-emerald-400"
                          : claim.status_id === 3
                            ? "bg-rose-500/10 text-rose-400"
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {claim.status_id === 1
                        ? "Pending"
                        : claim.status_id === 2
                          ? "Approved"
                          : "Rejected"}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400">
                    {claim.submission_date
                      ? new Date(claim.submission_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(claim.id, 2)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-medium rounded transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(claim.id, 3)}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 text-xs font-medium rounded transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                  <td className="py-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 text-xs font-medium rounded transition"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminClaims;