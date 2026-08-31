"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gauge, PackageOpen, ShieldCheck } from "lucide-react";
import { categoryLabels, formatPrice } from "@/lib/content";
import type { Equipment } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

export function ProductCard({ product, priority = false }: { product: Equipment; priority?: boolean }) {
  const { t } = useLanguage();
  const saving = product.price && product.oldPrice ? product.oldPrice - product.price : null;

  return (
    <article className="product-card">
      <Link href={`/catalog/${product.slug}`} className="product-image" aria-label={`${t("details")}: ${product.brand} ${product.name}`}>
        <Image
          src={product.images[0]}
          alt={`${product.brand} ${product.name}`}
          fill
          priority={priority}
          sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        {product.images[1] && (
          <Image
            className="product-image-secondary"
            src={product.images[1]}
            alt=""
            fill
            sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        )}
        <span className={`stock-badge ${product.status === "in-stock" ? "available" : "order"}`}>
          {product.status === "in-stock" ? t("inStock") : t("onOrder")}
        </span>
        {product.promo && <span className="promo-badge">{product.promo}</span>}
      </Link>
      <div className="product-card-body">
        <div className="product-meta">
          <span>{categoryLabels[product.category]}</span>
          <span>{product.brand}</span>
        </div>
        <h3>
          <Link href={`/catalog/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.shortDescription}</p>
        <div className="product-specs-mini">
          <span><PackageOpen aria-hidden="true" />{product.bucket ?? product.loadCapacity ?? "Под задачу"}</span>
          <span><Gauge aria-hidden="true" />{product.power ? `${product.power} л.с.` : "Уточнить"}</span>
          <span><ShieldCheck aria-hidden="true" />{product.warrantyHours} м/ч</span>
        </div>
        <div className="product-price-row">
          <div>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
            <strong>{formatPrice(product.price)}</strong>
            {saving && <small>Выгода {formatPrice(saving)}</small>}
          </div>
          {product.monthlyPayment && (
            <div className="monthly-price">
              <span>от</span>
              <strong>{formatPrice(product.monthlyPayment)}</strong>
              <small>в месяц</small>
            </div>
          )}
        </div>
        <Link href={`/catalog/${product.slug}`} className="product-link">
          {t("details")} <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
