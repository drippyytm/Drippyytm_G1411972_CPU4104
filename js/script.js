/* ========================================
   GLOBALSTEPPER E-COMMERCE WEBSITE
   Main JavaScript file
======================================== */


/* ---------- SHOPPING CART STORAGE ---------- */

const CART_STORAGE_KEY = "globalstepperCart";


function getCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
        return [];
    }

    try {
        return JSON.parse(savedCart);
    } catch (error) {
        console.error("Unable to read the shopping cart:", error);
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* ---------- CART COUNT ---------- */

function updateCartCount() {
    const cartCountElements =
        document.querySelectorAll("#cart-count");

    const floatingCountElements =
        document.querySelectorAll(
            "#floating-cart-count"
        );

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, product) =>
            total + product.quantity,
        0
    );

    cartCountElements.forEach((element) => {
        element.textContent = totalQuantity;

        element.setAttribute(
            "aria-label",
            `${totalQuantity} items in cart`
        );
    });

    floatingCountElements.forEach((element) => {
        element.textContent = totalQuantity;

        element.setAttribute(
            "aria-label",
            `${totalQuantity} items in shopping cart`
        );
    });
}


/* ---------- ADD PRODUCT TO CART ---------- */

function addProductToCart(button) {
    const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image,
        category: button.dataset.category,
        quantity: 1
    };

    const cart = getCart();

    const existingProduct = cart.find(
        (cartProduct) => cartProduct.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    showCartNotification(`${product.name} added to cart.`);

    document.dispatchEvent(
    new CustomEvent(
        "globalstepper:cart-updated"
    )
);
}


/* ---------- CART NOTIFICATION ---------- */

function showCartNotification(message) {
    const oldNotification = document.querySelector(
        ".cart-notification"
    );

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification = document.createElement("div");

    notification.className = "cart-notification";
    notification.setAttribute("role", "status");
    notification.setAttribute("aria-live", "polite");
    notification.textContent = message;

    document.body.appendChild(notification);

    window.setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    window.setTimeout(() => {
        notification.classList.remove("show");

        window.setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}


/* ---------- ADD TO CART BUTTON EVENTS ---------- */

function initialiseAddToCartButtons() {
    const buttons = document.querySelectorAll(
        ".add-to-cart-btn"
    );

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            addProductToCart(button);
        });
    });
}


/* ---------- MOBILE NAVIGATION ---------- */

function initialiseMobileNavigation() {
    const menuButton = document.querySelector("#menu-toggle");
    const navigation = document.querySelector("#nav-links");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("show");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("show");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
            menuButton.textContent = "☰";
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 900) {
            navigation.classList.remove("show");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
            menuButton.textContent = "☰";
        }
    });
}


/* ---------- NEWSLETTER VALIDATION ---------- */

function initialiseNewsletterForm() {
    const newsletterForm = document.querySelector(
        "#newsletter-form"
    );

    if (!newsletterForm) {
        return;
    }

    const emailInput = document.querySelector(
        "#newsletter-email"
    );

    const message = document.querySelector(
        "#newsletter-message"
    );

    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (email === "") {
            message.textContent =
                "Please enter your email address.";

            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            message.textContent =
                "Please enter a valid email address.";

            emailInput.focus();
            return;
        }

        message.textContent =
            "Thank you for joining the GLOBALSTEPPER mailing list.";

        newsletterForm.reset();
    });
}


function isValidEmail(email) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


/* ---------- CURRENT YEAR ---------- */

function displayCurrentYear() {
    const yearElement = document.querySelector(
        "#current-year"
    );

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }
}




/* ---------- PRODUCT DETAILS DATA ---------- */

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
    },
    {
        id: "5",
        name: "Limited Edition Green Tracksuit",
        price: 189.99,
        image: "media/images/limited-green-tracksuit.jpeg",
        category: "Tracksuits",
        description:
            "A green limited-edition tracksuit featuring bold front and back graphics."
    },
    {
        id: "6",
        name: "Limited Edition Black Tracksuit",
        price: 189.99,
        image: "media/images/limited-black-tracksuit.jpeg",
        category: "Tracksuits",
        description:
            "A black limited-edition tracksuit with bold GLOBALSTEPPER graphics."
    },
    {
        id: "7",
        name: "Rich of Pain Black T-Shirt",
        price: 64.99,
        image: "media/images/rich-of-pain-black.jpeg",
        category: "T-Shirts",
        description:
            "A black oversized T-shirt with Rich of Pain artwork."
    },
    {
        id: "8",
        name: "Rich of Pain Grey T-Shirt",
        price: 64.99,
        image: "media/images/rich-of-pain-grey.jpeg",
        category: "T-Shirts",
        description:
            "A grey oversized T-shirt with contrasting Rich of Pain artwork."
    },
    {
        id: "9",
        name: "Money Not Friends Black T-Shirt",
        price: 64.99,
        image: "media/images/money-not-friends-black.jpeg",
        category: "T-Shirts",
        description:
            "A black statement T-shirt featuring the Money Not Friends design."
    },
    {
        id: "10",
        name: "Money Not Friends Grey T-Shirt",
        price: 64.99,
        image: "media/images/money-not-friends-grey.jpeg",
        category: "T-Shirts",
        description:
            "A grey statement T-shirt featuring the Money Not Friends design."
    },
    {
        id: "11",
        name: "Too Gucci Grey T-Shirt",
        price: 69.99,
        image: "media/images/too-gucci-grey.jpeg",
        category: "T-Shirts",
        description:
            "A grey oversized T-shirt featuring the Too Gucci graphic."
    },
    {
        id: "12",
        name: "Too Gucci Black T-Shirt",
        price: 69.99,
        image: "media/images/too-gucci-black.jpeg",
        category: "T-Shirts",
        description:
            "A black oversized T-shirt featuring the Too Gucci graphic."
    }
];


