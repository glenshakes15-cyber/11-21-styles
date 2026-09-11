import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-8 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.3em]">
        11:21STYLES
      </p>

      <h1 className="text-4xl font-black md:text-6xl">
        BY GLENSHAKES
      </h1>

      <p className="mx-auto max-w-xl text-gray-600">
        Discover modern clothing and timeless styles from
        11:21STYLES.
      </p>

      <Link
        href="/shop"
        className="inline-block rounded-full bg-black px-6 py-3 text-white"
      >
        Shop collection
      </Link>
    </section>
  );
}