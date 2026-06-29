export const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "rgba(23, 37, 84, 0.3)",
    borderColor: "rgba(59,130,246,0.2)",
    borderRadius: "0.5rem",
    minHeight: "52px",
    boxShadow: "none",
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
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "rgba(34,211,238,0.15)"
      : "#18181b",
    color: "#f4f4f5",
    cursor: "pointer",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#f4f4f5",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#71717a",
  }),

  input: (provided) => ({
    ...provided,
    color: "#f4f4f5",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#22d3ee",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
};

export const userTypeOptions = [
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Employee" },
];

export const statusTypeOptions = [
  {
    value: 'active', label: "active"
  },
  {
    value: 'disabled', label: 'disabled'
  }
];

export const companies = [
  {
    value: 'amazon', label: 'Amazon'
  },
  {
    value: 'dallasTech' , label: 'DallasTech'
  }
]