/* ---------- PRODUCT DETAILS PAGE ---------- */

function initialiseProductDetails() {
    const productName = document.querySelector(
        "#detail-product-name"
    );

    if (!productName) {
        return;
    }

    const parameters = new URLSearchParams(
        window.location.search
    );

    const productId = parameters.get("id") || "1";

    const product = products.find(
        (item) => item.id === productId
    ) || products[0];

    const productImage = document.querySelector(
        "#detail-product-image"
    );

    const productCategory = document.querySelector(
        "#detail-product-category"
    );

    const productPrice = document.querySelector(
        "#detail-product-price"
    );

    const productDescription = document.querySelector(
        "#detail-product-description"
    );

    const breadcrumbProduct = document.querySelector(
        "#breadcrumb-product"
    );

    productName.textContent = product.name;
    productCategory.textContent = product.category;
    productPrice.textContent = `£${product.price.toFixed(2)}`;
    productDescription.textContent = product.description;
    breadcrumbProduct.textContent = product.name;

    productImage.src = product.image;
    productImage.alt = product.name;

    document.title =
        `${product.name} | GLOBALSTEPPER`;

    initialiseDetailAddToCart(product);
}


function initialiseDetailAddToCart(product) {
    const addButton = document.querySelector(
        "#detail-add-to-cart"
    );

    const sizeSelect = document.querySelector(
        "#product-size"
    );

    const quantityInput = document.querySelector(
        "#product-quantity"
    );

    const message = document.querySelector(
        "#detail-form-message"
    );

    if (
        !addButton ||
        !sizeSelect ||
        !quantityInput ||
        !message
    ) {
        return;
    }

    addButton.addEventListener("click", () => {
        const selectedSize = sizeSelect.value;
        const quantity = Number(quantityInput.value);

        if (selectedSize === "") {
            message.textContent =
                "Please choose a size before adding this product.";

            sizeSelect.focus();
            return;
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 10
        ) {
            message.textContent =
                "Please enter a quantity between 1 and 10.";

            quantityInput.focus();
            return;
        }

        const cart = getCart();

        const cartItemId =
            `${product.id}-${selectedSize}`;

        const existingProduct = cart.find(
            (item) => item.cartItemId === cartItemId
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                cartItemId: cartItemId,
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                size: selectedSize,
                quantity: quantity
            });
        }

        saveCart(cart);

        message.textContent =
            `${product.name}, size ${selectedSize}, added to cart.`;

        showCartNotification(
            `${product.name} added to cart.`
        );
    });
}


/* ---------- CART PAGE ---------- */

