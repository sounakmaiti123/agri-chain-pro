/* =====================================================
   AUTH REDIRECT (PROTECT INDEX)
===================================================== */
// App initialized
// ================= PAGE LOAD ANIMATION =================
window.addEventListener("load", () => {
  const page = document.querySelector(".page");
  if (page) {
    page.classList.add("active");
  }
});
// ================= REMOVE LOADER =================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s ease";

      setTimeout(() => loader.remove(), 500);
    }
  }, 1000); // delay for effect
});
// Auth redirect handled in setupUserUI

/* =====================================================
   GLOBAL DASHBOARD SWITCH (MUST BE GLOBAL)
===================================================== */
window.switchRole = function (role) {
  console.log("Switching role:", role);

  // Sidebar active
  document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
  const sidebarMap = { farmer: 0, transporter: 1, vendor: 2 };
  document.querySelectorAll(".menu-section")[0]?.querySelectorAll(".menu-item")[sidebarMap[role]]?.classList.add("active");

  // Navbar active
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
  document.querySelectorAll(".nav-link")[sidebarMap[role]]?.classList.add("active");

  // Hero tabs active
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab")[sidebarMap[role]]?.classList.add("active");

  // Hide all dashboards
  document.querySelectorAll(".dashboard").forEach(d => d.classList.remove("active-dashboard"));

  // Show selected
  document.getElementById(role + "-dashboard")?.classList.add("active-dashboard");

  // Scroll into view
  setTimeout(() => {
    document.querySelector(".dashboard-container")?.scrollIntoView({ behavior: "smooth" });
  }, 120);
};

/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", function () {

  /* ================= THEME TOGGLE ================= */
  const toggleBtn = document.getElementById("themeToggle");

  if (toggleBtn) {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light");
      toggleBtn.textContent = "☀️";
    }

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      toggleBtn.textContent = isLight ? "☀️" : "🌙";
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  }

  /* ================= NAVBAR LOGIN STATE ================= */
  const authActions = document.getElementById("authActions");
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const userName = localStorage.getItem("userName");
  const userPic = localStorage.getItem("userPicture");

  if (authActions) {
    if (!isLoggedIn) {
      authActions.innerHTML = `
        <button class="start-btn" onclick="goToLogin()">Login</button>
      `;
    } else {
      authActions.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          ${userPic ? `<img src="${userPic}" style="width:32px;height:32px;border-radius:50%">` : ""}
          <span>${userName || "User"}</span>
          <button class="icon-btn" onclick="logout()">Logout</button>
        </div>
      `;
    }
  }

});

/* =====================================================
   GOOGLE MAP NAVIGATION (NO API KEY)
===================================================== */
const navigationRoutes = {
  RT001: { origin: "22.9025,88.3967", destination: "22.5675,88.3693" },
  RT002: { origin: "23.1765,88.5580", destination: "22.5726,88.3639" },
  RT003: { origin: "23.4088,88.5014", destination: "22.5726,88.3639" }
};

window.navigateRoute = function (routeId) {
  const route = navigationRoutes[routeId];
  if (!route) return;

  const url =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${route.origin}` +
    `&destination=${route.destination}` +
    `&travelmode=driving`;

  window.open(url, "_blank");
};

/* =====================================================
   AUTH PAGE LOGIC
===================================================== */
window.toggleAuth = function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const title = document.getElementById("authTitle");
  const sub = document.getElementById("authSub");
  const toggleText = document.getElementById("toggleText");

  if (!loginForm || !signupForm) return;

  const isLogin = !loginForm.classList.contains("hidden");

  loginForm.classList.toggle("hidden");
  signupForm.classList.toggle("hidden");

  title.textContent = isLogin ? "Create Account" : "Welcome Back";
  sub.textContent = isLogin ? "Join AgriChain Pro today" : "Sign in to access your dashboard";
  toggleText.textContent = isLogin ? "Already have an account?" : "Don’t have an account?";
};



/* Redirect helpers */
function goToLogin() {
  window.location.href = "auth.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "auth.html";
}

/* Navbar shadow */
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});
/* =====================================================
   VENDOR REVENUE CHART
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const ctx = document.getElementById("vendorRevenueChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Revenue ($)",
        data: [12000, 18000, 15000, 22000, 26000, 30000],
        borderColor: "#38b87c",
        backgroundColor: "rgba(56,184,124,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#38b87c"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body)
                    .getPropertyValue('--text-main')
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body)
                    .getPropertyValue('--text-muted')
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.body)
                    .getPropertyValue('--text-muted')
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
      }
    }
  });

});
/* =====================================================
   VENDOR PROFIT MARGIN CHART
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const ctx2 = document.getElementById("vendorProfitChart");
  if (!ctx2) return;

  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Wheat", "Rice", "Corn", "Soybean"],
      datasets: [{
        label: "Profit Margin %",
        data: [18, 22, 14, 26],
        backgroundColor: [
          "#38b87c",
          "#4da3ff",
          "#f0ad4e",
          "#9b59b6"
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text-main')
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text-muted')
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.body)
              .getPropertyValue('--text-muted')
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
      }
    }
  });

});
/* ================= SCROLL REVEAL JS ================= */

