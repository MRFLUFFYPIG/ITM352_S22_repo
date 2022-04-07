prices = [5.95, 3.00, 12.50];
total_price = 0;
tax_rate = 0.08;    // 8% tax , needed to change from 1.08 to 0.08
for (price of prices) {
    total_price += price * tax_rate; // needed to change = to += for total_price
}
console.log(`Total price (with tax): ${total_price.toFixed(2)}`); 

// test case
console.log((5.95 + 3.00 + 12.50) * 1.08 + (5.95 + 3.00 + 12.50));