function initialiseCartPage() {
    const cartItemsContainer = document.querySelector(
        "#cart-items"
    );

    if (!cartItemsContainer) {
        return;
    }

    const emptyCartMessage = document.querySelector(
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


    const clearCartButton = document.querySelector(
        "#clear-cart-button"
    );

    const cartPageMessage = document.querySelector(
        "#cart-page-message"
    );

    function renderCart() {
    const cart = getCart();

    cartItemsContainer.innerHTML = "";
    
        

        if (cart.length === 0) {
            emptyCartMessage.hidden = false;
            checkoutButton.disabled = true;
            clearCartButton.disabled = true;
            subtotalElement.textContent = "£0.00";
            totalElement.textContent = "£0.00";
            updateCartCount();
            return;
        }

        emptyCartMessage.hidden = true;
        checkoutButton.disabled = false;
        clearCartButton.disabled = false;

        cart.forEach((item) => {
            const cartItem = document.createElement("article");

            cartItem.className = "cart-item";

            const sizeText = item.size
                ? `Size: ${item.size}`
                : "Standard product";

            const itemIdentifier =
                item.cartItemId || item.id;

            cartItem.innerHTML = `
                <img
                    class="cart-item-image"
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-details">
                    <p class="product-category">
                        ${item.category || "Streetwear"}
                    </p>

                    <h3>${item.name}</h3>

                    <p class="cart-item-meta">
                        ${sizeText}
                    </p>

                    <p class="cart-item-price">
                        £${Number(item.price).toFixed(2)} each
                    </p>

                    <div
                        class="cart-item-controls"
                        aria-label="Quantity controls for ${item.name}"
                    >
                        <button
                            class="quantity-button decrease-quantity"
                            type="button"
                            data-item-id="${itemIdentifier}"
                            aria-label="Decrease quantity of ${item.name}"
                        >
                            −
                        </button>

                        <span
                            class="quantity-value"
                            aria-label="Quantity"
                        >
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-button increase-quantity"
                            type="button"
                            data-item-id="${itemIdentifier}"
                            aria-label="Increase quantity of ${item.name}"
                        >
                            +
                        </button>

                        <button
                            class="remove-cart-item"
                            type="button"
                            data-item-id="${itemIdentifier}"
                            aria-label="Remove ${item.name} from cart"
                        >
                            Remove
                        </button>
                    </div>
                </div>

                <p class="cart-item-total">
                    £${(
                        Number(item.price) * item.quantity
                    ).toFixed(2)}
                </p>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        const subtotal = cart.reduce(
            (total, item) =>
                total + Number(item.price) * item.quantity,
            0
        );

        subtotalElement.textContent =
            `£${subtotal.toFixed(2)}`;

        totalElement.textContent =
            `£${subtotal.toFixed(2)}`;

        addCartPageButtonEvents();
        updateCartCount();
    }


    function findCartItem(cart, itemIdentifier) {
        return cart.find((item) => {
            const currentIdentifier =
                item.cartItemId || item.id;

            return currentIdentifier === itemIdentifier;
        });
    }


    function addCartPageButtonEvents() {
        const increaseButtons = document.querySelectorAll(
            ".increase-quantity"
        );

        const decreaseButtons = document.querySelectorAll(
            ".decrease-quantity"
        );

        const removeButtons = document.querySelectorAll(
            ".remove-cart-item"
        );

        increaseButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const cart = getCart();

                const item = findCartItem(
                    cart,
                    button.dataset.itemId
                );

                if (item && item.quantity < 10) {
                    item.quantity += 1;
                    saveCart(cart);
                    renderCart();
                }
            });
        });

        decreaseButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const cart = getCart();

                const item = findCartItem(
                    cart,
                    button.dataset.itemId
                );

                if (!item) {
                    return;
                }

                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    const itemIndex = cart.indexOf(item);
                    cart.splice(itemIndex, 1);
                }

                saveCart(cart);
                renderCart();
            });
        });

        removeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const cart = getCart();

                const updatedCart = cart.filter((item) => {
                    const currentIdentifier =
                        item.cartItemId || item.id;

                    return (
                        currentIdentifier !==
                        button.dataset.itemId
                    );
                });

                saveCart(updatedCart);
                renderCart();

                cartPageMessage.textContent =
                    "Product removed from your cart.";
            });
        });
    }


    clearCartButton.addEventListener("click", () => {
        const cart = getCart();

        if (cart.length === 0) {
            return;
        }

        const shouldClear = window.confirm(
            "Are you sure you want to remove every item from your cart?"
        );

        if (!shouldClear) {
            return;
        }

        saveCart([]);
        renderCart();

        cartPageMessage.textContent =
            "Your shopping cart has been cleared.";
    });


    checkoutButton.addEventListener("click", () => {
        const cart = getCart();

        if (cart.length === 0) {
            cartPageMessage.textContent =
                "Your cart is empty.";

            return;
        }

        cartPageMessage.textContent =
            "Checkout demonstration successful. No real payment has been processed.";
    });


    renderCart();
}



/* ---------- CONTACT FORM VALIDATION ---------- */

function initialiseContactForm() {
    const contactForm = document.querySelector("#contact-form");

    if (!contactForm) {
        return;
    }

    const nameInput = document.querySelector("#contact-name");
    const emailInput = document.querySelector("#contact-email");
    const subjectInput = document.querySelector("#contact-subject");
    const messageInput = document.querySelector("#contact-message");
    const consentInput = document.querySelector("#contact-consent");

    const nameError = document.querySelector("#name-error");
    const emailError = document.querySelector("#email-error");
    const subjectError = document.querySelector("#subject-error");
    const messageError = document.querySelector("#message-error");
    const consentError = document.querySelector("#consent-error");

    const characterCount = document.querySelector("#character-count");
    const formMessage = document.querySelector("#contact-form-message");

    function clearErrors() {
        nameError.textContent = "";
        emailError.textContent = "";
        subjectError.textContent = "";
        messageError.textContent = "";
        consentError.textContent = "";
        formMessage.textContent = "";

        nameInput.classList.remove("invalid");
        emailInput.classList.remove("invalid");
        subjectInput.classList.remove("invalid");
        messageInput.classList.remove("invalid");
    }

    messageInput.addEventListener("input", () => {
        characterCount.textContent =
            `${messageInput.value.length} / 500`;
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearErrors();

        let formIsValid = true;
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value;
        const message = messageInput.value.trim();

        if (name.length < 2) {
            nameError.textContent =
                "Please enter your full name.";

            nameInput.classList.add("invalid");
            formIsValid = false;
        }

        if (!isValidEmail(email)) {
            emailError.textContent =
                "Please enter a valid email address.";

            emailInput.classList.add("invalid");
            formIsValid = false;
        }

        if (subject === "") {
            subjectError.textContent =
                "Please choose an enquiry subject.";

            subjectInput.classList.add("invalid");
            formIsValid = false;
        }

        if (message.length < 10) {
            messageError.textContent =
                "Your message must contain at least 10 characters.";

            messageInput.classList.add("invalid");
            formIsValid = false;
        }

        if (!consentInput.checked) {
            consentError.textContent =
                "Please agree before submitting the form.";

            formIsValid = false;
        }

        if (!formIsValid) {
            const firstInvalidField =
                contactForm.querySelector(".invalid");

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;
        }

        formMessage.textContent =
            "Thank you. Your message has been submitted successfully.";

        contactForm.reset();
        characterCount.textContent = "0 / 500";
    });
}



/* ---------- WISHLIST ---------- */

const WISHLIST_STORAGE_KEY =
    "globalstepperWishlist";

function getWishlist() {
    const savedWishlist =
        localStorage.getItem(
            WISHLIST_STORAGE_KEY
        );

    if (!savedWishlist) {
        return [];
    }

    try {
        return JSON.parse(savedWishlist);
    } catch (error) {
        return [];
    }
}

function saveWishlist(wishlist) {
    localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist)
    );
}

function initialiseWishlist() {
    const buttons =
        document.querySelectorAll(
            ".wishlist-button"
        );

    if (buttons.length === 0) {
        return;
    }

    let wishlist = getWishlist();

    buttons.forEach((button) => {
        const productId =
            button.dataset.productId;

        function updateButton() {
            const isSaved =
                wishlist.includes(productId);

            button.classList.toggle(
                "active",
                isSaved
            );

            button.textContent =
                isSaved ? "♥" : "♡";

            button.setAttribute(
                "aria-pressed",
                String(isSaved)
            );
        }

        updateButton();

        button.addEventListener(
            "click",
            () => {
                if (
                    wishlist.includes(productId)
                ) {
                    wishlist =
                        wishlist.filter(
                            (id) =>
                                id !== productId
                        );
                } else {
                    wishlist.push(productId);
                }

                saveWishlist(wishlist);
                updateButton();
                updateWishlistCount();
            }
        );
    });
}




function initialiseProductFilters() {
    const categoryFilter =
        document.querySelector("#category-filter");

    const productSearch =
        document.querySelector("#product-search");

    const productSort =
        document.querySelector("#product-sort");

    const productGrid =
        document.querySelector("#all-products-grid");

    const productCards = Array.from(
        document.querySelectorAll(".shop-product-card")
    );

    const noProductsMessage =
        document.querySelector("#no-products-message");

    const productCount =
        document.querySelector("#product-count");

    if (
        !categoryFilter ||
        !productSearch ||
        !productGrid ||
        productCards.length === 0
    ) {
        return;
    }

    const originalOrder = [...productCards];

    function updateProducts() {
        const selectedCategory = categoryFilter.value;

        const searchTerm = productSearch.value
            .trim()
            .toLowerCase();

        const sortValue = productSort
            ? productSort.value
            : "default";

        let visibleProducts = productCards.filter((card) => {
            const productCategory =
                card.dataset.category || "";

            const productName =
                card.dataset.name || "";

            const matchesCategory =
                selectedCategory === "all" ||
                productCategory === selectedCategory;

            const matchesSearch =
                productName.includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        if (sortValue === "price-low") {
            visibleProducts.sort(
                (a, b) =>
                    Number(a.dataset.price) -
                    Number(b.dataset.price)
            );
        }

        if (sortValue === "price-high") {
            visibleProducts.sort(
                (a, b) =>
                    Number(b.dataset.price) -
                    Number(a.dataset.price)
            );
        }

        if (sortValue === "name-az") {
            visibleProducts.sort((a, b) =>
                a.dataset.name.localeCompare(
                    b.dataset.name
                )
            );
        }

        if (sortValue === "name-za") {
            visibleProducts.sort((a, b) =>
                b.dataset.name.localeCompare(
                    a.dataset.name
                )
            );
        }

        if (sortValue === "default") {
            visibleProducts.sort(
                (a, b) =>
                    originalOrder.indexOf(a) -
                    originalOrder.indexOf(b)
            );
        }

        productCards.forEach((card) => {
            card.hidden = true;
        });

        visibleProducts.forEach((card) => {
            card.hidden = false;
            productGrid.appendChild(card);
        });

        if (noProductsMessage) {
            noProductsMessage.hidden =
                visibleProducts.length !== 0;
        }

        if (productCount) {
            const word =
                visibleProducts.length === 1
                    ? "product"
                    : "products";

            productCount.textContent =
                `Showing ${visibleProducts.length} ${word}`;
        }
    }

    categoryFilter.addEventListener(
        "change",
        updateProducts
    );

    productSearch.addEventListener(
        "input",
        updateProducts
    );

    if (productSort) {
        productSort.addEventListener(
            "change",
            updateProducts
        );
    }

    updateProducts();
}



/* ---------- WISHLIST PAGE ---------- */

function initialiseWishlistPage() {
    const wishlistContainer =
        document.querySelector("#wishlist-products");

    const emptyMessage =
        document.querySelector("#empty-wishlist");

    if (!wishlistContainer || !emptyMessage) {
        return;
    }

    function renderWishlist() {
        const wishlist = getWishlist();

        wishlistContainer.innerHTML = "";

        const savedProducts = products.filter((product) =>
            wishlist.includes(product.id)
        );

        if (savedProducts.length === 0) {
            emptyMessage.hidden = false;
            return;
        }

        emptyMessage.hidden = true;

        savedProducts.forEach((product) => {
            const card = document.createElement("article");

            card.className = "shop-product-card";

            card.innerHTML = `
                <button
                    class="wishlist-remove-button"
                    type="button"
                    data-product-id="${product.id}"
                    aria-label="Remove ${product.name} from wishlist"
                >
                    ×
                </button>

                <div class="shop-product-image">
                    <a href="product-details.html?id=${product.id}">
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            loading="lazy"
                        >
                    </a>
                </div>

                <div class="shop-product-info">
                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h2>
                        ${product.name}
                    </h2>

                    <p class="product-price">
                        £${product.price.toFixed(2)}
                    </p>

                    <div class="product-actions">
                        <a
                            href="product-details.html?id=${product.id}"
                            class="product-button"
                        >
                            View Product
                        </a>

                        <button
                            class="add-to-cart-btn"
                            type="button"
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image}"
                            data-category="${product.category}"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;

            wishlistContainer.appendChild(card);
        });

        initialiseAddToCartButtons();
        initialiseWishlistRemoveButtons(renderWishlist);
    }

    renderWishlist();
}


