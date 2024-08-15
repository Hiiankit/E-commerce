"use client";
import { useEffect, useState } from "react";
import Header from "../Header/page";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(
      "https://mock.shop/api?query={products(first:20){edges{node{id title description featuredImage{id url} variants(first:3){edges{node{price{amount currencyCode}}}}}}}}"
    )
      .then((res) => res.json())
      .then((data) => setProducts(data.data.products.edges))
      .catch((error) => console.error("Error fetching products:", error));

    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (!products.length) return <div>Loading...</div>;

  return (
    <>
      <Header cartItems={cart.length} />
      <div className="grid font-serif grid-cols-1 sm:gap-2 sm:grid-cols-2 md:grid-cols-3 w-[70%] mx-auto ">
        {products.map(({ node: product }) => (
          <div key={product.id}>
            {product.featuredImage && (
              <img
                className="rounded-xl"
                src={product.featuredImage.url}
                alt={product.title}
                width={300}
              />
            )}
            <h1 className="text-xl font-bold">{product.title}</h1>
            <div>
              {product.variants.edges.length > 0 && (
                <p className="text-lg">
                  Price: ${product.variants.edges[0].node.price.amount}
                </p>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="bg-black text-white px-3 py-2 rounded-xl mb-4"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
