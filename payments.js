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
      "https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/create-paypal-order",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
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
      "PayPal order failed: " +
      error.error
    );

    return;
  }

  const data =
    await response.json();

  localStorage.setItem(
    "paypal_order_id",
    data.order_id
  );

  window.location.href =
    data.approve_url;
}
