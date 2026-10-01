document.addEventListener("DOMContentLoaded", () => {
  // 1. THEME TOGGLE (Dark / Light)
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme");
  const savedTheme = localStorage.getItem("jumantoro-theme");

  if (savedTheme === "light") {
    root.classList.add("light");
    themeBtn.textContent = "☀";
  }

  themeBtn.addEventListener("click", () => {
    root.classList.toggle("light");
    const isLight = root.classList.contains("light");
    themeBtn.textContent = isLight ? "☀" : "☾";
    localStorage.setItem("jumantoro-theme", isLight ? "light" : "dark");
  });

  // 2. SCROLL REVEAL ANIMATION
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          // Optional: Stop observing once revealed for better performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  // 3. LOAD PROJECTS FROM JSON & MODAL HANDLER
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const closeBtn = document.getElementById("close");
  const projectsContainer = document.getElementById("projects-container");

  async function loadProjects() {
    if (!projectsContainer) return;

    try {
      const response = await fetch("data/projects.json");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const projects = await response.json();

      projectsContainer.innerHTML = projects
        .map(
          (p) => `
        <article class="card project" data-title="${p.title}" data-detail="${p.detail}">
          <span class="num">${p.num}</span>
          <h3>${p.title}</h3>
          <p>${p.period}</p>
          <div class="tags">
            ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
        </article>
      `
        )
        .join("");

      // Attach click events to generated cards for modal popup
      document.querySelectorAll(".project").forEach((card) => {
        card.addEventListener("click", () => {
          modalTitle.textContent = card.dataset.title;
          modalText.textContent = card.dataset.detail;
          modal.classList.add("open");
          document.body.style.overflow = "hidden"; // Prevent background scrolling
        });
      });
    } catch (error) {
      console.error("Failed to load projects data:", error);
      projectsContainer.innerHTML = `<p style="color: var(--muted); grid-column: 1 / -1; text-align: center;">Unable to load projects. Please try again later.</p>`;
    }
  }

  loadProjects();

  // 4. MODAL CLOSE LOGIC
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = ""; // Restore background scrolling
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
});
