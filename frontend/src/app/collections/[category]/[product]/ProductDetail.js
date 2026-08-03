"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { BUSINESS } from "@/lib/seo";

// wa.me takes digits only — no "+", no separators.
const WHATSAPP_NUMBER = BUSINESS.telephone.replace(/\D/g, "");

function renderStars(rating) {
  const value = Number(rating || 0);

  return Array(5)
    .fill(0)
    .map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(value)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
}

/**
 * Product detail view.
 *
 * A client component so the WhatsApp button can open a chat, but it holds no
 * state and fetches nothing — so it renders fully into the server HTML and the
 * copy is indexable.
 */
export default function ProductDetail({
  product,
  categoryKey,
  categoryLabel,
  related = [],
}) {
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello, I would like a quotation for this curtain: ${product.name}`
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Visible breadcrumb, mirroring the BreadcrumbList structured data. */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#8f744e]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/collections/${categoryKey}`}
              className="hover:text-[#8f744e]"
            >
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[#8f744e] font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f3f0eb]">
          {product.image && (
            <Image
              src={product.image}
              alt={`${product.name} — ${categoryLabel.toLowerCase()} curtain by SKF Curtains`}
              fill
              // Two-column from the md breakpoint, full width below it.
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-[#b4a389]">
            {categoryLabel}
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[#8f744e]">
            {product.name}
          </h1>

          {product.rating ? (
            <div className="mt-4 flex items-center gap-1">
              {renderStars(product.rating)}
              <span className="ml-2 text-sm text-gray-500">
                {product.rating}
                {product.reviews ? ` (${product.reviews} reviews)` : ""}
              </span>
            </div>
          ) : null}

          {product.description && (
            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          <button
            type="button"
            onClick={openWhatsApp}
            aria-label={`Enquire on WhatsApp about ${product.name}`}
            className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 text-sm rounded-lg text-white font-semibold bg-[#25D366] hover:bg-[#1ebe5b] transition"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Send us a message for a free, no-obligation quotation including
            measuring and installation.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[#8f744e]">
            More from {categoryLabel}
          </h2>

          <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/collections/${categoryKey}/${item.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f3f0eb]">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-[#2d3142] group-hover:text-[#8f744e]">
                    {item.name}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
