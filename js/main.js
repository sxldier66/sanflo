// Modo oscuro + utilidades generales
const THEME_KEY = 'sanflo_theme_v1';

function applyTheme(theme){
  document.body.classList.toggle('dark', theme === 'dark');
  const icon = document.querySelector('[data-theme-icon]');
  if(icon){
    icon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
  }
}

function toggleTheme(){
  const current = localStorage.getItem(THEME_KEY) || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function setActiveNav(){
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    a.classList.toggle('active', href === path);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  setActiveNav();

  const btn = document.getElementById('themeToggle');
  if(btn) btn.addEventListener('click', toggleTheme);

  if(window.renderCart) renderCart();
  if(window.renderCatalog) renderCatalog();

  const search = document.getElementById('newsSearch');
  if(window.renderNoticias){
    renderNoticias('');
    if(search){
      search.addEventListener('input', e => renderNoticias(e.target.value));
    }
  }
});

window.toggleTheme = toggleTheme;