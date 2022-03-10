function isNonNegInt(q, returnErrors=false) {
    errors = []; 
    // Checks for errors first 

if(Number(q) != q) errors.push('Not a number!'); 
// Checks if string is a number value

if(q < 0) errors.push('Negative value!'); 
// Checks if it is non-negative

if(parseInt(q) != q) errors.push('Not an integer!'); 
// Checks that it is an integer

    checkIt (returnErrors ? errors : (errors.length == 0));
    // Returns the Check
}

// Ex 2a
var attributes  =  "Nick;23;23.5;-22.5" ;
var parts_array = attributes.split(';');

for(let part of parts_array) {
    let errs = isNonNegInt(part, true);
    console.log(`Part ${part} isNonNegInt ${errs.join('')}`);
}

function checkIt(item, index) {
    attributes.forEach(item, index); 
    console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`);
    }