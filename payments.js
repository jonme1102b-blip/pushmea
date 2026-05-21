function startPayment() {

  const jobId =
    localStorage.getItem(
      "closing_job_id"
    );

  const customerId =
    localStorage.getItem(
      "closing_customer_id"
    );

  const providerId =
    localStorage.getItem(
      "closing_provider_id"
    );

  const reply =
    localStorage.getItem(
      "closing_reply"
    );

  const amount =
    localStorage.getItem(
      "closing_amount"
    );

  if (
    !jobId ||
    !customerId ||
    !providerId ||
    !reply ||
    !amount
  ) {

    alert(
      "Payment information missing."
    );

    return;
  }

  alert(
    "Payment flow not connected yet."
  );
}
