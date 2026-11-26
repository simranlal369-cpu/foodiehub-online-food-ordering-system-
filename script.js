
// ===================================
// FOODIEHUB - ONLINE FOOD ORDERING
// ===================================

// FOOD DATABASE
const foods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        description: "Classic cheese pizza with fresh toppings.",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        description: "Delicious pizza with pepperoni and cheese.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600"
    },
    {
        id: 3,
        name: "Cheese Burger",
        category: "Burger",
        price: 149,
        description: "Juicy burger with cheese and fresh vegetables.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 4,
        name: "Chicken Burger",
        category: "Burger",
        price: 199,
        description: "Crispy chicken burger with special sauce.",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=600"
    },
    {
        id: 5,
        name: "Chicken Biryani",
        category: "Biryani",
        price: 279,
        description: "Aromatic rice with delicious chicken.",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=600"
    },
    {
        id: 6,
        name: "Veg Biryani",
        category: "Biryani",
        price: 199,
        description: "Flavourful rice cooked with fresh vegetables.",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600"
    },
    {
        id: 7,
        name: "Hakka Noodles",
        category: "Chinese",
        price: 159,
        description: "Chinese-style noodles with crunchy vegetables.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600"
    },
    {
        id: 8,
        name: "Spring Rolls",
        category: "Chinese",
        price: 129,
        description: "Crispy rolls filled with fresh vegetables.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600"
    },
    {
        id: 9,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 179,
        description: "Soft and rich chocolate dessert.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
    },
    {
        id: 10,
        name: "Ice Cream",
        category: "Dessert",
        price: 99,
        description: "Creamy and delicious ice cream.",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600"
    },
    {
        id: 11,
        name: "Veg Pizza",
        category: "Pizza",
        price: 229,
        description: "Fresh vegetables and melted cheese.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
    },
    {
        id: 12,
        name: "Double Patty Burger",
        category: "Burger",
        price: 249,
        description: "Double patty burger for extra hunger.",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600"
    }
];

// ===================================
// LOCAL STORAGE
// ===================================

function loadStorage(key, fallback) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return data ?? fallback;
    } catch (error) {
        return fallback;
    }
}

let cart = loadStorage("foodiehubCart", []);
let orders = loadStorage("foodiehubOrders", []);

function saveCart() {
    localStorage.setItem("foodiehubCart", JSON.stringify(cart));
}

function saveOrders() {
    localStorage.setItem("foodiehubOrders", JSON.stringify(orders));
}

// ===================================
// SELECT HTML ELEMENTS
// ===================================

const foodGrid = document.getElementById("foodGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const cartSidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");

const subtotalElement = document.getElementById("subtotal");
const deliveryFeeElement = document.getElementById("deliveryFee");
const grandTotalElement = document.getElementById("grandTotal");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutTotal = document.getElementById("checkoutTotal");

// ===================================
// DISPLAY FOOD MENU
// ===================================

function displayFoods(foodList) {

    if (foodList.length === 0) {
        foodGrid.innerHTML =
            '<p class="no-food">No food items found. Try another search!</p>';
        return;
    }

    foodGrid.innerHTML = foodList.map(food => `
        <div class="food-card">

            <img src="${food.image}" alt="${food.name}"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Food';">

            <div class="food-info">

                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-bottom">

                    <span class="price">₹${food.price}</span>

                    <button class="add-button"
                        data-id="${food.id}">
                        + Add
                    </button>

                </div>

            </div>
        </div>
    `).join("");

    // ADD TO CART BUTTONS
    document.querySelectorAll(".add-button").forEach(button => {

        button.addEventListener("click", () => {

            const foodId = Number(button.dataset.id);

            addToCart(foodId);

        });

    });
}

// ===================================
// ADD FOOD TO CART
// ===================================

function addToCart(foodId) {

    const food = foods.find(item => item.id === foodId);

    if (!food) return;

    const existingItem = cart.find(item => item.id === foodId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity: 1
        });

    }

    saveCart();
    renderCart();

}

// ===================================
// RENDER CART
// ===================================

