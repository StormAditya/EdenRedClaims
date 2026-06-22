import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { getAuthHeader } from './auth';

export default function EmployeeDashboard({ user, onLogout }) {
    
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alterClaimId, setAlterClaimId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [claimAmount, setClaimAmount] = useState('');

  const fetchClaims = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get('http://localhost:5000/api/employee-dashboard/claims', {
        headers: getAuthHeader(),
      });

      setClaims(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error(err);
      setClaims([]);
      setErrorMessage('Unable to fetch claims.');
    } finally {
      setLoading(false);
    }
  };
  const addClaims = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/employee-dashboard/claims', {
        category_id: categoryId,
        description: description,
        claim_amount: claimAmount,
      }, {
        headers: getAuthHeader(),
      });

      if (response.data?.success) {
        setCategoryId('');
        setDescription('');
        setClaimAmount('');
        await fetchClaims();
      }
      
    } catch (err) {
      console.error(err);
      setErrorMessage('Unable to add claims.');
    } finally {
      setLoading(false);
    }
  };

  const updateClaims = async () => {
     event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.patch('http://localhost:5000/api/employee-dashboard/claims', {
        claim_id: alterClaimId,
        category_id: categoryId,
        description: description,
        claim_amount: claimAmount,
      }, {
        headers: getAuthHeader(),
      });

      if (response.data?.success) {
        setAlterClaimId(null);
        setCategoryId('');
        setDescription('');
        setClaimAmount('');
        await fetchClaims();
      }
      
    } catch (err) {
      console.error(err);
      setErrorMessage('Unable to update claims.');
    } finally {
      setLoading(false);
    }
  };
  const removeClaim = async () => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try{
      const response = await axios.delete('http://localhost:5000/api/employee-dashboard/claims', {
        claim_id: alterClaimId,
      }, {
        headers: getAuthHeader(),
      });
      if (response.data?.success) {
        setAlterClaimId('');
        await fetchClaims();
      }
    }catch (err) {
      console.error(err);
      setErrorMessage('Unable to delete claims.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
       fetchClaims();

  }, []);

    const normalizeClaim = (claim) => ({
      claimID: claim.claimID ?? claim.claim_id ?? claim.id,
      userID: claim.userID ?? claim.user_id,
      categoryID: claim.categoryID ?? claim.category_id,
      claim_amount: Number(claim.claim_amount ?? 0),
      description: claim.description ?? '',
      statusID: claim.statusID ?? claim.status_id,
      submission_date: claim.submission_date ?? null,
      validation_date: claim.validation_date ?? null,
    });

    const employeeClaims = claims
      .filter((claim) => (claim.userID ?? claim.user_id) === user.userID)
      .map(normalizeClaim);

    const getStatusName = (statusID) => {
        return "Placeholder";
    };

    const getCategoryName = (categoryId) => {
        return "Placeholder";
    };

    return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Employee Portal
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Welcome back, <span className="text-cyan-400 font-medium">{user.name}</span>
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-4 py-2 text-xs font-bold tracking-wider uppercase border border-zinc-800 rounded-lg transition"
        >
          Sign Out
        </button>
      </header>
       <div className="max-w-7xl mx-auto">
          <form onSubmit={addClaims} className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-500/20 bg-blue-950/30 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <input type="text" name="category_id" placeholder="Category ID" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-blue-500/20 bg-blue-950/30 px-4 py-3 shadow-2xl shadow-blue-950/30 backdrop-blur-md" />
            <input type="text" name="description" placeholder="Description" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-blue-500/20 bg-blue-950/30 px-4 py-3 shadow-2xl shadow-blue-950/30 backdrop-blur-md" />
            <input type="number" name="claim_amount" placeholder="Claim Amount" required value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} className="w-full rounded-lg border border-blue-500/20 bg-blue-950/30 px-4 py-3 shadow-2xl shadow-blue-950/30 backdrop-blur-md" />
            <button
              type="submit"
              className="w-90 inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:cursor-pointer"
            >
              Add Claim
            </button>
          </form>
        </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-1 bg-gradient-to-br from-blue-950/40 to-zinc-900/40 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
          
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
            Available Limit
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            Remaining flexible reimbursement fund
          </p>
          
          <div className="text-4xl font-black text-cyan-400 tracking-tight">
            Rs.{user.balance.toFixed(2)}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex justify-between text-xs text-zinc-400">
            <span>Identity Token:</span>
            <span className="font-mono text-zinc-300">EMP-{user.userID}</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Claims History
            </h2>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-medium">
              {employeeClaims.length} Total Submissions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="pb-3 font-medium">Claim ID</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm">
                {employeeClaims.map((claim) => {
                  const statusName = getStatusName(claim.statusID);
                  
                  return (
                    <tr key={claim.claimID} className="group hover:bg-zinc-900/20 transition-colors">
                      <td className="py-4 font-mono font-medium text-zinc-400">
                        {claim.claimID}
                      </td>
                      <td className="py-4 text-zinc-300">
                        <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-400">
                          {getCategoryName(claim.categoryID)}
                        </span>
                      </td>
                      <td className="py-4 text-zinc-400 max-w-xs truncate pr-4" title={claim.description}>
                        {claim.description}
                      </td>
                      <td className="py-4 font-bold text-white">
                        Rs.{claim.claim_amount.toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide
                          ${statusName === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                          ${statusName === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                          ${statusName === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                        `}>
                          {statusName}  
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="bg-red-500 w-6 h-6 justify-center items-center rounded-md">
                          <img 
                          src="/images/deleteIcon.png"
                          alt="Delete"
                          className="w-5 h-5 cursor-pointer "
                          onClick={() => {
                            setAlterClaimId(claim.claim_id);
                            removeClaim();
                          }}
                        />
                        </div>
                        
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {employeeClaims.length === 0 && (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No reimbursement claims filed yet.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}