function initialiseWishlistRemoveButtons(renderWishlist) {
    const removeButtons =
        document.querySelectorAll(
            ".wishlist-remove-button"
        );

    removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId =
                button.dataset.productId;

            const updatedWishlist =
                getWishlist().filter(
                    (id) => id !== productId
                );

            saveWishlist(updatedWishlist);
            updateWishlistCount();
            renderWishlist();

            showCartNotification(
                "Product removed from wishlist."
            );
        });
    });
}


function updateWishlistCount() {
    const countElements =
        document.querySelectorAll("#wishlist-count");

    const wishlist = getWishlist();

    countElements.forEach((element) => {
        element.textContent = wishlist.length;

        element.setAttribute(
            "aria-label",
            `${wishlist.length} items in wishlist`
        );
    });
}

/* ---------- SLIDE-OUT CART ---------- */

function initialiseCartDrawer() {
    const drawer = document.querySelector("#cart-drawer");
    const overlay = document.querySelector("#cart-drawer-overlay");
    const closeButton = document.querySelector("#cart-drawer-close");
    const itemsContainer = document.querySelector("#cart-drawer-items");
    const emptyMessage = document.querySelector("#cart-drawer-empty");
    const subtotalElement = document.querySelector("#cart-drawer-subtotal");
    const checkoutButton = document.querySelector("#cart-drawer-checkout");
    const floatingCartButton = document.querySelector("#floating-cart-button");

    if (
        !drawer ||
        !overlay ||
        !closeButton ||
        !itemsContainer ||
        !emptyMessage ||
        !subtotalElement
    ) {
        return;
    }

    function openDrawer() {
        renderDrawer();
        drawer.classList.add("open");
        drawer.setAttribute("aria-hidden", "false");
        document.body.classList.add("cart-drawer-open");
        closeButton.focus();
    }

    function closeDrawer() {
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
        document.body.classList.remove("cart-drawer-open");
    }

    function findDrawerItem(cart, itemIdentifier) {
        return cart.find((item) => {
            const currentIdentifier =
                item.cartItemId || item.id;

            return currentIdentifier === itemIdentifier;
        });
    }

    function renderDrawer() {
        const cart = getCart();

        itemsContainer.innerHTML = "";

        if (cart.length === 0) {
            emptyMessage.hidden = false;
            itemsContainer.hidden = true;
            subtotalElement.textContent = "£0.00";

            if (checkoutButton) {
                checkoutButton.disabled = true;
            }

            return;
        }

        emptyMessage.hidden = true;
        itemsContainer.hidden = false;

        if (checkoutButton) {
            checkoutButton.disabled = false;
        }

        cart.forEach((item) => {
            const itemIdentifier =
                item.cartItemId || item.id;

            const sizeText = item.size
                ? `Size: ${item.size}`
                : item.category || "Streetwear";

            const itemElement =
                document.createElement("article");

            itemElement.className =
                "cart-drawer-item";

            itemElement.innerHTML = `
                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div>
                    <h3>${item.name}</h3>

                    <p>${sizeText}</p>

                    <p>
                        £${Number(item.price).toFixed(2)}
                    </p>

                    <div class="cart-drawer-quantity">

                        <button
                            type="button"
                            class="drawer-decrease"
                            data-item-id="${itemIdentifier}"
                            aria-label="Decrease quantity of ${item.name}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="drawer-increase"
                            data-item-id="${itemIdentifier}"
                            aria-label="Increase quantity of ${item.name}"
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="cart-drawer-remove"
                        data-item-id="${itemIdentifier}"
                    >
                        Remove
                    </button>
                </div>

                <p class="cart-drawer-item-total">
                    £${(
                        Number(item.price) *
                        item.quantity
                    ).toFixed(2)}
                </p>
            `;

            itemsContainer.appendChild(itemElement);
        });

        const subtotal = cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                item.quantity,
            0
        );

        subtotalElement.textContent =
            `£${subtotal.toFixed(2)}`;

        addDrawerItemEvents();
        updateCartCount();
    }

    function addDrawerItemEvents() {
        const increaseButtons =
            document.querySelectorAll(
                ".drawer-increase"
            );

        const decreaseButtons =
            document.querySelectorAll(
                ".drawer-decrease"
            );

        const removeButtons =
            document.querySelectorAll(
                ".cart-drawer-remove"
            );

        increaseButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const cart = getCart();

                const item = findDrawerItem(
                    cart,
                    button.dataset.itemId
                );

                if (item && item.quantity < 10) {
                    item.quantity += 1;
                    saveCart(cart);
                    renderDrawer();
                }
            });
        });

        decreaseButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const cart = getCart();

                const item = findDrawerItem(
                    cart,
                    button.dataset.itemId
                );

                if (!item) {
                    return;
                }

                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    const index = cart.indexOf(item);
                    cart.splice(index, 1);
                }

                saveCart(cart);
                renderDrawer();
            });
        });

        removeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const updatedCart =
                    getCart().filter((item) => {
                        const itemIdentifier =
                            item.cartItemId ||
                            item.id;

                        return (
                            itemIdentifier !==
                            button.dataset.itemId
                        );
                    });

                saveCart(updatedCart);
                renderDrawer();
            });
        });
    }

    overlay.addEventListener("click", closeDrawer);
    closeButton.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            drawer.classList.contains("open")
        ) {
            closeDrawer();
        }
    });

    document.addEventListener(
        "globalstepper:cart-updated",
        openDrawer
    );

    if (floatingCartButton) {
        floatingCartButton.addEventListener("click", openDrawer);
    }

    if (checkoutButton) {
        checkoutButton.addEventListener(
            "click",
            () => {
                window.location.href = "cart.html";
            }
        );
    }
}



