/* ========================================
   Zoohelper34 - E-commerce Application
   Vanilla JS SPA | localStorage PWA
   Middle+ Frontend Architecture
========================================= */

// Global State Management
// 🔥 РЕАЛЬНЫЕ ФОТО из /img/ (TinyPNG качество)
STATE.products = [
    { id: 1,  name: 'Bach Rescue Remedy Pet 10мл',  price: 1200, img: 'img/bach-rescue.webp',        desc: 'Антистресс пипетка 10мл' },
    { id: 2,  name: 'Gelacan Darling',              price: 950,  img: 'img/gelacan-darling.webp',   desc: 'Жевательная паста' },
    { id: 3,  name: 'TIAKI Silikon Slow Feeder',    price: 1800, img: 'img/tiaki-mandala.webp',    desc: 'Мандала медленный фидер' },
    { id: 4,  name: 'Zesty Paws Healthy Aging 60г', price: 2200, img: 'img/zesty-paws.webp',       desc: 'NAD+ для пожилых собак' },
    { id: 5,  name: 'Eheim Substrat Pro 720г',      price: 1100, img: 'img/eheim-substrat.webp',   desc: 'Биофильтр аквариум' },
    { id: 6,  name: 'ZARAHOME Pet Bowl Stand',      price: 1400, img: 'img/zarahome-bowl.webp',    desc: 'Миска с подставкой' },
    { id: 7,  name: 'Rojeco Интерактивный мяч',     price: 750,  img: 'img/rojeco-ball.webp',      desc: 'Игрушка для кошек' },
    { id: 8,  name: 'DERMOSCENT Крем для кожи',     price: 1600, img: 'img/dermescent-cream.webp', desc: 'Уход за кожей собак' },
    { id: 9,  name: 'DERMOSCENT Pyoclean',          price: 1300, img: 'img/pyoclean.webp',         desc: 'Очиститель ушей' },
    { id: 10, name: 'Trixie Пальто для собак',      price: 1900, img: 'img/trixie-coat.webp',      desc: 'Тёплая куртка' },
    { id: 11, name: 'Inodorina Песок 6L',           price: 1000, img: 'img/inodorina-sand.webp',   desc: 'Без запаха для кошек' },
    { id: 12, name: 'Pro Plan Пробиотик кошки',     price: 1700, img: 'img/proplan-probiotic.webp',desc: 'Поддержка пищеварения' },
    { id: 13, name: 'Ruffwear Харнес',              price: 3500, img: 'img/ruffwear-harness.webp', desc: 'Универсальный для собак' }
];

    cart: JSON.parse(localStorage.getItem('cart')) || [],
    user: JSON.parse(localStorage.getItem('user')) || { name: '', phone: '', email: '' },
    orders: JSON.parse(localStorage.getItem('orders')) || []
};

// Application Initialization
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    renderProducts();
    updateCartUI();
    initCabinet();
    setupEventListeners();
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(searchProducts, 300));
    searchInput.addEventListener('keypress', e => e.key === 'Enter' && searchProducts());
}

// Catalog Module
function renderProducts(filter = '') {
    const grid = document.getElementById('productsGrid');
    const filtered = STATE.products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="price">${p.price.toLocaleString()}₽</div>
            <button onclick="addToCart(${p.id})">🛒 В корзину</button>
        </div>
    `).join('') || '<p style="grid-column:1/-1;text-align:center;color:#666;padding:50px;">Товары не найдены</p>';
    console.log('Rendered products:', filtered.length);
}

function searchProducts() {
    const query = document.getElementById('searchInput').value;
    renderProducts(query);
}

// Cart Module
function addToCart(id) {
    const product = STATE.products.find(p => p.id === id);
    const existing = STATE.cart.find(item => item.id === id);
    if (existing) existing.qty += 1;
    else STATE.cart.push({ ...product, qty: 1 });
    syncStorage('cart');
    updateCartUI();
    showToast('✅ Добавлено в корзину!');
}

function updateCartUI() {
    document.getElementById('cartCount').textContent = STATE.cart.reduce((sum, item) => sum + item.qty, 0) || 0;
}

function renderCart() {
    const cartEl = document.getElementById('cartItems');
    cartEl.innerHTML = STATE.cart.length ? STATE.cart.map(item => `
        <div class="cart-item">
            <span>${item.name} × 
                <input type="number" value="${item.qty}" min="1" onchange="updateQty(${item.id}, this.value)" style="width:60px;">
            </span>
            <span>${(item.price * item.qty).toLocaleString()}₽</span>
            <button onclick="removeFromCart(${item.id})">❌</button>
        </div>
    `).join('') : '<p style="text-align:center;color:#666;padding:40px;">Корзина пуста</p>';
    document.getElementById('totalPrice').textContent = STATE.cart.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString() || 0;
}

function updateQty(id, qty) {
    const item = STATE.cart.find(item => item.id === id);
    if (item) {
        item.qty = Math.max(1, parseInt(qty) || 1);
        syncStorage('cart');
        renderCart();
    }
}

function removeFromCart(id) {
    STATE.cart = STATE.cart.filter(item => item.id !== id);
    syncStorage('cart');
    renderCart();
    updateCartUI();
    showToast('🗑️ Удалено из корзины');
}

// Cabinet Module
function initCabinet() {
    document.getElementById('userName').value = STATE.user.name;
    document.getElementById('userPhone').value = STATE.user.phone;
    document.getElementById('userEmail').value = STATE.user.email;
    renderOrders();
}

function saveProfile() {
    STATE.user.name = document.getElementById('userName').value;
    STATE.user.phone = document.getElementById('userPhone').value;
    STATE.user.email = document.getElementById('userEmail').value;
    syncStorage('user');
    showToast('✅ Профиль сохранён!');
}

function renderOrders() {
    const ordersEl = document.getElementById('ordersList');
    ordersEl.innerHTML = STATE.orders.length ? STATE.orders.map(order => `
        <div class="order-item">
            <strong>Заказ #${order.id} | ${new Date(order.date).toLocaleDateString('ru')} | ${order.total.toLocaleString()}₽</strong>
        </div>
    `).join('') : '<p style="text-align:center;color:#666;">Нет заказов</p>';
}

// Checkout Module
function checkout() {
    if (STATE.cart.length === 0) return showToast('❌ Корзина пуста!');
    saveOrder();
}

function saveOrder() {
    const total = STATE.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = { 
        id: Date.now().toString().slice(-6), 
        date: new Date().toISOString(), 
        total, 
        items: STATE.cart.map(i => ({...i})) 
    };
    STATE.orders.unshift(order);
    syncStorage('orders');
    STATE.cart = [];
    syncStorage('cart');
    updateCartUI();
    renderCart();
    showToast(`🎉 Заказ #${order.id} сохранён!`);
}

// SPA Navigation
function showSection(sectionId) {
    document.querySelectorAll('.page-section, .catalog').forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    if (sectionId === 'catalog') {
        document.getElementById('catalog').style.display = 'block';
    } else {
        document.getElementById(sectionId).classList.add('active');
        document.getElementById(sectionId).style.display = 'block';
    }
    if (sectionId === 'cart') renderCart();
    if (sectionId === 'cabinet') initCabinet();
}

// Utilities
function syncStorage(key) {
    localStorage.setItem(key, JSON.stringify(STATE[key]));
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
