"use client";

import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p>You must log in first.</p>
        <a href="/login" className="underline">
          Go to login
        </a>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest">
          Customer account
        </p>
        <h1 className="text-3xl font-bold">
          {session.user?.name || "My profile"}
        </h1>
      </div>

      <div className="rounded-2xl border p-5">
        <p>Email: {session.user?.email || "Not provided"}</p>
      </div>

      <div className="flex gap-3">
        <a
          href="/shop"
          className="rounded-full bg-black px-5 py-3 text-white"
        >
          Continue shopping
        </a>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full border px-5 py-3"
        >
          Log out
        </button>
      </div>
    </section>
  );
}