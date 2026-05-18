
const container_card = document.querySelector(".cart-items");
const pay_btn = document.querySelector(".checkout-btn");


pay_btn.addEventListener("click", () =>{
    alert("Поздравляю с покупкой!")
})

function calculateTotal(items) {
  return items.reduce((total, item) => {
    
    const cleanPrice = item.price.toString().replace(/[^\d]/g, '');
    
    const price = parseInt(cleanPrice, 10);
   
    const quantity = item.quantity;
    
    return total + (price * quantity);
  }, 0);
}

// Использование


const render = async() =>{
    const req = await fetch("https://bb9812bf76fa8b9b.mokky.dev/basket");
    const items = await req.json();

    console.log(items);

    container_card.textContent = ""

    const total =  calculateTotal(items)

    items.forEach(el => {
        let price = parseFloat(el.price.toString().replace(/[^\d.,]/g, ''));
        const item = document.createElement("div");
        item.classList.add('cart-item');
        item.innerHTML = `
            <div class="cart-item-image">
          <img src="${el.path}">
        </div>
        <div class="cart-item-info">
          <h3 class="cart-item-title">${el.title}</h3>
          <div class="cart-item-controls">
            <div class="cart-item-price">${el.price} ₽ × ${el.quantity} = ${price * el.quantity} ₽</div>
          </div>
        </div>
        <button class="remove-btn">Удалить</button>
        `;

        item.querySelector('.remove-btn').addEventListener('click', () =>{
            deleteItem(el.id)
        })

        container_card.appendChild(item);



    });




    document.querySelector(".total-sum").textContent = `Итого: ${total} ₽`
}


const deleteItem = async(id) =>{
    try {
        const req = await fetch(`https://bb9812bf76fa8b9b.mokky.dev/basket/${id}`,{
            method:"DELETE",
            headers:{
                "Content-type":"application/json"
            }
        });

        if(!req.ok){
            console.error("Eror");
            return;
        }

        render()

    } catch (error) {
        console.log(error)
    }
}

// https://bb9812bf76fa8b9b.mokky.dev/basket

render()