/* DATOS DE DEMOSTRACIÓN — reemplazar por el catálogo real de MNELECTRO.
   Nombres, precios y categorías son ejemplos; no representan stock ni ofertas reales. */
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75`;
window.MN_PRODUCTS = [
  { id: 'p1', name: 'Auriculares inalámbricos', cat: 'Audio', sub: 'Inalámbrico', price: 45900, img: U('1606220945770-b5b6c2c55bf1'), tag: 'Destacado', best: true },
  { id: 'p2', name: 'Smartwatch Series', cat: 'Wearables', sub: 'Smart', price: 62900, img: U('1523275335684-37898b6baf30'), tag: 'Nuevo', isNew: true, best: true },
  { id: 'p3', name: 'Parlante portátil', cat: 'Audio', sub: 'Portátil', price: 38900, img: U('1608043152269-423dbba4e7e1'), tag: '', best: true },
  { id: 'p4', name: 'Cámara de seguridad Wi-Fi', cat: 'Smart home', sub: 'Seguridad', price: 54900, img: U('1557324232-b8917d3c3dcb'), tag: 'Selección MN' },
  { id: 'p5', name: 'Smartphone (modelo demo)', cat: 'Celulares', sub: 'Conectividad', price: 289900, img: U('1592750475338-74b7b21085ab'), tag: 'Nuevo', isNew: true },
  { id: 'p6', name: 'Auriculares over-ear', cat: 'Audio', sub: 'Studio', price: 71900, img: U('1505740420928-5e560c06d30e'), tag: '' },
  { id: 'p7', name: 'Cargador rápido USB-C', cat: 'Accesorios', sub: 'Energía', price: 12900, img: U('1498049794561-7780e7231661'), tag: '' },
  { id: 'p8', name: 'Reloj deportivo (modelo demo)', cat: 'Wearables', sub: 'Movimiento', price: 48900, img: U('1544117519-31a4b719223d'), tag: '', isNew: true }
];
window.MN_CATEGORIES = ['Todos', 'Celulares', 'Audio', 'Wearables', 'Accesorios', 'Smart home'];
