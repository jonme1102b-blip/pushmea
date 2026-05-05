async function signup() {
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !role || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const response = await fetch("https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      role: role,
      email: email,
      password: password
    })
  });

  if (!response.ok) {
    return;
  }

  alert("welcome " + role);

  if (role === "provider") {
    window.location.href = "profiles/provider.html";
  }

  if (role === "agent") {
    window.location.href = "profiles/agent.html";
  }

  if (role === "customer") {
    window.location.href = "profiles/customer.html";
  }
}
