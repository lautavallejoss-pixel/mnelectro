const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = n => '$' + Number(n).toLocaleString('es-AR');
let cart = [];
let activeProduct = null;

const toast = (message) => {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(()=>el.classList.remove('show'), 2300);
};

// Reveal elements as the visitor scrolls.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }});
},{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

// Mobile navigation.
$('#menuToggle').addEventListener('click',()=>$('#mobileNav').classList.toggle('open'));
$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>$('#mobileNav').classList.remove('open')));

// Search panel and live product filtering.
$('#searchToggle').addEventListener('click',()=>{ $('#searchPanel').classList.toggle('open'); if($('#searchPanel').classList.contains('open')) $('#searchInput').focus(); });
$('#searchClose').addEventListener('click',()=>$('#searchPanel').classList.remove('open'));
$('#searchInput').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  $$('.product-card').forEach(card=>card.style.display=card.dataset.name.toLowerCase().includes(q)||card.dataset.category.toLowerCase().includes(q)?'':'none');
  if(q) $('#productos').scrollIntoView({behavior:'smooth',block:'start'});
});

// Category and product filters.
function setFilter(filter){
  $$('.filter-chip').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  $$('.product-card').forEach(card=>card.style.display=(filter==='Todos'||card.dataset.category===filter)?'':'none');
}
$$('.filter-chip').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
$$('.category-card').forEach(card=>card.addEventListener('click',()=>setFilter(card.dataset.filter)));

// Favorites are local demo interactions.
$$('.favorite').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('selected');btn.textContent=btn.classList.contains('selected')?'♥':'♡';toast(btn.classList.contains('selected')?'Agregado a favoritos':'Quitado de favoritos');}));

// Cart drawer.
const drawerOpen=()=>{$('#cartOverlay').classList.add('open');$('#cartDrawer').classList.add('open');document.body.style.overflow='hidden';};
const drawerClose=()=>{$('#cartOverlay').classList.remove('open');$('#cartDrawer').classList.remove('open');document.body.style.overflow='';};
$('#cartOpen').addEventListener('click',drawerOpen);$('#cartClose').addEventListener('click',drawerClose);$('#cartOverlay').addEventListener('click',drawerClose);
$('#continueShopping').addEventListener('click',drawerClose);
function addToCart(product){
  const found=cart.find(p=>p.name===product.name);
  if(found) found.qty++; else cart.push({...product,qty:1});
  renderCart();toast('Producto agregado al carrito');
}
function renderCart(){
  const count=cart.reduce((n,p)=>n+p.qty,0);
  $('#cartCount').textContent=count;
  $('#cartItems').innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>${p.qty} × ${money(p.price)}</small></div><button data-remove="${i}" aria-label="Quitar producto">✕</button></div>`).join(''):`<div class="empty-cart"><span>◇</span><h4>Tu carrito está vacío</h4><p>Cuando agregues productos, los vas a encontrar acá.</p><button class="button button-primary" id="continueShopping">Seguir explorando</button></div>`;
  $('#cartSubtotal').textContent=money(cart.reduce((n,p)=>n+p.price*p.qty,0));
  const cont=$('#continueShopping'); if(cont) cont.addEventListener('click',drawerClose);
  $$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);renderCart();}));
}
$$('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{
  const card=btn.closest('.product-card');
  addToCart({name:card.dataset.name,price:Number(card.dataset.price),image:$('.product-image img',card).src});
}));
$('#checkoutButton').addEventListener('click',()=>toast('Demo: conectá este paso al canal de compra real de la tienda.'));

// Quick-view product modal.
function openModal(card){
  activeProduct={name:card.dataset.name,price:Number(card.dataset.price),image:$('.product-image img',card).src};
  $('#modalTitle').textContent=activeProduct.name;$('#modalPrice').textContent=money(activeProduct.price);
  $('#modalImage').src=activeProduct.image;$('#modalImage').alt=activeProduct.name;
  $('#modalBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeModal(){$('#modalBackdrop').classList.remove('open');document.body.style.overflow='';}
$$('.quick-view').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.closest('.product-card'))));
$('#modalClose').addEventListener('click',closeModal);
$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});
$('#modalAdd').addEventListener('click',()=>{if(activeProduct)addToCart(activeProduct);closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();drawerClose();$('#searchPanel').classList.remove('open');}});

// Newsletter is a front-end demo; no data is sent or stored.
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();$('#newsletterMessage').textContent='¡Gracias! Esta demostración todavía no envía suscripciones.';$('#emailInput').value='';});

// Account action placeholder.
$('#accountButton').addEventListener('click',()=>toast('La cuenta de usuario se conecta desde la plataforma de la tienda.'));
