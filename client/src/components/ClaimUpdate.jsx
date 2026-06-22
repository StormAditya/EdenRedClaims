import EmployeeDashboard from "./EmployeeDashboard";

const ClaimUpdate = () => {
    const [claim, setClaim] = useState()


  return (
    <div className="max-w-7xl mx-auto z-999999">
        <form
          onSubmit={addClaims}
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
            type="submit"
            className="w-90 inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:cursor-pointer"
          >
            Add Claim
          </button>
        </form>
      </div>
  );
};

export default ClaimUpdate;



