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

// ДОБАВИТЬ В КОРЗИНУ
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

// УДАЛИТЬ ИЗ КОРЗИНЫ (НОВОЕ!)
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('zooCart', JSON.stringify(cart));
    updateCartCount();
    showToast('Товар удалён! 🗑️ ');
}

// ИЗМЕНИТЬ КОЛИЧЕСТВО (НОВОЕ!)
function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('zooCart', JSON.stringify(cart));
            updateCartCount();
        }
    }
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

// ✅ ОТРИСОВКА КОРЗИНЫ С КНОПКАМИ УДАЛЕНИЯ (+/-)
function renderCart() {
    const container = document.getElementById('cart-items');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.2rem; padding: 2rem;">Корзина пуста 😿 <br><a href="#products" style="color: #4CAF50;">Выберите товары</a></p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px; margin-bottom: 1rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="font-weight: 700; font-size: 1.1rem; color: #2E7D32;">${item.name}</div>
                    <div style="font-weight: 700; color: #4CAF50; font-size: 1.3rem;">
                        ${item.price * item.qty} ₽
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 1rem; background: white; padding: 0.8rem 1.5rem; border-radius: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
<button onclick="changeQuantity('${item.id}', -1)" style="width: 40px; height: 40px; border: none; background: #FF6B35; color: white; border-radius: 50%; font-size: 1.2rem; cursor: pointer; font-weight: bold;">−</button>
                        <span style="font-weight: 700; font-size: 1.3rem; min-width: 30px; text-align: center;">${item.qty}</span>
                        <button onclick="changeQuantity('${item.id}', 1)" style="width: 40px; height: 40px; border: none; background: #4CAF50; color: white; border-radius: 50%; font-size: 1.2rem; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" style="padding: 10px 20px; background: linear-gradient(45deg, #f44336, #d32f2f); color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer; box-shadow: 0 5px 15px rgba(244,67,54,0.4);">
                        🗑️  Удалить
                    </button>
                </div>
                <div style="margin-top: 0.8rem; color: #666; font-size: 0.95rem;">
                    ${item.price} ₽ × ${item.qty}
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('total-price').textContent = total.toLocaleString();
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showToast('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    window.open(`https://yookassa.ru/?amount=${total}`, '_blank');
    
    localStorage.setItem('zooLastOrder', JSON.stringify({
        date: new Date().toLocaleString('ru'),
        total: total,
        items: cart.map(item => item.name)
    }));
    
    showToast(`Заказ на ${total.toLocaleString()} ₽ оформлен! 💳`);
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
// Каталог: переключение категорий
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Активная вкладка
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.dataset.category;
        const products = document.querySelectorAll('.product-card.small');
        
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.classList.remove('hidden');
            } else {
                product.classList.add('hidden');
            }
        });
    });
});

// Инициализация кнопок маленьких карточек
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('buy-btn') && e.target.classList.contains('small')) {
        const card = e.target.closest('.product-card');
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseInt(card.dataset.price),
            qty: 1
        };
        addToCart(product);
    }
});
card.dataset.id
porkbun.com | parked domain
dataset.id has been registered at Porkbun but the owner has not put up a site yet. Visit again soon to see what amazing website they decide to build.
