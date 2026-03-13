/* Cotizador / Carrito Sanflo SRL
   - Validación de stock
   - Persistencia en localStorage
   - ITBIS 18%
*/

const TAX_RATE = 0.18;
const CART_KEY = 'sanflo_cart_v1';
const COUNTER_KEY = 'sanflo_cot_counter_v1';

function money(n){
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(n);
}

function loadCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch{ return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function findItemById(id){
  const cat = window.SANFLO_CATALOGO;
  return [...cat.productos, ...cat.servicios].find(x => x.id === id);
}

function addToCart(id){
  const item = findItemById(id);
  if(!item) return;

  if(item.stock <= 0){
    showToast('No disponible', `${item.nombre} está sin stock para cotizar.`);
    return;
  }

  const cart = loadCart();
  const existing = cart.find(x => x.id === id);
  const qty = existing ? existing.qty + 1 : 1;

  if(qty > item.stock){
    showToast('Stock insuficiente', `Solo hay ${item.stock} disponibles para ${item.nombre}.`);
    return;
  }

  if(existing) existing.qty = qty;
  else cart.push({ id, qty });

  saveCart(cart);
  renderCart();
  showToast('Agregado', `${item.nombre} agregado a la cotización.`);
}

function updateQty(id, qty){
  const item = findItemById(id);
  if(!item) return;

  const cart = loadCart();
  const row = cart.find(x => x.id === id);
  if(!row) return;

  const q = Math.max(1, Math.min(Number(qty || 1), item.stock));
  if(Number(qty) > item.stock){
    showToast('Ajustado por stock', `Se ajustó la cantidad a ${item.stock} para ${item.nombre}.`);
  }
  row.qty = q;
  saveCart(cart);
  renderCart();
}

function removeFromCart(id){
  const cart = loadCart().filter(x => x.id !== id);
  saveCart(cart);
  renderCart();
}

function clearCart(){
  saveCart([]);
  renderCart();
}

function calcTotals(cart){
  let subtotal = 0;
  for(const line of cart){
    const item = findItemById(line.id);
    if(!item) continue;
    subtotal += item.precio * line.qty;
  }
  const itbis = subtotal * TAX_RATE;
  const total = subtotal + itbis;
  return { subtotal, itbis, total };
}

function renderCart(){
  const cart = loadCart();

  const badge = document.querySelector('[data-cart-badge]');
  if(badge){
    const count = cart.reduce((a,b)=>a+b.qty,0);
    badge.textContent = count;
    badge.classList.toggle('d-none', count === 0);
  }

  const container = document.getElementById('cartItems');
  const totalsBox = document.getElementById('cartTotals');
  if(!container || !totalsBox) return;

  if(cart.length === 0){
    container.innerHTML = '<div class="text-center py-4 text-muted">Tu cotización está vacía.</div>';
    totalsBox.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(line => {
    const item = findItemById(line.id);
    if(!item) return '';
    const max = item.stock;
    return `
      <div class="d-flex gap-3 align-items-start border-bottom py-3">
        <div class="flex-grow-1">
          <div class="fw-semibold">${item.nombre}</div>
          <div class="small text-muted">${item.categoria} · ${money(item.precio)} / ${item.unidad}</div>
          <div class="mt-2 d-flex align-items-center gap-2">
            <label class="small text-muted">Cant.</label>
            <input class="form-control form-control-sm" style="width:90px" type="number" min="1" max="${max}" value="${line.qty}"
              onchange="updateQty('${item.id}', this.value)">
            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div class="text-end fw-semibold">${money(item.precio * line.qty)}</div>
      </div>
    `;
  }).join('');

  const { subtotal, itbis, total } = calcTotals(cart);
  totalsBox.innerHTML = `
    <div class="p-3 rounded-4 section-soft">
      <div class="d-flex justify-content-between"><span>Subtotal</span><span class="fw-semibold">${money(subtotal)}</span></div>
      <div class="d-flex justify-content-between"><span>ITBIS (18%)</span><span class="fw-semibold">${money(itbis)}</span></div>
      <hr>
      <div class="d-flex justify-content-between fs-5"><span class="fw-semibold">Total</span><span class="fw-bold text-sanflo">${money(total)}</span></div>
      <div class="d-grid gap-2 mt-3">
        <a class="btn btn-sanflo" href="cotizacion.html"><i class="bi bi-receipt"></i> Generar cotización</a>
        <button class="btn btn-outline-secondary" onclick="clearCart()"><i class="bi bi-x-circle"></i> Vaciar</button>
      </div>
    </div>
  `;
}

function nextQuoteNumber(){
  const today = new Date();
  const y = String(today.getFullYear());
  const m = String(today.getMonth()+1).padStart(2,'0');
  const d = String(today.getDate()).padStart(2,'0');
  const base = `${y}${m}${d}`;

  const raw = localStorage.getItem(COUNTER_KEY);
  let data = { date: base, n: 0 };
  if(raw){
    try{ data = JSON.parse(raw); } catch {}
  }
  if(data.date !== base){ data = { date: base, n: 0 }; }
  data.n += 1;
  localStorage.setItem(COUNTER_KEY, JSON.stringify(data));
  const seq = String(data.n).padStart(3,'0');
  return `COT-${base}-${seq}`;
}

function showToast(title, msg){
  const el = document.getElementById('liveToast');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMsg');
  if(!el || !titleEl || !msgEl) return alert(`${title}: ${msg}`);

  titleEl.textContent = title;
  msgEl.textContent = msg;

  const toast = bootstrap.Toast.getOrCreateInstance(el);
  toast.show();
}

function renderCatalog(){
  const target = document.getElementById('catalogGrid');
  if(!target) return;

  const items = [...SANFLO_CATALOGO.productos, ...SANFLO_CATALOGO.servicios];
  target.innerHTML = items.map(item => {
    const out = item.stock <= 0;
    return `
      <div class="col">
        <div class="card h-100 rounded-4 hover-lift">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div>
                <div class="icon-pill mb-2"><i class="bi bi-box-seam"></i> ${item.categoria}</div>
                <h5 class="card-title mb-1">${item.nombre}</h5>
                <div class="text-muted small">${money(item.precio)} / ${item.unidad}</div>
              </div>
              <span class="badge badge-stock ${out ? 'text-bg-danger' : 'text-bg-success'}">
                ${out ? 'Sin stock' : `Stock: ${item.stock}`}
              </span>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0 pt-0 pb-3">
            <div class="d-grid">
              <button class="btn ${out ? 'btn-outline-secondary' : 'btn-sanflo'}"
                ${out ? 'disabled' : ''} onclick="addToCart('${item.id}')">
                <i class="bi bi-cart-plus"></i> ${out ? 'No disponible' : 'Agregar a cotización'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* Exponer funciones globales */
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.renderCart = renderCart;
window.renderCatalog = renderCatalog;
window.nextQuoteNumber = nextQuoteNumber;
window.money = money;
window.findItemById = findItemById;
window.calcTotals = calcTotals;
window.showToast = showToast;