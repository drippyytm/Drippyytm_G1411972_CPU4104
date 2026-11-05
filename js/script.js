
/* ==========================================
   GLOBALSTEPPER
   COMPLETE WEBSITE JAVASCRIPT
   THE ARCHIVE - ALL FOUR PRODUCTS SOLD OUT
========================================== */

"use strict";

/* ==========================================
   SETTINGS AND PRODUCT DATA
========================================== */

const CART_STORAGE_KEY = "globalstepperCart";
const WISHLIST_STORAGE_KEY = "globalstepperWishlist";
const THEME_STORAGE_KEY = "globalstepperTheme";

const ARCHIVE_SOLD_OUT_IDS = new Set([
  "1", "2", "3", "4"
]);

const products = [
  {
    id: "1",
    name: "Grey No Love Lost Tracksuit",
    price: 185.99,
    image: "media/images/global tracksuit 1.jpeg",
    category: "Tracksuits",
    description:
      "A premium grey tracksuit featuring the GLOBALSTEPPER No Love Lost design."
  },
  {
    id: "2",
    name: "Black Been Da Goat Tracksuit",
    price: 185.99,
    image: "media/images/global tracksuit 2.jpeg",
    category: "Tracksuits",
    description:
      "A statement black tracksuit featuring the GLOBALSTEPPER Been Da Goat design."
  },
  {
    id: "3",
    name: "Signature Tracksuit",
    price: 179.99,
    image: "media/images/global tracksuit 3.jpeg",
    category: "Tracksuits",
    description:
      "A signature GLOBALSTEPPER tracksuit made for a bold streetwear look."
  },
  {
    id: "4",
    name: "Grey Logo Short Set",
    price: 125.99,
    image: "media/images/shortset.jpeg",
    category: "Short Sets",
    description:
      "A matching grey T-shirt and shorts set with GLOBALSTEPPER branding."
  }
];

function isArchiveSoldOut(id) {
  return ARCHIVE_SOLD_OUT_IDS.has(String(id));
}

function getProduct(id) {
  return products.find(
    product => product.id === String(id)
  );
}

function formatPrice(value) {
  return "£" + Number(value).toFixed(2);
}

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]
  );
}

function readStorage(key) {
  try {
    const data = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Storage could not be read:", error);
    return [];
  }
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
  } catch (error) {
    console.warn("Storage could not be saved:", error);
  }
}

/* ==========================================
   SHOPPING CART
========================================== */

function getCart() {
  const cart = readStorage(CART_STORAGE_KEY);

  return cart.filter(item =>
    item &&
    !isArchiveSoldOut(item.id) &&
    Number.isFinite(Number(item.price)) &&
    Number(item.quantity) > 0
  );
}

function saveCart(cart) {
  const availableItems = cart.filter(item =>
    item &&
    !isArchiveSoldOut(item.id)
  );

  writeStorage(CART_STORAGE_KEY, availableItems);

  updateCartCount();

  document.dispatchEvent(
    new CustomEvent("globalstepper:cart-changed")
  );
}

function removeSoldOutFromCart() {
  const originalCart = readStorage(CART_STORAGE_KEY);

  const availableCart = originalCart.filter(item =>
    item && !isArchiveSoldOut(item.id)
  );

  if (availableCart.length !== originalCart.length) {
    saveCart(availableCart);
  }
}

function updateCartCount() {
  const quantity = getCart().reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  document.querySelectorAll(
    "#cart-count, #floating-cart-count"
  ).forEach(element => {
    element.textContent = quantity;
    element.setAttribute(
      "aria-label",
      quantity + " items in shopping cart"
    );
  });
}

