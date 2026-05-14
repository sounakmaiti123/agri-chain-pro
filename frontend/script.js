/* =====================================================
   AUTH REDIRECT (PROTECT INDEX)
===================================================== */
// App initialized

// ================= ROUTE-BASED AUTH LOGIC =================
// '/' = always logged-out dashboard (Login / Sign Up / Get Plus)
// '/dashboard' = logged-in dashboard (Profile avatar)
const currentPath = window.location.pathname;

if (currentPath === '/' && !document.body.classList.contains('auth-page')) {
  // Root path: always show logged-out mode
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('user');
}

if (currentPath === '/dashboard') {
  // Dashboard path: require login
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.replace('/');
  }
}

// ================= PAGE LOAD ANIMATION =================
window.addEventListener("load", () => {
  const page = document.querySelector(".page");
  if (page) {
    page.classList.add("active");
  }
});
// Auth redirect handled in setupUserUI

/* =====================================================
   GLOBAL DASHBOARD SWITCH (MUST BE GLOBAL)
===================================================== */
window.switchRole = function (role) {
  console.log("Switching role:", role);

  // Sidebar active
  document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
  const sidebarMap = { farmer: 0, transporter: 1, vendor: 2, "plus-core": 3 };
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

// Auto-show signup form if URL has #signup hash
if (window.location.hash === '#signup' && document.body.classList.contains('auth-page')) {
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm && !loginForm.classList.contains("hidden")) {
      window.toggleAuth();
    }
  });
}


/* Redirect helpers */
function goToLogin() {
  window.location.href = "/login";
}

function logout() {
  localStorage.clear();
  window.location.href = "/";
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

  // Show professional loading sequence
  document.getElementById("successOverlay").classList.remove("hidden");

  // Animate through progress steps
  const steps = document.querySelectorAll('.login-step');
  const progressBar = document.getElementById('loginProgressBar');
  const percentText = document.getElementById('loginPercent');
  const statusLabels = ['Verifying...', 'Loading...', 'Syncing...', 'Preparing...'];
  const completeLabels = ['Verified', 'Loaded', 'Synced', 'Ready'];
  let currentPercent = 0;

  function animateStep(index) {
    if (index >= steps.length) {
      // All steps done — redirect
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 600);
      return;
    }

    const step = steps[index];
    const statusEl = step.querySelector('.login-step-status');

    // Activate current step
    step.classList.add('active');
    statusEl.textContent = statusLabels[index];

    // Animate progress
    const targetPercent = Math.round(((index + 1) / steps.length) * 100);
    const percentInterval = setInterval(() => {
      currentPercent++;
      if (currentPercent >= targetPercent) {
        currentPercent = targetPercent;
        clearInterval(percentInterval);
      }
      progressBar.style.width = currentPercent + '%';
      percentText.textContent = currentPercent + '%';
    }, 20);

    // Complete after delay
    setTimeout(() => {
      step.classList.remove('active');
      step.classList.add('complete');
      statusEl.textContent = completeLabels[index];

      // Next step
      setTimeout(() => animateStep(index + 1), 200);
    }, 700 + Math.random() * 300);
  }

  // Start step animation after checkmark draws
  setTimeout(() => animateStep(0), 1400);


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
        window.location.replace("/");

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
      <button onclick="window.location.href='/login'" class="nav-btn login-btn">Login</button>
      <button onclick="window.location.href='/login#signup'" class="nav-btn signup-btn">Sign Up</button>
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
    window.location.href = "/";
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
let plusCommodityChart = null;
let plusROIChart = null;