/* GLOBALSTEPPER LOADING SCREEN */

function initialisePageLoader() {
  const pageLoader = document.querySelector("#page-loader");

  if (!pageLoader) return;

  // Keep the intro visible for 3 seconds.
  window.setTimeout(() => {
    pageLoader.classList.add("hidden");

    // Remove it after the fade-out.
    window.setTimeout(() => {
      pageLoader.remove();
    }, 700);

  }, 3000);
}

/* ---------- QUICK VIEW ---------- */

function initialiseQuickView() {
    const modal =
        document.querySelector("#quick-view-modal");

    const overlay =
        document.querySelector("#quick-view-overlay");

    const closeButton =
        document.querySelector("#quick-view-close");

    const quickViewButtons =
        document.querySelectorAll(".quick-view-button");

    const image =
        document.querySelector("#quick-view-image");

    const category =
        document.querySelector("#quick-view-category");

    const title =
        document.querySelector("#quick-view-title");

    const price =
        document.querySelector("#quick-view-price");

    const productLink =
        document.querySelector("#quick-view-product-link");

    const addToCartButton =
        document.querySelector("#quick-view-add-to-cart");

    if (
        !modal ||
        !overlay ||
        !closeButton ||
        !image ||
        !category ||
        !title ||
        !price ||
        !productLink ||
        !addToCartButton ||
        quickViewButtons.length === 0
    ) {
        return;
    }

    let lastFocusedButton = null;

    function openQuickView(button) {
        const card =
            button.closest(".shop-product-card");

        if (!card) {
            return;
        }

        const cardImage =
            card.querySelector(".shop-product-image img");

        const cardCategory =
            card.querySelector(".product-category");

        const cardTitle =
            card.querySelector(".shop-product-info h2");

        const cardPrice =
            card.querySelector(".product-price");

        const fullProductLink =
            card.querySelector(
                'a[href*="product-details.html"]'
            );

        if (
            !cardImage ||
            !cardCategory ||
            !cardTitle ||
            !cardPrice ||
            !fullProductLink
        ) {
            return;
        }

        image.src = cardImage.src;
        image.alt = cardImage.alt;

        category.textContent =
            cardCategory.textContent.trim();

        title.textContent =
            cardTitle.textContent.trim();

        price.textContent =
            cardPrice.textContent.trim();

        productLink.href =
            fullProductLink.href;

            const originalAddButton =
    card.querySelector(".add-to-cart-btn");

if (originalAddButton) {
    addToCartButton.dataset.id =
        originalAddButton.dataset.id;

    addToCartButton.dataset.name =
        originalAddButton.dataset.name;

    addToCartButton.dataset.price =
        originalAddButton.dataset.price;

    addToCartButton.dataset.image =
        originalAddButton.dataset.image;

    addToCartButton.dataset.category =
        originalAddButton.dataset.category;
}

        lastFocusedButton = button;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("quick-view-open");

        closeButton.focus();
    }

    function closeQuickView() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("quick-view-open");

        if (lastFocusedButton) {
            lastFocusedButton.focus();
        }
    }

    quickViewButtons.forEach((button) => {
        button.addEventListener("click", () => {
            openQuickView(button);
        });
    });

    closeButton.addEventListener(
        "click",
        closeQuickView
    );

    overlay.addEventListener(
        "click",
        closeQuickView
    );

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("open")
        ) {
            closeQuickView();
        }
    });
     addToCartButton.addEventListener("click", () => {
    addProductToCart(addToCartButton);
});
}

