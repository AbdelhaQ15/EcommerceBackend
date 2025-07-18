const products = [
    {
        productId: 'zioefijziefze',
        quantity: 2,
        price: 10.99
    },{
        productId: 'zioefijziefze',
        quantity: 5,
        price: 11.4
    },{
        productId: 'zioefijziefze',
        quantity: 7,
        price: 2.99
    },{
        productId: 'zioefijziefze',
        quantity: 2,
        price: 5.30
    },{
        productId: 'zioefijziefze',
        quantity: 4,
        price: 10.99
    },{
        productId: 'zioefijziefze',
        quantity: 1,
        price: 3.99
    },
]

let productPrice = 0;
const totalPrice = products.forEach(product => {
    productPrice += product.quantity * product.price;
    });
console.log(productPrice);