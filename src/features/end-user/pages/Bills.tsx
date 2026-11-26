import "./Bills.css";
import { useState } from "react";

type Bill = {
  id: number;
  month: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
};

const bills: Bill[] = [
  {
    id: 1,
    month: "November 2026",
    amount: 1850,
    dueDate: "05 Dec 2026",
    status: "Pending",
  },
  {
    id: 2,
    month: "October 2026",
    amount: 1620,
    dueDate: "05 Nov 2026",
    status: "Paid",
  },
  {
    id: 3,
    month: "September 2026",
    amount: 1740,
    dueDate: "05 Oct 2026",
    status: "Paid",
  },
  {
    id: 4,
    month: "August 2026",
    amount: 1920,
    dueDate: "05 Sep 2026",
    status: "Overdue",
  },
];

function Bills() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBills =
    statusFilter === "All"
      ? bills
      : bills.filter((bill) => bill.status === statusFilter);
  return (
    <div className="bills-page">
      <div className="bills-header">
        <div>
          <h1>My Bills</h1>
          <p>View and manage your electricity bills.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter bills by status"
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="bills-table-container">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.month}</td>
                <td>₹{bill.amount.toLocaleString("en-IN")}</td>
                <td>{bill.dueDate}</td>
                <td>
                  <span className={`bill-status ${bill.status.toLowerCase()}`}>
                    {bill.status}
                  </span>
                </td>
                <td>
                  <button className="bill-action">
                    {bill.status === "Paid" ? "View" : "View / Pay"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="bills-note">
        Note: All bills are generated on the 1st of every month.
      </p>
    </div>
  );
}

export default Bills;
