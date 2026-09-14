"use client";

import { useEffect, useState } from "react";

type CartItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("MPESA");
  const [currency, setCurrency] = useState("KES");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        shippingAddress: address,
        paymentMethod: method,
        paymentCurrency: currency,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Order failed");
      setLoading(false);
      return;
    }

    localStorage.removeItem("cart");
    alert(`Order created: ${result.id}`);
    window.location.href = "/profile";
  }

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm">
            Delivery address
          </span>
          <textarea
            required
            value={address}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            className="min-h-28 w-full rounded-lg border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Currency</span>
          <select
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="KES">KES</option>
            <option value="TZS">TZS</option>
            <option value="UGX">UGX</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">
            Payment method
          </span>
          <select
            value={method}
            onChange={(event) =>
              setMethod(event.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="MPESA">M-Pesa</option>
            <option value="PAYPAL">PayPal</option>
            <option value="BANK">Bank</option>
            <option value="CASH">Cash</option>
          </select>
        </label>

        <button
          disabled={loading || items.length === 0}
          className="w-full rounded-full bg-black px-5 py-3 text-white disabled:bg-gray-400"
        >
          {loading ? "Creating order..." : "Place order"}
        </button>
      </form>
    </section>
  );
}