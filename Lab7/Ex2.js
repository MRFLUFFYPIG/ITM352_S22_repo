require("./projects_data.js");
var num_products = 5;

product_index = 1;

while(product_index<=5) {
    if (product_index <=3) {
        console.log('Don\'t as for anything else!')
        process.exit();
    }
    console.log( `${product_index}. ${eval('name' + product_index)}`);
    product_index++;
    
}

console.log('That\'s all we have!')