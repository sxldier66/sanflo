const SANFLO_NOTICIAS = [
  {
    id: 1,
    titulo: '5 buenas prácticas de higiene en clínicas y consultorios',
    fecha: '2026-03-01',
    resumen: 'Recomendaciones rápidas: lavado de manos, desinfección de superficies, uso de EPP y manejo de residuos.',
    contenido: `
      <p>La higiene en clínicas y consultorios es fundamental para prevenir infecciones y garantizar la seguridad de pacientes y personal.</p>
      <p>Entre las prácticas más importantes se encuentran:</p>
      <ul>
        <li>Lavado de manos frecuente y correcto.</li>
        <li>Desinfección constante de superficies de contacto.</li>
        <li>Uso adecuado de equipos de protección personal (EPP).</li>
        <li>Manejo correcto de residuos médicos.</li>
        <li>Reposición constante de insumos de higiene.</li>
      </ul>
      <p>Implementar estas prácticas ayuda a mantener un entorno seguro y profesional.</p>
    `,
    tag: 'Higiene'
  },
  {
    id: 2,
    titulo: '¿Cómo elegir guantes según el procedimiento?',
    fecha: '2026-02-20',
    resumen: 'Látex, nitrilo o vinilo: diferencias, usos comunes y consideraciones para alergias.',
    contenido: `
      <p>La elección del tipo de guante depende del procedimiento, el nivel de riesgo y las necesidades del usuario.</p>
      <ul>
        <li><strong>Látex:</strong> buena elasticidad y sensibilidad, pero puede causar alergias.</li>
        <li><strong>Nitrilo:</strong> resistente y recomendado para procedimientos con mayor exposición.</li>
        <li><strong>Vinilo:</strong> útil para tareas de bajo riesgo y corta duración.</li>
      </ul>
      <p>También es importante verificar talla, resistencia y calidad del material para asegurar un uso adecuado.</p>
    `,
    tag: 'Insumos'
  },
  {
    id: 3,
    titulo: 'Mantenimiento preventivo: por qué te ahorra dinero',
    fecha: '2026-02-10',
    resumen: 'Un plan preventivo reduce fallas, mejora desempeño de equipos y evita interrupciones.',
    contenido: `
      <p>El mantenimiento preventivo ayuda a prolongar la vida útil de los equipos y evita averías inesperadas.</p>
      <p>Entre sus beneficios están:</p>
      <ul>
        <li>Reducción de costos por reparaciones mayores.</li>
        <li>Menos interrupciones operativas.</li>
        <li>Mayor eficiencia del equipo.</li>
        <li>Mejor planificación de recursos.</li>
      </ul>
      <p>Por eso muchas empresas prefieren planes preventivos en lugar de esperar fallas críticas.</p>
    `,
    tag: 'Servicios'
  },
  {
    id: 4,
    titulo: 'Checklist semanal de limpieza para negocios',
    fecha: '2026-01-28',
    resumen: 'Guía práctica para organizar tareas, responsables y frecuencia de limpieza por áreas.',
    contenido: `
      <p>Un checklist semanal de limpieza ayuda a mantener el orden y reducir riesgos sanitarios en cualquier negocio.</p>
      <p>Debe incluir:</p>
      <ul>
        <li>Áreas a limpiar.</li>
        <li>Frecuencia de limpieza.</li>
        <li>Responsables asignados.</li>
        <li>Productos o insumos requeridos.</li>
        <li>Verificación final.</li>
      </ul>
      <p>Esta metodología mejora el control interno y la imagen del establecimiento.</p>
    `,
    tag: 'Higiene'
  }
];

function openNews(id){
  const noticia = SANFLO_NOTICIAS.find(n => n.id === id);
  if(!noticia) return;

  document.getElementById('newsModalTitle').textContent = noticia.titulo;
  document.getElementById('newsModalDate').textContent = noticia.fecha;
  document.getElementById('newsModalTag').textContent = noticia.tag;
  document.getElementById('newsModalBody').innerHTML = noticia.contenido;

  const modal = new bootstrap.Modal(document.getElementById('newsModal'));
  modal.show();
}

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
      <div class="card h-100 rounded-4 hover-lift news-card-click" onclick="openNews(${n.id})" role="button">
        <div class="card-body">
          <span class="badge text-bg-info mb-2">${n.tag}</span>
          <h5 class="card-title">${n.titulo}</h5>
          <div class="small text-muted mb-2"><i class="bi bi-calendar-event"></i> ${n.fecha}</div>
          <p class="card-text">${n.resumen}</p>
          <div class="mt-3">
            <span class="btn btn-sm btn-outline-dark">Leer más</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

window.renderNoticias = renderNoticias;
window.openNews = openNews;
