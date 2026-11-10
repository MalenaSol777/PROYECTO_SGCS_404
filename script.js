const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');

if (hamburgerBtn && mobileNav) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    mobileNav.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      mobileNav.classList.remove('active');
    });
  });
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function closeModalOnBackdrop(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

const filterBtns = document.querySelectorAll('.filter-btn');
const toolCards = document.querySelectorAll('.tool-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    toolCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

const glossarySearch = document.getElementById('glossarySearch');
const glossaryItems = document.querySelectorAll('.glossary-item');

if (glossarySearch) {
  glossarySearch.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    glossaryItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(term)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const isActive = item.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.classList.remove('active');
      const span = fi.querySelector('.faq-question span');
      if (span) span.textContent = '+';
    });

    if (!isActive) {
      item.classList.add('active');
      const span = question.querySelector('span');
      if (span) span.textContent = '-';
    }
  });
});

function toggleSolution(solutionId) {
  const sol = document.getElementById(solutionId);
  if (sol) {
    sol.classList.toggle('active');
  }
}

const datosMetodologias = {
  scrum: { nombre: "Scrum", enfoque: "Ágil / Iterativo", flexibilidad: "Alta", roles: "Product Owner, Scrum Master, Developer" },
  kanban: { nombre: "Kanban", enfoque: "Gestión de Flujo / Visual", flexibilidad: "Muy Alta", roles: "Sin roles rígidos obligatorios" },
  cascada: { nombre: "Cascada", enfoque: "Tradicional / Secuencial", flexibilidad: "Baja", roles: "Analista, Diseñador, Programador, Tester" }
};

const btnComparar = document.getElementById('btnComparar');
if (btnComparar) {
  btnComparar.addEventListener('click', () => {
    const seleccionadas = document.querySelectorAll('input[name="metodologia"]:checked');
    const contenedor = document.getElementById('tablaComparativaContainer');
    
    if (seleccionadas.length < 2) {
      contenedor.innerHTML = "<p style='color: var(--pink-accent); font-weight: 700;'>Por favor, selecciona al menos 2 metodologías para comparar.</p>";
      return;
    }
    
    let html = '<table class="comparison-table">';
    html += '<tr><th>Metodología</th><th>Enfoque</th><th>Flexibilidad</th><th>Roles Principales</th></tr>';
    
    seleccionadas.forEach(checkbox => {
      const m = datosMetodologias[checkbox.value];
      html += `<tr>
                <td style="font-weight:700;">${m.nombre}</td>
                <td>${m.enfoque}</td>
                <td>${m.flexibilidad}</td>
                <td>${m.roles}</td>
               </tr>`;
    });
    
    html += '</table>';
    contenedor.innerHTML = html;
  });
}

let surveyAnswers = {};

function selectSurveyOption(step, methodology, element) {
  surveyAnswers[step] = methodology;
  
  const parentGrid = element.parentElement;
  parentGrid.querySelectorAll('.survey-option-card').forEach(card => {
    card.classList.remove('selected');
  });
  element.classList.add('selected');

  setTimeout(() => {
    const currentStep = document.getElementById(`step-${step}`);
    currentStep.classList.remove('active');

    if (step < 3) {
      const nextStep = document.getElementById(`step-${step + 1}`);
      nextStep.classList.add('active');
      document.getElementById('surveyProgress').style.width = `${(step + 1) * 33}%`;
    } else {
      document.getElementById('surveyProgress').style.width = '100%';
      showSurveyResult();
    }
  }, 300);
}

function showSurveyResult() {
  const resultStep = document.getElementById('step-result');
  resultStep.classList.add('active');

  let counts = { scrum: 0, kanban: 0, cascada: 0 };
  Object.values(surveyAnswers).forEach(val => {
    counts[val] = (counts[val] || 0) + 1;
  });

  let best = 'scrum';
  let max = -1;
  for (let key in counts) {
    if (counts[key] > max) {
      max = counts[key];
      best = key;
    }
  }

  const resultText = document.getElementById('surveyResultText');
  if (best === 'scrum') {
    resultText.innerHTML = "Metodología Sugerida: Scrum. Tu proyecto se beneficia de iteraciones estructuradas, entregas parciales y roles definidos.";
  } else if (best === 'kanban') {
    resultText.innerHTML = "Metodología Sugerida: Kanban. Tu proyecto requiere un flujo continuo, flexibilidad total y gestión visual de tareas.";
  } else {
    resultText.innerHTML = "Metodología Sugerida: Cascada. Tu proyecto se adapta mejor a requisitos estables y fases secuenciales cerradas.";
  }
}

function resetSurvey() {
  surveyAnswers = {};
  document.querySelectorAll('.survey-option-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelectorAll('.survey-step').forEach(step => {
    step.classList.remove('active');
  });
  document.getElementById('step-1').classList.add('active');
  document.getElementById('surveyProgress').style.width = '33%';
}

function handleContactSubmit(event) {
  event.preventDefault();
  let isValid = true;

  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');

  if (!nombre.value.trim()) {
    nombre.parentElement.classList.add('error');
    isValid = false;
  } else {
    nombre.parentElement.classList.remove('error');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.parentElement.classList.add('error');
    isValid = false;
  } else {
    email.parentElement.classList.remove('error');
  }

  if (!mensaje.value.trim()) {
    mensaje.parentElement.classList.add('error');
    isValid = false;
  } else {
    mensaje.parentElement.classList.remove('error');
  }

  if (isValid) {
    document.getElementById('contactForm').reset();
    document.getElementById('formSuccess').style.display = 'block';
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 4000);
  }
}