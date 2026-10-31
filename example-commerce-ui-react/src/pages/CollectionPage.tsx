import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { api, type ListParams } from '../api';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { useAsync, useDocumentTitle } from '../hooks';
import type { Facets } from '../types';
import { ErrorState, Loading } from './states';

const SORTS: [string, string][] = [
  ['featured', 'Featured'], ['best_selling', 'Best selling'], ['newest', 'Newest'], ['price_asc', 'Price: low to high'],
  ['price_desc', 'Price: high to low'], ['rating', 'Top rated'], ['name', 'Name A–Z'],
];
const PAGE_SIZE = 24;

/** Used for both /collections/:slug and /search?q= */
export function CollectionPage({ mode }: { mode: 'collection' | 'search' }) {
  const { slug } = useParams();
  const [sp, setSp] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const q = sp.get('q') ?? '';

  const params: ListParams = useMemo(() => ({
    collection: mode === 'collection' ? slug : undefined,
    q: mode === 'search' ? q : undefined,
    color: sp.getAll('color'), size: sp.getAll('size'), brand: sp.getAll('brand'),
    minPrice: sp.get('minPrice') ?? undefined, maxPrice: sp.get('maxPrice') ?? undefined,
    sort: sp.get('sort') ?? 'featured', page: Number(sp.get('page') ?? 1), pageSize: PAGE_SIZE,
  }), [mode, slug, q, sp]);

  const category = useAsync(() => (mode === 'collection' && slug ? api.category(slug) : Promise.resolve(null)), [mode, slug]);
  const list = useAsync((signal) => api.products(params, signal), [JSON.stringify(params)]);
  const title = mode === 'search' ? `Search: “${q}”` : category.data?.name;
  useDocumentTitle(title);

  const update = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(sp);
    mutate(next);
    next.delete('page');
    setSp(next);
  };
  const toggle = (key: string, value: string) => update((next) => {
    const values = next.getAll(key);
    next.delete(key);
    (values.includes(value) ? values.filter((v) => v !== value) : [...values, value]).forEach((v) => next.append(key, v));
  });
  const goPage = (page: number) => {
    const next = new URLSearchParams(sp);
    next.set('page', String(page));
    setSp(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const activeFilters = ['color', 'size', 'brand'].flatMap((k) => sp.getAll(k).map((v) => [k, v] as const));
  const hasPrice = sp.get('minPrice') || sp.get('maxPrice');

  if (category.error) return <ErrorState error={category.error} />;
  if (mode === 'search' && !q) return <div className="container state"><h2>Search the store</h2><p className="muted">Try “sequin”, “platform boots” or “nurse”.</p></div>;

  return (
    <div className="container collection">
      {category.data && <Breadcrumbs crumbs={category.data.breadcrumbs} />}
      <header className="collection__head">
        <h1>{title ?? ' '}</h1>
        {category.data && <p className="muted">{category.data.description}</p>}
        {category.data && category.data.children.length > 0 && (
          <div className="chips">
            {category.data.children.map((c) => <Link key={c.slug} className="chip" to={`/collections/${c.slug}`}>{c.name}</Link>)}
          </div>
        )}
      </header>

      <div className="toolbar">
        <button className="btn btn--ghost btn--sm toolbar__filters" onClick={() => setFiltersOpen((v) => !v)}>
          {filtersOpen ? 'Hide filters' : 'Filters'}{activeFilters.length ? ` (${activeFilters.length})` : ''}
        </button>
        <span className="muted">{list.data ? `${list.data.totalItems.toLocaleString()} styles` : ' '}</span>
        <label className="sort">
          <span>Sort</span>
          <select value={sp.get('sort') ?? 'featured'} onChange={(e) => update((n) => n.set('sort', e.target.value))}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>

      {(activeFilters.length > 0 || hasPrice) && (
        <div className="chips chips--active">
          {activeFilters.map(([k, v]) => <button key={k + v} className="chip chip--on" onClick={() => toggle(k, v)}>{v} ✕</button>)}
          {hasPrice && <button className="chip chip--on" onClick={() => update((n) => { n.delete('minPrice'); n.delete('maxPrice'); })}>
            {sp.get('minPrice') ? `$${sp.get('minPrice')}` : '$0'}–{sp.get('maxPrice') ? `$${sp.get('maxPrice')}` : 'any'} ✕</button>}
          <button className="link-btn" onClick={() => setSp(new URLSearchParams(q ? { q } : {}))}>Clear all</button>
        </div>
      )}

      <div className="collection__body">
        <aside className={`filters${filtersOpen ? ' is-open' : ''}`}>
          {list.data?.facets && <FilterPanel facets={list.data.facets} sp={sp} toggle={toggle} update={update} />}
        </aside>
        <div className="collection__results">
          {list.loading && !list.data ? <Loading /> : list.error ? <ErrorState error={list.error} /> : list.data && (
            <>
              {list.data.items.length === 0 ? <div className="state"><p>No styles match those filters.</p></div> : (
                <div className={list.loading ? 'is-dim' : ''}><ProductGrid products={list.data.items} preferColors={sp.getAll('color')} /></div>
              )}
              {list.data.totalPages > 1 && <Pagination page={list.data.page} totalPages={list.data.totalPages} go={goPage} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ facets, sp, toggle, update }: {
  facets: Facets; sp: URLSearchParams; toggle: (k: string, v: string) => void;
  update: (m: (n: URLSearchParams) => void) => void;
}) {
  const [min, setMin] = useState(sp.get('minPrice') ?? '');
  const [max, setMax] = useState(sp.get('maxPrice') ?? '');
  const colors = sp.getAll('color'); const sizes = sp.getAll('size'); const brands = sp.getAll('brand');
  return (
    <>
      <details open className="facet">
        <summary>Color</summary>
        <div className="facet__swatches">
          {facets.colors.map((c) => (
            <button key={c.name} className={`swatch${colors.includes(c.name) ? ' is-active' : ''}`} style={{ background: c.hex }}
              title={`${c.name} (${c.count})`} aria-label={c.name} aria-pressed={colors.includes(c.name)} onClick={() => toggle('color', c.name)} />
          ))}
        </div>
      </details>
      <details open className="facet">
        <summary>Size</summary>
        <div className="facet__sizes">
          {facets.sizes.map((s) => (
            <button key={s.value} className={`size-btn${sizes.includes(s.value) ? ' is-active' : ''}`} aria-pressed={sizes.includes(s.value)}
              onClick={() => toggle('size', s.value)}>{s.value}</button>
          ))}
        </div>
      </details>
      <details open className="facet">
        <summary>Price</summary>
        <form className="facet__price" onSubmit={(e) => { e.preventDefault(); update((n) => {
          if (min) n.set('minPrice', min); else n.delete('minPrice');
          if (max) n.set('maxPrice', max); else n.delete('maxPrice');
        }); }}>
          <input inputMode="decimal" placeholder={`$${Math.floor(facets.price.min ?? 0)}`} value={min} onChange={(e) => setMin(e.target.value)} aria-label="Min price" />
          <span>–</span>
          <input inputMode="decimal" placeholder={`$${Math.ceil(facets.price.max ?? 0)}`} value={max} onChange={(e) => setMax(e.target.value)} aria-label="Max price" />
          <button className="btn btn--ghost btn--sm">Go</button>
        </form>
      </details>
      <details open className="facet">
        <summary>Brand</summary>
        {facets.brands.map((b) => (
          <label key={b.value} className="check">
            <input type="checkbox" checked={brands.includes(b.value)} onChange={() => toggle('brand', b.value)} />
            <span>{b.value}</span><span className="muted small">{b.count}</span>
          </label>
        ))}
      </details>
    </>
  );
}

function Pagination({ page, totalPages, go }: { page: number; totalPages: number; go: (p: number) => void }) {
  const pages = new Set([1, page - 1, page, page + 1, totalPages].filter((p) => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  return (
    <nav className="pager" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => go(page - 1)}>‹ Prev</button>
      {sorted.map((p, i) => (
        <span key={p}>
          {i > 0 && p - sorted[i - 1] > 1 && <span className="pager__gap">…</span>}
          <button className={p === page ? 'is-active' : ''} aria-current={p === page ? 'page' : undefined} onClick={() => go(p)}>{p}</button>
        </span>
      ))}
      <button disabled={page >= totalPages} onClick={() => go(page + 1)}>Next ›</button>
    </nav>
  );
}
