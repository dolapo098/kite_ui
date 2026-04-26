export function PayoutPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h3>Payout</h3>
        <p>Send a simulated payout to a local bank account.</p>
      </header>

      <article className="card form-card">
        <label className="field">
          <span>Source Currency</span>
          <select>
            <option>NGN</option>
            <option>KES</option>
          </select>
        </label>

        <label className="field">
          <span>Amount</span>
          <input type="number" placeholder="0.00" min="0" step="0.01" />
        </label>

        <label className="field">
          <span>Account Number</span>
          <input type="text" placeholder="0123456789" />
        </label>

        <label className="field">
          <span>Bank Code</span>
          <input type="text" placeholder="Bank code" />
        </label>

        <label className="field">
          <span>Account Name</span>
          <input type="text" placeholder="Recipient full name" />
        </label>

        <button type="button" className="primary-btn">
          Submit Payout
        </button>
      </article>
    </div>
  );
}
