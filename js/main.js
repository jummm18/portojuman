const root = document.documentElement;
const theme = document.getElementById('theme');
const saved = localStorage.getItem('jumantoro-theme');

if (saved === 'light') {
  root.classList.add('light');
  theme.textContent = '☀';
}

theme.onclick = () => {
  root.classList.toggle('light');
  const light = root.classList.contains('light');
  theme.textContent = light ? '☀' : '☾';
  localStorage.setItem('jumantoro-theme', light ? 'light' : 'dark');
};

const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('show');
}), { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Load Projects from JSON & Modal Handler
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const closeBtn = document.getElementById('close');

async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    const projects = await response.json();
    const container = document.getElementById('projects-container');
    
    if (!container) return;

    container.innerHTML = projects.map(p => `
      <article class="card project" data-title="${p.title}" data-detail="${p.detail}">
        <span class="num">${p.num}</span>
        <h3>${p.title}</h3>
        <p>${p.period}</p>
        <div class="tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </article>
    `).join('');

    // Attach click events to generated cards for modal popup
    document.querySelectorAll('.project').forEach(card => {
      card.onclick = () => {
        modalTitle.textContent = card.dataset.title;
        modalText.textContent = card.dataset.detail;
        modal.classList.add('open');
      };
    });
  } catch (error) {
    console.error('Gagal memuat data projects:', error);
  }
}

loadProjects();

if (closeBtn) closeBtn.onclick = () => modal.classList.remove('open');
if (modal) modal.onclick = e => { if (e.target === modal) modal.classList.remove('open'); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });