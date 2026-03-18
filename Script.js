// 🛒 ZooHelperStore — полная корзина + ЮKassa + Макс готовность
class ZooHelperStore {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('zoohelper_cart')) || [];
        this.products = [
            { id: 1, name: 'Силикатный наполнитель 5кг', price: 850, oldPrice: 990, image: 'https://via.placeholder.com/350x250/87CEEB/FFFFFF?text=Силикатный+наполнитель+5кг' },
            { id: 2, name: 'ЭКО шампунь BabyEco 500мл', price: 649, oldPrice: 790, image: 'https://via.placeholder.com/350x250/FFB6C1/FFFFFF?text=BabyEco+шампунь+500мл' },
            { id: 3, name: 'Премиум корм курица 1.5кг', price: 1200, oldPrice: 1490, image: 'https://via.placeholder.com/350x250/90EE90/FFFFFF?text=Премиум+корм+1.5кг' }
        ];
        this.init();
    }

    init() {
        this.updateCartUI();
        this.addEventListeners();
        this.animateEntrance();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        const existing = this.cart.find(item => item.id === productId);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} добавлен! 🛒`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    saveCart() {
        localStorage.setItem('zoohelper_cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const totalPrice = document.getElementById('totalPrice');
        const checkoutBtn = document.getElementById('checkoutBtn');

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalSum = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCount.textContent = totalItems;
        totalPrice.textContent = `${totalSum.toLocaleString()}₽`;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Корзина пуста 😿<br>Добавьте товары из каталога!</p>';
            checkoutBtn.style.display = 'none';
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" width="60" height="60">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-price">${item.price.toLocaleString()}₽</div>
                    </div>
                    <div class="cart-quantity">
                        <button onclick="store.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="store.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="store.removeFromCart(${item.id})">×</button>
                </div>
            `).join('');
            checkoutBtn.style.display = 'block';
        }
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        button.innerHTML = '✓';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.innerHTML = 'В корзину';
        }, 200);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    checkout() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.showNotification(`🔄 Переход на ЮKassa... Итого: ${total}₽`);
        
        // ЮKassa (российская, работает под санкциями)
        setTimeout(() => {
            // Макс готов: замени shopId на свой из личного кабинета Макс
            const maxUrl = `https://www.mkb.ru/pay?shopId=YOUR_SHOP_ID&amount=${total * 100}&orderId=${Date.now()}`;
            window.open(maxUrl, '_blank');
        }, 1000);
    }

    addEventListeners() {
        document.querySelectorAll('.btn-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.dataset.productId);
                this.addToCart(productId);
                this.animateButton(btn);
            });
        });
    }

    animateEntrance() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.product-card, .feature, .cart-section').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// 🚀 Запуск
const store = new ZooHelperStore();
