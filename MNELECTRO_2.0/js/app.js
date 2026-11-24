/* MNELECTRO 2.0 — lógica de la tienda demo. Sin pagos ni envío de datos. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const P = window.MN_PRODUCTS, byId = Object.fromEntries(P.map(p => [p.id, p]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = n => '$' + Number(n).toLocaleString('es-AR');
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* almacenamiento no disponible */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* noop */ } }
};
let favs = new Set(store.get('mn_favs', []).filter(id => byId[id]));
let cart = store.get('mn_cart', []).filter(i => byId[i.id] && i.qty > 0);
const state = { q: '', cat: 'Todos', price: 'all', sort: 'feat' };

const fallback = (() => { const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1E293B"/><stop offset="1" stop-color="#0B0B0F"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="200" cy="230" r="70" fill="none" stroke="#3382F6" stroke-opacity=".5"/><text x="200" y="245" font-family="sans-serif" font-weight="800" font-size="44" text-anchor="middle" fill="#F8FAFC">MN</text></svg>`; return 'data:image/svg+xml,' + encodeURIComponent(s); })();
document.addEventListener('error', e => { const t = e.target; if (t.tagName === 'IMG' && t.src !== fallback) { t.removeAttribute('srcset'); t.src = fallback; } }, true);

const fixBroken = () => $$('img').forEach(t => { if (t.complete && !t.naturalWidth && t.src !== fallback) { t.removeAttribute('srcset'); t.src = fallback; } });
const img = (src, w, alt, extra = '') => `<img src="${src}&w=${w}" srcset="${src}&w=${Math.round(w * .6)} ${Math.round(w * .6)}w, ${src}&w=${w} ${w}w, ${src}&w=${w * 2} ${w * 2}w" sizes="(max-width:720px) 46vw, 300px" width="${w}" height="${Math.round(w * 1.25)}" loading="lazy" decoding="async" alt="${esc(alt)}" ${extra}>`;

/* Toasts */
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  $('#toasts').append(t); setTimeout(() => t.remove(), 2600);
}

/* Tarjetas de producto */
const heart = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/></svg>';
function card(p, i, cls = 'card') {
  const on = favs.has(p.id);
  return `<article class="${cls}" style="--i:${i}"><div class="pimg">${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}<button class="fav" data-act="fav" data-id="${p.id}" aria-pressed="${on}" aria-label="Favorito: ${esc(p.name)}">${heart}</button>${img(p.img, 400, p.name + ' (imagen de ejemplo)')}<button class="qv" data-act="qv" data-id="${p.id}" aria-label="Vista rápida: ${esc(p.name)}">Vista rápida</button></div><div class="pinfo"><small>${esc(p.cat)} · ${esc(p.sub)} · demo</small><h3>${esc(p.name)}</h3><div class="prow"><span class="price">${money(p.price)}</span><button class="add" data-act="add" data-id="${p.id}" aria-label="Agregar al carrito: ${esc(p.name)}">+</button></div></div></article>`;
}

/* Categorías */
const CATS = [['Celulares', 'Conectividad', '1511707171634-5f897ff02aa9'], ['Audio', 'Sonido', '1505740420928-5e560c06d30e'], ['Wearables', 'Movimiento', '1544117519-31a4b719223d'], ['Accesorios', 'Detalles', '1523206489230-c012c64b2b48']];
$('#cats').innerHTML = CATS.map(([n, s, id], i) => {
  const src = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75`;
  return `<button class="cat reveal" style="--i:${i}" data-cat="${n}"><img src="${src}&w=500" srcset="${src}&w=400 400w, ${src}&w=800 800w" sizes="(max-width:720px) 46vw, 25vw" width="400" height="500" loading="lazy" decoding="async" alt=""><span><small>${s}</small><strong>${n}</strong></span></button>`;
}).join('');

/* Catálogo */
const CHIPS = [...window.MN_CATEGORIES, 'Favoritos'];
function renderChips() {
  $('#chips').innerHTML = CHIPS.map(c => `<button class="chip" data-chip="${c}" aria-pressed="${state.cat === c}">${c === 'Favoritos' ? `Favoritos (${favs.size})` : c}</button>`).join('');
}
function filtered() {
  const q = norm(state.q.trim());
  let r = P.filter(p => (state.cat === 'Todos' || (state.cat === 'Favoritos' ? favs.has(p.id) : p.cat === state.cat)) &&
    (!q || norm(`${p.name} ${p.cat} ${p.sub}`).includes(q)) &&
    (state.price === 'all' || (state.price === 'lt40' && p.price < 40000) || (state.price === 'mid' && p.price >= 40000 && p.price <= 60000) || (state.price === 'gt60' && p.price > 60000)));
  if (state.sort === 'asc') r.sort((a, b) => a.price - b.price);
  if (state.sort === 'desc') r.sort((a, b) => b.price - a.price);
  if (state.sort === 'az') r.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return r;
}
function renderGrid() {
  const r = filtered(); renderChips();
  $('#resultCount').textContent = r.length === 1 ? '1 producto' : `${r.length} productos`;
  $('#grid').innerHTML = r.length ? r.map((p, i) => card(p, Math.min(i, 8))).join('') :
    `<div class="empty"><h3>${state.cat === 'Favoritos' && !state.q ? 'Aún no tienes favoritos' : 'No encontramos productos'}</h3><p>${state.cat === 'Favoritos' && !state.q ? 'Toca el corazón en cualquier producto para guardarlo aquí.' : 'Prueba con otra búsqueda o quita algún filtro.'}</p><button class="btn ghost" data-act="reset">Limpiar filtros</button></div>`;
}
const extra = () => {
  $('#bestGrid').innerHTML = P.filter(p => p.best).map((p, i) => card(p, i, 'card reveal')).join('');
  $('#newGrid').innerHTML = P.filter(p => p.isNew).map((p, i) => card(p, i, 'card reveal')).join('');
  observe();
};
function setCat(c, scroll) { state.cat = c; renderGrid(); if (scroll) $('#catalogo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }

/* Favoritos */
function toggleFav(id) {
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set('mn_favs', [...favs]);
  $$(`[data-act="fav"][data-id="${id}"]`).forEach(b => b.setAttribute('aria-pressed', favs.has(id)));
  $('#qFav').setAttribute('aria-pressed', favs.has(id));
  bump($('#favCount'), favs.size);
  toast(favs.has(id) ? 'Agregado a favoritos' : 'Quitado de favoritos');
  state.cat === 'Favoritos' ? renderGrid() : renderChips();
}
function bump(el, n) { el.textContent = n; el.dataset.n = n; el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 300); }

/* Carrito */
function saveCart() { store.set('mn_cart', cart); renderCart(); }
function addToCart(id) { const f = cart.find(i => i.id === id); f ? f.qty++ : cart.push({ id, qty: 1 }); saveCart(); toast('Agregado al carrito'); }
function renderCart() {
  const n = cart.reduce((a, i) => a + i.qty, 0); bump($('#cartCount'), n);
  $('#subtotal').textContent = money(cart.reduce((a, i) => a + byId[i.id].price * i.qty, 0));
  $('#checkout').disabled = $('#clearCart').hidden = !cart.length;
  $('#cartItems').innerHTML = cart.length ? cart.map(({ id, qty }) => { const p = byId[id]; return `<div class="crow"><img src="${p.img}&w=128" width="64" height="64" alt=""><div><strong>${esc(p.name)}</strong><small>${money(p.price)}</small><div class="qty"><button data-act="dec" data-id="${id}" aria-label="Quitar una unidad">−</button><span aria-live="polite">${qty}</span><button data-act="inc" data-id="${id}" aria-label="Agregar una unidad">+</button></div></div><button class="rm" data-act="rm" data-id="${id}">Quitar</button></div>`; }).join('') :
    `<div class="empty"><h3>Tu carrito está vacío</h3><p>Los productos que agregues aparecerán aquí.</p><button class="btn primary" data-act="shop">Ver catálogo</button></div>`;
}

/* Diálogos accesibles: foco atrapado, Escape, restaurar foco */
let current = null, lastFocus = null;
const FOCUSABLE = 'a[href],button:not([disabled]),input,select,[tabindex]:not([tabindex="-1"])';
function openDlg(el, withOverlay) {
  closeDlg(true); lastFocus = document.activeElement; current = el; el.hidden = false;
  if (withOverlay) $('#overlay').hidden = false;
  document.body.classList.add('lock');
  $$('.header,main,.footer,.totop').forEach(e => e.inert = true);
  (el.querySelector('[data-close]') || el).focus();
}
function closeDlg(silent) {
  if (!current) return; current.hidden = true; $('#overlay').hidden = true; current = null;
  document.body.classList.remove('lock'); $$('.header,main,.footer,.totop').forEach(e => e.inert = false);
  if (!silent && lastFocus) lastFocus.focus();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (current) closeDlg(); else { setSearch(false); setMenu(false); } }
  if (e.key === 'Tab' && current) {
    const f = $$(FOCUSABLE, current).filter(x => !x.closest('[hidden]')); if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
$('#overlay').addEventListener('click', () => closeDlg());
$('#quick').addEventListener('click', e => { if (e.target === e.currentTarget) closeDlg(); });
$$('[data-close]').forEach(b => b.addEventListener('click', () => closeDlg()));

let qId = null;
function quickView(id) {
  const p = byId[id]; qId = id;
  $('#qImg').src = p.img + '&w=800'; $('#qImg').alt = p.name + ' (imagen de ejemplo)';
  $('#qTitle').textContent = p.name; $('#qCat').textContent = `${p.cat} · ${p.sub} · demo`; $('#qPrice').textContent = money(p.price);
  $('#qFav').setAttribute('aria-pressed', favs.has(id)); openDlg($('#quick'));
}
$('#qAdd').addEventListener('click', () => { addToCart(qId); closeDlg(); });
$('#qFav').addEventListener('click', () => toggleFav(qId));

/* Acciones delegadas */
document.addEventListener('click', e => {
  const cat = e.target.closest('[data-cat]'); if (cat) return setCat(cat.dataset.cat, true);
  const chip = e.target.closest('[data-chip]'); if (chip) return setCat(chip.dataset.chip);
  const b = e.target.closest('[data-act]'); if (!b) return;
  const id = b.dataset.id, a = b.dataset.act;
  if (a === 'add') addToCart(id);
  else if (a === 'fav') toggleFav(id);
  else if (a === 'qv') quickView(id);
  else if (a === 'inc') { cart.find(i => i.id === id).qty++; saveCart(); }
  else if (a === 'dec') { const i = cart.find(x => x.id === id); if (--i.qty < 1) cart = cart.filter(x => x !== i); saveCart(); }
  else if (a === 'rm') { cart = cart.filter(i => i.id !== id); saveCart(); toast('Producto quitado'); }
  else if (a === 'shop') { closeDlg(); $('#catalogo').scrollIntoView(); }
  else if (a === 'reset') { Object.assign(state, { q: '', cat: 'Todos', price: 'all', sort: 'feat' }); $('#searchInput').value = ''; $('#priceSel').value = 'all'; $('#sortSel').value = 'feat'; renderGrid(); }
});
$('#cartBtn').addEventListener('click', () => openDlg($('#cartDrawer'), true));
$('#favBtn').addEventListener('click', () => setCat('Favoritos', true));
$('#checkout').addEventListener('click', () => toast('Demo: aquí se conecta el checkout real. No se procesan pagos.'));
$('#clearCart').addEventListener('click', () => { cart = []; saveCart(); toast('Carrito vaciado'); });
$('#priceSel').addEventListener('change', e => { state.price = e.target.value; renderGrid(); });
$('#sortSel').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });

/* Búsqueda y menú móvil */
function setSearch(open) { $('#searchPanel').hidden = !open; $('#searchBtn').setAttribute('aria-expanded', open); if (open) { setMenu(false); $('#searchInput').focus(); } }
function setMenu(open) { $('#mobileNav').hidden = !open; $('#menuBtn').setAttribute('aria-expanded', open); $('#menuBtn').setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); if (open) setSearch(false); }
$('#searchBtn').addEventListener('click', () => setSearch($('#searchPanel').hidden));
$('#searchClose').addEventListener('click', () => { setSearch(false); $('#searchBtn').focus(); });
$('#menuBtn').addEventListener('click', () => setMenu($('#mobileNav').hidden));
$$('#mobileNav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
let st; $('#searchInput').addEventListener('input', e => {
  clearTimeout(st); st = setTimeout(() => { state.q = e.target.value; renderGrid(); }, 120);
});
$('#searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#catalogo').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });

/* Newsletter (demo, no envía datos) */
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault(); const i = $('#email'), m = $('#newsMsg'), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim());
  i.setAttribute('aria-invalid', !ok); m.classList.toggle('err', !ok);
  m.textContent = ok ? '¡Listo! Esta demostración no guarda ni envía tu correo.' : 'Ingresa un correo válido, por ejemplo nombre@correo.com.';
  if (ok) { i.value = ''; toast('Suscripción simulada'); } else i.focus();
});

/* Datos locales de la demo */
$('#clearDemo').addEventListener('click', () => { store.del('mn_favs'); store.del('mn_cart'); favs = new Set(); cart = []; renderCart(); renderGrid(); extra(); bump($('#favCount'), 0); toast('Datos locales borrados'); });

/* Scroll: progreso, volver arriba, parallax sutil, revelado */
const prog = $('#progress'), up = $('#toTop'), pars = $$('[data-parallax]'); let tick = false;
function onScroll() {
  tick = false; const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`; up.hidden = y < 700;
  if (!reduce && innerWidth > 720) pars.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; el.style.transform = `translate3d(0,${((r.top + r.height / 2 - innerHeight / 2) * -parseFloat(el.dataset.parallax)).toFixed(1)}px,0)`; });
}
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
up.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
function observe() { $$('.reveal:not(.on)').forEach(el => io ? io.observe(el) : el.classList.add('on')); }

/* Inicio */
renderGrid(); extra(); renderCart(); bump($('#favCount'), favs.size); onScroll(); observe(); fixBroken(); addEventListener('load', fixBroken);
})();
