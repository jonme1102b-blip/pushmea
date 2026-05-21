const appliedJobId =
  localStorage.getItem("applied_job_id");

if (appliedJobId) {

  document.getElementById(
    "bid-region"
  ).innerHTML = `

    <h2>Bid for Job ${appliedJobId}</h2>

    <textarea
      id="bid-message"
      rows="10"
      cols="80"
      placeholder="Write your bid message here..."
    ></textarea>

    <br><br>

    <button onclick="submitBid()">
      Bid for Job ${appliedJobId}
    </button>

    <hr>
  `;
}

async function submitBid() {

  const bidMessage =
    document.getElementById(
      "bid-message"
    ).value;

  if (!bidMessage) {
    alert("Please enter a message.");
    return;
  }

  const jobId =
    localStorage.getItem(
      "applied_job_id"
    );

  const providerId =
    localStorage.getItem(
      "user_id"
    );

  const jobsResponse =
    await fetch(
      "https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/get-all-jobs",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        }
      }
    );

  const jobs =
    await jobsResponse.json();

  const selectedJob =
    jobs.find(
      job =>
        String(
          job.job_id
        ) ===
        String(jobId)
    );

  if (!selectedJob) {
    alert(
      "Job not found."
    );
    return;
  }

  const customerId =
    selectedJob.author_id;

  const response =
    await fetch(
      "https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/submit-message",
      {
        method: "POST",
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
            sender_id:
              providerId,
            message_text:
              bidMessage
          })
      }
    );

  if (!response.ok) {

    const errorData =
      await response.json();

    alert(
      "Message failed: " +
      errorData.error
    );

    return;
  }

  alert(
    "Bid submitted."
  );

  localStorage.removeItem(
    "applied_job_id"
  );

  document.getElementById(
    "bid-region"
  ).innerHTML = "";

  loadMyMessages();
}

async function sendReply(
  jobId,
  customerId,
  providerId
) {

  const userId =
    localStorage.getItem(
      "user_id"
    );

  const replyBox =
    document.getElementById(
      `reply-${jobId}`
    );

  const replyText =
    replyBox.value;

  if (!replyText) {
    alert(
      "Please enter a reply."
    );
    return;
  }

  const response =
    await fetch(
      "https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/submit-message",
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
            sender_id:
              userId,
            message_text:
              replyText
          })
      }
    );

  if (!response.ok) {

    const errorData =
      await response.json();

    alert(
      "Reply failed: " +
      errorData.error
    );

    return;
  }

  alert(
    "Reply sent."
  );

  replyBox.value = "";

  loadMyMessages();
}

async function closeDeal(
  jobId,
  customerId,
  providerId
) {

  const amountBox =
    document.getElementById(
      `amount-${jobId}`
    );

  const replyBox =
    document.getElementById(
      `reply-${jobId}`
    );

  const amount =
    amountBox.value;

  const reply =
    replyBox.value;

  if (!reply) {

    alert(
      "Please write a reply before closing the deal."
    );

    return;
  }

  if (!amount) {

    alert(
      "Please enter an agreed amount."
    );

    return;
  }

  localStorage.setItem(
    "closing_job_id",
    jobId
  );

  localStorage.setItem(
    "closing_customer_id",
    customerId
  );

  localStorage.setItem(
    "closing_provider_id",
    providerId
  );

  localStorage.setItem(
    "closing_reply",
    reply
  );

  localStorage.setItem(
    "closing_amount",
    amount
  );

  document.getElementById(
    "payment-region"
  ).innerHTML = `

    <hr>

    <button>
      Pay
    </button>
  `;

  document.getElementById(
    "payment-region"
  ).style.display =
    "block";
}

async function loadMyMessages() {

  const userId =
    localStorage.getItem(
      "user_id"
    );

  const response =
    await fetch(
      "https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/get-my-messages",
      {
        method:
          "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body:
          JSON.stringify({
            user_id:
              userId
          })
      }
    );

  if (!response.ok) {

    const errorData =
      await response.json();

    alert(
      "Messages failed: " +
      errorData.error
    );

    return;
  }

  const messages =
    await response.json();

  let html =
    "";

  messages.forEach(
    message => {

      const isSent =
        String(
          message.sender_id
        ) ===
        String(
          userId
        );

      const direction =
        isSent
          ? "Sent"
          : "Received";

      html += `
        <div>

        <p>
        <strong>
        ${direction}
        </strong>
        </p>

        <p>
        <strong>
        Job ID:
        </strong>
        ${message.job_id}
        </p>

        <p>
        <strong>
        Message:
        </strong>
        ${message.message_text}
        </p>

        <p>
        <strong>
        Sent:
        </strong>
        ${message.created_at}
        </p>
      `;

      if (!isSent) {

        html += `

          <textarea
            id="reply-${message.job_id}"
            rows="4"
            cols="60"
            placeholder="Write reply..."
          ></textarea>

          <br><br>

          <button
            onclick='sendReply(
            "${message.job_id}",
            "${message.customer_id}",
            "${message.provider_id}"
            )'
          >
            Reply
          </button>

          <br><br>

          <input
            id="amount-${message.job_id}"
            type="number"
            placeholder="Agreed amount"
          >

          <button
            onclick='closeDeal(
            "${message.job_id}",
            "${message.customer_id}",
            "${message.provider_id}"
            )'
          >
            Close Deal
          </button>
        `;
      }

      html += `
        <hr>
        </div>
      `;
    }
  );

  document.getElementById(
    "messages-output"
  ).innerHTML =
    html;
}
