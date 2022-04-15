num_items= 5;
var products = [
    
        {brand: "Pyzel",
        "price" : 799.00,
        "inventory":10,
        "image":"https://img.shaperbuddy.com/img/18/surfboards/5235215845eff7.jpg"},

    
        {brand : "Rob Machado",
        "price" : 499.00,
        "inventory":10,
        "image" :"http://cdn.shopify.com/s/files/1/1646/9407/products/GoFish_Red_1500px_1200x630.jpg?v=1627427041"},

    
        {brand : "Body Glove",
        "price" : 299.00,
        "inventory":10,
        "image" :"https://cdn.shopify.com/s/files/1/0103/0448/7482/products/stsurfdaily20u-343___daily-76-soft-top-surfboard-with-removable-fins-mint-white___default_2000x.jpg?v=1600730940"},

    
        {brand : "Giantex",
        "price" : 199.00,
        "inventory":10,
        "image" :"https://m.media-amazon.com/images/I/61PSvHFQvZL._AC_SL1200_.jpg"},
    
    
        {brand : "Flying Bee",
        "price" : 419.00,
        "inventory":10,
        "image" :"https://www.mundo-surf.com/43361/surfboard-ms-flying-bee-round.jpg"}
];
//accorinding to Xinfei this will help my products.
if(typeof exports != 'undefined') { // try to export this file to server.js
        exports.products = products;
        }