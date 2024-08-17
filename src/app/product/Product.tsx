"use client";
import { useEffect, useState } from "react";
import Header from "../header/Header";
import Image from "next/image";

// Define the types for product and variant
interface ProductVariant {
  price: {
    amount: number;
  };
}

interface ProductNode {
  id: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
}

interface ProductResponse {
  data: {
    products: {
      edges: Array<{
        node: ProductNode;
      }>;
    };
  };
}

export default function Product() {
  const [products, setProducts] = useState<ProductNode[]>([]);
  const [cart, setCart] = useState<ProductNode[]>([]);

  useEffect(() => {
    fetch(
      "https://mock.shop/api?query={products(first:20){edges{node{id title description featuredImage{id url} variants(first:3){edges{node{price{amount currencyCode}}}}}}}}"
    )
      .then((res) => res.json())
      .then((data: ProductResponse) =>
        setProducts(data.data.products.edges.map((edge) => edge.node))
      )
      .catch((error) => console.error("Error fetching products:", error));

    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const addToCart = (product: ProductNode) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate the number of items in the cart
  const cartItems = cart.length;

  if (products.length === 0) return <div>Loading...</div>;

  return (
    <>
      <Header cartItems={cartItems} />
      <div className="grid  font-serif grid-cols-2  sm:grid-cols-2 md:grid-cols-3 w-[70%] mx-auto sm:gap-4 ">
        {products.map((product) => (
          <div key={product.id}>
            {product.featuredImage && (
              <Image
                className="rounded-xl "
                src={product.featuredImage.url}
                alt={product.title}
                width={300}
                height={200}
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
