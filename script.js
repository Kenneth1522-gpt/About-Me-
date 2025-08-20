// ====== Konfigurasi Biodata Tri ======
const PROFILE = {
  name: "Tri Cahyo",
  school: "SMK Bhinus",
  age: 17,
  address: "Dusun Segrumung"
};

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initTheme();
  initAccent();
  initTilt();
  initBlobs();
  initCopyBio();
  initMenuToggle();
  initFadeIn();
  startStars();
});

// Tahun footer
function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

// Theme toggle + persist
function initTheme() {
  const saved = localStorage.getItem("gen-theme");
  if (saved === "light") document.body.classList.add("light");
  updateThemeIcon();
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("gen-theme", document.body.classList.contains("light") ? "light" : "dark");
    updateThemeIcon();
  });
}
function updateThemeIcon() {
  const btn = document.getElementById("themeToggle");
  const light = document.body.classList.contains("light");
  btn.textContent = light ? "🌞" : "🌙";
}

// Accent picker + persist
function initAccent() {
  const saved = localStorage.getItem("gen-accent");
  if (saved) document.documentElement.style.setProperty("--accent", saved);
  document.querySelectorAll(".accent").forEach(btn => {
    btn.addEventListener("click", () => {
      const c = btn.dataset.color;
      document.documentElement.style.setProperty("--accent", c);
      localStorage.setItem("gen-accent", c);
    });
  });
}

// Tilt effect (disable di HP)
function initTilt() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll(".tilt").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx = ((y - r.height / 2) / r.height) * -6;
      const ry = ((x - r.width / 2) / r.width) * 6;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener("mouseleave", () =>
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0)"
    );
  });
}

// Menu Toggle (mobile nav)
function initMenuToggle() {
  const menuBtn = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav");
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
}

// Copy biodata ke clipboard
function initCopyBio() {
  const btn = document.getElementById("copyBio");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const text = `Nama: ${PROFILE.name}\nSekolah: ${PROFILE.school}\nUmur: ${PROFILE.age}\nAlamat: ${PROFILE.address}`;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Tersalin ✅";
      setTimeout(() => btn.textContent = "Copy Biodata", 1500);
    } catch {
      alert("Gagal menyalin. Copy manual ya:\n\n" + text);
    }
  });
}

// Form demo: copy ke clipboard
function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const text = `Halo, aku ${name} (${email}).\n\n${message}`;
  navigator.clipboard.writeText(text)
    .then(() => alert("Pesan disalin ke clipboard. Tinggal paste ke email/DM 👍"))
    .catch(() => alert("Gagal menyalin. Silakan copy manual ya."));
  e.target.reset();
  return false;
}

// ====== Animated neon blobs background ======
function initBlobs() {
  const c = document.getElementById("blobs");
  const ctx = c.getContext("2d");
  let W, H, blobs = [], raf;

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    const count = Math.min(14, Math.max(8, Math.floor(W / 160)));
    blobs = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 60 + Math.random() * 140,
      vx: (Math.random() - .5) * 0.4,
      vy: (Math.random() - .5) * 0.4,
      hue: Math.random() * 360
    }));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    blobs.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -200 || b.x > W + 200) b.vx *= -1;
      if (b.y < -200 || b.y > H + 200) b.vy *= -1;
      const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.2, b.x, b.y, b.r);
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      grad.addColorStop(0, accent + "cc");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(loop);
  }

  resize(); loop();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf); resize(); loop();
  });
}

// Blob ikut kursor
document.addEventListener("mousemove", e => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = (e.clientX - centerX) / 40;
  const offsetY = (e.clientY - centerY) / 40;
  document.getElementById("blobs").style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

// ====== Partikel bintang jatuh ======
function startStars() {
  setInterval(() => {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "vw";
    star.style.animationDuration = Math.random() * 3 + 2 + "s";
    star.style.opacity = Math.random();
    star.style.fontSize = Math.random() * 8 + 4 + "px";
    star.textContent = "★";
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 5000);
  }, 200);
}

// ====== Fade-in on scroll ======
function initFadeIn() {
  const fadeEls = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  });
  fadeEls.forEach(el => observer.observe(el));
}
