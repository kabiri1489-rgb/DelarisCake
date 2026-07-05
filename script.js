// ===== اسپلش =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const splash = document.getElementById('splash');
        if (splash) splash.classList.add('hidden');
    }, 1200);

    renderCakes();
    updateCartCount();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('fullName').value.trim();
            const age = document.getElementById('age').value.trim();
            const email = document.getElementById('email').value.trim();
            if (name && age && email) {
                localStorage.setItem('user', JSON.stringify({ name, age, email }));
                window.location.href = 'dashboard.html';
            } else {
                showToast('لطفاً همه فیلدها را پر کنید.');
            }
        });
    }

    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuIcon = document.getElementById('menuIcon');
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    const modal = document.getElementById('cakeModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('active');
        }
    });

    if (document.getElementById('cartItems')) renderCart();
    if (document.getElementById('paymentAmount')) {
        renderCart();
        const orderEl = document.getElementById('orderNumber');
        if (orderEl) {
            const num = Math.floor(Math.random() * 9000 + 1000);
            orderEl.textContent = '#DEL-' + num;
        }
    }
});

// ===== داده‌های کیک‌ها =====
const cakes = [
    {
        id: 1,
        name: 'کیک شکلاتی سلطنتی',
        price: 420000,
        desc: 'شکلات تلخ بلژیکی با خامه طبیعی و برش‌های طلایی',
        img: 'https://i.supaimg.com/d3484bf0-3568-4b4d-83d8-32004cd9b325/d70c3f13-4735-413d-922f-226609224b57.jpg',
        isSpecial: false
    },
    {
        id: 2,
        name: 'کیک میوه‌ی بهشتی',
        price: 350000,
        desc: 'لایه‌های اسفنجی با میوه‌های تازه و خامه سبک',
        img: 'https://i.supaimg.com/d3484bf0-3568-4b4d-83d8-32004cd9b325/39e59717-8c40-4adc-8a52-58d155bf1474.jpg',
        isSpecial: false
    },
    {
        id: 3,
        name: 'کیک عروسی رویایی',
        price: 680000,
        desc: 'طراحی سه‌طبقه با گل‌های طبیعی و فوندانت لوکس',
        img: 'https://i.supaimg.com/d3484bf0-3568-4b4d-83d8-32004cd9b325/a38c7750-2487-49d9-b3fb-1c15ee5a89db.jpg',
        isSpecial: false
    },
    {
        id: 4,
        name: 'کیک تولد سلطنتی',
        price: 0,
        desc: '🎂 این کیک توسط اسرا مخصوص تولد امیر ساخته شده و به هیچ‌کس فروخته نمی‌شود.',
        img: 'https://i.supaimg.com/d3484bf0-3568-4b4d-83d8-32004cd9b325/1e28c0ab-f0c5-4266-933b-7f04f8a1a4ec.jpg',
        isSpecial: true
    },
    {
        id: 5,
        name: 'کیک توت‌فرنگی',
        price: 310000,
        desc: 'اسفنج وانیلی با توت‌فرنگی تازه و خامه گل‌بهی',
        img: 'https://i.supaimg.com/d3484bf0-3568-4b4d-83d8-32004cd9b325/21a3f75b-7b8b-477e-be73-55227d605899.jpg',
        isSpecial: false
    }
];

// ===== سبد خرید =====
let cart = JSON.parse(localStorage.getItem('delaris-cart')) || [];

function saveCart() {
    localStorage.setItem('delaris-cart', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = total;
        countEl.style.display = total > 0 ? 'inline' : 'none';
    }
}

// ===== گالری =====
function renderCakes() {
    const grid = document.getElementById('cakeGrid');
    if (!grid) return;

    grid.innerHTML = cakes.map(function(cake) {
        let priceHtml = '';
        let buttonHtml = '';
        let specialClass = '';

        if (cake.isSpecial) {
            specialClass = 'special';
            priceHtml = '<p class="price">👑 فروشی نیست</p>';
            buttonHtml = '<button class="add-to-cart" disabled>فروشی نیست</button>';
        } else {
            priceHtml = `<p class="price">${cake.price.toLocaleString()} تومان</p>`;
            buttonHtml = `<button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${cake.id})">افزودن به سبد</button>`;
        }

        return `
            <div class="cake-card ${specialClass}" onclick="${cake.isSpecial ? '' : 'openModal(' + cake.id + ')'}">
                <img src="${cake.img}" alt="${cake.name}" loading="lazy" />
                <h3>${cake.name}</h3>
                ${priceHtml}
                ${buttonHtml}
            </div>
        `;
    }).join('');
}

