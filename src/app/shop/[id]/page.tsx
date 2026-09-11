"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description?: string;
  type: string;
  sizes: string;
  colors: string;
  priceKES: string | number;
  priceTZS?: string | number;
  priceUGX?: string | number;
  priceUSD?: string | number;
  priceEUR?: string | number;
  priceGBP?: string | number;
  stock: number;
  images: string;
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [currency, setCurrency] = useState("KES");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/products/${params.id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);

        const sizes = JSON.parse(data.sizes || "[]");
        const colors = JSON.parse(data.colors || "[]");

        setSize(sizes[0] || "");
        setColor(colors[0] || "");
      });
  }, [params.id]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  const currentProduct = product;

  const images = JSON.parse(currentProduct.images || "[]");
  const sizes = JSON.parse(currentProduct.sizes || "[]");
  const colors = JSON.parse(currentProduct.colors || "[]");

  const prices: Record<string, number> = {
    KES: Number(currentProduct.priceKES),
    TZS: Number(currentProduct.priceTZS || currentProduct.priceKES),
    UGX: Number(currentProduct.priceUGX || currentProduct.priceKES),
    USD: Number(currentProduct.priceUSD || currentProduct.priceKES),
    EUR: Number(currentProduct.priceEUR || currentProduct.priceKES),
    GBP: Number(currentProduct.priceGBP || currentProduct.priceKES),
  };

  function addToCart() {
    const item = {
      productId: currentProduct.id,
      name: currentProduct.name,
      image: images[0],
      size,
      color,
      currency,
      price: prices[currency],
      quantity: 1,
    };

    const current = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    localStorage.setItem(
      "cart",
      JSON.stringify([...current, item])
    );

    alert("Item added to cart.");
  }

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        {images.map((image: string, index: number) => (
          <img
            key={index}
            src={image}
            alt={`${product.name} ${index + 1}`}
            className="w-full rounded-2xl object-cover"
          />
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase text-gray-500">
            {product.type}
          </p>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-gray-600">
            {product.description}
          </p>
        </div>

        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="KES">KES</option>
          <option value="TZS">TZS</option>
          <option value="UGX">UGX</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>

        <p className="text-2xl font-bold">
          {currency} {prices[currency].toLocaleString()}
        </p>

        <div>
          <p className="mb-2 font-medium">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((item: string) => (
              <button
                key={item}
                onClick={() => setSize(item)}
                className={`rounded-lg border px-4 py-2 ${
                  size === item
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-medium">Colour</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((item: string) => (
              <button
                key={item}
                onClick={() => setColor(item)}
                className={`rounded-lg border px-4 py-2 ${
                  color === item
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {product.stock > 0 ? "In stock" : "Sold out"}
        </p>

        <button
          disabled={product.stock <= 0}
          onClick={addToCart}
          className="w-full rounded-full bg-black px-5 py-3 text-white disabled:bg-gray-400"
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}