function showCartNotification(message) {
  document.querySelectorAll(
    ".cart-notification"
  ).forEach(element => element.remove());

  const notification = document.createElement("div");

  notification.className = "cart-notification";
  notification.setAttribute("role", "status");
  notification.setAttribute("aria-live", "polite");
  notification.textContent = message;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  setTimeout(() => {
    notification.classList.remove("show");

    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2500);
}

function addProductToCart(button) {
  const id = String(button.dataset.id || "");

  if (isArchiveSoldOut(id)) {
    showCartNotification(
      "This GLOBALSTEPPER archive product is SOLD OUT."
    );
    return;
  }

  if (button.disabled) return;

  const product = getProduct(id);

  if (!product) {
    showCartNotification(
      "Product information is unavailable."
    );
    return;
  }

  const cart = getCart();

  const existing = cart.find(item =>
    String(item.id) === id &&
    !item.size
  );

  if (existing) {
    if (Number(existing.quantity) >= 10) {
      showCartNotification(
        "Maximum quantity is 10."
      );
      return;
    }

    existing.quantity =
      Number(existing.quantity) + 1;
  } else {
    cart.push({
      cartItemId: id,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });
  }

  saveCart(cart);

  showCartNotification(
    product.name + " added to cart."
  );

  document.dispatchEvent(
    new CustomEvent("globalstepper:cart-updated")
  );
}

/* ==========================================
   SOLD OUT BUTTONS AND BADGES
========================================== */

function disableSoldOutButtons() {
  document.querySelectorAll(
    ".add-to-cart-btn[data-id]"
  ).forEach(button => {
    if (!isArchiveSoldOut(button.dataset.id)) {
      return;
    }

    button.disabled = true;
    button.textContent = "SOLD OUT";
    button.setAttribute("aria-disabled", "true");
  });

  document.querySelectorAll(
    ".shop-product-card, .product-card"
  ).forEach(card => {
    const addButton = card.querySelector(
      ".add-to-cart-btn[data-id]"
    );

    const productLink = card.querySelector(
      'a[href*="product-details.html"]'
    );

    let id = addButton?.dataset.id;

    if (!id && productLink) {
      try {
        id = new URL(
          productLink.href,
          window.location.href
        ).searchParams.get("id");
      } catch (error) {
        return;
      }
    }

    if (!isArchiveSoldOut(id)) return;

    card.classList.add("archive-product");
    card.dataset.soldOut = "true";

    const imageWrapper = card.querySelector(
      ".shop-product-image, .product-image"
    );

    if (
      imageWrapper &&
      !imageWrapper.querySelector(
        ".archive-badge, .sold-out-badge"
      )
    ) {
      const badge = document.createElement("span");

      badge.className = "archive-badge";
      badge.textContent = "SOLD OUT";

      imageWrapper.prepend(badge);
    }
  });
}

function initialiseAddToCartButtons() {
  document.addEventListener("click", event => {
    const button = event.target.closest(
      ".add-to-cart-btn[data-id]"
    );

    if (!button) return;

    if (
      button.id === "quick-view-add-to-cart" ||
      button.id === "detail-add-to-cart"
    ) {
      return;
    }

    event.preventDefault();

    addProductToCart(button);
  });

  disableSoldOutButtons();
}

/* ==========================================
   MOBILE NAVIGATION
========================================== */

function initialiseMobileNavigation() {
  const menuButton = document.querySelector(
    "#menu-toggle"
  );

  const navigation = document.querySelector(
    "#nav-links"
  );

  if (!menuButton || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("show");

    menuButton.setAttribute(
      "aria-expanded", "false"
    );

    menuButton.setAttribute(
      "aria-label", "Open navigation menu"
    );

    menuButton.textContent = "☰";
  }

  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("show");

    menuButton.setAttribute(
      "aria-expanded", String(open)
    );

    menuButton.setAttribute(
      "aria-label",
      open
        ? "Close navigation menu"
        : "Open navigation menu"
    );

    menuButton.textContent = open ? "✕" : "☰";
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) {
      closeMenu();
    }
  });
}

/* ==========================================
   PRODUCT FILTERS, SEARCH AND SORT
========================================== */

