"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  type: string;
  priceKES: string | number;
  stock: number;
  images: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-widest">
          Collection
        </p>
        <h1 className="text-3xl font-bold">Shop</h1>
      </div>

      {products.length === 0 ? (
        <p>No products are currently available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const images = JSON.parse(product.images || "[]");
            const image =
              images[0] ||
              "https://placehold.co/600x800?text=11%3A21STYLES";

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border"
              >
                <img
                  src={image}
                  alt={product.name}
                  className="h-80 w-full object-cover"
                />

                <div className="space-y-2 p-4">
                  <p className="text-xs uppercase text-gray-500">
                    {product.type}
                  </p>

                  <h2 className="font-semibold">
                    {product.name}
                  </h2>

                  <p>
                    KES{" "}
                    {Number(product.priceKES).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">
                    {product.stock > 0 ? "In stock" : "Sold out"}
                  </p>

                  <a
                    href={`/shop/${product.id}`}
                    className="inline-block rounded-full bg-black px-4 py-2 text-sm text-white"
                  >
                    View item
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}