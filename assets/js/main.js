// ============================================
// NAVEGAÇÃO POR STEPPER
// ============================================
const steps = document.querySelectorAll('.step');
const sections = document.querySelectorAll('.section');
const gotoButtons = document.querySelectorAll('[data-goto]');

function activateSection(sectionId) {
  // Atualiza stepper
  steps.forEach(s => s.classList.remove('active'));
  const targetStep = document.querySelector(`.step[data-section="${sectionId}"]`);
  if (targetStep) targetStep.classList.add('active');

  // Atualiza seção visível
  sections.forEach(s => s.classList.remove('active'));
  const targetSection = document.getElementById(sectionId);
  if (targetSection) targetSection.classList.add('active');

  // Scroll para o topo suavemente
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

steps.forEach(step => {
  step.addEventListener('click', () => {
    activateSection(step.dataset.section);
  });
});

gotoButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    activateSection(btn.dataset.goto);
  });
});

// ============================================
// HELPER: CARREGAR JSON
// ============================================
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Erro ao carregar ${path}:`, err);
    return null;
  }
}

// Helper seguro para ler chaves com espaços nos seus JSONs atuais
// Ex: obj["id "] ou obj["id"]
const k = (obj, key) => {
  if (!obj) return '';
  return obj[key] ?? obj[key + ' '] ?? obj[key.trim()] ?? '';
};

// ============================================
// RENDER: PROJECTS
// ============================================
async function renderProjects() {
  const projects = await loadJSON('data/projects.json');
  const grid = document.getElementById('projects-grid');
  if (!projects || !grid) return;

  grid.innerHTML = projects.map(p => `
    <article class="project-card">
      <div class="project-domain">${k(p, 'domain')}</div>
      <h3>${k(p, 'title')}</h3>
      <p>${k(p, 'description')}</p>
      ${Array.isArray(k(p, 'tools')) ? `
        <div class="project-tools">
          ${k(p, 'tools').map(t => `<span class="tool-tag">${t}</span>`).join('')}
        </div>
      ` : ''}
      <div class="project-links">
        ${k(p, 'public_link') ? `<a href="${k(p, 'public_link')}" target="_blank" rel="noopener" class="project-link">View code →</a>` : ''}
        ${k(p, 'request_access') ? `<a href="${k(p, 'request_access')}" target="_blank" rel="noopener" class="project-link">Request demo access →</a>` : ''}
      </div>
    </article>
  `).join('');
}

// ============================================
// RENDER: TRANSLATION
// ============================================
async function renderTranslation() {
  const data = await loadJSON('data/translations.json');
  const grid = document.getElementById('translation-grid');
  if (!data || !grid) return;

  grid.innerHTML = data.map(t => `
    <article class="translation-card">
      <div class="translation-pair">${k(t, 'pair')}</div>
      ${Array.isArray(k(t, 'domains')) ? `
        <div class="translation-domains">
          ${k(t, 'domains').map(d => `<span class="tool-tag">${d}</span>`).join('')}
        </div>
      ` : ''}
      <p>${k(t, 'description')}</p>
      ${k(t, 'excerpt') ? `<div class="translation-excerpt">"${k(t, 'excerpt')}"</div>` : ''}
      ${k(t, 'request_access') ? `<a href="${k(t, 'request_access')}" target="_blank" rel="noopener" class="translation-cta">Request sample access →</a>` : ''}
    </article>
  `).join('');
}

// ============================================
// RENDER: TIMELINE
// ============================================
async function renderTimeline() {
  const timeline = await loadJSON('data/timeline.json');
  const container = document.getElementById('timeline');
  if (!timeline || !container) return;

  container.innerHTML = timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      ${k(item, 'icon') ? `<div class="timeline-icon">${k(item, 'icon')}</div>` : ''}
      <div class="timeline-type">${k(item, 'type')}</div>
      <div class="timeline-date">${k(item, 'date')}</div>
      <h3>${k(item, 'title')}</h3>
      <p>${k(item, 'description')}</p>
    </div>
  `).join('');
}

// ============================================
// RENDER: LANGUAGES
// ============================================
async function renderLanguages() {
  const languages = await loadJSON('data/languages.json');
  const grid = document.getElementById('languages-grid');
  if (!languages || !grid) return;

  grid.innerHTML = languages.map(l => `
    <div class="language-card">
      <div class="language-icon">${k(l, 'icon')}</div>
      <div class="language-name">${k(l, 'lang')}</div>
      <div class="language-level">${k(l, 'level')}</div>
      <p class="language-details">${k(l, 'details')}</p>
    </div>
  `).join('');
}

// ============================================
// INIT - Carrega tudo quando a página abre
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderTranslation();
  renderTimeline();
  renderLanguages();
});
