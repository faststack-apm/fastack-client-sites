import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { api } from '../api';
import { ProductRail } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { useAsync, useDocumentTitle } from '../hooks';
import { Loading, ErrorState } from './states';

const TILE_COLORS = ['#ff2d87', '#111111', '#d4af37', '#c8102e', '#6a2c91', '#1a8c8c'];

export function HomePage() {
  useDocumentTitle(undefined);
  const { data, error, loading } = useAsync(() => api.home(), []);
  const [slide, setSlide] = useState(0);
  const heroes = data?.heroes ?? [];
  useEffect(() => {
    if (heroes.length < 2) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % heroes.length), 6000);
    return () => clearInterval(t);
  }, [heroes.length]);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorState error={error} />;

  return (
    <div className="home">
      <section className="hero">
        {heroes.map((h, i) => (
          <div key={h.title} className={`hero__slide hero__slide--${h.theme}${i === slide ? ' is-active' : ''}`} aria-hidden={i !== slide}>
            <div className="container hero__inner">
              <p className="hero__kicker">Vegas Clubwear</p>
              <h1>{h.title}</h1>
              <p className="hero__sub">{h.subtitle}</p>
              <Link to={`/collections/${h.collection}`} className="btn btn--light" tabIndex={i === slide ? 0 : -1}>{h.cta}</Link>
            </div>
          </div>
        ))}
        <div className="hero__dots">
          {heroes.map((h, i) => (
            <button key={h.title} className={i === slide ? 'is-active' : ''} onClick={() => setSlide(i)} aria-label={`Show ${h.title}`} />
          ))}
        </div>
      </section>

      <section className="container tiles">
        {data.tiles.map((t, i) => (
          <Link key={t.slug} to={`/collections/${t.slug}`} className="tile">
            <ProductImage imageKey={t.imageKey} color={TILE_COLORS[i % TILE_COLORS.length]} label={t.name} />
            <span className="tile__label">{t.name}</span>
          </Link>
        ))}
      </section>

      <div className="container">
        {data.sections.map((s) => (
          <ProductRail key={s.collection} title={s.title} products={s.products} link={`/collections/${s.collection}`} />
        ))}
      </div>

      <section className="promo-band">
        <div className="container promo-band__inner">
          <div><strong>Take 10% off</strong> your first order with code <code>VEGAS10</code></div>
          <div><strong>Spend $100+</strong> and save 20% with <code>JACKPOT20</code></div>
        </div>
      </section>
    </div>
  );
}
