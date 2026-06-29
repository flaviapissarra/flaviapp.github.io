// ============================================
// 1. NAVEGAÇÃO & SCROLL SUAVE
// ============================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -80% 0px' });

sections.forEach(section => observer.observe(section));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.getElementById(this.getAttribute('href').substring(1));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ============================================
// 2. HELPERS
// ============================================
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    return res.ok ? await res.json() : null;
  } catch { return null; }
}
const k = (obj, key) => obj ? (obj[key] ?? obj[key.trim()] ?? '') : '';
const formatTitle = (name) => name.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

// ============================================
// 3. PROJETOS - DADOS HARDCODED (TESTE)
// ============================================
async function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // DADOS DE TESTE - funciona sem API
  const projectsData = [
    {
      domain: "LOGISTICS",
      title: "Cross-Border Freight Cost Dashboard",
      description: "Mapped shipping variances across 12 major ports. Automated reporting reduced manual data cleaning by 65%.",
      tools: ["Power BI", "SQL", "Python"],
      public_link: "#",
      request_access: "mailto:flaviapissarra+githubio@gmail.com"
    },
    {
      domain: "AI/TRANSLATION",
      title: "GenAI Translation Evaluator",
      description: "Automated quality assessment for technical translations using LLMs and custom evaluation metrics.",
      tools: ["Python", "OpenAI API", "Pandas", "JSON"],
      public_link: "#",
      request_access: "mailto:flaviapissarra+githubio@gmail.com"
    },
    {
      domain: "NLP",
      title: "NLP Sentiment Analysis",
      description: "Sentiment analysis pipeline for multilingual customer feedback and trade communications.",
      tools: ["Python", "NLTK", "Transformers", "Pandas"],
      public_link: "#",
      request_access: "mailto:flaviapissarra+githubio@gmail.com"
    },
    {
      domain: "DATA ENGINEERING",
      title: "SQL Data Pipeline",
      description: "ETL pipeline for automated data extraction from port logistics systems. Reduced query time by 80%.",
      tools: ["SQL", "PostgreSQL", "Python", "Airflow"],
      public_link: "#",
      request_access: "mailto:flaviapissarra+githubio@gmail.com"
    }
  ];

  grid.innerHTML = `
    <div class="carousel-wrapper">
      <button class="carousel-btn prev" aria-label="Anterior">‹</button>
      <div class="carousel-container">
        <div class="carousel-viewport">
          <div class="carousel-track">
            ${projectsData.map(p => `
              <div class="carousel-slide">
                <article class="project-card">
                  <div class="project-domain">${p.domain}</div>
                  <h3>${p.title}</h3>
                  <p>${p.description}</p>
                  ${p.tools?.length ? `<div class="project-tools">${p.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>` : ''}
                  <div class="project-links">
                    <a href="${p.public_link}" class="project-link">View project →</a>
                    <a href="${p.request_access}" class="project-link">Request access →</a>
                  </div>
                </article>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <button class="carousel-btn next" aria-label="Próximo">›</button>
    </div>
    <div class="carousel-dots"></div>`;
      
  initCarousel();
}

function initCarousel() {
  const wrapper = document.querySelector('.carousel-wrapper');
  if (!wrapper) return;
  
  const track = wrapper.querySelector('.carousel-track');
  const slides = wrapper.querySelectorAll('.carousel-slide');
  const prevBtn = wrapper.querySelector('.prev');
  const nextBtn = wrapper.querySelector('.next');
  const dotsContainer = wrapper.parentElement.querySelector('.carousel-dots');
  let currentIndex = 0;

  const getSlidesPerView = () => window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;

  function update() {
    const spv = getSlidesPerView();
    const slideWidth = slides[0].offsetWidth;
    const gap = 16;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
    
    const totalDots = Math.ceil(slides.length / spv);
    dotsContainer.innerHTML = Array.from({ length: totalDots }, (_, i) => 
      `<button class="carousel-dot ${i === Math.floor(currentIndex / spv) ? 'active' : ''}" data-index="${i}"></button>`
    ).join('');
    
    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.onclick = () => { currentIndex = parseInt(dot.dataset.index) * spv; update(); };
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= slides.length - spv;
  }

  prevBtn.onclick = () => { if (currentIndex > 0) { currentIndex--; update(); } };
  nextBtn.onclick = () => { if (currentIndex < slides.length - getSlidesPerView()) { currentIndex++; update(); } };
  
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { currentIndex = 0; update(); }, 200); });
  update();
}

// ============================================
// 4. OUTRAS SEÇÕES (JSON)
// ============================================
async function renderTranslation() {
  const data = await loadJSON('data/translations.json');
  const grid = document.getElementById('translation-grid');
  if (!data || !grid) return;
  grid.innerHTML = data.map(t => `
    <article class="translation-card">
      <div class="translation-pair">${k(t, 'pair')}</div>
      ${k(t, 'domains')?.length ? `<div class="project-tools">${k(t, 'domains').map(d => `<span class="tool-tag">${d}</span>`).join('')}</div>` : ''}
      <p>${k(t, 'description')}</p>
      ${k(t, 'excerpt') ? `<div class="translation-excerpt">"${k(t, 'excerpt')}"</div>` : ''}
      ${k(t, 'request_access') ? `<a href="${k(t, 'request_access')}" target="_blank" class="project-link">Request sample →</a>` : ''}
    </article>`).join('');
}

async function renderTimeline() {
  const data = await loadJSON('data/timeline.json');
  const el = document.getElementById('timeline');
  if (!data || !el) return;

  const { startYear, endYear, categories, rows } = data;
  const totalYears = endYear - startYear + 1;

  // Filtros por categoria
  const filtersHTML = `
    <div class="gantt-filters">
      <button class="filter-btn active" data-filter="all">All</button>
      ${Object.entries(categories).map(([key, cat]) => 
        `<button class="filter-btn" data-filter="${key}">${cat.label}</button>`
      ).join('')}
    </div>
  `;

  // Header com anos
  const yearsHTML = Array.from({ length: totalYears }, (_, i) => {
    const year = startYear + i;
    return `<div class="gantt-year" style="left: ${(i / totalYears) * 100}%">${year}</div>`;
  }).join('');

  // Linhas (rows)
  const rowsHTML = rows.map(row => {
    const cat = categories[row.category];
    const left = ((row.startYear - startYear) / totalYears) * 100;
    const width = ((row.endYear - row.startYear + 1) / totalYears) * 100;
    const isShort = (row.endYear - row.startYear) === 0;

    return `
      <div class="gantt-row" data-category="${row.category}" data-id="${row.id}">
        <div class="gantt-row-label">${row.label}</div>
        <div class="gantt-row-track">
          <div class="gantt-bar ${isShort ? 'gantt-bar-short' : ''}" 
               style="left: ${left}%; width: ${width}%; background: ${cat.color};"
               data-title="${row.title}"
               data-institution="${row.institution}"
               data-date="${row.startYear}${row.endYear !== row.startYear ? '–' + row.endYear : ''}"
               data-description="${row.description}">
            <span class="gantt-bar-label">${row.label}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    ${filtersHTML}
    <div class="gantt-container">
      <div class="gantt-header">
        ${yearsHTML}
      </div>
      <div class="gantt-body">
        ${rowsHTML}
      </div>
    </div>
    <div class="gantt-legend">
      ${Object.entries(categories).map(([key, cat]) => 
        `<div class="legend-item"><span class="legend-color" style="background:${cat.color}"></span>${cat.label}</div>`
      ).join('')}
    </div>
    <div class="gantt-tooltip" id="gantt-tooltip"></div>
  `;

  initGanttInteractions();
}

function initGanttInteractions() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const rows = document.querySelectorAll('.gantt-row');
  const tooltip = document.getElementById('gantt-tooltip');
  const bars = document.querySelectorAll('.gantt-bar');

  // Filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach(row => {
        if (filter === 'all' || row.dataset.category === filter) {
          row.style.display = 'flex';
          setTimeout(() => row.classList.add('visible'), 10);
        } else {
          row.classList.remove('visible');
          setTimeout(() => row.style.display = 'none', 300);
        }
      });
    });
  });

  // Tooltip no hover
  bars.forEach(bar => {
    bar.addEventListener('mouseenter', (e) => {
      const title = bar.dataset.title;
      const institution = bar.dataset.institution;
      const date = bar.dataset.date;
      const description = bar.dataset.description;
      tooltip.innerHTML = `
        <div class="tooltip-title">${title}</div>
        <div class="tooltip-institution">${institution}</div>
        <div class="tooltip-date">${date}</div>
        <div class="tooltip-description">${description}</div>
      `;
      tooltip.classList.add('visible');
    });

    bar.addEventListener('mousemove', (e) => {
      const rect = document.querySelector('.gantt-container').getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
      tooltip.style.top = (e.clientY - rect.top + 15) + 'px';
    });

    bar.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

async function renderLanguages() {
  const data = await loadJSON('data/languages.json');
  const grid = document.getElementById('languages-grid');
  if (!data || !grid) return;
  grid.innerHTML = data.map(l => {
    const details = k(l, 'details').trim();
    const first = details.split('•')[0].trim();
    return `
      <div class="language-card">
        <div class="lang-title">${k(l, 'icon')} ${k(l, 'lang')} - ${k(l, 'level')} - ${first}</div>
        <p class="lang-desc">${details.replace(first + ' • ', '')}</p>
      </div>`;
  }).join('');
}

// ============================================
// 5. INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderTranslation();
  renderTimeline();
  renderLanguages();
});
