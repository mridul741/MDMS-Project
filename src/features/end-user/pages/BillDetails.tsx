
import "./BillDetails.css";
import { useNavigate, useParams } from "react-router-dom";

type Bill = {
  id: number;
  month: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  units: number;
  meterNumber: string;
  billingPeriod: string;
};

const bills: Bill[] = [
  {
    id: 1,
    month: "November 2026",
    amount: 1850,
    dueDate: "05 Dec 2026",
    status: "Pending",
    units: 245,
    meterNumber: "MTR-1001",
    billingPeriod: "01 Nov – 30 Nov 2026",
  },
  {
    id: 2,
    month: "October 2026",
    amount: 1620,
    dueDate: "05 Nov 2026",
    status: "Paid",
    units: 216,
    meterNumber: "MTR-1001",
    billingPeriod: "01 Oct – 31 Oct 2026",
  },
  {
    id: 3,
    month: "September 2026",
    amount: 1740,
    dueDate: "05 Oct 2026",
    status: "Paid",
    units: 232,
    meterNumber: "MTR-1001",
    billingPeriod: "01 Sep – 30 Sep 2026",
  },
  {
    id: 4,
    month: "August 2026",
    amount: 1920,
    dueDate: "05 Sep 2026",
    status: "Overdue",
    units: 256,
    meterNumber: "MTR-1001",
    billingPeriod: "01 Aug – 31 Aug 2026",
  },
];

function BillDetails() {
  const { billId } = useParams();
  const navigate = useNavigate();

  const bill = bills.find((item) => item.id === Number(billId));

  if (!bill) {
    return (
      <div className="bill-details-page">
        <h2>Bill not found</h2>
        <button onClick={() => navigate("/user/bills")}>
          Back to Bills
        </button>
      </div>
    );
  }

  return (
    <div className="bill-details-page">
      <button
        className="bill-back-button"
        onClick={() => navigate("/user/bills")}
      >
        ← Back to Bills
      </button>

      <div className="bill-details-header">
        <div>
          <h1>Bill Details</h1>
          <p>View your electricity bill information.</p>
        </div>
        <span className={`bill-status ${bill.status.toLowerCase()}`}>
          {bill.status}
        </span>
      </div>

      <section className="bill-summary">
        <p>Total Amount</p>
        <h2>₹{bill.amount.toLocaleString("en-IN")}</h2>
        <p>Billing Month: {bill.month}</p>
      </section>

      <section className="bill-info-card">
        <h2>Bill Information</h2>
        <div className="bill-info-grid">
          <div>
            <span>Bill ID</span>
            <strong>#{bill.id}</strong>
          </div>
          <div>
            <span>Meter Number</span>
            <strong>{bill.meterNumber}</strong>
          </div>
          <div>
            <span>Billing Period</span>
            <strong>{bill.billingPeriod}</strong>
          </div>
          <div>
            <span>Due Date</span>
            <strong>{bill.dueDate}</strong>
          </div>
          <div>
            <span>Units Consumed</span>
            <strong>{bill.units} kWh</strong>
          </div>
          <div>
            <span>Payment Status</span>
            <strong>{bill.status}</strong>
          </div>
        </div>
      </section>

      <div className="bill-details-actions">
        <button onClick={() => window.print()}>Print Bill</button>
        {bill.status !== "Paid" && (
          <button className="bill-pay-button" onClick={() => alert("Payment integration will be added later.")}>
            Pay Now
          </button>
        )}
      </div>

      <p className="bill-demo-note">
        Sample bill information for the Phase 1 prototype.
      </p>
    </div>
  );
}

export default BillDetails;
