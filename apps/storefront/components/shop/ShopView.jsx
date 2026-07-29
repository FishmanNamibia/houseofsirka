"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { productPrice, unique } from "@/lib/format";
import { useStore } from "@/components/store/StoreProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";
import Sheet from "@/components/ui/Sheet";
import { ProductCard, SelectFilter } from "@/components/shop/parts";

const DEFAULT_FILTERS = {
  search: "",
  category: "All",
  size: "All",
  color: "All",
  maxPrice: 2800,
  sort: "Featured",
};

/**
 * One definition of the six controls, rendered into two containers.
 *
 * They were previously written inline in the desktop panel only, which is why
 * the mobile experience was six stacked full-width fields ahead of the grid:
 * at 375px that pushed the first product roughly 1,200px down the page, so the
 * rail this shop is built to show was invisible until you scrolled past the
 * machinery for narrowing it.
 */
function FilterFields({ filters, setFilters, fmt, categories, sizes, colors }) {
  const set = (patch) => setFilters({ ...filters, ...patch });

  return (
    <>
      <label className="grid gap-2 text-body-sm font-bold text-ink-700 sm:col-span-2 md:col-span-3 lg:col-span-1">
        <span className="inline-flex items-center gap-2">
          <Search size={16} aria-hidden="true" /> Search
        </span>
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Dress, blazer, silk"
          className="h-11 rounded-none border border-brass-600 bg-white px-3 text-ink-900"
        />
      </label>
      <SelectFilter label="Category" value={filters.category} options={categories} onChange={(v) => set({ category: v })} />
      <SelectFilter label="Size" value={filters.size} options={sizes} onChange={(v) => set({ size: v })} />
      <SelectFilter label="Color" value={filters.color} options={colors} onChange={(v) => set({ color: v })} />
      <label className="grid gap-2 text-body-sm font-bold text-ink-700">
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal size={16} aria-hidden="true" /> Max price
        </span>
        <input
          type="range"
          min="400"
          max="3000"
          step="50"
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="range-thumb h-11 accent-wine-600"
        />
        <span className="tabular text-caption text-ink-600">{fmt(filters.maxPrice)}</span>
      </label>
      <SelectFilter
        label="Sort"
        value={filters.sort}
        options={["Featured", "Newest", "Price low", "Price high"]}
        onChange={(v) => set({ sort: v })}
      />
    </>
  );
}

function Catalogue() {
  const { store, publishedProducts, fmt, addToCart, toggleWishlist } = useStore();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(
    () => ["All", ...unique(store.products.map((p) => p.category))],
    [store.products],
  );
  const sizes = useMemo(
    () => ["All", ...unique(store.products.flatMap((p) => p.variants.map((v) => v.size)))],
    [store.products],
  );
  const colors = useMemo(
    () => ["All", ...unique(store.products.flatMap((p) => p.variants.map((v) => v.color)))],
    [store.products],
  );

  const filteredProducts = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const matched = publishedProducts.filter((product) => {
      const haystack = [
        product.name, product.sku, product.category,
        product.collection, product.description, product.tags.join(" "),
      ].join(" ").toLowerCase();

      return (
        (!search || haystack.includes(search)) &&
        (filters.category === "All" || product.category === filters.category) &&
        (filters.size === "All" || product.variants.some((v) => v.size === filters.size)) &&
        (filters.color === "All" || product.variants.some((v) => v.color === filters.color)) &&
        productPrice(product) <= Number(filters.maxPrice)
      );
    });

    return matched.sort((a, b) => {
      if (filters.sort === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sort === "Price low") return productPrice(a) - productPrice(b);
      if (filters.sort === "Price high") return productPrice(b) - productPrice(a);
      return Number(b.tags.includes("Featured")) - Number(a.tags.includes("Featured")) || b.rating - a.rating;
    });
  }, [filters, publishedProducts]);

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
  const activeCount = Object.keys(DEFAULT_FILTERS).filter(
    (key) => filters[key] !== DEFAULT_FILTERS[key],
  ).length;
  const fieldProps = { filters, setFilters, fmt, categories, sizes, colors };

  return (
    <div className="mx-auto max-w-shell px-4 py-8 md:px-8 xl:px-12 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-body-sm text-ink-600">
        <Link href="/" className="hover:text-wine-600">Home</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="text-ink-800">Shop</span>
      </nav>

      <h1 className="font-display text-display-md text-wine-800 md:text-display-lg">
        {store.content.catalogTitle}
      </h1>
      <p className="mt-3 max-w-[68ch] text-body text-ink-700">{store.content.catalogCopy}</p>

      {/* Inline from md up, where six controls fit on two rows without cost. */}
      <div className="mt-8 hidden gap-3 rounded-none border border-brass-200 bg-ink-50 p-4 md:grid md:grid-cols-3 lg:grid-cols-[1.3fr_repeat(5,1fr)]">
        <FilterFields {...fieldProps} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-5">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-expanded={filtersOpen}
          aria-controls="shop-filters"
          className="inline-flex h-11 items-center gap-2 rounded-none border border-brass-600 px-4 text-body-sm font-semibold text-ink-800 transition-colors duration-150 hover:border-wine-600 hover:text-wine-600 md:hidden"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filter and sort
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center bg-wine-600 px-1 text-micro text-white">
              {activeCount}
            </span>
          )}
        </button>

        <p aria-live="polite" className="text-body-sm font-semibold text-ink-600">
          Showing {filteredProducts.length} piece{filteredProducts.length === 1 ? "" : "s"}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-body-sm font-semibold text-wine-600 underline underline-offset-4 hover:text-wine-700"
          >
            Clear filters
          </button>
        )}
      </div>

      <Sheet
        id="shop-filters"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="bottom"
        title="Filter and sort"
      >
        {/* sm:grid-cols-2 is load-bearing: the search field carries
            sm:col-span-2 for the desktop panel, and in a single-column grid
            that would conjure an implicit second column at 640-767px. */}
        <div className="grid content-start gap-4 overflow-y-auto p-5 sm:grid-cols-2">
          <FilterFields {...fieldProps} />
        </div>
        {/* The count is the whole point of filtering, so it stays pinned rather
            than sitting under a scroll the customer has to finish first. */}
        <div className="grid gap-3 border-t border-brass-200 p-5">
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="h-13 rounded-none bg-wine-600 px-6 text-body font-semibold text-white transition-colors duration-150 hover:bg-wine-700"
          >
            Show {filteredProducts.length} piece{filteredProducts.length === 1 ? "" : "s"}
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-body-sm font-semibold text-wine-600 underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>
      </Sheet>

      {/* The card titles are h3; without this the outline jumps h1 -> h3. */}
      <h2 className="sr-only">All pieces</h2>
      <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wished={store.wishlist.includes(product.id)}
            fmt={fmt}
            onWish={() => toggleWishlist(product.id)}
            onQuickAdd={() => {
              const variant = product.variants.find((v) => v.stock > 0);
              if (variant) addToCart(product, variant.id);
            }}
          />
        ))}
      </div>

      {!filteredProducts.length && (
        <p className="mt-10 text-body text-ink-600">
          Nothing matches those filters just now. Try widening the price or clearing a filter.
        </p>
      )}
    </div>
  );
}

export default function ShopView({ products }) {
  return (
    <StorefrontShell products={products}>
      <Catalogue />
    </StorefrontShell>
  );
}
