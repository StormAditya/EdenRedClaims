export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(23, 37, 84, 0.3)", 
    borderColor: "rgba(59,130,246,0.2)",
    borderRadius: "0.5rem",
    minHeight: "52px",
    boxShadow: "none",
    zIndex: 9999,
    "&:hover": {
      borderColor: "rgba(34,211,238,0.5)",
    },
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: "#18181b", 
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: "0.5rem",
    overflow: "hidden",
    zIndex: 9999,
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "rgba(34,211,238,0.15)" : "#18181b",
    color: "#f4f4f5",
    cursor: "pointer",
    zIndex: 9999,
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#f4f4f5",
    zIndex: 9999,
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#71717a", 
  }),

  input: (provided) => ({
    ...provided,
    color: "#f4f4f5",
    zIndex: 9999,
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#22d3ee",
    zIndex: 9999,
  }),

  indicatorSeparator: () => ({
    display: "none",
    zIndex: 9999,
  }),
};

export const options = [
  { value: "1", label: "Travel" },
  { value: "2", label: "Food" },
  { value: "3", label: "Medical" },
];

