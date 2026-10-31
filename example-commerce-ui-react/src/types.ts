// Response shapes shared by the Java and Next.js commerce APIs.
export interface Color { name: string; hex: string }
export interface Crumb { slug: string; name: string }

export interface ProductSummary {
  id: number; slug: string; name: string; brand: string; categorySlug: string; imageKey: string;
  price: number; compareAtPrice: number | null; onSale: boolean; isNew: boolean; doorbuster: boolean;
  colors: Color[]; rating: number; reviewCount: number; inStock: boolean;
}

export interface ProductDetail extends ProductSummary {
  sku: string; kind: string; description: string; material: string; sizes: string[]; stock: number;
  createdAt: string; breadcrumbs: Crumb[]; related: ProductSummary[];
}

export interface Facets {
  colors: { name: string; hex: string; count: number }[];
  sizes: { value: string; count: number }[];
  brands: { value: string; count: number }[];
  price: { min: number | null; max: number | null };
}

export interface ProductPage {
  items: ProductSummary[]; page: number; pageSize: number; totalItems: number; totalPages: number;
  facets: Facets | null;
}

export interface CategoryView {
  slug: string; name: string; description: string; type: 'category' | 'smart'; parentSlug: string | null;
  productCount: number; breadcrumbs: Crumb[]; children: { slug: string; name: string; productCount: number }[];
}

export interface MenuItem { slug: string; label: string; items?: MenuItem[] }

export interface HomeContent {
  announcement: string;
  heroes: { title: string; subtitle: string; cta: string; collection: string; theme: string }[];
  tiles: { slug: string; name: string; imageKey: string }[];
  sections: { title: string; collection: string; products: ProductSummary[] }[];
}

export interface StoreSettings {
  name: string; currency: string; freeShippingThreshold: number; flatShipping: number; taxRate: number;
}

export interface CartLine {
  id: number; productId: number; slug: string; name: string; brand: string; imageKey: string; color: string;
  colorHex: string; size: string; unitPrice: number; compareAtPrice: number | null; quantity: number;
  lineTotal: number; available: number;
}

export interface Cart {
  id: string; status: 'open' | 'converted'; items: CartLine[]; itemCount: number; promoCode: string | null;
  promoDescription: string | null; subtotal: number; discount: number; shipping: number; tax: number; total: number;
  freeShippingRemaining: number; updatedAt: string;
}

export interface Address {
  firstName: string; lastName: string; address1: string; address2?: string | null; city: string; state: string;
  postalCode: string; country: string; phone?: string | null;
}

export interface Order {
  orderNumber: string; status: string; email: string; createdAt: string;
  items: { productId: number; sku: string; slug: string; name: string; imageKey: string; color: string; size: string;
    unitPrice: number; quantity: number; lineTotal: number }[];
  itemCount: number; shippingAddress: Address; shippingMethod: string; promoCode: string | null;
  subtotal: number; discount: number; shipping: number; tax: number; total: number; cardBrand: string; cardLast4: string;
}

export interface ApiErrorBody { status: number; code: string; message: string }
