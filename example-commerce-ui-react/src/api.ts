import type {
  ApiErrorBody, Address, Cart, CategoryView, HomeContent, MenuItem, Order, ProductDetail, ProductPage, StoreSettings,
} from './types';

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
  });
  if (!res.ok) {
    let body: Partial<ApiErrorBody> = {};
    try { body = await res.json(); } catch { /* non-JSON error */ }
    throw new ApiError(res.status, body.code ?? 'http_error', body.message ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

const json = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });

export interface ListParams {
  collection?: string; q?: string; color?: string[]; size?: string[]; brand?: string[];
  minPrice?: string; maxPrice?: string; sort?: string; page?: number; pageSize?: number; facets?: boolean;
}

function qs(params: ListParams): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const api = {
  health: () => request<{ status: string; service: string }>('/health'),
  store: () => request<StoreSettings>('/store'),
  menu: () => request<MenuItem[]>('/menu'),
  home: () => request<HomeContent>('/home'),
  category: (slug: string) => request<CategoryView>(`/categories/${encodeURIComponent(slug)}`),
  products: (params: ListParams, signal?: AbortSignal) => request<ProductPage>(`/products${qs(params)}`, { signal }),
  product: (slug: string) => request<ProductDetail>(`/products/${encodeURIComponent(slug)}`),

  createCart: () => request<Cart>('/carts', json('POST')),
  cart: (id: string) => request<Cart>(`/carts/${id}`),
  addItem: (id: string, item: { productId: number; color: string; size: string; quantity: number }) =>
    request<Cart>(`/carts/${id}/items`, json('POST', item)),
  updateItem: (id: string, itemId: number, quantity: number) =>
    request<Cart>(`/carts/${id}/items/${itemId}`, json('PATCH', { quantity })),
  removeItem: (id: string, itemId: number) => request<Cart>(`/carts/${id}/items/${itemId}`, json('DELETE')),
  applyPromo: (id: string, code: string) => request<Cart>(`/carts/${id}/promo`, json('POST', { code })),
  removePromo: (id: string) => request<Cart>(`/carts/${id}/promo`, json('DELETE')),

  placeOrder: (body: {
    cartId: string; email: string; shippingAddress: Address; shippingMethod: 'standard' | 'express';
    payment: { cardNumber: string; expMonth: number; expYear: number; cvc: string; nameOnCard: string };
  }) => request<Order>('/orders', json('POST', body)),
  order: (orderNumber: string, email?: string) =>
    request<Order>(`/orders/${encodeURIComponent(orderNumber)}${email ? `?email=${encodeURIComponent(email)}` : ''}`),
};