// ===== مودال =====
let currentModalId = null;

function openModal(id) {
    const cake = cakes.find(function(c) { return c.id === id; });
    if (!cake || cake.isSpecial) return;

    currentModalId = id;
    document.getElementById('modalImage').src = cake.img;
    document.getElementById('modalName').textContent = cake.name;
    document.getElementById('modalDesc').textContent = cake.desc;
    document.getElementById('modalPrice').textContent = cake.price.toLocaleString() + ' تومان';
    document.getElementById('modalPrice').className = 'price';
    document.getElementById('modalAddBtn').style.display = 'inline-block';
    document.getElementById('modalAddBtn').className = 'btn-enter';
    document.getElementById('modalAddBtn').innerHTML = 'افزودن به سبد خرید';
    document.getElementById('cakeModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('cakeModal').classList.remove('active');
    document.body.style.overflow = '';
}

function addToCartFromModal() {
    if (currentModalId) {
        addToCart(currentModalId);
        closeModal();
    }
}

// ===== افزودن به سبد =====
function addToCart(id) {
    const cake = cakes.find(function(c) { return c.id === id; });
    if (!cake || cake.isSpecial) return;

    const existing = cart.find(function(item) { return item.id === id; });
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: id, quantity: 1 });
    }
    saveCart();
    showToast('به سبد خرید اضافه شد 🎂');
}

// ===== حذف از سبد =====
function removeFromCart(id) {
    const index = cart.findIndex(function(item) { return item.id === id; });
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        renderCart();
    }
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('آیا از پاک کردن کامل سبد خرید مطمئن هستید؟')) {
        cart = [];
        saveCart();
        renderCart();
        showToast('سبد خرید پاک شد');
    }
}

// ===== رندر سبد =====
function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const paymentAmount = document.getElementById('paymentAmount');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">سبد خرید خالی است 🛒</div>';
        if (totalEl) totalEl.textContent = '۰ تومان';
        if (paymentAmount) paymentAmount.textContent = '۰ تومان';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(function(item) {
        const cake = cakes.find(function(c) { return c.id === item.id; });
        if (!cake || cake.isSpecial) return '';
        const subtotal = cake.price * item.quantity;
        total += subtotal;
        return `
            <div class="cart-item">
                <span class="item-name">${cake.name}</span>
                <div>
                    <span class="item-qty">${item.quantity} × ${cake.price.toLocaleString()} تومان</span>
                    <span class="item-remove" onclick="removeFromCart(${item.id})">✕</span>
                </div>
            </div>
        `;
    }).join('');

    const totalText = total.toLocaleString() + ' تومان';
    if (totalEl) totalEl.textContent = totalText;
    if (paymentAmount) paymentAmount.textContent = totalText;
}

// ===== Toast =====
function showToast(message) {
    const oldToast = document.querySelector('.toast-msg');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s ease';
        setTimeout(function() { toast.remove(); }, 500);
    }, 2500);
}

// ===== صفحه‌گردانی =====
function goToMenu() { window.location.href = 'menu.html'; }
function goToDashboard() { window.location.href = 'dashboard.html'; }
function goToCart() { window.location.href = 'cart.html'; }
function goToPayment() {
    if (cart.length === 0) {
        showToast('سبد خرید خالی است!');
        return;
    }
    window.location.href = 'payment.html';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function logout() {
    if (confirm('آیا از خروج از حساب خود مطمئن هستید؟')) {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

function processPayment() {
    if (cart.length === 0) {
        showToast('سبد خرید خالی است!');
        return;
    }
    showToast('🔄 اتصال به درگاه شتاب...');
    setTimeout(function() {
        showToast('✅ پرداخت با موفقیت انجام شد!');
        cart = [];
        saveCart();
        setTimeout(function() { window.location.href = 'dashboard.html'; }, 1000);
    }, 2000);
}
