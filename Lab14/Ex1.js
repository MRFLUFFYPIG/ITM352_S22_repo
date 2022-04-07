// Needed to take out the quotes on price 
product = {name:'small gumball', price: 0.34};

tax_rate = 0.045;

total = product.price + product.price * tax_rate;

console.log(`A ${product.name} costs ${total}`); 
