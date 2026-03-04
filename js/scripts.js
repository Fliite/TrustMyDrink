const volumeModifier = {
            "25cl": 0,
            "50cl": 2
        };

        const materialModifier = {
            "plastique": 0,
            "verre": 3
        };

        const cartItems = [];
        const cartList = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");

        function formatPrice(value) {
            return value.toFixed(2).replace(".", ",") + " €";
        }

        function updateCard(card) {
            const qty = Number(card.dataset.qty);
            const baseUnit = Number(card.dataset.baseUnit);
            const volume = card.querySelector("select[name='volume']").value;
            const material = card.querySelector("select[name='material']").value;
            const unitPrice = baseUnit + volumeModifier[volume] + materialModifier[material];
            const totalPrice = qty * unitPrice;

            card.querySelector("[data-role='price']").textContent = "Prix : " + formatPrice(totalPrice);
            card.querySelector("[data-role='unit-price']").textContent = "(" + formatPrice(unitPrice) + " / verre)";

            const image = card.querySelector(".pack-image");
            if (image) {
                const nextSrc = material === "verre" ? image.dataset.glass : image.dataset.plastic;
                image.src = nextSrc;
                image.alt = "Design du verre (" + material + ")";
            }

            return { qty, volume, material, unitPrice, totalPrice };
        }

        function renderCart() {
            cartList.innerHTML = "";

            if (cartItems.length === 0) {
                const empty = document.createElement("li");
                empty.className = "cart-empty";
                empty.textContent = "Votre panier est vide.";
                cartList.appendChild(empty);
                cartTotal.textContent = formatPrice(0);
                return;
            }

            let total = 0;
            cartItems.forEach((item) => {
                total += item.totalPrice;
                const li = document.createElement("li");
                li.className = "cart-item";
                li.innerHTML = `
                    <div>
                        <strong>${item.name}</strong><br>
                        ${item.volume}, ${item.material} — ${formatPrice(item.totalPrice)}
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Retirer</button>
                `;
                cartList.appendChild(li);
            });

            cartTotal.textContent = formatPrice(total);
        }

        document.querySelectorAll(".pack-card").forEach((card) => {
            updateCard(card);

            card.querySelectorAll("select").forEach((select) => {
                select.addEventListener("change", () => updateCard(card));
            });

            card.querySelector(".add-to-cart").addEventListener("click", () => {
                const { qty, volume, material, unitPrice, totalPrice } = updateCard(card);
                const name = card.querySelector("h3").textContent;
                cartItems.push({
                    id: Date.now().toString(36) + Math.random().toString(16).slice(2),
                    name,
                    qty,
                    volume,
                    material,
                    unitPrice,
                    totalPrice
                });
                renderCart();
            });
        });

        cartList.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("remove-btn")) {
                const id = target.getAttribute("data-id");
                const index = cartItems.findIndex((item) => item.id === id);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                    renderCart();
                }
            }
        });

        renderCart();
