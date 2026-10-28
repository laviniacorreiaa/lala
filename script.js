
"use strict";

// PERSONALIZE AQUI:
// Use o DDI + DDD + número, somente números.
// Exemplo: "5511999999999"
// Troque pelo WhatsApp real da sua confeitaria.
const WHATSAPP_NUMBER = "5511999999999";

const products = [
  {
    id: 1, name: "Bolo de Chocolate", category: "Bolos",
    description: "Massa fofinha com brigadeiro cremoso.",
    price: 65,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2, name: "Bolo Red Velvet", category: "Bolos",
    description: "Massa aveludada com creme delicado.",
    price: 78,
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3, name: "Brigadeiros Gourmet", category: "Docinhos",
    description: "Chocolate intenso com granulado especial.",
    price: 35,
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4, name: "Cupcake de Baunilha", category: "Cupcakes",
    description: "Cobertura cremosa e massa macia.",
    price: 12,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5, name: "Cheesecake de Morango", category: "Sobremesas",
    description: "Creme suave com calda de morangos.",
    price: 16,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6, name: "Bolo de Morango", category: "Bolos",
    description: "Recheio cremoso e sabor delicado.",
    price: 72,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7, name: "Macarons", category: "Docinhos",
    description: "Delicados, coloridos e crocantes.",
    price: 9,
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8, name: "Brownie Especial", category: "Sobremesas",
    description: "Chocolate intenso com interior úmido.",
    price: 14,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"
  }
];

let cart = new Map();
let activeCategory = "Todos";
let toastTimer;

const $ = (selector) => document.querySelector(selector);

const money = (value) => value.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderProducts() {
  const visible = products.filter((product) =>
    activeCategory === "Todos" || product.category === activeCategory
  );

  $("#productGrid").innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${escapeHTML(product.name)}"
          loading="lazy">
        <span class="product-category">${escapeHTML(product.category)}</span>
      </div>
      <div class="product-info">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}"
            aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function cartQuantity() {
  let total = 0;
  for (const quantity of cart.values()) total += quantity;
  return total;
}

function cartTotal() {
  let total = 0;
  for (const [id, quantity] of cart) {
    const product = products.find((item) => item.id === id);
    if (product) total += product.price * quantity;
  }
  return total;
}

function renderCart() {
  const entries = [...cart.entries()].filter(([id, quantity]) =>
    products.some((product) => product.id === id) && quantity > 0
  );

  $("#cartCount").textContent = cartQuantity();
  $("#cartTotal").textContent = money(cartTotal());

  if (!entries.length) {
    $("#cartItems").innerHTML = `
      <div class="empty-cart">
        <div style="font-size:42px">♡</div>
        <p>Seu carrinho está esperando por uma delícia!</p>
        <button class="btn btn-primary" id="browseProducts">Ver cardápio</button>
      </div>`;
    return;
  }

  $("#cartItems").innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${escapeHTML(product.name)}">
        <div>
          <h3>${escapeHTML(product.name)}</h3>
          <p>${money(product.price * quantity)}</p>
          <div class="quantity">
            <button data-change="${id}" data-delta="-1"
              aria-label="Diminuir quantidade">−</button>
            <span>${quantity}</span>
            <button data-change="${id}" data-delta="1"
              aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="remove-item" data-remove="${id}">Remover</button>
        </div>
      </article>`;
  }).join("");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

function changeCart(id, delta) {
  const current = cart.get(id) || 0;
  const next = current + delta;

  if (next <= 0) cart.delete(id);
  else cart.set(id, next);

  renderCart();
}

function openCart() {
  $("#cartPanel").classList.add("open");
  $("#overlay").classList.add("visible");
  document.body.classList.add("cart-open");
  $("#closeCart").focus();
}

function closeCart() {
  $("#cartPanel").classList.remove("open");
  $("#overlay").classList.remove("visible");
  document.body.classList.remove("cart-open");
  $("#openCart").focus();
}

function sendWhatsApp(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (!/^\d{12,13}$/.test(number) || /^55(\d)\1+$/.test(number)) {
    showToast("Configure o número de WhatsApp no arquivo script.js.");
    return;
  }

  const url = "https://wa.me/" + number + "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

function checkout() {
  if (cart.size === 0) {
    showToast("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  const name = $("#customerName").value.trim();
  const address = $("#customerAddress").value.trim();
  const notes = $("#customerNotes").value.trim();

  if (!name) {
    $("#customerName").focus();
    showToast("Informe seu nome para continuar.");
    return;
  }

  const lines = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `• ${product.name} x${quantity} — ${money(product.price * quantity)}`;
  });

  const message = [
    "Olá! Gostaria de fazer um pedido na Doce Encanto 🍰",
    "",
    `Nome: ${name}`,
    address ? `Endereço/retirada: ${address}` : "",
    "",
    "MEU PEDIDO:",
    ...lines,
    "",
    `TOTAL DOS PRODUTOS: ${money(cartTotal())}`,
    "",
    notes ? `Observações: ${notes}` : "",
    "",
    "Por favor, confirme a disponibilidade, o prazo e a entrega. Obrigado(a)!"
  ].filter((line) => line !== "").join("\n");

  sendWhatsApp(message);
}

$("#productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const product = products.find((item) => item.id === id);
  if (!product) return;

  changeCart(id, 1);
  showToast(`${product.name} adicionado ao carrinho!`);
});

$("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });
  renderProducts();
});

$("#cartItems").addEventListener("click", (event) => {
  if (event.target.id === "browseProducts") {
    closeCart();
    $("#produtos").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");

  if (change) {
    changeCart(Number(change.dataset.change), Number(change.dataset.delta));
  }

  if (remove) {
    cart.delete(Number(remove.dataset.remove));
    renderCart();
  }
});

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#checkout").addEventListener("click", checkout);

$("#contactButton").addEventListener("click", () => {
  sendWhatsApp("Olá! Gostaria de conhecer o cardápio da Doce Encanto 🍰");
});

$("#menuToggle").addEventListener("click", () => {
  const nav = $("#nav");
  const isOpen = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").setAttribute("aria-label",
    isOpen ? "Fechar menu" : "Abrir menu");
  $("#menuToggle").textContent = isOpen ? "✕" : "☰";
});

$("#nav").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $("#nav").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    $("#menuToggle").setAttribute("aria-label", "Abrir menu");
    $("#menuToggle").textContent = "☰";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("#cartPanel").classList.contains("open")) {
    closeCart();
  }
});

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