/* ---------- SCROLL REVEAL ---------- */

function initialiseScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    if (revealElements.length === 0) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, revealObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

/* ---------- DARK AND LIGHT MODE ---------- */

const THEME_STORAGE_KEY = "globalstepperTheme";

function initialiseThemeToggle() {
    const themeButtons =
        document.querySelectorAll("#theme-toggle");

    const savedTheme =
        localStorage.getItem(THEME_STORAGE_KEY);

    const systemPrefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    const startingTheme =
        savedTheme ||
        (systemPrefersDark ? "dark" : "light");

    function applyTheme(theme) {
        const isDark = theme === "dark";

        document.body.classList.toggle(
            "dark-theme",
            isDark
        );

        themeButtons.forEach((button) => {
            const icon = button.querySelector(
                "span[aria-hidden='true']"
            );

            const text = button.querySelector(
                ".theme-toggle-text"
            );

            button.setAttribute(
                "aria-pressed",
                String(isDark)
            );

            button.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            if (icon) {
                icon.textContent = isDark ? "☀" : "☾";
            }

            if (text) {
                text.textContent = isDark
                    ? "Light"
                    : "Dark";
            }
        });
    }

    applyTheme(startingTheme);

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const nextTheme =
                document.body.classList.contains(
                    "dark-theme"
                )
                    ? "light"
                    : "dark";

            localStorage.setItem(
                THEME_STORAGE_KEY,
                nextTheme
            );

            applyTheme(nextTheme);
        });
    });
}

