import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, ApiError } from './api';
import type { Cart } from './types';

const STORAGE_KEY = 'vc.cartId';

interface CartState {
  cart: Cart | null;
  /** True while a saved cart is being restored on page load. */
  restoring: boolean;
  busy: boolean;
  error: string | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (item: { productId: number; color: string; size: string; quantity: number }) => Promise<boolean>;
  update: (itemId: number, quantity: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
  applyPromo: (code: string) => Promise<boolean>;
  removePromo: () => Promise<void>;
  /** Forget the current cart (after checkout). */
  reset: () => void;
  clearError: () => void;
}

const CartContext = createContext<CartState | null>(null);

function readId(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}
function writeId(id: string | null) {
  try { if (id) localStorage.setItem(STORAGE_KEY, id); else localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [restoring, setRestoring] = useState(() => readId() !== null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Restore an existing cart on load; drop it if it's gone or already checked out.
  useEffect(() => {
    const id = readId();
    if (!id) return;
    api.cart(id)
      .then((c) => { if (c.status === 'open') setCart(c); else writeId(null); })
      .catch(() => writeId(null))
      .finally(() => setRestoring(false));
  }, []);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cart?.status === 'open') return cart.id;
    const created = await api.createCart();
    writeId(created.id);
    setCart(created);
    return created.id;
  }, [cart]);

  const run = useCallback(async (fn: () => Promise<Cart>): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      setCart(await fn());
      return true;
    } catch (e) {
      if (e instanceof ApiError && (e.code === 'cart_closed' || (e.status === 404 && e.message.startsWith('Cart')))) {
        writeId(null);
        setCart(null);
      }
      setError(e instanceof Error ? e.message : 'Something went wrong');
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const value = useMemo<CartState>(() => ({
    cart, restoring, busy, error, drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    add: async (item) => {
      const ok = await run(async () => api.addItem(await ensureCart(), item));
      if (ok) setDrawerOpen(true);
      return ok;
    },
    update: async (itemId, quantity) => { if (cart) await run(() => api.updateItem(cart.id, itemId, quantity)); },
    remove: async (itemId) => { if (cart) await run(() => api.removeItem(cart.id, itemId)); },
    applyPromo: async (code) => (cart ? run(() => api.applyPromo(cart.id, code)) : false),
    removePromo: async () => { if (cart) await run(() => api.removePromo(cart.id)); },
    reset: () => { writeId(null); setCart(null); },
    clearError: () => setError(null),
  }), [cart, restoring, busy, error, drawerOpen, run, ensureCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
