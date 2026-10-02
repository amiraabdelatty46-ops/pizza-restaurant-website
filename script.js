//burger
let burger = document.querySelector('.menu-toggle');
let navLinks = document.querySelector('.nav-links');
if (burger) {
    burger.addEventListener('click', function(){ 
        navLinks.classList.toggle('active');
    }
)};
let cart = [];

const cartCounter = document.getElementById('cart-counter');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items-list');
const totalPriceElement = document.getElementById('total-price');
const closeCartBtn = document.getElementById('close-cart');
const buttons = document.querySelectorAll('.btn, .offer-btn');

buttons.forEach((button) => {
    let newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
});
const cleanButtons = document.querySelectorAll('.btn, .order-btn , .btns');

cleanButtons.forEach((button) => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        let card = this.closest('.pizza-card, .offer-card, div');
        let titleElement = card.querySelector('h3');
        let priceElement = card.querySelector('.pizza-price');
        
        let itemName = titleElement ? titleElement.innerText.trim() : "بيتزا";
        let itemPrice = 0;
        
        if (priceElement) {
            itemPrice = parseFloat(priceElement.innerText.replace(/[^\d.]/g, '')) || 0;
        }
        cart.push({ name: itemName, price: itemPrice });
                updateCartUI();
                let originalText = this.innerText;
        this.innerText = "تمت الإضافة ✓";
        setTimeout(() => {
            this.innerText = originalText;
        }, 1000);
    });
});
function updateCartUI() {
    cartCounter.innerText = cart.length;
    cartItemsList.innerHTML = '';
    let total = 0;
    
    let groupedCart = {};
    cart.forEach(item => {
        if (groupedCart[item.name]) {
            groupedCart[item.name].quantity += 1;
            groupedCart[item.name].totalPrice += item.price;
        } else {
            groupedCart[item.name] = { 
                price: item.price, 
                quantity: 1, 
                totalPrice: item.price 
            };
        }
    });

    for (let name in groupedCart) {
        let item = groupedCart[name];
        total += item.totalPrice;
        
        let li = document.createElement('li');
        li.innerHTML = `${name} (×${item.quantity}) - <b>${item.totalPrice}</b>`;
        cartItemsList.appendChild(li);
    }
    
    totalPriceElement.innerText = total;
}

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

document.getElementById('checkout-whatsapp').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('السلة فارغة، أضف بعض المنتجات أولاً!');
        return;
    }

    let phoneNumber = "201000000000";
    let message = "مرحباً، أود إتمام الطلب التالي:\n\n";
    
    let total = 0;
    let groupedCart = {};
    cart.forEach(item => {
        if (groupedCart[item.name]) {
            groupedCart[item.name].quantity += 1;
            groupedCart[item.name].totalPrice += item.price;
        } else {
            groupedCart[item.name] = { price: item.price, quantity: 1, totalPrice: item.price };
        }
    });

    let index = 1;
    for (let name in groupedCart) {
        let item = groupedCart[name];
        message += `${index}. ${name} (×${item.quantity}) - ${item.totalPrice}\n`;
        total += item.totalPrice;
        index++;
    }

    message += `\nالإجمالي الكلي: ${total}\nشكراً لك!`;

    let encodedMessage = encodeURIComponent(message);
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
});

