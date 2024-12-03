document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    // Retrieve cart items from localStorage
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    // Function to render cart items
    function renderCartItems() {
        cartContainer.innerHTML = ""; // Clear the cart container
        let cartTotal = 0;

        if (storedCartItems.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            cartTotalElement.textContent = "0 FRW";
            return;
        }

        // Loop through items and render
        storedCartItems.forEach((item, index) => {
            const cartRow = document.createElement("div");
            cartRow.className = "cart-item d-flex align-items-center border-bottom py-3";

            cartRow.innerHTML = `
                <div class="cart-img">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;">
                </div>
                <div class="cart-details flex-grow-1 px-3">
                    <h5 class="mb-1">${item.name}</h5>
                    <p class="mb-1 text-primary">${item.price} FRW</p>
                </div>
                <div>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                </div>
            `;
            cartContainer.appendChild(cartRow);

            // Calculate total
            cartTotal += parseInt(item.price);
        });

        // Update cart total
        cartTotalElement.textContent = `${cartTotal} FRW`;
    }

    // Event listener for remove buttons
    cartContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-item")) {
            const index = event.target.getAttribute("data-index");
            storedCartItems.splice(index, 1); // Remove item from array
            localStorage.setItem("cartItems", JSON.stringify(storedCartItems)); // Update localStorage
            renderCartItems(); // Re-render cart items
        }
    });

    // Initial render
    renderCartItems();
});