function openPlusModal() {
  document.getElementById('plusModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Initialize charts after modal layout has fully stabilized during fade-in transition
  setTimeout(() => {
    initPlusCharts();
    // Force resize to ensure canvases fill containers beautifully
    if (plusCommodityChart) plusCommodityChart.resize();
    if (plusROIChart) plusROIChart.resize();
  }, 380);
}

function closePlusModal() {
  document.getElementById('plusModal').classList.add('hidden');
  document.body.style.overflow = '';

  // Destroy charts to prevent canvas reuse errors
  if (plusCommodityChart) { plusCommodityChart.destroy(); plusCommodityChart = null; }
  if (plusROIChart) { plusROIChart.destroy(); plusROIChart = null; }
}

function activateProPlus() {
  closePlusModal();
  // Automatically switch view to the newly built Pro+ Enterprise Hub
  switchRole('plus-core');
  
  // Show a premium visual confirmation alert
  setTimeout(() => {
    alert("👑 AgriChain Pro+ Enterprise Core Unlocked!\n\nAll real-time platform telemetry modules, multi-spectral satellite sensors, and international arbitrage smart dispatch pipelines are now fully initialized.");
  }, 400);
}

function initPlusCharts() {
  // Commodity Price Trends Chart
  const commodityCtx = document.getElementById('plusCommodityChart');
  if (commodityCtx && !plusCommodityChart) {
    plusCommodityChart = new Chart(commodityCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Wheat',
            data: [2.85, 3.10, 3.05, 3.20],
            borderColor: '#00ffaa',
            backgroundColor: 'rgba(0,255,170,0.08)',
            fill: true, tension: 0.4, pointRadius: 4,
            pointBackgroundColor: '#00ffaa', borderWidth: 2
          },
          {
            label: 'Rice',
            data: [2.60, 2.75, 2.85, 2.90],
            borderColor: '#4da3ff',
            backgroundColor: 'rgba(77,163,255,0.06)',
            fill: true, tension: 0.4, pointRadius: 4,
            pointBackgroundColor: '#4da3ff', borderWidth: 2
          },
          {
            label: 'Corn',
            data: [1.95, 1.80, 1.85, 1.92],
            borderColor: '#f0ad4e',
            backgroundColor: 'rgba(240,173,78,0.06)',
            fill: true, tension: 0.4, pointRadius: 4,
            pointBackgroundColor: '#f0ad4e', borderWidth: 2
          },
          {
            label: 'Soybean',
            data: [3.40, 3.55, 3.70, 3.85],
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168,85,247,0.06)',
            fill: true, tension: 0.4, pointRadius: 4,
            pointBackgroundColor: '#a855f7', borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 },
              callback: (v) => '$' + v.toFixed(2)
            },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }

  // ROI Projection Chart
  const roiCtx = document.getElementById('plusROIChart');
  if (roiCtx && !plusROIChart) {
    plusROIChart = new Chart(roiCtx, {
      type: 'bar',
      data: {
        labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
        datasets: [
          {
            label: 'With Pro',
            data: [5200, 9800, 16500, 24000, 31500, 42000],
            backgroundColor: 'rgba(0,255,170,0.6)',
            borderColor: '#00ffaa',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Without Pro',
            data: [3200, 5100, 7200, 9000, 10800, 12500],
            backgroundColor: 'rgba(255,107,107,0.4)',
            borderColor: '#ff6b6b',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
            grid: { display: false }
          },
          y: {
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 },
              callback: (v) => '$' + (v / 1000) + 'k'
            },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }
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

/* =====================================================
   PRO+ PREMIUM CORE INTERACTIVE HANDLERS
===================================================== */

// Trigger live mock satellite map scan
window.triggerSatelliteScan = function () {
  const laser = document.getElementById("satelliteLaser");
  const metricsList = document.getElementById("scanMetricsList");
  const btn = document.querySelector(".scan-trigger-btn");

  if (!laser || !metricsList || !btn) return;

  // Disable button temporarily
  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Scanning Grid...`;
  laser.classList.add("scanning");

  // Randomize mock metrics slightly for dynamic interactive feel
  setTimeout(() => {
    laser.classList.remove("scanning");
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-satellite-dish"></i> Run Live Scan`;

    // Generate fresh simulated numbers
    const nSat = Math.floor(Math.random() * 30) + 45; // 45 - 75%
    const cDen = Math.floor(Math.random() * 20) + 75; // 75 - 95%
    
    // Update metric list display with multi-state logic
    metricsList.innerHTML = `
      <div class="metric-row">
        <span>Soil Salinity</span>
        <div class="bar-track"><div class="bar-fill green-fill" style="width:22%"></div></div>
        <strong>Optimal (Safe)</strong>
      </div>
      <div class="metric-row">
        <span>Nitrogen Saturation</span>
        <div class="bar-track"><div class="bar-fill ${nSat < 55 ? 'yellow-fill' : 'green-fill'}" style="width:${nSat}%"></div></div>
        <strong>${nSat}% (${nSat < 55 ? 'Top-up Advised' : 'Optimal'})</strong>
      </div>
      <div class="metric-row">
        <span>Chlorophyll Density</span>
        <div class="bar-track"><div class="bar-fill blue-fill" style="width:${cDen}%"></div></div>
        <strong>${cDen}% (Outstanding)</strong>
      </div>
    `;

    // Highlight recommendation box
    const recBox = document.querySelector(".ai-recommendation-box");
    if (recBox) {
      recBox.style.transition = "all 0.3s ease";
      recBox.style.transform = "scale(1.02)";
      recBox.style.boxShadow = "0 0 20px rgba(0,255,170,0.3)";
      setTimeout(() => {
        recBox.style.transform = "scale(1)";
        recBox.style.boxShadow = "none";
      }, 600);
    }
  }, 2500);
};

// Dynamic Carbon Credits Offset Monetization Calculator
window.updateCarbonCredits = function (val, type) {
  if (type === 'acreage') {
    document.getElementById("acreageVal").textContent = val + " Acres";
  } else if (type === 'duration') {
    document.getElementById("durationVal").textContent = val + (val == 1 ? " Year" : " Years");
  }

  // Compute combined payout estimate
  // Base offset ≈ 1.5 tons per acre/year * multi-year cumulative bonus factor
  const acres = parseInt(document.getElementById("acreageVal").textContent);
  const years = parseInt(document.getElementById("durationVal").textContent);
  
  // Custom bonus coefficient formula
  const totalTons = Math.round(acres * 1.5 * (1 + (years - 1) * 0.1));
  const ratePerTon = 30; // $30/ton standard contract floor
  const payout = totalTons * ratePerTon;

  const amountDisplay = document.getElementById("carbonPayoutAmount");
  const detailsDisplay = document.querySelector(".payout-details");

  if (amountDisplay && detailsDisplay) {
    amountDisplay.textContent = "$" + payout.toLocaleString();
    detailsDisplay.innerHTML = `
      <span><b>${totalTons.toLocaleString()} Metric Tons</b> CO2 Eq. Offset</span>
      <span>Rate: <b>$${ratePerTon} / Ton</b></span>
    `;
  }
};

window.claimCarbonCredits = function () {
  alert("🌱 Ledger Request Initiated!\n\nSmart contract verified via regenerative compliance nodes. Offset certificates tokenized and payout transaction queued for direct multi-currency disbursement.");
};

window.toggleAutoDrip = function (cb) {
  const bar = document.getElementById("dripStatusBar");
  if (!bar) return;

  if (cb.checked) {
    bar.innerHTML = `<i class="fas fa-tint"></i> Autonomous link active. Next scheduled flush bypassed due to adequate root moisture.`;
    bar.style.color = "#00ffaa";
    bar.style.backgroundColor = "rgba(0,255,170,0.06)";
    bar.style.borderColor = "rgba(0,255,170,0.15)";
  } else {
    bar.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Autonomous link suspended. System switched to manual overrides.`;
    bar.style.color = "#f0ad4e";
    bar.style.backgroundColor = "rgba(240,173,78,0.06)";
    bar.style.borderColor = "rgba(240,173,78,0.15)";
  }
};

window.toggleArbitrageBid = function (dest, cb) {
  if (cb.checked) {
    console.log(`Auto-Bid active for ${dest} cross-border spread matrix.`);
  } else {
    console.log(`Auto-Bid trigger deactivated for ${dest}.`);
  }
};

