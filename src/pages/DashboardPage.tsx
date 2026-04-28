import { getWalletBalancesErrorMessage, useWalletBalancesQuery, WALLET_CURRENCIES } from "../hooks/useWalletBalancesQuery";
import { formatBalanceCentsForDisplay } from "../utils/formatBalance";

export function DashboardPage() {
  const balancesQuery = useWalletBalancesQuery();

  const showBalancesErrorBlock = balancesQuery.isError;
  const showBalancesLoading = balancesQuery.isPending || balancesQuery.isFetching;

  function handleRetryBalances(): void {
    void balancesQuery.refetch();
  }

  return (
    <div className="page">
      <header className="page-header">
        <h3>Dashboard</h3>
        <p>View balances by currency and recent activity.</p>
      </header>

      {showBalancesErrorBlock ? (
        <>
          <p className="error-text">{getWalletBalancesErrorMessage(balancesQuery.error)}</p>
          <button type="button" className="primary-btn" onClick={handleRetryBalances}>
            Retry balances
          </button>
        </>
      ) : null}

      <div className="card-grid five-col">
        {WALLET_CURRENCIES.map((currency, index) => (
          <article key={currency} className="card">
            <p className="card-label">{currency} Balance</p>
            <p className="card-value">
              {showBalancesLoading
                ? "…"
                : balancesQuery.data?.[index]
                  ? balancesQuery.data[index].balance ??
                    formatBalanceCentsForDisplay(
                      balancesQuery.data[index].balance_cents,
                      balancesQuery.data[index].currency_code,
                    )
                  : "—"}
            </p>
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
