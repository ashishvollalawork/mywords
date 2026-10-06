"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal elements as they enter the viewport.
const revealElements = document.querySelectorAll(".reveal");
if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  revealElements.forEach((element) => revealObserver.observe(element));
}

// Reading progress.
const progressBar = document.getElementById("progressBar");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(percent, 100)}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Optional ambient music. Browsers require a user gesture before playback.
const soundButton = document.getElementById("soundButton");
const soundLabel = soundButton.querySelector(".sound-label");
const music = document.getElementById("backgroundMusic");
music.volume = 0.28;

soundButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      soundButton.setAttribute("aria-pressed", "true");
      soundLabel.textContent = "Sound on";
    } catch (error) {
      soundLabel.textContent = "Add music file";
      console.info("Add audio/background-music.mp3 to enable sound.");
    }
  } else {
    music.pause();
    soundButton.setAttribute("aria-pressed", "false");
    soundLabel.textContent = "Sound off";
  }
});

// Gentle final-message interaction.
const memoryButton = document.getElementById("memoryButton");
const hiddenMemory = document.getElementById("hiddenMemory");
memoryButton.addEventListener("click", () => {
  const showing = hiddenMemory.classList.toggle("show");
  memoryButton.textContent = showing ? "Keep it in my heart" : "One last memory";
  memoryButton.setAttribute("aria-expanded", String(showing));
});

// Lightweight canvas star field.
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let animationFrame;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(110, Math.floor(window.innerWidth / 10)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.25 + 0.2,
    alpha: Math.random() * 0.6 + 0.15,
    speed: Math.random() * 0.12 + 0.02
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 235, 241, ${star.alpha})`;
    ctx.fill();
    star.y -= star.speed;
    if (star.y < -2) {
      star.y = window.innerHeight + 2;
      star.x = Math.random() * window.innerWidth;
    }
  }
  animationFrame = requestAnimationFrame(drawStars);
}

function drawStaticStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 235, 241, ${star.alpha})`;
    ctx.fill();
  });
}

resizeCanvas();
if (!reduceMotion) drawStars();
else drawStaticStars();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeCanvas();
    if (reduceMotion) drawStaticStars();
  }, 120);
});
