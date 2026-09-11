"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      alert("Incorrect login details");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest">
          Welcome back
        </p>
        <h1 className="text-3xl font-bold">Log in</h1>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm">
            Email, username, or phone
          </span>
          <input
            required
            value={identifier}
            onChange={(event) =>
              setIdentifier(event.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>

        <button
          disabled={loading}
          className="w-full rounded-full bg-black px-5 py-3 text-white disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/profile",
          })
        }
        className="w-full rounded-full border px-5 py-3"
      >
        Continue with Google
      </button>

      <div className="flex justify-between text-sm">
        <a href="/signup" className="underline">
          Create account
        </a>
        <a href="/forgot-password" className="underline">
          Forgot password?
        </a>
      </div>
    </section>
  );
}