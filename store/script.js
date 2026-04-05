const container = document.querySelector(".container-item");


const render = async (type = "all") => {
    try {
        container.textContent = '';
        let items;
        let basket;
        if (type === "all") {
            const req = await fetch("https://bb9812bf76fa8b9b.mokky.dev/cloth");
            items = await req.json();
            const req2 = await fetch("https://bb9812bf76fa8b9b.mokky.dev/basket");
             basket = await req2.json();
        } else {
            const req = await fetch(`https://bb9812bf76fa8b9b.mokky.dev/cloth?type=${type}` );
            items = await req.json();
            const req2 = await fetch(`https://bb9812bf76fa8b9b.mokky.dev/basket?type=${type}`);
             basket = await req2.json();
        }

     
        
        

        items.forEach(el => {

            
           


            const item = document.createElement("div");
            item.classList.add("item");

            item.innerHTML = `
                <img src=${el.path} width="300" height="300" alt="">
                <p class="title">${el.title}</p>
                <p class="price">${el.price}</p>
                
                
                <button class="add-btn">


                                <div class="null">

                                    Добавить

                                </div>

                                <div class="exists">

                                    <p class="minus">-</p>
                                    <p class="quantity"></p>
                                    <p class="plus">+</p>

                                </div>

                            </button>
            `;

            const basketItem = basket.find(b => b.productId === el.id);
            const quantityElement = item.querySelector(".quantity");



            // console.log(basketItem)

            if (basketItem) {
                item.querySelector(".add-btn").classList.add("exists");

                quantityElement.textContent = basketItem.quantity;
                item.querySelector(".plus").addEventListener("click", (e) => {
                    e.stopPropagation()
                    addItem(el, type)
                })

                item.querySelector(".minus").addEventListener("click", (e) => {
                    e.stopPropagation()
                    removeItem(basketItem.productId, basketItem.id, basketItem.quantity, type)
                })

            } else {
                item.querySelector(".add-btn").classList.add("null");
                quantityElement.textContent = "net";
                item.querySelector(".add-btn").addEventListener("click", (e) => {
                    e.stopPropagation()
                    addItem(el, type)
                })
            }


            container.appendChild(item);

        });

    } catch (error) {
        console.log(error);
    }
}


// https://bb9812bf76fa8b9b.mokky.dev/basket


render();

const removeItem = async (productId, id, quantity, type) => {
    
    console.log(type)
    try {
        if (quantity > 1) {
            quantity = quantity - 1
            await fetch(`https://bb9812bf76fa8b9b.mokky.dev/basket/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    quantity: quantity
                })
            })
            render(type)
        } else {
            await fetch(`https://bb9812bf76fa8b9b.mokky.dev/basket/${id}`, {
                method: "DELETE"

            })
            render(type)
        }
    } catch (error) {
        console.log(error)
    }
}


const addItem = async (el, type) => {
    console.log(type)

    try {
        container.textContent = ''


        const req = await fetch("https://bb9812bf76fa8b9b.mokky.dev/basket");
        const basket = await req.json();



      

        const exists = basket.find(ele => ele.productId === el.id);

       

        if (exists) {
            console.log(exists.id)
            exists.quantity = exists.quantity + 1;
            // console.log(exists.quantity);
            await fetch(`https://bb9812bf76fa8b9b.mokky.dev/basket/${exists.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    quantity: exists.quantity
                })
            })
            render(type)
        } else {
            el.quantity = 1
            await fetch(`https://bb9812bf76fa8b9b.mokky.dev/basket/`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    productId: el.id,
                    title: el.title,
                    price: el.price,
                    path: el.path,
                    type:el.type,
                    quantity: 1
                })
            })
            render(type)

        }

    } catch (error) {
        console.log(error);
    }
}

const itemCloth = document.querySelectorAll(".itemCloth");

console.log(itemCloth);


itemCloth.forEach(el =>{
    el.addEventListener("click", (e) =>{
        console.log(e.target.dataset.value);
        
        render(e.target.dataset.value);
    })
})
