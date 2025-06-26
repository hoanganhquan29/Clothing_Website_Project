const products = {
      "summer-dress": {
        name: "Summer Dress",
        price: 29.99,
        description: "Lightweight and breezy summer dress for hot days.",
        rating: 4,
        images: [
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
        ],
        related: ["denim-jacket", "white-sneakers"]
      },
      "denim-jacket": {
        name: "Denim Jacket",
        price: 49.99,
        description: "Classic blue denim jacket with modern fit.",
        rating: 5,
        images: [
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1495121605193-b116b5b09c70?auto=format&fit=crop&w=600&q=80"
        ],
        related: ["summer-dress", "white-sneakers"]
      },
   
      "leather-bag": {
  name: "Leather Bag",
  price: 79.99,
  description: "Premium leather handbag with adjustable strap.",
  rating: 5,
  images: [
    "https://images.unsplash.com/photo-1600185365521-4cfdb09ed5a7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1601260450462-84cc21f437e6?auto=format&fit=crop&w=600&q=80"
  ],
  related: ["summer-dress", "white-sneakers"]
},
"red-scarf": {
  name: "Red Scarf",
  price: 19.99,
  description: "Soft and warm red scarf made from premium wool.",
  rating: 4,
  images: [
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512460461124-4237c9e62c13?auto=format&fit=crop&w=600&q=80"
  ],
  related: ["summer-dress", "leather-bag"]
},
"leather-bag": {
  name: "Leather Bag",
  price: 79.99,
  description: "Premium leather handbag with adjustable strap.",
  rating: 5,
  images: [
    "https://images.unsplash.com/photo-1600185365521-4cfdb09ed5a7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1601260450462-84cc21f437e6?auto=format&fit=crop&w=600&q=80"
  ],
  related: ["denim-jacket", "white-sneakers"]
},
"black-hat": {
  name: "Black Hat",
  price: 24.99,
  description: "Stylish black hat perfect for any season.",
  rating: 3,
  images: [
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=600&q=80"
  ],
  related: ["red-scarf", "white-sneakers"]
},
"summer-sunglasses": {
  name: "Summer Sunglasses",
  price: 39.99,
  description: "Trendy sunglasses with UV protection for summer days.",
  rating: 4,
  images: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&w=600&q=80"
  ],
  related: ["red-scarf", "black-hat"]
},
"floral-dress": {
  name: "Floral Dress",
  price: 44.99,
  description: "Beautiful floral print dress perfect for spring and summer.",
  rating: 5,
  images: [
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=600&q=80"
  ],
  related: ["summer-dress", "red-scarf"]
},
"white-sneakers":{
  name:"White Sneakers",
  price:59.99,
  descreption:"White sneakers are classic, versatile footwear known for their clean, minimalist look. They typically feature a simple design made from materials like leather, canvas, or synthetic fabrics, with white rubber soles. Perfect for casual, sporty, or even semi-formal outfits, white sneakers are popular for their ability to complement a wide range of styles.",
  rating:4.8,
  images:[
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/13721f24-2774-443e-a27d-998d2c6be068/AIR+FORCE+1+%2707+FLYEASE.png",
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/192e92e5-474f-4092-902b-70ec0d0e379f/AIR+FORCE+1+%2707+FLYEASE.png"
  ],
  related:["black-hat","denim-jacket"]
},


      
    };

    const params = new URLSearchParams(window.location.search);
    const id = params.get("product");
    const product = products[id];

    if (!product) {
      document.body.innerHTML = "<h2 style='text-align:center'>Product not found</h2>";
      throw new Error("Invalid product");
    }

    // Render product details
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("main-image").src = product.images[0];

    // Rating stars
    document.getElementById("rating-stars").innerHTML = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);

    // Thumbnails
    const thumbnails = document.getElementById("thumbnails");
    product.images.forEach((img, idx) => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.onclick = () => {
        document.getElementById("main-image").src = img;
      };
      thumbnails.appendChild(thumb);
    });

    // Related Products
    const relatedDiv = document.getElementById("related-container");
    product.related.forEach(relId => {
      const rel = products[relId];
      const a = document.createElement("a");
      a.href = `product.html?product=${relId}`;
      a.innerHTML = `
        <img src="${rel.images[0]}" alt="${rel.name}">
        <h4>${rel.name}</h4>
      `;
      relatedDiv.appendChild(a);
    });

    function addProductToCart() {
      const size = document.getElementById("size").value;
      const quantity = parseInt(document.getElementById("quantity").value);

      if (!size) {
        alert("Please select a size.");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
      cart.push({
        id,
        name: product.name,
        size,
        quantity,
        price: product.price
      });
      localStorage.setItem("shoppingCart", JSON.stringify(cart));
      alert("Product added to cart!");
    }