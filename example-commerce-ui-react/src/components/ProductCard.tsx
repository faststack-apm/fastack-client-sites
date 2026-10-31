import { useState } from 'react';
import { Link } from 'react-router';
import { money, pct } from '../format';
import type { ProductSummary } from '../types';
import { ProductImage } from './ProductImage';

export function Price({ price, compareAtPrice }: { price: number; compareAtPrice: number | null }) {
  const off = pct(price, compareAtPrice);
  return (
    <span className="price">
      <span className={off ? 'price__now price__now--sale' : 'price__now'}>{money(price)}</span>
      {off > 0 && <s className="price__was">{money(compareAtPrice)}</s>}
      {off > 0 && <span className="price__off">-{off}%</span>}
    </span>
  );
}

export function Stars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating);
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
      {count !== undefined && <span className="stars__count">({count})</span>}
    </span>
  );
}

export function ProductCard({ product, preferColors = [] }: { product: ProductSummary; preferColors?: string[] }) {
  // Show the filtered color first when a color filter is active.
  const [color, setColor] = useState(product.colors.find((c) => preferColors.includes(c.name)) ?? product.colors[0]);
  return (
    <article className="pcard">
      <Link to={`/products/${product.slug}`} className="pcard__media">
        <ProductImage imageKey={product.imageKey} color={color?.hex} label={product.name} />
        <span className="pcard__badges">
          {product.doorbuster && <span className="badge badge--gold">Doorbuster</span>}
          {product.isNew && <span className="badge badge--pink">New</span>}
          {product.onSale && <span className="badge badge--red">Sale</span>}
          {!product.inStock && <span className="badge badge--dark">Sold out</span>}
        </span>
      </Link>
      <div className="pcard__body">
        <div className="pcard__brand">{product.brand}</div>
        <Link to={`/products/${product.slug}`} className="pcard__name">{product.name}</Link>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} />
        <div className="pcard__meta">
          <span className="swatches">
            {product.colors.map((c) => (
              <button key={c.name} type="button" className={`swatch swatch--sm${c.name === color?.name ? ' is-active' : ''}`}
                style={{ background: c.hex }} title={c.name} aria-label={c.name} onMouseEnter={() => setColor(c)}
                onFocus={() => setColor(c)} />
            ))}
          </span>
          <Stars rating={product.rating} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, preferColors }: { products: ProductSummary[]; preferColors?: string[] }) {
  return <div className="pgrid">{products.map((p) => <ProductCard key={`${p.id}-${preferColors?.join()}`} product={p} preferColors={preferColors} />)}</div>;
}

export function ProductRail({ title, products, link }: { title: string; products: ProductSummary[]; link?: string }) {
  return (
    <section className="rail">
      <div className="rail__head">
        <h2>{title}</h2>
        {link && <Link to={link} className="btn btn--ghost btn--sm">View all</Link>}
      </div>
      <div className="rail__track">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  );
}
