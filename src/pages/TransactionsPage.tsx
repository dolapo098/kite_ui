import { useState } from "react";
import ReactPaginate from "react-paginate";
import {
  TRANSACTION_STATUS_COMPLETED,
  TRANSACTION_STATUS_FAILED,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_STATUS_SUCCESSFUL,
} from "../constants/transactions";
import {
  getTransactionsErrorMessage,
  TRANSACTIONS_PAGE_SIZE,
  useTransactionsQuery,
} from "../hooks/useTransactionsQuery";
import type { TransactionItemResponse } from "../types";
import { formatTransactionAmountSummary, formatTransactionDate } from "../utils/formatTransaction";

function getStatusClass(status: string): string {
  const base = "status-chip";
  const isSuccess = status === TRANSACTION_STATUS_SUCCESSFUL || status === TRANSACTION_STATUS_COMPLETED;
  const isPending = status === TRANSACTION_STATUS_PROCESSING || status === TRANSACTION_STATUS_PENDING;
  const isFailed = status === TRANSACTION_STATUS_FAILED;
  const modifier = isSuccess ? " success" : isPending ? " warning" : isFailed ? " error" : "";

  return `${base}${modifier}`;
}

export function TransactionsPage() {
  const [page, setPage] = useState(1);
  const limit = TRANSACTIONS_PAGE_SIZE;
  const transactionsQuery = useTransactionsQuery(page, limit);

  const showTransactionsError = transactionsQuery.isError;
  const showLoadingRow = transactionsQuery.isPending && !transactionsQuery.data;
  const items = transactionsQuery.data?.items ?? [];
  const pagination = transactionsQuery.data?.pagination;
  const showEmptyRow =
    Boolean(transactionsQuery.data) && items.length === 0 && !showLoadingRow && !showTransactionsError;
  const showDataRows =
    Boolean(transactionsQuery.data) && items.length > 0 && !showTransactionsError;
  const showPagination =
    Boolean(pagination) && (pagination?.total_pages ?? 0) > 1 && !showTransactionsError;

  function handlePageChange(selectedZeroBased: number): void {
    setPage(selectedZeroBased + 1);
  }

  function handleRetryTransactions(): void {
    void transactionsQuery.refetch();
  }

  return (
    <div className="page">
      <header className="page-header">
        <h3>Transaction history</h3>
        <p>Unified, paginated feed of deposits, conversions, and payouts (newest first).</p>
      </header>

      {showTransactionsError ? (
        <>
          <p className="error-text">{getTransactionsErrorMessage(transactionsQuery.error)}</p>
          <button type="button" className="primary-btn" onClick={handleRetryTransactions}>
            Retry
          </button>
        </>
      ) : null}

      <article className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {showLoadingRow ? (
              <tr>
                <td colSpan={4}>Loading…</td>
              </tr>
            ) : null}

            {showEmptyRow ? (
              <tr>
                <td colSpan={4} className="muted">
                  No transactions yet.
                </td>
              </tr>
            ) : null}

            {showDataRows
              ? items.map((row: TransactionItemResponse) => (
                  <tr key={row.id}>
                    <td className="transaction-type">{row.type}</td>
                    <td>
                      <span className={getStatusClass(row.status)}>{row.status}</span>
                    </td>
                    <td>{formatTransactionAmountSummary(row)}</td>
                    <td>{formatTransactionDate(row.created_at)}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>

        {showPagination ? (
          <div className="pagination-wrap">
            <ReactPaginate
              pageCount={pagination?.total_pages ?? 0}
              forcePage={page - 1}
              onPageChange={({ selected }) => {
                handlePageChange(selected);
              }}
              containerClassName="pagination"
              activeClassName="active"
              disabledClassName="disabled"
            />
          </div>
        ) : null}
      </article>
    </div>
  );
}
