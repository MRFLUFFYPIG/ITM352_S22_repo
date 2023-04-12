import products from "products.js";

const productContainer = document.getElementById("product-container");

// Loop through the products array and create a product section for each product
products.forEach((product) => {
  // Create the HTML elements for the product section
  const productSection = document.createElement("section");
  productSection.classList.add("product");

  const productImage = document.createElement("img");
  productImage.src = product.image;
  productImage.alt = product.name;

  const productName = document.createElement("h2");
  productName.textContent = product.name;

  const productDescription = document.createElement("p");
  productDescription.textContent = product.description;

  const productPrice = document.createElement("span");
  productPrice.classList.add("price");
  productPrice.textContent = `$${product.price.toFixed(2)}`;

  const productButton = document.createElement("button");
  productButton.textContent = "Add to Cart";

  // Append the HTML elements to the product section
  productSection.appendChild(productImage);
  productSection.appendChild(productName);
  productSection.appendChild(productDescription);
  productSection.appendChild(productPrice);
  productSection.appendChild(productButton);

  // Append the product section to the product container
  productContainer.appendChild(productSection);
});
