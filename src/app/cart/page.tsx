"use client";

import { useEffect, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  currency: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  function remove(index: number) {
    const copy = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(copy);
    localStorage.setItem("cart", JSON.stringify(copy));
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Cart</h1>
      <a href="/cart">Cart</a>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item, index) => (
              <article
                key={`${item.productId}-${index}`}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.size} / {item.color}
                  </p>
                  <p>
                    {item.currency}{" "}
                    {item.price.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => remove(index)}
                  className="text-sm underline"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <p className="text-xl font-bold">
            Total: {items[0]?.currency}{" "}
            {total.toLocaleString()}
          </p>

          <a
            href="/checkout"
            className="inline-block rounded-full bg-black px-5 py-3 text-white"
          >
            Checkout
          </a>
        </>
      )}
    </section>
  );
}