const STORAGE_KEY = 'cusTgom-cart';

function getCart() {
  const cartJSON = localStorage.getItem(STORAGE_KEY);
  if (!cartJSON) return [];
  try {
    return JSON.parse(cartJSON);
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (!existing) {
    cart.push({ ...product, quantity: 1 });
    saveCart(cart);
    updateCartCounter();
  }
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartUI();
  updateCartCounter();
}

function updateCartCounter() {
  const cart = getCart();
  const total = cart.length;
  const counter = document.querySelector('#cart-counter');
  if (counter) {
    counter.textContent = total;
    counter.style.display = total > 0 ? 'inline' : 'none';
  }
}

function updateCartUI() {
  const cart = getCart();
  const list = document.querySelector('#cart-items');
  const totalPriceElem = document.querySelector('#cart-total');
  if (!list || !totalPriceElem) return;

  if (cart.length === 0) {
    list.innerHTML = '<li>Your cart is empty.</li>';
    totalPriceElem.textContent = '$0.00';
    return;
  }

  list.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span class="cart-item-title">${item.name}</span>
      <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
      <button class="remove-btn" data-id="${item.id}" aria-label="Remove ${item.name}">&times;</button>
    `;
    list.appendChild(li);
  });

  totalPriceElem.textContent = '$' + total.toFixed(2);

  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
    };
  });
}

function setupCartModal() {
  const openBtn = document.querySelector('#open-cart');
  const modal = document.querySelector('#cart-modal');
  const closeBtn = document.querySelector('#close-cart');

  if (!openBtn || !modal || !closeBtn) return;

  openBtn.onclick = () => {
    updateCartUI();
    modal.classList.remove('hidden');
    modal.focus();
  };

  closeBtn.onclick = () => {
    modal.classList.add('hidden');
  };

  window.onclick = e => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  };
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  alert('Thank you for your purchase!');
  localStorage.removeItem(STORAGE_KEY);
  updateCartCounter();
  updateCartUI();
  document.querySelector('#cart-modal').classList.add('hidden');
}

function initCart() {
  updateCartCounter();
  setupCartModal();

  const checkoutBtn = document.querySelector('#checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = checkout;
  }

  document.querySelectorAll('.buy-button').forEach(button => {
    button.onclick = () => {
      const card = button.closest('.product-card');
      const id = card.getAttribute('data-id');
      const name = card.querySelector('h3').textContent;
      const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
      addToCart({ id, name, price, quantity: 1 });
    };
  });
}

initCart();