/* ---------- LIVE SEARCH SUGGESTIONS ---------- */

function initialiseLiveSearchSuggestions() {
    const searchInput =
        document.querySelector("#product-search");

    const suggestionsContainer =
        document.querySelector("#search-suggestions");

    if (!searchInput || !suggestionsContainer) {
        return;
    }

    let activeIndex = -1;

    function closeSuggestions() {
        suggestionsContainer.hidden = true;
        suggestionsContainer.innerHTML = "";
        searchInput.setAttribute("aria-expanded", "false");
        activeIndex = -1;
    }

    function getMatchingProducts(searchTerm) {
        return products
            .filter((product) => {
                const searchableText = `
                    ${product.name}
                    ${product.category}
                    ${product.description || ""}
                `.toLowerCase();

                return searchableText.includes(searchTerm);
            })
            .slice(0, 6);
    }

    function openProduct(productId) {
        window.location.href =
            `product-details.html?id=${productId}`;
    }

    function renderSuggestions() {
        const searchTerm =
            searchInput.value.trim().toLowerCase();

        suggestionsContainer.innerHTML = "";
        activeIndex = -1;

        if (searchTerm.length < 2) {
            closeSuggestions();
            return;
        }

        const matches = getMatchingProducts(searchTerm);

        suggestionsContainer.hidden = false;
        searchInput.setAttribute("aria-expanded", "true");

        if (matches.length === 0) {
            suggestionsContainer.innerHTML = `
                <p class="search-no-results">
                    No matching products found.
                </p>
            `;

            return;
        }

        matches.forEach((product) => {
            const suggestion =
                document.createElement("button");

            suggestion.type = "button";
            suggestion.className = "search-suggestion";
            suggestion.setAttribute("role", "option");

            suggestion.innerHTML = `
                <img
                    src="${product.image}"
                    alt=""
                >

                <span>
                    <span class="search-suggestion-name">
                        ${product.name}
                    </span>

                    <span class="search-suggestion-category">
                        ${product.category}
                    </span>
                </span>

                <span class="search-suggestion-price">
                    £${product.price.toFixed(2)}
                </span>
            `;

            suggestion.addEventListener("click", () => {
                openProduct(product.id);
            });

            suggestionsContainer.appendChild(suggestion);
        });
    }

    function updateActiveSuggestion() {
        const suggestions =
            suggestionsContainer.querySelectorAll(
                ".search-suggestion"
            );

        suggestions.forEach((suggestion, index) => {
            const isActive = index === activeIndex;

            suggestion.classList.toggle(
                "active",
                isActive
            );

            suggestion.setAttribute(
                "aria-selected",
                String(isActive)
            );
        });

        if (activeIndex >= 0) {
            suggestions[activeIndex]?.scrollIntoView({
                block: "nearest"
            });
        }
    }

    searchInput.addEventListener(
        "input",
        renderSuggestions
    );

    searchInput.addEventListener("keydown", (event) => {
        const suggestions =
            suggestionsContainer.querySelectorAll(
                ".search-suggestion"
            );

        if (
            suggestionsContainer.hidden ||
            suggestions.length === 0
        ) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            activeIndex =
                (activeIndex + 1) % suggestions.length;

            updateActiveSuggestion();
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            activeIndex =
                (
                    activeIndex - 1 +
                    suggestions.length
                ) % suggestions.length;

            updateActiveSuggestion();
        }

        if (
            event.key === "Enter" &&
            activeIndex >= 0
        ) {
            event.preventDefault();
            suggestions[activeIndex].click();
        }

        if (event.key === "Escape") {
            closeSuggestions();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            !event.target.closest(
                ".live-search-wrapper"
            )
        ) {
            closeSuggestions();
        }
    });

    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim().length >= 2) {
            renderSuggestions();
        }
    });
}