const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  revealElements.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 120) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
/* =====================================================
   FINAL AUTH HANDLER (CLEAN & WORKING)
===================================================== */

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    console.log("Login triggered:", email);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {

  // save user
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("user", JSON.stringify(data));

  // show success animation
  document.getElementById("successOverlay").classList.remove("hidden");

  setTimeout(() => {

    document.getElementById("successOverlay").classList.add("hidden");
    document.getElementById("redirectLoader").classList.remove("hidden");

    setTimeout(() => {
      window.location.replace("/"); // dashboard
    }, 1500);

  }, 1200);

} else {
        alert(data.error || "Invalid credentials ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  });
}


// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");

    console.log("Signup triggered:", name, email);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (res.ok) {
        alert("Signup successful 🎉");

        // 🔥 REDIRECT TO LOGIN PAGE
        window.location.replace("/login");

      } else {
        alert(data.error || "Signup failed ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  });
}


// ================= PROTECT DASHBOARD =================
// Auth redirect handled in setupUserUI
// ================= SHOW USER INFO =================
const userData = JSON.parse(localStorage.getItem("user"));

if (userData) {
  const userInfo = document.getElementById("userInfo");

  if (userInfo) {
    userInfo.innerText = `👋 Welcome, ${userData.name} (${userData.role})`;
  }
}
// ================= NAV BUTTON ACTIONS =================
document.querySelector(".ai-btn")?.addEventListener("click", () => {
  alert("AI Assistant Coming Soon 🤖");
});

document.querySelector(".pro-btn")?.addEventListener("click", () => {
  openPlusModal();
});
// ================= NAV ACTIVE SWITCH =================
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});
// switchRole is defined via window.switchRole above
// goToLogin/goToSignup defined above
/* ================= PARTICLE GENERATOR ================= */

const particleContainer = document.querySelector(".particles");

if (particleContainer) {
  for (let i = 0; i < 40; i++) {
    const span = document.createElement("span");

    span.style.left = Math.random() * 100 + "vw";
    span.style.animationDuration = (5 + Math.random() * 5) + "s";
    span.style.animationDelay = Math.random() * 5 + "s";

    particleContainer.appendChild(span);
  }
}
function setupUserUI() {

  const authContainer = document.getElementById("authActions");
  if (!authContainer) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  // 🔥 CLEAR FIRST
  authContainer.innerHTML = "";

  // ❌ NOT LOGGED IN
  if (!isLoggedIn || !user) {
    authContainer.innerHTML = `
      <button onclick="window.location.href='/auth.html'" class="nav-btn login-btn">Login</button>
      <button class="nav-btn pro-btn" onclick="openPlusModal()">✨ Get Plus</button>
    `;
    return;
  }

  // ✅ LOGGED IN (Avatar + Get Plus)
  authContainer.innerHTML = `
    <div class="user-menu">

      <div class="user-avatar" onclick="toggleDropdown()">
       ${user.profileImage 
  ? `<img src="${user.profileImage}" class="avatar-img">` 
  : (user.name ? user.name.charAt(0).toUpperCase() : "U")
}
      </div>

      <div class="dropdown hidden" id="userDropdown">
        <p><strong>${user.name || "User"}</strong></p>
        <p style="font-size:12px;color:#aaa;">${user.email}</p>
        <label class="upload-btn">
  📸 Upload Photo
  <input type="file" accept="image/*" onchange="uploadProfileImage(event)" hidden>
</label>
        <hr>
        <button onclick="logout()">Logout</button>
      </div>

    </div>

    <button class="nav-btn pro-btn" onclick="openPlusModal()">✨ Get Plus</button>
  `;
}
document.addEventListener("DOMContentLoaded", () => {
  setupUserUI();
});
function toggleDropdown() {
  const dropdown = document.getElementById("userDropdown");
  dropdown.classList.toggle("hidden");
}
function logout() {

  const overlay = document.getElementById("logoutOverlay");
  if (overlay) overlay.classList.remove("hidden");

  document.body.classList.add("fade-out");

  setTimeout(() => {
    localStorage.clear();
  }, 400);

  setTimeout(() => {
    window.location.href = "/auth.html";
  }, 1200);
}
// ================= PROFILE IMAGE UPLOAD =================
async function uploadProfileImage(event) {

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async function(e) {

    const base64Image = e.target.result;

    let user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/upload-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          image: base64Image
        })
      });

      const data = await res.json();

      if (res.ok) {

        // 🔥 update local user
        user.profileImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));

        setupUserUI(); // refresh avatar instantly

        alert("Profile updated ✅");

      } else {
        alert(data.error || "Upload failed ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  reader.readAsDataURL(file);
}

// ================= GET PLUS MODAL =================
function openPlusModal() {
  document.getElementById('plusModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePlusModal() {
  document.getElementById('plusModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePlusModal();
});

// Billing Toggle
let isYearly = false;
function toggleBilling() {
  isYearly = !isYearly;
  const knob = document.getElementById('toggleKnob');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const yearlyLabel = document.getElementById('yearlyLabel');

  knob.classList.toggle('yearly', isYearly);
  monthlyLabel.classList.toggle('active', !isYearly);
  yearlyLabel.classList.toggle('active', isYearly);

  // Animate price change
  document.querySelectorAll('.amount').forEach(el => {
    const target = isYearly ? el.dataset.yearly : el.dataset.monthly;
    animatePrice(el, parseInt(target));
  });
}

function animatePrice(el, target) {
  const current = parseInt(el.textContent);
  const diff = target - current;
  const steps = 15;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const progress = step / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(current + diff * eased);
    if (step >= steps) {
      el.textContent = target;
      clearInterval(interval);
    }
  }, 20);
}
