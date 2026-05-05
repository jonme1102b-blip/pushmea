const permissions = {
  customer: {
    "my-profile.html": true,
    "my-jobs.html": true,
    "post-a-job.html": true,
    "allocate-jobs.html": false,
    "available-jobs.html": false,
    "messages.html": true,
    "settings.html": true
  },
  provider: {
    "my-profile.html": true,
    "my-jobs.html": true,
    "post-a-job.html": false,
    "allocate-jobs.html": false,
    "available-jobs.html": true,
    "messages.html": true,
    "settings.html": true
  },
  agent: {
    "my-profile.html": true,
    "my-jobs.html": true,
    "post-a-job.html": true,
    "allocate-jobs.html": true,
    "available-jobs.html": true,
    "messages.html": true,
    "settings.html": true
  }
};

function getCurrentRole() {
  return localStorage.getItem("selectedRole") || "customer";
}

function setCurrentRole(role) {
  localStorage.setItem("selectedRole", role);
}

function handleRestrictedPage(pageName, role) {
  const allowed = permissions[role][pageName];

  if (!allowed) {
    window.location.href = `restricted.html?page=${pageName}&role=${role}`;
  } else {
    window.location.href = pageName;
  }
}

function setupNavigation() {
  const role = getCurrentRole();
  const roleDropdown = document.getElementById("role-dropdown");

  if (roleDropdown) {
    roleDropdown.value = role;

    roleDropdown.addEventListener("change", function () {
      setCurrentRole(this.value);
      window.location.href = "my-profile.html";
    });
  }

  document.querySelectorAll("[data-page]").forEach(function (link) {
    const pageName = link.getAttribute("data-page");
    const allowed = permissions[role][pageName];

    if (!allowed) {
      link.classList.add("disabled");
    }

    link.addEventListener("click", function (event) {
      event.preventDefault();
      handleRestrictedPage(pageName, role);
    });
  });
}

document.addEventListener("DOMContentLoaded", setupNavigation);