/* ===========================================================
   PREMIUM ABOUT PAGE EFFECTS
=========================================================== */

function initialiseAboutPageEffects() {

    const aboutPage =
        document.querySelector(".about-page");

    if (!aboutPage) {
        return;
    }


    /* ---------- MOUSE GLOW ---------- */

    aboutPage.addEventListener("mousemove", (event) => {

        aboutPage.style.setProperty(
            "--mouse-x",
            `${event.clientX}px`
        );

        aboutPage.style.setProperty(
            "--mouse-y",
            `${event.clientY}px`
        );

    });


    /* ---------- SCROLL REVEAL ---------- */

    const revealElements =
        document.querySelectorAll(
            ".about-story-section, " +
            ".mission-card, " +
            ".brand-values-section .section-heading, " +
            ".value-card, " +
            ".about-cta"
        );

    revealElements.forEach((element) => {
        element.classList.add("reveal-premium");
    });


    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* ---------- 3D TILT ---------- */

    const tiltCards =
        document.querySelectorAll(
            ".about-logo-card, " +
            ".mission-card, " +
            ".value-card"
        );


    tiltCards.forEach((card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                if (
                    window.matchMedia(
                        "(max-width: 700px)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) /
                    centerY) * -4;

                const rotateY =
                    ((x - centerX) /
                    centerX) * 4;


                card.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-6px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";

            }
        );

    });


    /* ---------- HERO PARALLAX ---------- */

    const hero =
        document.querySelector(".about-hero");

    if (hero) {

        window.addEventListener(
            "scroll",
            () => {

                const scrollPosition =
                    window.scrollY;

                const movement =
                    Math.min(
                        scrollPosition * 0.08,
                        35
                    );

                hero.style.transform =
                    `translateY(${movement}px)`;

            },
            {
                passive: true
            }
        );

    }

}



/* ---------- PAGE INITIALISATION ---------- */

document.addEventListener("DOMContentLoaded", () => {
    initialisePageLoader();

    initialiseMobileNavigation();
    initialiseAddToCartButtons();
    initialiseNewsletterForm();
    initialiseProductFilters();
    initialiseProductDetails();
    initialiseCartPage();
    initialiseContactForm();
    initialiseWishlist();
    initialiseWishlistPage();
    initialiseCartDrawer();
    initialiseQuickView();
    initialiseScrollReveal();
    initialiseThemeToggle();
    initialiseLiveSearchSuggestions();
    initialiseAboutPageEffects();
    updateCartCount();
    updateWishlistCount();
    displayCurrentYear();
    initialiseAboutPageEffects();
});


/* ==========================================
   GLOBALSTEPPER
   KEEP ONLY FIRST FOUR PRODUCTS
========================================== */

(function () {
    "use strict";

    const allowedProductIds = new Set([
        "1",
        "2",
        "3",
        "4"
    ]);

    function updateShopProducts() {
        const productGrid = document.querySelector(
            "#all-products-grid"
        );

        if (!productGrid) {
            return;
        }

        const productCards = Array.from(
            productGrid.querySelectorAll(
                ".shop-product-card"
            )
        );

        productCards.forEach((card) => {
            const addButton = card.querySelector(
                ".add-to-cart-btn"
            );

            const productLink = card.querySelector(
                'a[href*="product-details.html"]'
            );

            let productId = addButton?.dataset.id;

            if (!productId && productLink) {
                const url = new URL(
                    productLink.href,
                    window.location.href
                );

                productId = url.searchParams.get("id");
            }

            if (!allowedProductIds.has(productId)) {
                card.remove();
            }
        });

        const remainingProducts =
            productGrid.querySelectorAll(
                ".shop-product-card"
            );

        const productCount = document.querySelector(
            "#product-count"
        );

        if (productCount) {
            productCount.textContent =
                `Showing ${remainingProducts.length} products`;
        }
    }

    document.addEventListener(
        "DOMContentLoaded",
        updateShopProducts
    );

})();
