import { Link } from 'react-router';
import { ApiError } from '../api';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="state"><div className="spinner" aria-hidden />{label}</div>;
}

export function ErrorState({ error }: { error: Error | null }) {
  if (error instanceof ApiError && error.status === 404) return <NotFound />;
  return (
    <div className="state">
      <h2>Something went wrong</h2>
      <p className="muted">{error?.message ?? 'Please try again.'}</p>
      <button className="btn btn--pink" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="state">
      <h2>What happens in Vegas…</h2>
      <p className="muted">…apparently includes this page disappearing.</p>
      <Link to="/" className="btn btn--pink">Back to the shop</Link>
    </div>
  );
}
