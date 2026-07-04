// ===== داده‌های کیک‌ها =====
const cakes = [
    { id: 1, name: 'کیک شکلاتی سلطنتی', price: 420000, desc: 'شکلات تلخ بلژیکی با خامه‌ی طبیعی و برش‌های طلایی', img: 'images/cake1.jpg' },
    { id: 2, name: 'کیک میوه‌ی بهشتی', price: 350000, desc: 'لایه‌های اسفنجی با میوه‌های تازه و خامه‌ی سبک', img: 'images/cake2.jpg' },
    { id: 3, name: 'کیک عروسی رویایی', price: 680000, desc: 'طراحی سه‌طبقه با گل‌های طبیعی و فوندانت لوکس', img: 'images/cake3.jpg' },
    { id: 4, name: 'کیک تولد سلطنتی', price: 390000, desc: 'با تم طلایی و شکلاتی، مخصوص جشن‌های ویژه', img: 'images/cake4.jpg' },
    { id: 5, name: 'کیک توت‌فرنگی', price: 310000, desc: 'اسفنج وانیلی با توت‌فرنگی تازه و خامه‌ی گل‌بهی', img: 'images/cake5.jpg' },
    { id: 6, name: 'کیک شکلات-قهوه', price: 450000, desc: 'ترکیب بی‌نظیر قهوه و شکلات تلخ با گاناش طلایی', img: 'images/cake6.jpg' }
];

// ===== سبد خرید =====
let cart = JSON.parse(localStorage.getItem('dolaris-cart')) || [];

// ===== ذخیره‌سازی سبد =====
function saveCart() {
    localStorage.setItem('dolaris-cart', JSON.stringify(cart));
    updateCartCount();
}

// ===== به‌روزرسانی تعداد سبد =====
function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = total;
        countEl.style.display = total > 0 ? 'inline' : 'none';
    }
}

// ===== نمایش کیک‌ها در گالری =====
function renderCakes() {
    const grid = document.getElementById('cakeGrid');
    if (!grid) return;
    grid.innerHTML = cakes.map(cake => `
        <div class="cake-card glass-card" onclick="openModal(${cake.id})">
            <img src="${cake.img}" alt="${cake.name}" loading="lazy" />
            <h3>${cake.name}</h3>
            <p class="price">${cake.price.toLocaleString()} تومان</p>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${cake.id})">
                افزودن به سبد
            </button>
        </div>
    `).join('');
}

// ===== مودال =====
let currentModalId = null;

function openModal(id) {
    const cake = cakes.find(c => c.id === id);
    if (!cake) return;
    currentModalId = id;
    document.getElementById('modalImage').src = cake.img;
    document.getElementById('modalName').textContent = cake.name;
    document.getElementById('modalDesc').textContent = cake.desc;
    document.getElementById('modalPrice').textContent = cake.price.toLocaleString() + ' تومان';
    document.getElementById('cakeModal').classList.add('active');
}

function closeModal() {
    document.getElementById('cakeModal').classList.remove('active');
}

function addToCartFromModal() {
    if (currentModalId) {
        addToCart(currentModalId);
        closeModal();
    }
}

// ===== افزودن به سبد =====
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, quantity: 1 });
    }
    saveCart();
    showToast('به سبد خرید اضافه شد 🎂');
}

// ===== حذف از سبد =====
function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
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

// ===== پاک کردن کل سبد =====
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('آیا از پاک کردن کامل سبد خرید مطمئن هستید؟')) {
        cart = [];
        saveCart();
        renderCart();
        showToast('سبد خرید پاک شد');
    }
}

// ===== نمایش سبد خرید در صفحه‌ی cart.html =====
function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">سبد خرید خالی است 🛒</div>';
        if (totalEl) totalEl.textContent = '۰ تومان';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const cake = cakes.find(c => c.id === item.id);
        if (!cake) return '';
        const price = cake.price;
        const subtotal = price * item.quantity;
        total += subtotal;
        return `
            <div class="cart-item">
                <span class="item-name">${cake.name}</span>
                <div>
                    <span class="item-qty">${item.quantity} × ${price.toLocaleString()} تومان</span>
                    <span class="item-remove" onclick="removeFromCart(${item.id})">✕</span>
                </div>
            </div>
        `;
    }).join('');

    if (totalEl) {
        totalEl.textContent = total.toLocaleString() + ' تومان';
    }

    // به‌روزرسانی مبلغ پرداخت در صفحه‌ی پرداخت
    const paymentAmount = document.getElementById('paymentAmount');
    if (paymentAmount) {
        paymentAmount.textContent = total.toLocaleString() + ' تومان';
    }
}

// ===== پیام کوتاه (Toast) =====
function showToast(msg) {
    const old = document.querySelector('.toast-msg');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(20,20,20,0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(200,164,140,0.15)',
        color: '#f0dfd4',
        padding: '14px 28px',
        borderRadius: '60px',
        fontFamily: 'Playfair Display, serif',
        fontSize: '1rem',
        zIndex: '3000',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        animation: 'fadeUp 0.5s ease forwards'
    });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// ===== توابع صفحه‌گردانی =====
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

// ===== اسکرول به بخش =====
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toggleSidebar();
    }
}

// ===== خروج =====
function logout() {
    if (confirm('آیا از خروج مطمئن هستید؟')) {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// ===== منوی همبرگری =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// ===== ثبت‌نام =====
document.addEventListener('DOMContentLoaded', function() {
    // انیمیشن اسکرول
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ثبت‌نام
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('fullName').value.trim();
            const age = document.getElementById('age').value.trim();
            const email = document.getElementById('email').value.trim();
            if (name && age && email) {
                localStorage.setItem('user', JSON.stringify({ name, age, email }));
                window.location.href = 'dashboard.html';
            } else {
                showToast('لطفاً همه فیلدها را پر کنید');
            }
        });
    }

    // رندر گالری
    renderCakes();

    // رندر سبد خرید در صفحه‌ی سبد
    if (window.location.pathname.includes('cart.html') || document.getElementById('cartItems')) {
        renderCart();
    }

    // به‌روزرسانی سبد در همه‌جا
    updateCartCount();

    // تنظیم مبلغ پرداخت در صفحه‌ی پرداخت
    if (window.location.pathname.includes('payment.html')) {
        renderCart(); // این تابع مبلغ را به‌روز می‌کند
        // شماره سفارش تصادفی
        const orderEl = document.getElementById('orderNumber');
        if (orderEl) {
            const num = Math.floor(Math.random() * 9000 + 1000);
            orderEl.textContent = `#DOL-2024-${num}`;
        }
    }

    // بستن سایدبار با کلیک بیرون
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuIcon = document.getElementById('menuIcon');
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // بستن مودال با کلیک بیرون
    document.getElementById('cakeModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // بستن مودال با دکمه ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('active');
        }
    });
});

// ===== پرداخت =====
function processPayment() {
    if (cart.length === 0) {
        showToast('سبد خرید خالی است!');
        return;
    }
    const total = cart.reduce((sum, item) => {
        const cake = cakes.find(c => c.id === item.id);
        return sum + (cake ? cake.price * item.quantity : 0);
    }, 0);

    showToast('🔄 اتصال به درگاه شتاب...');
    
    setTimeout(() => {
        showToast('✅ پرداخت با موفقیت انجام شد!');
        cart = [];
        saveCart();
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    }, 1800);
}

// ===== جلوگیری از ریفرش فرم =====
window.addEventListener('beforeunload', function() {
    // هیچ کاری لازم نیست
});

