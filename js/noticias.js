const SANFLO_NOTICIAS = [
  {
    id: 1,
    titulo: '5 buenas prácticas de higiene en clínicas y consultorios',
    fecha: '2026-03-01',
    resumen: 'Recomendaciones rápidas: lavado de manos, desinfección de superficies, uso de EPP y manejo de residuos.',
    tag: 'Higiene'
  },
  {
    id: 2,
    titulo: '¿Cómo elegir guantes según el procedimiento?',
    fecha: '2026-02-20',
    resumen: 'Látex, nitrilo o vinilo: diferencias, usos comunes y consideraciones para alergias.',
    tag: 'Insumos'
  },
  {
    id: 3,
    titulo: 'Mantenimiento preventivo: por qué te ahorra dinero',
    fecha: '2026-02-10',
    resumen: 'Un plan preventivo reduce fallas, mejora desempeño de equipos y evita interrupciones.',
    tag: 'Servicios'
  },
  {
    id: 4,
    titulo: 'Checklist semanal de limpieza para negocios',
    fecha: '2026-01-28',
    resumen: 'Guía práctica para organizar tareas, responsables y frecuencia de limpieza por áreas.',
    tag: 'Higiene'
  }
];

function renderNoticias(filterText=''){
  const grid = document.getElementById('newsGrid');
  if(!grid) return;

  const q = (filterText || '').trim().toLowerCase();
  const items = SANFLO_NOTICIAS.filter(n =>
    !q || n.titulo.toLowerCase().includes(q) || n.resumen.toLowerCase().includes(q) || n.tag.toLowerCase().includes(q)
  );

  if(items.length === 0){
    grid.innerHTML = '<div class="col-12"><div class="alert alert-warning">No se encontraron artículos con ese filtro.</div></div>';
    return;
  }

  grid.innerHTML = items.map(n => `
    <div class="col">
      <div class="card h-100 rounded-4 hover-lift">
        <div class="card-body">
          <span class="badge text-bg-info mb-2">${n.tag}</span>
          <h5 class="card-title">${n.titulo}</h5>
          <div class="small text-muted mb-2"><i class="bi bi-calendar-event"></i> ${n.fecha}</div>
          <p class="card-text">${n.resumen}</p>
        </div>
      </div>
    </div>
  `).join('');
}

window.renderNoticias = renderNoticias;