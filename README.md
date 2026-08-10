# GLOBALSTEPPER E-Commerce Website

## Project Overview

GLOBALSTEPPER is a responsive front-end e-commerce website created for the CPU4104 Web Development Summative Project.

The website represents a unisex streetwear brand and provides an interactive online shopping experience. Users can browse products, view individual product details, search and filter products, save products to a wishlist, add products to a shopping cart, change quantities, remove products and view the automatically calculated total price.

The website was developed using HTML5, CSS3 and JavaScript without the use of frameworks or backend technologies.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- Local Storage
- Responsive CSS
- CSS Media Queries

---

## Website Pages

The website contains the following pages:

- `index.html` – Home page
- `products.html` – Product listing/shop page
- `product-details.html` – Dynamic individual product details page
- `cart.html` – Shopping cart page
- `about.html` – Information about GLOBALSTEPPER
- `contact.html` – Contact page with form validation
- `wishlist.html` – Saved products wishlist page

---

## Main Features

### Product Features

- Twelve product listings
- Product images, names and prices
- Dynamic product details
- Product search
- Live search suggestions
- Category filtering
- Product sorting
- Product Quick View modal

### Shopping Cart

The website includes an interactive shopping cart created using JavaScript.

Users can:

- Add products to the cart
- Remove products from the cart
- Increase product quantities
- Decrease product quantities
- View automatically calculated cart totals
- Access the shopping cart drawer
- Keep cart contents saved using Local Storage

### Wishlist

Users can save products to a wishlist.

Wishlist selections are stored using Local Storage so saved products can remain available when the user moves between pages.

### Responsive Design

GLOBALSTEPPER uses a responsive mobile-first design.

The layout adapts to different screen sizes using CSS and media queries to provide a suitable experience across:

- Mobile devices
- Tablets
- Desktop computers

The website also includes a responsive mobile navigation menu.

### Forms and Validation

The website contains interactive forms including:

- Contact form
- Newsletter form

JavaScript validation is used to check user input before form submission.

### User Interface

Additional interface features include:

- Dark and light theme toggle
- Saved theme preference using Local Storage
- Page loading animation
- Scroll reveal animations
- Interactive hover effects
- Shine effects
- Mobile navigation menu

---

## Accessibility

Accessibility was considered during the development and testing of the website.

The website includes accessibility features designed to improve usability and make content easier to understand and navigate.

Lighthouse testing was used to identify accessibility issues during development.

Evidence showing identified accessibility problems and subsequent improvements is stored inside the `evidence` folder.

---

## Performance Testing

Google Chrome Lighthouse was used to test the website during development.

Performance testing helped identify areas where the website could be optimised, including image delivery and page resources.

Changes were made during development to improve website performance, and before-and-after evidence is included in the `evidence` folder.

---

## SEO

The website contains basic Search Engine Optimisation features including:

- Page titles
- Meta descriptions
- Open Graph metadata
- Semantic HTML structure

These features help provide information about the website to browsers and search engines.

---

## Project Folder Structure

```text
GLOBALSTEPPER/
│
├── index.html
├── products.html
├── product-details.html
├── cart.html
├── about.html
├── contact.html
├── wishlist.html
├── README.md
│
├── css/
│   ├── style.css
│   └── style.min.css
│
├── js/
│   └── script.js
│
├── images/
│   ├── logo.png
│   ├── product images
│   └── videos/
│       └── Hero-small.mp4
│
└── evidence/
    ├── problem1.png
    ├── problem2.png
    ├── 1&2-fix.png
    ├── performance-before.png
    └── performance-after.png.png