function initialiseProductFilters() {
  const grid = document.querySelector(
    "#all-products-grid"
  );

  const categoryFilter = document.querySelector(
    "#category-filter"
  );

  const searchInput = document.querySelector(
    "#product-search"
  );

  const sortSelect = document.querySelector(
    "#product-sort"
  );

  const count = document.querySelector(
    "#product-count"
  );

  const emptyMessage = document.querySelector(
    "#no-products-message"
  );

  if (!grid) return;

  const cards = Array.from(
    grid.querySelectorAll(".shop-product-card")
  );

  const originalOrder = [...cards];

  function updateProducts() {
    const category = categoryFilter?.value || "all";

    const search = (
      searchInput?.value || ""
    ).trim().toLowerCase();

    const sort = sortSelect?.value || "default";

    const visible = cards.filter(card => {
      const matchesCategory =
        category === "all" ||
        card.dataset.category === category;

      const matchesSearch = (
        card.dataset.name || ""
      ).toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      visible.sort(
        (a, b) =>
          Number(a.dataset.price) -
          Number(b.dataset.price)
      );
    } else if (sort === "price-high") {
      visible.sort(
        (a, b) =>
          Number(b.dataset.price) -
          Number(a.dataset.price)
      );
    } else if (sort === "name-az") {
      visible.sort(
        (a, b) =>
          (a.dataset.name || "").localeCompare(
            b.dataset.name || ""
          )
      );
    } else if (sort === "name-za") {
      visible.sort(
        (a, b) =>
          (b.dataset.name || "").localeCompare(
            a.dataset.name || ""
          )
      );
    } else {
      visible.sort(
        (a, b) =>
          originalOrder.indexOf(a) -
          originalOrder.indexOf(b)
      );
    }

    cards.forEach(card => {
      card.hidden = true;
    });

    visible.forEach(card => {
      card.hidden = false;
      grid.appendChild(card);
    });

    if (count) {
      count.textContent =
        "Showing " + visible.length +
        (visible.length === 1
          ? " product"
          : " products");
    }

    if (emptyMessage) {
      emptyMessage.hidden = visible.length !== 0;
    }
  }

  categoryFilter?.addEventListener(
    "change", updateProducts
  );

  searchInput?.addEventListener(
    "input", updateProducts
  );

  sortSelect?.addEventListener(
    "change", updateProducts
  );

  updateProducts();
}

/* ==========================================
   LIVE SEARCH SUGGESTIONS
========================================== */

function initialiseLiveSearchSuggestions() {
  const input = document.querySelector(
    "#product-search"
  );

  const container = document.querySelector(
    "#search-suggestions"
  );

  if (!input || !container) return;

  let activeIndex = -1;

  function closeSuggestions() {
    container.hidden = true;
    container.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    activeIndex = -1;
  }

  function renderSuggestions() {
    const term = input.value.trim().toLowerCase();

    container.innerHTML = "";
    activeIndex = -1;

    if (term.length < 2) {
      closeSuggestions();
      return;
    }

    const matches = products.filter(product => {
      const text = (
        product.name + " " +
        product.category + " " +
        product.description
      ).toLowerCase();

      return text.includes(term);
    }).slice(0, 6);

    if (!matches.length) {
      container.hidden = false;
      container.textContent =
        "No matching products found.";
      input.setAttribute("aria-expanded", "true");
      return;
    }

    matches.forEach(product => {
      const suggestion = document.createElement(
        "button"
      );

      suggestion.type = "button";
      suggestion.className = "search-suggestion";
      suggestion.setAttribute("role", "option");

      suggestion.innerHTML = `
        <img
          src="${escapeHTML(product.image)}"
          alt=""
        >

        <span>
          <span class="search-suggestion-name">
            ${escapeHTML(product.name)}
          </span>

          <span class="search-suggestion-category">
            ${escapeHTML(product.category)}
          </span>
        </span>

        <span class="search-suggestion-price">
          ${isArchiveSoldOut(product.id)
            ? "SOLD OUT"
            : formatPrice(product.price)}
        </span>
      `;

      suggestion.addEventListener("click", () => {
        window.location.href =
          "product-details.html?id=" +
          encodeURIComponent(product.id);
      });

      container.appendChild(suggestion);
    });

    container.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  input.addEventListener("input", renderSuggestions);

  input.addEventListener("focus", () => {
    if (input.value.trim().length >= 2) {
      renderSuggestions();
    }
  });

  input.addEventListener("keydown", event => {
    const suggestions = Array.from(
      container.querySelectorAll(
        ".search-suggestion"
      )
    );

    if (event.key === "Escape") {
      closeSuggestions();
      return;
    }

    if (!suggestions.length || container.hidden) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex =
        (activeIndex + 1) % suggestions.length;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex =
        (activeIndex - 1 + suggestions.length) %
        suggestions.length;
    } else if (
      event.key === "Enter" &&
      activeIndex >= 0
    ) {
      event.preventDefault();
      suggestions[activeIndex].click();
      return;
    } else {
      return;
    }

    suggestions.forEach((suggestion, index) => {
      const active = index === activeIndex;

      suggestion.classList.toggle(
        "active", active
      );

      suggestion.setAttribute(
        "aria-selected", String(active)
      );
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(
      ".live-search-wrapper"
    )) {
      closeSuggestions();
    }
  });
}

/* ==========================================
   PRODUCT DETAILS
========================================== */

function initialiseProductDetails() {
  const name = document.querySelector(
    "#detail-product-name"
  );

  if (!name) return;

  const params = new URLSearchParams(
    window.location.search
  );

  const product = getProduct(
    params.get("id") || "1"
  );

  if (!product) {
    name.textContent = "Product not found";
    return;
  }

  const fields = {
    "#detail-product-category": product.category,
    "#detail-product-price":
      formatPrice(product.price),
    "#detail-product-description":
      product.description,
    "#breadcrumb-product": product.name
  };

  name.textContent = product.name;

  Object.entries(fields).forEach(
    ([selector, value]) => {
      const element = document.querySelector(
        selector
      );

      if (element) element.textContent = value;
    }
  );

  const image = document.querySelector(
    "#detail-product-image"
  );

  if (image) {
    image.src = product.image;
    image.alt = product.name;
  }

  document.title =
    product.name + " | GLOBALSTEPPER";

  initialiseDetailAddToCart(product);
}

function initialiseDetailAddToCart(product) {
  const button = document.querySelector(
    "#detail-add-to-cart"
  );

  const size = document.querySelector(
    "#product-size"
  );

  const quantity = document.querySelector(
    "#product-quantity"
  );

  const message = document.querySelector(
    "#detail-form-message"
  );

  if (!button) return;

  if (isArchiveSoldOut(product.id)) {
    button.disabled = true;
    button.textContent = "SOLD OUT";

    button.setAttribute(
      "aria-disabled", "true"
    );

    if (size) size.disabled = true;
    if (quantity) quantity.disabled = true;

    if (message) {
      message.textContent =
        "This GLOBALSTEPPER archive piece is sold out.";
    }

    return;
  }

  button.addEventListener("click", () => {
    const selectedSize = size?.value || "";
    const selectedQuantity = Number(
      quantity?.value || 1
    );

    if (!selectedSize) {
      if (message) {
        message.textContent =
          "Please select a size.";
      }
      size?.focus();
      return;
    }

    if (
      !Number.isInteger(selectedQuantity) ||
      selectedQuantity < 1 ||
      selectedQuantity > 10
    ) {
      if (message) {
        message.textContent =
          "Choose a quantity between 1 and 10.";
      }
      return;
    }

    const cart = getCart();
    const key = product.id + "-" + selectedSize;

    const existing = cart.find(item =>
      item.cartItemId === key
    );

    if (existing) {
      if (
        Number(existing.quantity) +
        selectedQuantity > 10
      ) {
        if (message) {
          message.textContent =
            "Maximum quantity is 10.";
        }
        return;
      }

      existing.quantity += selectedQuantity;
    } else {
      cart.push({
        cartItemId: key,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size: selectedSize,
        quantity: selectedQuantity
      });
    }

    saveCart(cart);

    if (message) {
      message.textContent =
        product.name + " added to cart.";
    }

    showCartNotification(
      product.name + " added to cart."
    );

    document.dispatchEvent(
      new CustomEvent(
        "globalstepper:cart-updated"
      )
    );
  });
}

/* ==========================================
   WISHLIST
========================================== */

function getWishlist() {
  return readStorage(WISHLIST_STORAGE_KEY)
    .map(String);
}

function saveWishlist(wishlist) {
  writeStorage(
    WISHLIST_STORAGE_KEY,
    [...new Set(wishlist.map(String))]
  );

  updateWishlistCount();
}

function updateWishlistCount() {
  const count = getWishlist().length;

  document.querySelectorAll(
    "#wishlist-count"
  ).forEach(element => {
    element.textContent = count;
    element.setAttribute(
      "aria-label",
      count + " items in wishlist"
    );
  });
}

function initialiseWishlist() {
  function updateButtons() {
    const wishlist = getWishlist();

    document.querySelectorAll(
      ".wishlist-button"
    ).forEach(button => {
      const saved = wishlist.includes(
        String(button.dataset.productId)
      );

      button.classList.toggle(
        "active", saved
      );

      button.textContent = saved ? "♥" : "♡";
      button.setAttribute(
        "aria-pressed", String(saved)
      );
    });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest(
      ".wishlist-button"
    );

    if (!button) return;

    const id = String(
      button.dataset.productId
    );

    let wishlist = getWishlist();

    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(
        item => item !== id
      );
    } else {
      wishlist.push(id);
    }

    saveWishlist(wishlist);
    updateButtons();
  });

  updateButtons();
}

