// Глобальные переменные
let cart = JSON.parse(localStorage.getItem('zooCart')) || [];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀  ZooHelper JS готов!');
    
    initCart();
    initButtons();
});

// Инициализация корзины
function initCart() {
    updateCartCount();
    document.getElementById('cart-btn').addEventListener('click', toggleCart);
    document.querySelector('.close').addEventListener('click', toggleCart);
    document.getElementById('checkout').addEventListener('click', checkout);
    
    // Закрытие модалки по клику вне её
    document.getElementById('cart-modal').addEventListener('click', function(e) {
        if (e.target === this) toggleCart();
    });
}

// Кнопки "В корзину"
function initButtons() {
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                qty: 1
            };
            
            addToCart(product);
        });
    });
}

// Добавить в корзину
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('zooCart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} добавлен! ✅`);
}

// Обновить счётчик корзины
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('modal-count').textContent = count;
    renderCart();
}

// Показать корзину
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        renderCart();
    }
}

// Отрисовка товаров в корзине
function renderCart() {
    const container = document.getElementById('cart-items');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Корзина пуста 😿 </p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid #eee;">
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="color: #999;">${item.price} ₽ × ${item.qty}</div>
                </div>
                <div style="font-weight: 700; color: #4CAF50;">
                    ${item.price * item.qty} ₽
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('total-price').textContent = total;
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showToast('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const yookassaUrl = `https://yookassa.ru/?amount=${total}`;
    
    // Открываем ЮKassa
    window.open(yookassaUrl, '_blank');
    
    // Симуляция сохранения заказа
    localStorage.setItem('zooLastOrder', JSON.stringify({
        date: new Date().toLocaleString('ru'),
        total: total,
        items: cart.map(item => item.name)
    }));
    
    showToast(`Заказ на ${total} ₽ оформлен! 💳`);
    cart = [];
    localStorage.setItem('zooCart', '[]');
    updateCartCount();
    toggleCart();
}

// Уведомление
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
