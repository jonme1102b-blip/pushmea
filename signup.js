async function signup() {
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !role || !email || !password) {
    alert("Please fill in all signup fields.");
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

  localStorage.setItem("selectedRole", role);

  window.location.href = "my-profile.html";
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill in all login fields.");
    return;
  }

  const response = await fetch("https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  if (!response.ok) {
    alert("Login failed.");
    return;
  }

  const data = await response.json();

  localStorage.setItem("selectedRole", data.role);

  window.location.href = "my-profile.html";
}
