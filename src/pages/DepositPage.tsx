export function DepositPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h3>Deposit</h3>
        <p>Simulate an inbound wallet funding event.</p>
      </header>

      <article className="card form-card">
        <label className="field">
          <span>Currency</span>
          <select>
            <option>USD</option>
            <option>GBP</option>
            <option>EUR</option>
            <option>NGN</option>
            <option>KES</option>
          </select>
        </label>

        <label className="field">
          <span>Amount</span>
          <input type="number" placeholder="0.00" min="0" step="0.01" />
        </label>

        <button type="button" className="primary-btn">
          Create Deposit
        </button>
      </article>
    </div>
  );
}