function renderCart() {

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    cartCount.textContent = totalItems;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty! 🍽️<br><br>Add some delicious food.</p>';

    } else {

        cartItems.innerHTML = cart.map(item => `

            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <p>₹${item.price * item.quantity}</p>

                    <div class="quantity-controls">

                        <button data-action="decrease"
                            data-id="${item.id}">−</button>

                        <span>${item.quantity}</span>

                        <button data-action="increase"
                            data-id="${item.id}">+</button>

                    </div>

                    <button class="remove-button"
                        data-action="remove"
                        data-id="${item.id}">
                        Remove
                    </button>

                </div>

            </div>

        `).join("");

    }

    // CALCULATE BILL
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const deliveryFee = subtotal > 0 ? 40 : 0;

    const total = subtotal + deliveryFee;

    subtotalElement.textContent = `₹${subtotal}`;
    deliveryFeeElement.textContent = `₹${deliveryFee}`;
    grandTotalElement.textContent = `₹${total}`;

    checkoutTotal.textContent = `₹${total}`;

    document.getElementById("checkoutButton").disabled =
        cart.length === 0;

}

// ===================================
// CART QUANTITY AND REMOVE BUTTONS
// ===================================

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    } else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }

    } else if (action === "remove") {

        cart = cart.filter(product => product.id !== id);

    }

    saveCart();
    renderCart();

});

// ===================================
// CATEGORY FILTER
// ===================================

let selectedCategory = "All";

document.querySelectorAll(".category").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".category").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        selectedCategory = this.dataset.category;

        filterFoods();

    });

});

// ===================================
// SEARCH FOOD
// ===================================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", filterFoods);

function filterFoods() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredFoods = foods.filter(food => {

        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        const matchesSearch =
            food.name.toLowerCase().includes(searchText) ||
            food.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;

    });

    displayFoods(filteredFoods);

}

// ===================================
// OPEN AND CLOSE CART
// ===================================

function openCart() {

    cartSidebar.classList.add("open");
    overlay.classList.add("show");

}

function closeCart() {

    cartSidebar.classList.remove("open");
    overlay.classList.remove("show");

}

document.getElementById("cartButton")
    .addEventListener("click", openCart);

document.getElementById("closeCart")
    .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

// ===================================
// CHECKOUT
// ===================================

document.getElementById("checkoutButton")
    .addEventListener("click", function() {

        if (cart.length === 0) return;

        closeCart();

        document.getElementById("checkoutFormArea").hidden = false;
        document.getElementById("successMessage").hidden = true;

        checkoutModal.classList.add("show");

    });

// ===================================
// PLACE ORDER
// ===================================

document.getElementById("orderForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) return;

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const address = document.getElementById("customerAddress").value.trim();
        const payment = document.getElementById("paymentMethod").value;

        if (!name || !phone || !address) {
            alert("Please complete all delivery details.");
            return;
        }

        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const deliveryFee = 40;
        const total = subtotal + deliveryFee;

        const order = {

            orderId: "FH" + Date.now(),

            customerName: name,
            phone: phone,
            address: address,
            paymentMethod: payment,

            items: [...cart],

            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: total,

            orderDate: new Date().toLocaleString(),

            status: "Order Placed"

        };

        // SAVE ORDER
        orders.push(order);
        saveOrders();

        // CLEAR CART
        cart = [];
        saveCart();
        renderCart();

        // DISPLAY SUCCESS MESSAGE
        document.getElementById("checkoutFormArea").hidden = true;

        document.getElementById("successMessage").hidden = false;

        document.getElementById("orderDetails").innerHTML = `
            <strong>Order ID:</strong> ${order.orderId}<br>
            <strong>Customer:</strong> ${name}<br>
            <strong>Total Paid:</strong> ₹${total}<br>
            <strong>Payment:</strong> ${payment}
        `;

        this.reset();

    });

// ===================================
// CLOSE CHECKOUT
// ===================================

function closeCheckout() {

    checkoutModal.classList.remove("show");

}

document.getElementById("closeModal")
    .addEventListener("click", closeCheckout);

document.getElementById("continueShopping")
    .addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", function(event) {

    if (event.target === checkoutModal) {
        closeCheckout();
    }

});

// ===================================
// INITIALIZE WEBSITE
// ===================================

displayFoods(foods);

renderCart();

console.log("Welcome to FoodieHub!");
console.log("Food menu loaded successfully!");
X