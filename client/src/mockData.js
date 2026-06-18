export const USERS = [
  {
    userID: 1001,
    name: "Jai Verma",
    username: "employee@company.com",
    password: "password123", 
    contact_no: "+1234567890",
    address: "123 Main St, Tech City",
    role: "employee", 
    balance: 500.00 
  },
  {
    userID: 1002,
    name: "Nisha Kapoor",
    username: "admin@company.com",
    password: "admin123",
    contact_no: "+1987654321",
    address: "456 Admin Ave, Corporate Hub",
    role: "admin",
    balance: 0.00
  }
];[]

export const CLAIMS = [
  {
    claimID: "CLM-001",
    userID: 1001, // F.K from User
    categoryID: 101, // F.K from Category
    claim_amount: 120.50,
    description: "Uber ride to client headquarters for project presentation",
    statusID: 1, // F.K from Status
    submission_date: "2026-06-10",
    validation_date: null,
  },
  {
    claimID: "CLM-002",
    userID: 1001, // F.K from User
    categoryID: 102, // F.K from Category
    claim_amount: 260.00,
    description: "Meal at starbucks during lunch hours",
    statusID: 1, // F.K from Status
    submission_date: "2026-06-10",
    validation_date: null,
  }
];

export const RECIEPT = [
    {
      reciept_ID: "RCT-01",
      claim_ID: "CLM-001", //F.K from Claims
      reciept_amount: 140.00,
      merchant_name: "Uber",
      merchant_contact: "98XXXXXXXX",
      merchant_address: "Noida",
      purchase_date: "2026-06-04",
      tax: 20.00
    },
    {
      reciept_ID: "RCT-02",
      claim_ID: "CLM-002", //F.K from Claims
      reciept_amount: 210.00,
      merchant_name: "Starbucks",
      merchant_contact: "88XXXXXXXX",
      merchant_address: "Noida",
      purchase_date: "2026-06-07",
      tax: 40.00
    }
];
export const ITEMS = [
  {
    item_name: "Car",
    qty: 1,
    price: 120.00,
    reciept_ID: "RCT-01" //F.K from Reciept
  },
  {
    item_name: "Toast",
    qty: 2,
    price: 85.00,
    reciept_ID: "RCT-02" //F.K from Reciept
  }
]
export const STATUS = [
  {
    Status_ID: 1,
    Status: "Pending"
  },
  {
    Status_ID: 2,
    Status: "Approved"
  },
  {
    Status_ID: 3,
    Status: "Rejected"
  }
];

export const CATEGORIES = [
  {
    Category_ID: 101,
    Category: "Travel"
  },
  {
    Category_ID: 102,
    Category: "Meals"
  },
  {
    Category_ID: 103,
    Category: "Office supplies"
  },
  {
    Category_ID: 104,
    Category: "Software/Subscriptions"
  }
];

export const DOCUMENTS = [
  {
    doc_ID: "DOC_100",
    reciept_ID: "RCT-01", //F.K from Reciept
    doc_file: "link/img"
  },
  {
    doc_ID: "DOC_200",
    reciept_ID: "RCT-02", //F.K from Reciept
    doc_file: "link/img"
  }
];



