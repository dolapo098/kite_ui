const sampleRows = [
  { id: "TX-9012", type: "deposit", status: "successful", amount: "250.00 USD", when: "Today, 09:31" },
  { id: "TX-9011", type: "conversion", status: "successful", amount: "120.00 USD -> 183,540.00 NGN", when: "Today, 08:10" },
  { id: "TX-9010", type: "payout", status: "processing", amount: "40,000.00 NGN", when: "Yesterday, 18:22" },
];

function getStatusClass(status: string): string {
  const base = "status-chip";
  const isSuccess = status === "successful";
  const isPending = status === "processing" || status === "pending";
  const isFailed = status === "failed";
  const modifier = isSuccess ? " success" : isPending ? " warning" : isFailed ? " error" : "";

  return `${base}${modifier}`;
}

export function TransactionsPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h3>Transactions</h3>
        <p>Unified activity feed for deposits, conversions, and payouts.</p>
      </header>

      <article className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Type</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.type}</td>
                <td>
                  <span className={getStatusClass(row.status)}>{row.status}</span>
                </td>
                <td>{row.amount}</td>
                <td>{row.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </div>
  );
}
