import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeader } from './auth';

const STATUS_LABELS = {
  1: 'Pending',
  2: 'Approved',
  3: 'Rejected',
};

const formatDate = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
};

export default function ED2({ user, onLogout }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-blue-500/20 bg-blue-950/30 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Employee Dashboard</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-cyan-400">Your Claims</h1>
            <p className="mt-2 text-sm text-zinc-400">Review every submitted expense claim in one place.</p>
          </div>

          <button
            type="button"
            onClick={fetchClaims}
            className="inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20"
          >
            Refresh
          </button>
        </div>
        <div className="addClaims">
          <form onSubmit={addClaims} className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-500/20 bg-blue-950/30 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <input type="text" name="category_id" placeholder="Category ID" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
            <input type="text" name="description" placeholder="Description" required value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" name="claim_amount" placeholder="Claim Amount" required value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20"
            >
              Add Claim
            </button>
          </form>
        </div>
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/50 p-4 text-sm font-medium text-red-200">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-400">
            Loading claims...
          </div>
        ) : claims.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-400">
            No claims found for this account.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {claims.map((claim) => (
              <article
                key={claim.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20 transition hover:border-cyan-400/30 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                      Claim #{claim.id}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-white">${Number(claim.claim_amount).toFixed(2)}</h2>
                  </div>

                  <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-200">
                    {STATUS_LABELS[claim.status_id] || `Status ${claim.status_id}`}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-zinc-300">
                  <p>
                    <span className="font-semibold text-cyan-300">Description:</span>{' '}
                    {claim.description || 'No description provided'}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-300">Category ID:</span> {claim.category_id}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-300">Submitted:</span>{' '}
                    {formatDate(claim.submission_date)}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-300">Validated:</span>{' '}
                    {formatDate(claim.validation_date)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}