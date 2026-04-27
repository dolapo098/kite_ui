export interface AdminMarkPayoutFailedFormErrors {
  payout_id?: string;
  failure_reason?: string;
}

export function validateAdminMarkPayoutFailedForm(
  payoutId: string,
  failureReason: string,
): AdminMarkPayoutFailedFormErrors {
  const errors: AdminMarkPayoutFailedFormErrors = {};

  if (!payoutId.trim()) {
    errors.payout_id =
      "Create a successful payout on the left first. Mark failed uses that payout (no ID shown here).";
  }

  if (!failureReason.trim()) {
    errors.failure_reason = "Failure reason is required";
  }

  return errors;
}
