"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Registration failed");
      setLoading(false);
      return;
    }

    const login = await signIn("credentials", {
      identifier: form.email || form.phone || form.username,
      password: form.password,
      redirect: false,
    });

    if (login?.error) {
      alert("Account created. Please log in.");
      router.push("/login");
    } else {
      router.push("/profile");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest">
          Join us
        </p>
        <h1 className="text-3xl font-bold">Create account</h1>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {[
          ["name", "Name", "text"],
          ["email", "Email", "email"],
          ["phone", "Phone", "tel"],
          ["username", "Username", "text"],
          ["password", "Password", "password"],
        ].map(([field, label, type]) => (
          <label key={field} className="block">
            <span className="mb-1 block text-sm">{label}</span>
            <input
              required={
                field === "password" ||
                (field === "email" &&
                  !form.phone &&
                  !form.username)
              }
              type={type}
              value={form[field as keyof typeof form]}
              onChange={(event) =>
                update(field, event.target.value)
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>
        ))}

        <button
          disabled={loading}
          className="w-full rounded-full bg-black px-5 py-3 text-white disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Log in
        </a>
      </p>
    </section>
  );
}