function initialiseWishlistPage() {
  const container = document.querySelector(
    "#wishlist-products"
  );

  const emptyMessage = document.querySelector(
    "#empty-wishlist"
  );

  if (!container) return;

  function render() {
    const wishlist = getWishlist();

    const savedProducts = products.filter(
      product => wishlist.includes(product.id)
    );

    container.innerHTML = "";

    if (emptyMessage) {
      emptyMessage.hidden =
        savedProducts.length > 0;
    }

    savedProducts.forEach(product => {
      const soldOut = isArchiveSoldOut(
        product.id
      );

      const card = document.createElement(
        "article"
      );

      card.className =
        "shop-product-card" +
        (soldOut ? " archive-product" : "");

      card.innerHTML = `
        <button
          class="wishlist-remove-button"
          type="button"
          data-product-id="${product.id}"
          aria-label="Remove ${escapeHTML(product.name)}"
        >×</button>

        <div class="shop-product-image">
          ${soldOut
            ? '<span class="archive-badge">SOLD OUT</span>'
            : ""}

          <a href="product-details.html?id=${product.id}">
            <img
              src="${escapeHTML(product.image)}"
              alt="${escapeHTML(product.name)}"
              loading="lazy"
            >
          </a>
        </div>

        <div class="shop-product-info">
          <p class="product-category">
            ${escapeHTML(product.category)}
          </p>

          <h2>${escapeHTML(product.name)}</h2>

          <p class="product-price">
            ${formatPrice(product.price)}
          </p>

          <div class="product-actions">
            <a
              href="product-details.html?id=${product.id}"
              class="product-button"
            >View Product</a>

            <button
              class="add-to-cart-btn"
              type="button"
              data-id="${product.id}"
              ${soldOut ? "disabled" : ""}
            >
              ${soldOut ? "SOLD OUT" : "Add to Cart"}
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  container.addEventListener("click", event => {
    const button = event.target.closest(
      ".wishlist-remove-button"
    );

    if (!button) return;

    const updated = getWishlist().filter(
      id => id !== button.dataset.productId
    );

    saveWishlist(updated);
    render();

    showCartNotification(
      "Product removed from wishlist."
    );
  });

  render();
}

/* ==========================================
   CART PAGE
========================================== */

function initialiseCartPage() {
  const container = document.querySelector(
    "#cart-items"
  );

  if (!container) return;

  const emptyMessage = document.querySelector(
    "#empty-cart-message"
  );

  const subtotalElement = document.querySelector(
    "#cart-subtotal"
  );

  const totalElement = document.querySelector(
    "#cart-total"
  );

  const checkoutButton = document.querySelector(
    "#checkout-button"
  );

  const clearButton = document.querySelector(
    "#clear-cart-button"
  );

  const message = document.querySelector(
    "#cart-page-message"
  );

  function render() {
    const cart = getCart();

    container.innerHTML = "";

    if (emptyMessage) {
      emptyMessage.hidden = cart.length > 0;
    }

    if (checkoutButton) {
      checkoutButton.disabled =
        cart.length === 0;
    }

    if (clearButton) {
      clearButton.disabled =
        cart.length === 0;
    }

    cart.forEach(item => {
      const key = item.cartItemId || item.id;

      const card = document.createElement(
        "article"
      );

      card.className = "cart-item";

      card.innerHTML = `
        <img
          class="cart-item-image"
          src="${escapeHTML(item.image)}"
          alt="${escapeHTML(item.name)}"
        >

        <div class="cart-item-details">
          <p class="product-category">
            ${escapeHTML(item.category || "Streetwear")}
          </p>

          <h3>${escapeHTML(item.name)}</h3>

          <p class="cart-item-meta">
            ${item.size
              ? "Size: " + escapeHTML(item.size)
              : "Standard product"}
          </p>

          <p class="cart-item-price">
            ${formatPrice(item.price)} each
          </p>

          <div class="cart-item-controls">
            <button
              type="button"
              class="quantity-button decrease-quantity"
              data-item-id="${escapeHTML(key)}"
            >−</button>

            <span class="quantity-value">
              ${Number(item.quantity)}
            </span>

            <button
              type="button"
              class="quantity-button increase-quantity"
              data-item-id="${escapeHTML(key)}"
            >+</button>

            <button
              type="button"
              class="remove-cart-item"
              data-item-id="${escapeHTML(key)}"
            >Remove</button>
          </div>
        </div>

        <p class="cart-item-total">
          ${formatPrice(
            Number(item.price) *
            Number(item.quantity)
          )}
        </p>
      `;

      container.appendChild(card);
    });

    const subtotal = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
        Number(item.quantity),
      0
    );

    if (subtotalElement) {
      subtotalElement.textContent =
        formatPrice(subtotal);
    }

    if (totalElement) {
      totalElement.textContent =
        formatPrice(subtotal);
    }

    updateCartCount();
  }

  container.addEventListener("click", event => {
    const button = event.target.closest(
      "[data-item-id]"
    );

    if (!button) return;

    const key = button.dataset.itemId;
    let cart = getCart();

    const item = cart.find(
      product =>
        String(product.cartItemId || product.id) ===
        key
    );

    if (!item) return;

    if (button.classList.contains(
      "increase-quantity"
    )) {
      item.quantity = Math.min(
        10, Number(item.quantity) + 1
      );
    }

    if (button.classList.contains(
      "decrease-quantity"
    )) {
      item.quantity =
        Number(item.quantity) - 1;
    }

    if (button.classList.contains(
      "remove-cart-item"
    )) {
      item.quantity = 0;
    }

    cart = cart.filter(
      product => Number(product.quantity) > 0
    );

    saveCart(cart);
    render();
  });

  clearButton?.addEventListener("click", () => {
    if (!window.confirm(
      "Remove all products from your cart?"
    )) {
      return;
    }

    saveCart([]);
    render();

    if (message) {
      message.textContent =
        "Your shopping cart has been cleared.";
    }
  });

  checkoutButton?.addEventListener("click", () => {
    if (!getCart().length) {
      if (message) {
        message.textContent =
          "Your cart is empty.";
      }
      return;
    }

    if (message) {
      message.textContent =
        "Checkout demonstration successful. No real payment has been processed.";
    }
  });

  render();
}

/* ==========================================
   SLIDE-OUT SHOPPING CART
========================================== */

function initialiseCartDrawer() {
  const drawer = document.querySelector(
    "#cart-drawer"
  );

  const overlay = document.querySelector(
    "#cart-drawer-overlay"
  );

  const closeButton = document.querySelector(
    "#cart-drawer-close"
  );

  const container = document.querySelector(
    "#cart-drawer-items"
  );

  const emptyMessage = document.querySelector(
    "#cart-drawer-empty"
  );

  const subtotalElement = document.querySelector(
    "#cart-drawer-subtotal"
  );

  const checkoutButton = document.querySelector(
    "#cart-drawer-checkout"
  );

  const floatingButton = document.querySelector(
    "#floating-cart-button"
  );

  if (!drawer || !container) return;

  function render() {
    const cart = getCart();

    container.innerHTML = "";

    if (emptyMessage) {
      emptyMessage.hidden = cart.length > 0;
    }

    container.hidden = cart.length === 0;

    if (checkoutButton) {
      checkoutButton.disabled =
        cart.length === 0;
    }

    cart.forEach(item => {
      const key = item.cartItemId || item.id;

      const card = document.createElement(
        "article"
      );

      card.className = "cart-drawer-item";

      card.innerHTML = `
        <img
          src="${escapeHTML(item.image)}"
          alt="${escapeHTML(item.name)}"
        >

        <div>
          <h3>${escapeHTML(item.name)}</h3>

          <p>
            ${item.size
              ? "Size: " + escapeHTML(item.size)
              : escapeHTML(item.category || "Streetwear")}
          </p>

          <p>${formatPrice(item.price)}</p>

          <div class="cart-drawer-quantity">
            <button
              type="button"
              class="drawer-decrease"
              data-item-id="${escapeHTML(key)}"
            >−</button>

            <span>${Number(item.quantity)}</span>

            <button
              type="button"
              class="drawer-increase"
              data-item-id="${escapeHTML(key)}"
            >+</button>
          </div>

          <button
            type="button"
            class="cart-drawer-remove"
            data-item-id="${escapeHTML(key)}"
          >Remove</button>
        </div>

        <p class="cart-drawer-item-total">
          ${formatPrice(
            Number(item.price) *
            Number(item.quantity)
          )}
        </p>
      `;

      container.appendChild(card);
    });

    const subtotal = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
        Number(item.quantity),
      0
    );

    if (subtotalElement) {
      subtotalElement.textContent =
        formatPrice(subtotal);
    }
  }

  function openDrawer() {
    render();
    drawer.classList.add("open");
    drawer.setAttribute(
      "aria-hidden", "false"
    );
    document.body.classList.add(
      "cart-drawer-open"
    );
    closeButton?.focus();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute(
      "aria-hidden", "true"
    );
    document.body.classList.remove(
      "cart-drawer-open"
    );
  }

  container.addEventListener("click", event => {
    const button = event.target.closest(
      "[data-item-id]"
    );

    if (!button) return;

    const key = button.dataset.itemId;
    let cart = getCart();

    const item = cart.find(
      product =>
        String(product.cartItemId || product.id) ===
        key
    );

    if (!item) return;

    if (button.classList.contains(
      "drawer-increase"
    )) {
      item.quantity = Math.min(
        10, Number(item.quantity) + 1
      );
    }

    if (button.classList.contains(
      "drawer-decrease"
    )) {
      item.quantity =
        Number(item.quantity) - 1;
    }

    if (button.classList.contains(
      "cart-drawer-remove"
    )) {
      item.quantity = 0;
    }

    cart = cart.filter(
      product => Number(product.quantity) > 0
    );

    saveCart(cart);
    render();
  });

  overlay?.addEventListener(
    "click", closeDrawer
  );

  closeButton?.addEventListener(
    "click", closeDrawer
  );

  floatingButton?.addEventListener(
    "click", openDrawer
  );

  document.addEventListener(
    "globalstepper:cart-updated",
    openDrawer
  );

  document.addEventListener(
    "globalstepper:cart-changed",
    render
  );

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });

  checkoutButton?.addEventListener(
    "click",
    () => {
      window.location.href = "cart.html";
    }
  );

  render();
}

/* ==========================================
   QUICK VIEW MODAL
========================================== */

function initialiseQuickView() {
  const modal = document.querySelector(
    "#quick-view-modal"
  );

  const overlay = document.querySelector(
    "#quick-view-overlay"
  );

  const closeButton = document.querySelector(
    "#quick-view-close"
  );

  const image = document.querySelector(
    "#quick-view-image"
  );

  const category = document.querySelector(
    "#quick-view-category"
  );

  const title = document.querySelector(
    "#quick-view-title"
  );

  const price = document.querySelector(
    "#quick-view-price"
  );

  const description = document.querySelector(
    "#quick-view-description"
  );

  const link = document.querySelector(
    "#quick-view-product-link"
  );

  const addButton = document.querySelector(
    "#quick-view-add-to-cart"
  );

  if (!modal || !addButton) return;

  let activeProduct = null;
  let lastFocusedButton = null;

  function openQuickView(button) {
    const card = button.closest(
      ".shop-product-card"
    );

    if (!card) return;

    const id = String(
      button.dataset.productId ||
      card.querySelector(
        ".add-to-cart-btn[data-id]"
      )?.dataset.id || ""
    );

    const product = getProduct(id);

    if (!product) return;

    activeProduct = product;
    lastFocusedButton = button;

    if (image) {
      image.src = product.image;
      image.alt = product.name;
    }

    if (category) {
      category.textContent = product.category;
    }

    if (title) {
      title.textContent = product.name;
    }

    if (price) {
      price.textContent =
        formatPrice(product.price);
    }

    if (description) {
      description.textContent =
        product.description;
    }

    if (link) {
      link.href =
        "product-details.html?id=" + product.id;
    }

    addButton.dataset.id = product.id;
    addButton.dataset.name = product.name;
    addButton.dataset.price = product.price;
    addButton.dataset.image = product.image;
    addButton.dataset.category = product.category;

    if (isArchiveSoldOut(product.id)) {
      addButton.disabled = true;
      addButton.textContent = "SOLD OUT";
      addButton.setAttribute(
        "aria-disabled", "true"
      );
    } else {
      addButton.disabled = false;
      addButton.textContent = "Add to Cart";
      addButton.removeAttribute(
        "aria-disabled"
      );
    }

    modal.classList.add("open");
    modal.setAttribute(
      "aria-hidden", "false"
    );

    document.body.classList.add(
      "quick-view-open"
    );

    closeButton?.focus();
  }

  function closeQuickView() {
    modal.classList.remove("open");
    modal.setAttribute(
      "aria-hidden", "true"
    );

    document.body.classList.remove(
      "quick-view-open"
    );

    lastFocusedButton?.focus();
  }

  document.querySelectorAll(
    ".quick-view-button"
  ).forEach(button => {
    button.addEventListener("click", () => {
      openQuickView(button);
    });
  });

  addButton.addEventListener("click", () => {
    if (!activeProduct) return;

    if (isArchiveSoldOut(activeProduct.id)) {
      showCartNotification(
        "This archive product is SOLD OUT."
      );
      return;
    }

    addProductToCart(addButton);
  });

  overlay?.addEventListener(
    "click", closeQuickView
  );

  closeButton?.addEventListener(
    "click", closeQuickView
  );

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeQuickView();
    }
  });
}

/* ==========================================
   DARK AND LIGHT MODE
========================================== */

function initialiseThemeToggle() {
  const buttons = document.querySelectorAll(
    "#theme-toggle"
  );

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(
      THEME_STORAGE_KEY
    );
  } catch (error) {
    savedTheme = null;
  }

  const systemDark = window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle(
      "dark-theme", dark
    );

    buttons.forEach(button => {
      button.setAttribute(
        "aria-pressed", String(dark)
      );

      button.setAttribute(
        "aria-label",
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

      const icon = button.querySelector(
        "span[aria-hidden='true']"
      );

      const text = button.querySelector(
        ".theme-toggle-text"
      );

      if (icon) {
        icon.textContent = dark ? "☀" : "☾";
      }

      if (text) {
        text.textContent =
          dark ? "Light" : "Dark";
      }
    });
  }

  applyTheme(
    savedTheme ||
    (systemDark ? "dark" : "light")
  );

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const next =
        document.body.classList.contains(
          "dark-theme"
        )
          ? "light"
          : "dark";

      try {
        localStorage.setItem(
          THEME_STORAGE_KEY, next
        );
      } catch (error) {}

      applyTheme(next);
    });
  });
}

/* ==========================================
   NEWSLETTER
========================================== */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function initialiseNewsletterForm() {
  const form = document.querySelector(
    "#newsletter-form"
  );

  if (!form) return;

  const email = document.querySelector(
    "#newsletter-email"
  );

  const message = document.querySelector(
    "#newsletter-message"
  );

  if (!email || !message) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!isValidEmail(email.value.trim())) {
      message.textContent =
        "Please enter a valid email address.";
      email.focus();
      return;
    }

    message.textContent =
      "Thank you for joining the GLOBALSTEPPER mailing list.";

    form.reset();
  });
}

/* ==========================================
   CONTACT FORM
========================================== */

function initialiseContactForm() {
  const form = document.querySelector(
    "#contact-form"
  );

  if (!form) return;

  const name = document.querySelector(
    "#contact-name"
  );

  const email = document.querySelector(
    "#contact-email"
  );

  const subject = document.querySelector(
    "#contact-subject"
  );

  const message = document.querySelector(
    "#contact-message"
  );

  const consent = document.querySelector(
    "#contact-consent"
  );

  const result = document.querySelector(
    "#contact-form-message"
  );

  const characterCount = document.querySelector(
    "#character-count"
  );

  message?.addEventListener("input", () => {
    if (characterCount) {
      characterCount.textContent =
        message.value.length + " / 500";
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const fields = [
      ["#name-error", name?.value.trim().length >= 2,
        "Please enter your full name.", name],
      ["#email-error", isValidEmail(
        email?.value.trim() || ""
      ), "Please enter a valid email address.", email],
      ["#subject-error", Boolean(subject?.value),
        "Please choose an enquiry subject.", subject],
      ["#message-error", (
        message?.value.trim().length || 0
      ) >= 10,
        "Your message must contain at least 10 characters.",
        message],
      ["#consent-error", Boolean(consent?.checked),
        "Please agree before submitting.", consent]
    ];

    let valid = true;
    let firstInvalid = null;

    fields.forEach(
      ([selector, passed, errorText, input]) => {
        const error = document.querySelector(
          selector
        );

        if (error) {
          error.textContent =
            passed ? "" : errorText;
        }

        input?.classList.toggle(
          "invalid", !passed
        );

        if (!passed) {
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      }
    );

    if (!valid) {
      firstInvalid?.focus();
      return;
    }

    if (result) {
      result.textContent =
        "Your message has passed validation. This demo does not send messages to an inbox.";
    }

    form.reset();

    if (characterCount) {
      characterCount.textContent = "0 / 500";
    }
  });
}

/* ==========================================
   LOADING SCREEN
========================================== */

function initialisePageLoader() {
  const loader = document.querySelector(
    "#page-loader"
  );

  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("hidden");

    setTimeout(() => {
      loader.remove();
    }, 700);
  }, 3000);
}

/* ==========================================
   SCROLL REVEAL EFFECTS
========================================== */

function initialiseScrollReveal() {
  const elements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
  );

  if (!elements.length) return;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    elements.forEach(element => {
      element.classList.add("revealed");
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add(
          "revealed"
        );

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================
   PREMIUM ABOUT PAGE EFFECTS
========================================== */

function initialiseAboutPageEffects() {
  const page = document.querySelector(
    ".about-page"
  );

  if (!page) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealElements = document.querySelectorAll(
    ".about-story-section, " +
    ".mission-card, " +
    ".brand-values-section .section-heading, " +
    ".value-card, " +
    ".about-cta"
  );

  revealElements.forEach(element => {
    element.classList.add("reveal-premium");
  });

  if (
    !("IntersectionObserver" in window) ||
    reducedMotion
  ) {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  } else {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

  const pointerFine = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (!pointerFine || reducedMotion) return;

  page.addEventListener("mousemove", event => {
    page.style.setProperty(
      "--mouse-x", event.clientX + "px"
    );

    page.style.setProperty(
      "--mouse-y", event.clientY + "px"
    );
  });

  const tiltCards = document.querySelectorAll(
    ".about-logo-card, .mission-card, .value-card"
  );

  tiltCards.forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (!centerX || !centerY) return;

      const rotateX =
        ((y - centerY) / centerY) * -4;

      const rotateY =
        ((x - centerX) / centerX) * 4;

      card.style.transform =
        "perspective(1000px) " +
        "rotateX(" + rotateX + "deg) " +
        "rotateY(" + rotateY + "deg) " +
        "translateY(-6px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) " +
        "rotateX(0) rotateY(0) translateY(0)";
    });
  });

  const hero = document.querySelector(
    ".about-hero"
  );

  if (hero) {
    window.addEventListener(
      "scroll",
      () => {
        const movement = Math.min(
          window.scrollY * 0.08, 35
        );

        hero.style.transform =
          "translateY(" + movement + "px)";
      },
      { passive: true }
    );
  }
}

/* ==========================================
   FOOTER YEAR
========================================== */

function displayCurrentYear() {
  document.querySelectorAll(
    "#current-year"
  ).forEach(element => {
    element.textContent =
      new Date().getFullYear();
  });
}

/* ==========================================
   START GLOBALSTEPPER WEBSITE
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initialisePageLoader();

    removeSoldOutFromCart();

    initialiseMobileNavigation();

    initialiseAddToCartButtons();

    initialiseProductFilters();

    initialiseLiveSearchSuggestions();

    initialiseProductDetails();

    initialiseWishlist();

    initialiseWishlistPage();

    initialiseCartPage();

    initialiseCartDrawer();

    initialiseQuickView();

    initialiseThemeToggle();

    initialiseNewsletterForm();

    initialiseContactForm();

    initialiseScrollReveal();

    initialiseAboutPageEffects();

    updateCartCount();

    updateWishlistCount();

    displayCurrentYear();

    disableSoldOutButtons();
  }
);

/* ==========================================
   GLOBALSTEPPER
   END OF JAVASCRIPT
========================================== */
