import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../api';
import { useCart } from '../cart';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Price, ProductRail, Stars } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { useAsync, useDocumentTitle } from '../hooks';
import { ErrorState, Loading } from './states';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { data: p, error, loading } = useAsync(() => api.product(slug), [slug]);
  const { add, busy, error: cartError, clearError } = useCart();
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [needSize, setNeedSize] = useState(false);
  useDocumentTitle(p?.name);

  useEffect(() => {
    if (!p) return;
    setColor(p.colors[0]?.name ?? '');
    setSize(p.sizes.length === 1 ? p.sizes[0] : '');
    setQty(1);
    setNeedSize(false);
    clearError();
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.id]);

  if (loading) return <Loading />;
  if (error || !p) return <ErrorState error={error} />;
  const hex = p.colors.find((c) => c.name === color)?.hex;

  const submit = async () => {
    if (!size) { setNeedSize(true); return; }
    await add({ productId: p.id, color, size, quantity: qty });
  };

  return (
    <div className="container pdp">
      <Breadcrumbs crumbs={p.breadcrumbs} current={p.name} />
      <div className="pdp__grid">
        <div className="pdp__gallery">
          <ProductImage imageKey={p.imageKey} color={hex} size="large" label={`${p.name} in ${color}`} />
          <div className="pdp__thumbs">
            {p.colors.map((c) => (
              <button key={c.name} className={c.name === color ? 'is-active' : ''} onClick={() => setColor(c.name)} aria-label={`View ${c.name}`}>
                <ProductImage imageKey={p.imageKey} color={c.hex} size="thumb" />
              </button>
            ))}
          </div>
        </div>
        <div className="pdp__info">
          <div className="pcard__brand">{p.brand}</div>
          <h1>{p.name}</h1>
          <div className="pdp__rating"><Stars rating={p.rating} count={p.reviewCount} /> <span className="muted small">SKU {p.sku}</span></div>
          <div className="pdp__price"><Price price={p.price} compareAtPrice={p.compareAtPrice} /></div>
          {p.doorbuster && <div className="badge badge--gold">Doorbuster deal</div>}

          <div className="opt">
            <div className="opt__label">Color: <strong>{color}</strong></div>
            <div className="swatches">
              {p.colors.map((c) => (
                <button key={c.name} className={`swatch swatch--lg${c.name === color ? ' is-active' : ''}`} style={{ background: c.hex }}
                  onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={c.name === color} title={c.name} />
              ))}
            </div>
          </div>
          <div className="opt">
            <div className="opt__label">Size: <strong>{size || '—'}</strong></div>
            <div className="facet__sizes">
              {p.sizes.map((s) => (
                <button key={s} className={`size-btn${s === size ? ' is-active' : ''}`} onClick={() => { setSize(s); setNeedSize(false); }}
                  aria-pressed={s === size}>{s}</button>
              ))}
            </div>
            {needSize && <div className="field-error">Please choose a size</div>}
          </div>
          <div className="pdp__buy">
            <div className="qty qty--lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(20, p.stock, q + 1))} aria-label="Increase">+</button>
            </div>
            <button className="btn btn--pink btn--block" disabled={!p.inStock || busy} onClick={submit}>
              {!p.inStock ? 'Sold out' : busy ? 'Adding…' : 'Add to bag'}
            </button>
          </div>
          {cartError && <div className="alert">{cartError}</div>}
          {p.inStock && p.stock < 10 && <p className="low-stock">Only {p.stock} left — selling fast!</p>}
          <ul className="perks">
            <li>Free U.S. shipping on orders over $50</li>
            <li>Ships from Las Vegas in 1–2 business days</li>
            <li>Easy 30-day returns</li>
          </ul>
          <details open className="pdp__details"><summary>Details</summary><p>{p.description}</p><p className="muted">Material: {p.material}</p></details>
        </div>
      </div>
      {p.related.length > 0 && <ProductRail title="You may also like" products={p.related} link={`/collections/${p.categorySlug}`} />}
    </div>
  );
}
