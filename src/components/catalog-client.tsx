"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { categoryLabels, equipmentCategories } from "@/lib/categories";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Equipment, EquipmentCategory, EquipmentStatus } from "@/lib/types";

type CategoryFilter = "all" | EquipmentCategory;
type StatusFilter = "all" | EquipmentStatus;

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Все модели" },
  ...equipmentCategories.map((value) => ({ value, label: categoryLabels[value] })),
];

export function CatalogClient({ products }: { products: Equipment[] }) {
  const powerLimit = Math.max(200, ...products.map((product) => Math.ceil((product.power || 0) / 5) * 5));
  const priceLimit = Math.max(4_000_000, ...products.map((product) => Math.ceil((product.price || 0) / 100_000) * 100_000));
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [maxPower, setMaxPower] = useState(powerLimit);
  const [maxPrice, setMaxPrice] = useState(priceLimit);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(",", ".");
    const list = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesStatus = status === "all" || product.status === status;
      const matchesPower = !product.power || product.power <= maxPower;
      const matchesPrice = !product.price || product.price <= maxPrice;
      const haystack = `${product.brand} ${product.name} ${product.bucket || ""} ${product.keywords.join(" ")}`.toLowerCase().replace(",", ".");
      return matchesCategory && matchesStatus && matchesPower && matchesPrice && (!normalized || haystack.includes(normalized));
    });
    return [...list].sort((a, b) => {
      if (sort === "price-asc") return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      if (sort === "power") return (b.power ?? 0) - (a.power ?? 0);
      return Number(b.featured) - Number(a.featured);
    });
  }, [category, maxPower, maxPrice, products, query, sort, status]);

  const reset = () => {
    setCategory("all");
    setStatus("all");
    setQuery("");
    setMaxPower(powerLimit);
    setMaxPrice(priceLimit);
    setSort("featured");
  };

  return (
    <div className="catalog-layout">
      <button className="filter-mobile-trigger" onClick={() => setFiltersOpen(true)}><SlidersHorizontal aria-hidden="true" />Фильтры</button>
      <aside className={`catalog-filters ${filtersOpen ? "open" : ""}`} aria-label="Фильтры каталога">
        <div className="filter-head">
          <div><span className="eyebrow">ПОДБОР</span><h2>Фильтры</h2></div>
          <button className="icon-button filter-close" onClick={() => setFiltersOpen(false)} aria-label="Закрыть фильтры"><X aria-hidden="true" /></button>
        </div>
        <fieldset>
          <legend>Тип техники</legend>
          {categories.map((item) => (
            <label key={item.value} className="radio-row">
              <input type="radio" name="category" checked={category === item.value} onChange={() => setCategory(item.value)} />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Доступность</legend>
          <label className="radio-row"><input type="radio" name="status" checked={status === "all"} onChange={() => setStatus("all")} /><span>Любая</span></label>
          <label className="radio-row"><input type="radio" name="status" checked={status === "in-stock"} onChange={() => setStatus("in-stock")} /><span>В наличии</span></label>
          <label className="radio-row"><input type="radio" name="status" checked={status === "on-order"} onChange={() => setStatus("on-order")} /><span>Под заказ</span></label>
        </fieldset>
        <label className="range-field">
          <span>Мощность до <strong>{maxPower} л.с.</strong></span>
          <input type="range" min="0" max={powerLimit} step="5" value={maxPower} onChange={(event) => setMaxPower(Number(event.target.value))} />
        </label>
        <label className="range-field">
          <span>Цена до <strong>{new Intl.NumberFormat("ru-RU").format(maxPrice)} сом</strong></span>
          <input type="range" min="0" max={priceLimit} step="100000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
        </label>
        <button className="filter-reset" onClick={reset}>Сбросить фильтры</button>
        <button className="button filter-apply" onClick={() => setFiltersOpen(false)}>Показать {filtered.length}</button>
      </aside>

      <section className="catalog-results" aria-live="polite">
        <div className="catalog-toolbar">
          <label className="catalog-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Поиск по каталогу</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, LG939 или 1,5 м³" />
          </label>
          <label className="catalog-sort">
            <span>Сортировка</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Сначала популярные</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="power">По мощности</option>
            </select>
          </label>
        </div>
        <div className="catalog-count"><strong>{filtered.length}</strong> моделей по выбранным условиям</div>
        {filtered.length ? (
          <div className="product-grid">
            {filtered.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}
          </div>
        ) : (
          <div className="catalog-empty">
            <span>0</span>
            <h2>Сейчас подходящих товаров нет</h2>
            <p>Попробуйте изменить запрос или зайдите через несколько дней. Каталог регулярно обновляется.</p>
            <button className="button" onClick={reset}>Сбросить фильтры</button>
          </div>
        )}
      </section>
    </div>
  );
}
