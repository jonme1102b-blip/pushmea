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

  const jobs =
    await (
      await fetch(
        "https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/get-all-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      )
    ).json();

  const selectedJob =
    jobs.find(
      x =>
        String(
          x.job_id
        ) ===
        String(
          jobId
        )
    );

  if (!selectedJob) {
    alert("Job not found.");
    return;
  }

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
            selectedJob.author_id,

          provider_id:
            providerId,

          sender_id:
            providerId,

          message_text:
            bidMessage
        })
    }
  );

  loadMyMessages();
}

async function sendReply(
  messageId,
  jobId,
  customerId,
  providerId
) {

  const reply =
    document.getElementById(
      `reply-${messageId}`
    ).value;

  if (!reply) {

    alert(
      "Please enter a reply."
    );

    return;
  }

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
            localStorage.getItem(
              "user_id"
            ),

          message_text:
            reply
        })
    }
  );

  loadMyMessages();
}

async function closeDeal(
  messageId,
  jobId,
  customerId,
  providerId
) {

  const reply =
    document.getElementById(
      `reply-${messageId}`
    ).value;

  const amount =
    document.getElementById(
      `amount-${messageId}`
    ).value;

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

  document
    .querySelectorAll(
      ".payment-region"
    )
    .forEach(
      x =>
        x.innerHTML = ""
    );

  document.getElementById(
    `payment-${messageId}`
  ).innerHTML = `

    <hr>

    <button
      onclick="startPayment()"
    >
      Pay
    </button>
  `;
}

async function loadMyMessages() {

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
              localStorage.getItem(
                "user_id"
              )
          })
      }
    );

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
          localStorage.getItem(
            "user_id"
          )
        );

      html += `

<div>

<p>
<strong>
${
isSent
? "Sent"
: "Received"
}
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
id="reply-${message.message_id}"
rows="4"
cols="60"
></textarea>

<br><br>

<button
onclick='sendReply(
"${message.message_id}",
"${message.job_id}",
"${message.customer_id}",
"${message.provider_id}"
)'
>
Reply
</button>

<br><br>

<input
id="amount-${message.message_id}"
type="number"
placeholder="Agreed amount"
>

<button
onclick='closeDeal(
"${message.message_id}",
"${message.job_id}",
"${message.customer_id}",
"${message.provider_id}"
)'
>
Close Deal
</button>

<div
class="payment-region"
id="payment-${message.message_id}"
></div>

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
