const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach((item) => observer.observe(item));


// splash screen js
const splash = document.getElementById("splash");
const closeBtn = document.querySelector(".splash-close");
const startBtn = document.getElementById("startBtn");

// to show the splash screen only once
// if (localStorage.getItem("splashClosed") === "true") {
//   splash.classList.add("is-hidden");
// }

function closeSplash() {
  splash.classList.add("is-hidden");
  localStorage.setItem("splashClosed", "true");
}

closeBtn.addEventListener("click", closeSplash);
startBtn.addEventListener("click", closeSplash);

// Close when pressing Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !splash.classList.contains("is-hidden")) {
    closeSplash();
  }
});

// Close when clicking outside the splash window
splash.addEventListener("click", function (event) {
  if (event.target === splash) {
    closeSplash();
  }
});