export function ConvertPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h3>Convert</h3>
        <p>Generate an FX quote and execute before it expires.</p>
      </header>

      <div className="split-grid">
        <article className="card form-card">
          <p className="card-label">Step 1: Get Quote</p>
          <label className="field">
            <span>From</span>
            <select>
              <option>USD</option>
              <option>GBP</option>
              <option>EUR</option>
              <option>NGN</option>
              <option>KES</option>
            </select>
          </label>

          <label className="field">
            <span>To</span>
            <select>
              <option>NGN</option>
              <option>KES</option>
              <option>USD</option>
              <option>GBP</option>
              <option>EUR</option>
            </select>
          </label>

          <label className="field">
            <span>Amount In</span>
            <input type="number" placeholder="0.00" min="0" step="0.01" />
          </label>

          <button type="button" className="primary-btn">
            Get Quote
          </button>
        </article>

        <article className="card">
          <p className="card-label">Step 2: Execute Quote</p>
          <p className="muted">Quote details, fee, and expiry countdown will show here.</p>
          <button type="button" className="primary-btn" disabled>
            Confirm Conversion
          </button>
        </article>
      </div>
    </div>
  );
}
