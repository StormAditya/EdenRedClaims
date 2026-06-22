import EmployeeDashboard from "./EmployeeDashboard";
import axios from 'axios';
import Select from "react-select";

import { getAuthHeader } from "./auth";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { customSelectStyles, options } from "../assets/selectstyle";


const ClaimUpdate = () => {


  const navigate = useNavigate();

  const { claimID } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alterClaimId, setAlterClaimId] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [claimAmount, setClaimAmount] = useState("");



  const fetchClaim = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(`http://localhost:5000/api/employee-dashboard/claims/${claimID}`);

      const data = response.data.data;
      setClaim(data);
      setCategoryId(data.category_id);
      setDescription(data.description);
      setClaimAmount(data.claim_amount);
      console.log(categoryId, description, claimAmount);

    }
    catch (err) {
      console.error(err);
      setClaims(null);
      setErrorMessage("Unable to fetch claims.");
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClaim();
  }, []);

  /* useEffect(() => {
    console.log("claim updated:", claim);
  }, [claim]);
  */
  const handleBack = () => navigate('/employee-dashboard')

  const updateClaims = async () => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.patch(
        "http://localhost:5000/api/employee-dashboard/claims",
        {
          claim_id: claimID,
          category_id: categoryId,
          description: description,
          claim_amount: claimAmount,
        },
        {
          headers: getAuthHeader(),
        },
      );
      console.log('done')

      if (response.data?.success) {
        setCategoryId("");
        setDescription("");
        setClaimAmount("");
        await fetchClaims();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to update claims.");
    } finally {
      setLoading(false);
      handleBack();
    }
  };


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      <form
        className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-500/20 bg-blue-950/30 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
      >
        <Select
          options={options}
          styles={customSelectStyles}
          value={options.find((option) => option.value === categoryId)}
          onChange={(selectedOption) => setCategoryId(selectedOption.value)}
          placeholder="Select Category"
          menuPortalTarget={document.body}
          className="w-full"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-blue-500/20 bg-blue-950/30 px-4 py-3 shadow-2xl shadow-blue-950/30 backdrop-blur-md"
        />
        <input
          type="number"
          name="claim_amount"
          placeholder="Claim Amount"
          required
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
          className="w-full rounded-lg border border-blue-500/20 bg-blue-950/30 px-4 py-3 shadow-2xl shadow-blue-950/30 backdrop-blur-md"
        />
        <button
          type="button" onClick={updateClaims}
          className="w-90 inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:cursor-pointer"
        >
          Update
        </button>
      </form>
      <button
        type="button" onClick={handleBack}
        className="w-30 inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:cursor-pointer"
      >
        Back
      </button>
    </div>


  );
};

export default ClaimUpdate;



