initialiseListeners();

// [[[

function initialiseListeners() {
   let purchaseButton = document.getElementById('purchase-button');

   purchaseButton.addEventListener('click', purchaseButtonClicked);

   function purchaseButtonClicked() {
      const sessionId = crypto.randomUUID();
      let cartItems = document.getElementsByClassName('cart-items')[0];
      const purchasedItems = cartItems.getElementsByClassName('cart-row');

      let body = {
         sessionID: sessionId,
         items: []
      };

      for(let i = 0; i < purchasedItems.length; i++) {
         const item = purchasedItems[i].children;
         const ID = item[0].id;
         const quantity = item[2].getElementsByClassName('cart-quantity-input')[0];

         body.items.push({ ID: ID, amount: quantity.value });
      }

      const XHR = new XMLHttpRequest();
      XHR.open('POST', '/store');
      XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

      XHR.send(JSON.stringify(body));

      while(cartItems.hasChildNodes()) {
         cartItems.removeChild(cartItems.firstChild);
      }

      updateCartTotal();
   }

   let addToCartButtons = document.getElementsByClassName('shop-item-button');

   for (let i = 0; i < addToCartButtons.length; i++) {
      addToCartButtons[i].addEventListener('click', addToCartClicked);
   }

   function addToCartClicked(event) {
      let button = event.target;
      let shopItem = button.parentElement.parentElement;

      let item = {
         id:    shopItem.getAttribute('id'),
         title: shopItem.getElementsByClassName('shop-item-title')[0].innerText,
         price: shopItem.getElementsByClassName('shop-item-price')[0].innerText,
         image: shopItem.getElementsByClassName('shop-item-image')[0].src
      };

      console.log();

      addItemToCart(item);
   }
}

// ]]]

// [[[

function addItemToCart(item) {
   let cartRow = document.createElement('div');
   cartRow.classList.add('cart-row');

   var cartItemNames = document.getElementsByClassName('cart-item-title');
   for(let i = 0; i < cartItemNames.length; i++) {
      if(cartItemNames[i].innerText == item.title) {
         alert('This item is already in the cart');
         return;
      }
   }

   let cartRowContents = `
                    <div id="${item.id}" class="cart-item cart-column">
                        <img class="cart-item-image" src="${item.image}" width="100" height="100">
                        <span class="cart-item-title">${item.title}</span>
                    </div>
                    <span class="cart-price cart-column">${item.price}</span>
                    <div class="cart-quantity cart-column">
                        <input class="cart-quantity-input" type="number" value="1">
                        <button class="btn btn-remove" type="button">REMOVE</button>
                    </div>`;

   cartRow.innerHTML = cartRowContents;

   let cartItems = document.getElementsByClassName('cart-items')[0];
   cartItems.append(cartRow);

   cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem);
   cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChqanged);

   updateCartTotal();
}

// ]]]

// [[[

function quantityChqanged(event) {
   let input = event.target;

   if(input.value <= 0) {
      input.value = 1;
   }

   updateCartTotal();
}

// ]]]

// [[[

function removeCartItem(event) {
   let button = event.target;

   button.parentElement.parentElement.remove();
   updateCartTotal();
}

// ]]]

// [[[

function updateCartTotal() {
   let cartItems = document.getElementsByClassName('cart-items')[0];
   let cartRows = cartItems.getElementsByClassName('cart-row');

   let total = 0;

   for(let i = 0; i < cartRows.length; i++) {
      let cartRow = cartRows[i];
      let priceElement = cartRow.getElementsByClassName('cart-price')[0];
      let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
      let price = parseFloat(priceElement.innerText.replace('€', ''));
      let quantity = quantityElement.value;

      total = total + (price * quantity);
   }

   total = Math.round(total * 100) / 100;
   document.getElementsByClassName('cart-total-price')[0].innerText = '€' + total;

}

// ]]]
