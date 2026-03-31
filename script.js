document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Чайник Керамический 'Уют'", price: 2500, image: 'img/1.jpg', description: 'Элегантный и вместительный керамический чайник. Идеально подходит для семейных чаепитий. Сохраняет тепло надолго.', category: 'Аксессуары', material: 'Керамика', rating: 4, reviews: 12 },
        { id: 2, name: 'Набор Чашек Фарфор (4 шт.)', price: 1800, image: 'img/2.jpg', description: 'Изысканные фарфоровые чашки для настоящих ценителей. Тонкий и прочный материал подчеркнет вкус вашего любимого напитка.', category: 'Посуда', material: 'Фарфор', rating: 5, reviews: 5 },
        { id: 3, name: "Зеленый Чай 'Сенча'", price: 550, image: 'img/3.jpg', description: 'Классический японский зеленый чай (100г) с освежающим вкусом и тонким ароматом. Богат антиоксидантами.', category: 'Чай', material: 'Чай', rating: 3, reviews: 20 },
        { id: 4, name: "Чайник Стеклянный 'Прозрачность'", price: 3100, image: 'img/4.jpg', description: 'Современный чайник из боросиликатного стекла с фильтром из нержавеющей стали. Наблюдайте за завариванием чая.', category: 'Аксессуары', material: 'Стекло', rating: 5, reviews: 18, isNew: true },
        { id: 5, name: 'Набор Пиал "Утро" (2 шт.)', price: 1950, image: 'img/5.jpg', description: 'Две керамические пиалы ручной работы. Идеальны для утреннего чая или матча. Уникальный дизайн.', category: 'Посуда', material: 'Керамика', rating: 4, reviews: 9, isNew: true },
        { id: 6, name: "Черный Чай 'Ассам'", price: 650, image: 'img/6.jpg', description: 'Крепкий и насыщенный черный чай из индийского региона Ассам (100г). Отлично бодрит и подходит для завтрака.', category: 'Чай', material: 'Чай', rating: 5, reviews: 35, isNew: true },
        { id: 7, name: 'Фарфоровое Блюдце (6 шт.)', price: 1200, image: 'img/7.jpg', description: 'Комплект из шести классических фарфоровых блюдец. Дополнят ваш сервиз и защитят стол.', category: 'Посуда', material: 'Фарфор', rating: 4, reviews: 11 },
        { id: 8, name: 'Фильтр-сито для чая', price: 400, image: 'img/8.jpg', description: 'Удобное сито из нержавеющей стали для заваривания листового чая прямо в кружке.', category: 'Аксессуары', material: 'Металл', rating: 5, reviews: 50 },
    ];

    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.modal .close-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const formatCurrency = (number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(number);
    const saveCart = () => localStorage.setItem('cart', JSON.stringify(cart));
    
    const renderRatingStars = (rating) => {
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            const color = i < rating ? 'FFC107' : 'e0e0e0'; 
            starsHTML += `<img src="https://icongr.am/feather/star.svg?size=16&color=${color}" alt="★" class="rating-star">`;
        }
        return starsHTML;
    };

    const updateCartDisplay = () => {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCountSpan = document.getElementById('cart-count');
        const cartTotalAmountSpan = document.getElementById('cart-total-amount');

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Корзина пуста.</p>';
        } else {
            cart.forEach(item => {
                const product = products.find(p => p.id == item.id);
                if (!product) return;

                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                itemCount += item.quantity;

                const li = document.createElement('div');
                li.className = 'cart-item';
                li.innerHTML = `
                    <div class="cart-item-info">
                        <span class="item-name">${product.name}</span>
                        <span>${formatCurrency(product.price)} x ${item.quantity}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                        <button class="remove-item-btn" data-id="${item.id}" title="Удалить">&times;</button>
                    </div>
                `;
                cartItemsContainer.appendChild(li);
            });
        }

        cartTotalAmountSpan.textContent = formatCurrency(total);
        cartCountSpan.textContent = itemCount;
        updateCheckoutPage();
    };
    
    const addToCart = (productId) => {
        const existingItem = cart.find(item => item.id == productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        saveCart();
        updateCartDisplay();
    };

    const updateCartQuantity = (productId, change) => {
        const item = cart.find(item => item.id == productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.id != productId);
        }
        saveCart();
        updateCartDisplay();
    };

    const renderProductCard = (product) => `
        <div class="product-card">
            <a href="product.html?id=${product.id}" class="product-link">
                <div class="product-image"><img src="${product.image}" alt="${product.name}"></div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description.substring(0, 50)}...</p>
                    <div class="rating">${renderRatingStars(product.rating)} <span>(${product.reviews})</span></div>
                    <p class="price">${formatCurrency(product.price)}</p>
                </div>
            </a>
            <button class="primary-btn add-to-cart-btn" data-id="${product.id}">В корзину</button>
        </div>
    `;


    if (document.getElementById('home-product-grid')) {
        const newArrivals = products.filter(p => p.isNew).slice(0, 4); // Show 4 items
        document.getElementById('home-product-grid').innerHTML = newArrivals.map(renderProductCard).join('');
    }

    const productListContainer = document.getElementById('product-list');
    if (productListContainer) {
        let currentFilters = { category: [], material: [] };
        let currentSearchQuery = '';
        
        const applyFiltersAndSearch = () => {
            let filteredProducts = products;

            if (currentSearchQuery) {
                filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(currentSearchQuery));
            }

            if (currentFilters.category.length > 0) {
                filteredProducts = filteredProducts.filter(p => currentFilters.category.includes(p.category));
            }
            if (currentFilters.material.length > 0) {
                filteredProducts = filteredProducts.filter(p => currentFilters.material.includes(p.material));
            }
            
            if (filteredProducts.length === 0) {
                productListContainer.innerHTML = '<p>Товары не найдены.</p>';
            } else {
                productListContainer.innerHTML = filteredProducts.map(renderProductCard).join('');
            }
        };
        
        const urlParams = new URLSearchParams(window.location.search);
        
        const searchQueryFromUrl = urlParams.get('search');
        const searchInput = document.getElementById('search-input-catalog');
        if (searchQueryFromUrl) {
            searchInput.value = searchQueryFromUrl;
            currentSearchQuery = searchQueryFromUrl.toLowerCase();
        }
        
        urlParams.forEach((value, key) => {
            const checkbox = document.querySelector(`input[name="${key}"][value="${value}"]`);
            if (checkbox) {
                checkbox.checked = true;
                if (!currentFilters[key]) currentFilters[key] = [];
                if (!currentFilters[key].includes(value)) currentFilters[key].push(value);
            }
        });

        document.getElementById('filters')?.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const { name, value, checked } = e.target;
                if (checked) {
                    if (!currentFilters[name].includes(value)) currentFilters[name].push(value);
                } else {
                    currentFilters[name] = currentFilters[name].filter(item => item !== value);
                }
                applyFiltersAndSearch();
            }
        });
        
        searchInput?.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase();
            applyFiltersAndSearch();
        });

        document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
             document.querySelectorAll('#filters input[type="checkbox"]').forEach(cb => cb.checked = false);
             currentFilters = { category: [], material: [] };
             applyFiltersAndSearch();
        });

        applyFiltersAndSearch();
    }
    
    const setupSearchRedirect = (buttonId, inputId) => {
        const searchButton = document.getElementById(buttonId);
        const searchInput = document.getElementById(inputId);
        if (searchButton && searchInput) {
            const performSearch = () => {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
                }
            };
            searchButton.addEventListener('click', performSearch);
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    };
    
    setupSearchRedirect('search-btn-main', 'search-input-main');

    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const productId = new URLSearchParams(window.location.search).get('id');
        const product = products.find(p => p.id == productId);

        if (product) {
            document.title = `${product.name} | Посуда и Чай`;
            productDetailContainer.innerHTML = `
                <div class="product-detail-layout">
                    <div class="product-detail-image">
                        <img src="${product.image.replace('300x300', '600x600')}" alt="${product.name}">
                    </div>
                    <div class="product-detail-info">
                        <h1>${product.name}</h1>
                        <p class="price">${formatCurrency(product.price)}</p>
                        <div class="rating">${renderRatingStars(product.rating)} <span>(${product.reviews} отзывов)</span></div>
                        <p class="description">${product.description}</p>
                        <button class="primary-btn large-btn" id="add-to-cart-detail-btn" data-id="${product.id}">Добавить в корзину</button>
                    </div>
                </div>
            `;
        } else {
            productDetailContainer.innerHTML = '<h2>Товар не найден</h2><a href="catalog.html">Вернуться в каталог</a>';
        }
    }
    
    const updateCheckoutPage = () => {
        const checkoutItemsContainer = document.getElementById('checkout-cart-items');
        const checkoutTotalSpan = document.getElementById('checkout-total-amount');
        if(!checkoutItemsContainer) return;

        let total = 0;
        checkoutItemsContainer.innerHTML = '';
        if (cart.length > 0) {
            cart.forEach(item => {
                const product = products.find(p => p.id == item.id);
                if(product){
                    const itemTotal = product.price * item.quantity;
                    total += itemTotal;
                    checkoutItemsContainer.innerHTML += `<div class="cart-item"><span>${product.name} (x${item.quantity})</span> <span>${formatCurrency(itemTotal)}</span></div>`;
                }
            });
        } else {
            checkoutItemsContainer.innerHTML = '<p>Ваша корзина пуста.</p>';
        }
        checkoutTotalSpan.textContent = formatCurrency(total);
    };

    if (document.getElementById('login-form')) {
        const showLoginBtn = document.getElementById('show-login-btn');
        const showRegisterBtn = document.getElementById('show-register-btn');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        showLoginBtn.addEventListener('click', () => {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            showLoginBtn.classList.add('active');
            showRegisterBtn.classList.remove('active');
        });
        showRegisterBtn.addEventListener('click', () => {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            showRegisterBtn.classList.add('active');
            showLoginBtn.classList.remove('active');
        });
    }

    
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.toggle('active');
    });

    cartBtn?.addEventListener('click', () => cartModal.style.display = 'block');
    closeBtn?.addEventListener('click', () => cartModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
    });
    
    document.body.addEventListener('click', (e) => {
        const button = e.target.closest('.add-to-cart-btn, #add-to-cart-detail-btn');
        if (button) {
            const id = button.dataset.id;
            addToCart(id);
            button.textContent = 'Добавлено!';
            button.disabled = true;
            setTimeout(() => { 
                button.textContent = 'В корзину';
                button.disabled = false;
            }, 1500);
        }
    });
    
    document.getElementById('cart-items')?.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('.quantity-btn')) {
            const id = target.dataset.id;
            const change = parseInt(target.dataset.change, 10);
            updateCartQuantity(id, change);
        }
        if (target.matches('.remove-item-btn')) {
            const id = target.dataset.id;
            cart = cart.filter(item => item.id != id);
            saveCart();
            updateCartDisplay();
        }
    });

    updateCartDisplay();
});