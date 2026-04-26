export function DashboardPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h3>Dashboard</h3>
        <p>View balances by currency and recent activity.</p>
      </header>

      <div className="card-grid five-col">
        {["USD", "GBP", "EUR", "NGN", "KES"].map((currency) => (
          <article key={currency} className="card">
            <p className="card-label">{currency} Balance</p>
            <p className="card-value">0.00</p>
          </article>
        ))}
      </div>

      <article className="card">
        <p className="card-label">Recent Transactions</p>
        <p className="muted">Latest wallet activity will appear here.</p>
      </article>
    </div>
  );
}
