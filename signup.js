async function signup() {
  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !username || !role || !email || !password) {
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
      username: username,
      role: role,
      email: email,
      password: password
    })
  });

  if (!response.ok) {
    return;
  }

  const loginResponse = await fetch("https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  if (!loginResponse.ok) {
    alert("Automatic login failed after signup.");
    return;
  }

  const data = await loginResponse.json();

  alert("welcome " + role);

  localStorage.setItem("selectedRole", data.role);
  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("access_token", data.access_token);

  window.location.href = "my-profile.html";
}

async function login() {
  const username = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    alert("Please fill in all login fields.");
    return;
  }

  const response = await fetch("https://ofxmxfwibvhvlhgirxfd.supabase.co/functions/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  if (!response.ok) {
    const errorData = await response.json();

    alert("Login failed: " + errorData.error);
    return;
  }

  const data = await response.json();

  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("selectedRole", data.role);
  localStorage.setItem("access_token", data.access_token);

  window.location.href = "my-profile.html";
}
