// Selectors
document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.querySelector(".container.py-5 .row.g-4");
    const totalElement = document.querySelector(".container.py-5 .row .text-end h4 span");
    const checkoutButton = document.querySelector(".container.py-5 .row .text-end button");

    // Update the total price
    const updateTotal = () => {
        let total = 0;
        const cartItems = cartContainer.querySelectorAll(".col-12");
        cartItems.forEach((item) => {
            const itemTotal = parseInt(item.querySelector(".text-primary.fw-bold:last-child").innerText.replace(" FRW", "").replace(",", ""));
            total += itemTotal;
        });
        totalElement.innerText = `${total.toLocaleString()} FRW`;
    };

    // Handle quantity updates
    cartContainer.addEventListener("click", (e) => {
        if (e.target.matches(".btn-outline-primary")) {
            const isIncrement = e.target.innerText === "+";
            const input = e.target.parentElement.querySelector("input");
            const quantity = parseInt(input.value);
            const itemPrice = parseInt(e.target.closest(".col-12").querySelector(".text-primary.fw-bold").innerText.replace(" FRW", "").replace(",", ""));
            const totalPriceElement = e.target.closest(".col-12").querySelector(".text-primary.fw-bold:last-child");

            if (isIncrement) {
                input.value = quantity + 1;
            } else if (quantity > 1) {
                input.value = quantity - 1;
            }

            const newTotal = input.value * itemPrice;
            totalPriceElement.innerText = `${newTotal.toLocaleString()} FRW`;
            updateTotal();
        }
    });

    // Handle item removal
    cartContainer.addEventListener("click", (e) => {
        if (e.target.matches(".btn-danger")) {
            e.target.closest(".col-12").remove();
            updateTotal();
        }
    });

    // Checkout action
    checkoutButton.addEventListener("click", () => {
        alert(`Proceeding to checkout with total: ${totalElement.innerText}`);
    });

    // Initialize total calculation
    updateTotal();
});
