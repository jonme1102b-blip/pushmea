async function startPayment() {

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

  const amount =
    localStorage.getItem(
      "closing_amount"
    );

  if (
    !jobId ||
    !customerId ||
    !providerId ||
    !amount
  ) {

    alert(
      "Payment information missing."
    );

    return;
  }

  const response =
    await fetch(
      "https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/create-deal",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({

            job_id:
              jobId,

            customer_id:
              customerId,

            provider_id:
              providerId,

            amount:
              amount
          })
      }
    );

  if (
    !response.ok
  ) {

    const error =
      await response.json();

    alert(
      "Deal failed: " +
      error.error
    );

    return;
  }

  alert(
    "Deal created."
  );

  localStorage.removeItem(
    "closing_job_id"
  );

  localStorage.removeItem(
    "closing_customer_id"
  );

  localStorage.removeItem(
    "closing_provider_id"
  );

  localStorage.removeItem(
    "closing_reply"
  );

  localStorage.removeItem(
    "closing_amount"
  );

  location.reload();
}
