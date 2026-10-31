#!/usr/bin/env node
// Generates the Vegas Clubwear catalog (categories, smart collections, menu, products)
// deterministically and writes catalog.json into both commerce APIs.
//
//   node tools/catalog-generator/generate.mjs
//
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KINDS, SIZES, TREE, SMART, MENU, HOME } from './taxonomy.mjs';

const PRODUCTS_PER_LEAF = 75;
const MIN_PER_COLLECTION = 75;
const SEED = 20261028;

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const OUTPUTS = [
  join(root, 'example-commerce-api-java/src/main/resources/catalog/catalog.json'),
  join(root, 'example-commerce-api-next/data/catalog.json'),
];

// ---------- deterministic RNG ----------
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const chance = (p) => rand() < p;
const between = (lo, hi) => lo + rand() * (hi - lo);
const sample = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
};
const toPrice = (n) => Math.max(4.99, Math.floor(n) + pick([0.99, 0.99, 0.95, 0.49]));
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- vocab ----------
const COLORS = [
  ['Black', '#111111'], ['White', '#f5f5f5'], ['Red', '#c8102e'], ['Hot Pink', '#ff1f8f'], ['Blush', '#f4c2c2'],
  ['Nude', '#d8b59a'], ['Silver', '#c0c0c0'], ['Gold', '#d4af37'], ['Royal Blue', '#2251c9'], ['Emerald', '#0f7b52'],
  ['Purple', '#6a2c91'], ['Lavender', '#b49bdc'], ['Neon Green', '#39ff14'], ['Orange', '#ff7a1a'], ['Yellow', '#f7d531'],
  ['Wine', '#6d1a36'], ['Leopard', '#b5833f'], ['Teal', '#1a8c8c'], ['Baby Blue', '#9cc9f0'], ['Fuchsia', '#c71585'],
  ['Champagne', '#e9d7b8'], ['Brown', '#6b4226'], ['Olive', '#6b7a2b'], ['Holographic', '#b8c6ff'],
];
const COLOR_HEX = Object.fromEntries(COLORS);
const ADJECTIVES = [
  'Midnight', 'Neon', 'Velvet', 'Satin', 'Glam', 'Starlight', 'Vixen', 'Siren', 'Electric', 'Diamond', 'Crystal',
  'Lux', 'After Dark', 'Showgirl', 'Jackpot', 'High Roller', 'Sin City', 'Afterparty', 'Moonlit', 'Spotlight',
  'Bombshell', 'Wild Card', 'Rhinestone', 'Strip', 'Rooftop', 'VIP', 'Bottle Service', 'Lucky Seven', 'Dazzle',
  'Glitter', 'Mirage', 'Flamingo', 'Desert Rose', 'Cherry', 'Ruby', 'Onyx', 'Stardust', 'Fever', 'Daydream', 'Sunset',
];
const DETAILS = ['Cutout', 'Lace-Up', 'Ruched', 'Mesh', 'Off-Shoulder', 'Halter', 'Strappy', 'Backless', 'Corset', 'Ruffle', 'Plunge', 'Wrap', 'Chain', 'Sheer', 'Asymmetric', 'Bodycon', 'Faux Leather', 'Vinyl', 'Metallic', 'Ribbed'];
const MATERIALS = {
  default: ['95% Polyester, 5% Spandex', '92% Nylon, 8% Spandex', '100% Polyester', '90% Polyester, 10% Elastane', 'Stretch knit'],
  shoes: ['Faux leather upper, rubber sole', 'Patent PU upper, TPR sole', 'Clear PVC upper, synthetic sole', 'Faux suede upper, rubber sole'],
  jewelry: ['Zinc alloy with rhinestones', 'Gold-tone stainless steel', 'Silver-tone brass', 'Acrylic and glass crystals'],
  bag: ['PU leather', 'Satin with rhinestone trim', 'Vinyl', 'Faux croc PU'],
};
const BRANDS_APPAREL = ['Vegas Clubwear', 'VC Studio', 'Neon Nights', 'After Hours', 'Strip Collective'];
const BRANDS_SHOES = [['Stiletto Society', 0.35], ['Cape Royale', 0.25], ['Gothika', 0.15], ['VC Studio', 0.25]];
const BRANDS_COSTUME = ['Vegas Clubwear', 'Masquerade Lane', 'Showgirl Costume Co.'];
const SHOE_KINDS = new Set(['boot', 'bootie', 'heel', 'wedge', 'flat', 'sneaker']);

// ---------- categories ----------
const categories = [];
const leaves = [];
let sort = 0;
function walk(node, parent, depth, ancestors) {
  const path = [...ancestors, node.slug];
  const cat = {
    slug: node.slug,
    name: node.name,
    parentSlug: parent?.slug ?? null,
    type: 'category',
    depth,
    sortOrder: sort++,
    description: node.description ?? `Shop ${node.name.toLowerCase()} at Vegas Clubwear — styles built for the Strip.`,
    path,
    rule: null,
  };
  categories.push(cat);
  if (node.children?.length) node.children.forEach((ch) => walk(ch, node, depth + 1, path));
  else leaves.push({ ...node, path });
}
TREE.forEach((n) => walk(n, null, 0, []));
for (const s of SMART) {
  categories.push({
    slug: s.slug, name: s.name, parentSlug: null, type: 'smart', depth: 0, sortOrder: sort++,
    description: s.description ?? `Shop ${s.name} at Vegas Clubwear.`, path: [s.slug], rule: s.rule,
  });
}
const slugs = new Set();
for (const cat of categories) {
  if (slugs.has(cat.slug)) throw new Error(`Duplicate category slug ${cat.slug}`);
  slugs.add(cat.slug);
}

// ---------- products ----------
const products = [];
const usedSlugs = new Set();
const today = new Date('2026-10-28T12:00:00Z');
let nextId = 1;

function brandFor(kindKey, leaf) {
  if (SHOE_KINDS.has(kindKey)) {
    let r = rand();
    for (const [b, w] of BRANDS_SHOES) { if ((r -= w) < 0) return b; }
    return 'VC Studio';
  }
  if (leaf.path[0] === 'costumes' || kindKey === 'costume') return pick(BRANDS_COSTUME);
  return pick(BRANDS_APPAREL);
}

function materialFor(kindKey, image) {
  if (SHOE_KINDS.has(kindKey)) return pick(MATERIALS.shoes);
  if (image === 'jewelry') return pick(MATERIALS.jewelry);
  if (image === 'bag') return pick(MATERIALS.bag);
  return pick(MATERIALS.default);
}

function makeName(leaf, kind) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const parts = [pick(ADJECTIVES)];
    if (attempt > 6 || chance(0.45)) parts.push(pick(DETAILS));
    if (leaf.theme) parts.push(leaf.theme);
    let noun = pick(kind.nouns);
    if (leaf.kind === 'costume' && leaf.theme) noun = noun; // "Midnight Nurse Deluxe Costume"
    parts.push(noun);
    // drop duplicated words (e.g., "Rhinestone Rhinestone Clutch")
    const words = [];
    for (const w of parts.join(' ').split(' ')) if (words[words.length - 1] !== w) words.push(w);
    const name = words.join(' ');
    const slug = slugify(name);
    if (!usedSlugs.has(slug)) { usedSlugs.add(slug); return { name, slug }; }
  }
  const name = `${pick(ADJECTIVES)} ${leaf.theme ?? ''} ${pick(kind.nouns)} No. ${nextId}`.replace(/\s+/g, ' ');
  const slug = slugify(name);
  usedSlugs.add(slug);
  return { name, slug };
}

function describe(name, leaf, kind, material, colors) {
  const opener = pick([
    `Own the night in the ${name}.`,
    `The ${name} was made for bottle service and late-night photo ops.`,
    `Turn every head on the Strip with the ${name}.`,
    `From the pool party to the afterparty, the ${name} goes all night.`,
    `Hit the jackpot with the ${name}.`,
  ]);
  const mid = pick([
    'Designed with a flattering fit and plenty of stretch for dancing until sunrise.',
    'Finished with eye-catching details that shine under club lights.',
    'A Vegas Clubwear best seller, restocked for the season.',
    'Pairs perfectly with statement heels and minimal jewelry.',
    'Lightweight, comfortable and made to move.',
  ]);
  return `${opener} ${mid} Available in ${colors.map((c) => c.name).join(', ')}. ${material}.`;
}

function makeProduct(leaf, index) {
  const kindKey = leaf.kind;
  const kind = KINDS[kindKey];
  if (!kind) throw new Error(`Unknown kind ${kindKey} on ${leaf.slug}`);
  const { name, slug } = makeName(leaf, kind);
  const sizeKey = leaf.plus ? (kind.sizes === 'one' ? 'one' : 'plus') : kind.sizes;
  let sizes = SIZES[sizeKey];
  if (sizes.length > 4 && chance(0.25)) sizes = sizes.slice(0, sizes.length - 1); // some sold-out tails
  const colorNames = leaf.forceColor
    ? [leaf.forceColor, ...(chance(0.3) ? [pick(['Red', 'Wine', 'Silver'])] : [])]
    : sample(COLORS.map((c) => c[0]), 1 + Math.floor(rand() * 4));
  const colors = colorNames.map((n) => ({ name: n, hex: COLOR_HEX[n] }));
  const material = materialFor(kindKey, kind.image);

  let base = between(kind.price[0], kind.price[1]);
  if (leaf.plus) base *= 1.08;
  const valuePriced = chance(0.07); // value-tier pricing for "Under $20"
  if (valuePriced) base = between(8, 19);
  let price = toPrice(base);
  let compareAtPrice = null;
  const onSale = chance(0.2);
  if (onSale) {
    compareAtPrice = price;
    price = toPrice(price * between(0.45, 0.8));
    if (price >= compareAtPrice) price = toPrice(compareAtPrice - 3);
  }
  const daysOld = Math.floor(between(0, 420));
  const createdAt = new Date(today.getTime() - daysOld * 86400000).toISOString();
  const id = nextId++;
  return {
    id,
    sku: `VC-${String(id).padStart(6, '0')}`,
    slug,
    name,
    brand: brandFor(kindKey, leaf),
    categorySlug: leaf.slug,
    categoryPath: leaf.path,
    kind: kindKey,
    imageKey: kind.image,
    description: describe(name, leaf, kind, material, colors),
    material,
    price,
    compareAtPrice,
    onSale,
    isNew: daysOld <= 30 || chance(0.03),
    doorbuster: chance(0.04),
    colors,
    sizes: [...sizes],
    stock: chance(0.03) ? 0 : Math.floor(between(3, 250)),
    rating: Math.round(between(3.4, 5.0) * 10) / 10,
    reviewCount: Math.floor(between(0, 640)),
    createdAt,
  };
}

for (const leaf of leaves) {
  for (let i = 0; i < PRODUCTS_PER_LEAF; i++) products.push(makeProduct(leaf, i));
}

// ---------- membership + minimum-size enforcement ----------
const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
function matches(p, rule) {
  if (rule.scope && !p.categoryPath.includes(rule.scope)) return false;
  if (rule.isNew && !p.isNew) return false;
  if (rule.onSale && !p.onSale) return false;
  if (rule.doorbuster && !p.doorbuster) return false;
  if (rule.maxPrice != null && !(p.price < rule.maxPrice)) return false;
  if (rule.brand && p.brand !== rule.brand) return false;
  return true;
}
function inCollection(p, cat) {
  return cat.type === 'smart' ? matches(p, cat.rule) : p.categoryPath.includes(cat.slug);
}
// Nudge products into smart collections that fall short, without breaking their own category membership.
for (const cat of categories.filter((c) => c.type === 'smart')) {
  let members = products.filter((p) => inCollection(p, cat));
  const candidates = products.filter((p) => !inCollection(p, cat) && (!cat.rule.scope || p.categoryPath.includes(cat.rule.scope)));
  while (members.length < MIN_PER_COLLECTION && candidates.length) {
    const p = candidates.splice(Math.floor(rand() * candidates.length), 1)[0];
    const r = cat.rule;
    if (r.brand && !SHOE_KINDS.has(p.kind)) continue;
    if (r.isNew) { p.isNew = true; p.createdAt = new Date(today.getTime() - Math.floor(between(0, 30)) * 86400000).toISOString(); }
    if (r.doorbuster) p.doorbuster = true;
    if (r.brand) p.brand = r.brand;
    if (r.maxPrice != null && p.price >= r.maxPrice) {
      if (!p.onSale) { p.compareAtPrice = p.price; p.onSale = true; }
      p.price = toPrice(between(r.maxPrice * 0.45, r.maxPrice - 1));
    }
    if (r.onSale && !p.onSale) { p.compareAtPrice = p.price; p.onSale = true; p.price = toPrice(p.price * 0.7); }
    members = products.filter((x) => inCollection(x, cat));
  }
}

const counts = {};
let failures = 0;
for (const cat of categories) {
  counts[cat.slug] = products.filter((p) => inCollection(p, cat)).length;
  if (counts[cat.slug] < MIN_PER_COLLECTION) { failures++; console.error(`!! ${cat.slug} has only ${counts[cat.slug]}`); }
}
for (const cat of categories) cat.productCount = counts[cat.slug];
// menu references must exist
const walkMenu = (items) => items.forEach((m) => { if (!bySlug[m.slug]) throw new Error(`Menu slug missing: ${m.slug}`); walkMenu(m.items ?? []); });
walkMenu(MENU);

const catalog = {
  store: { name: 'Vegas Clubwear', currency: 'USD', freeShippingThreshold: 50, flatShipping: 7.95, taxRate: 0.08375 },
  generatedWith: { seed: SEED, productsPerLeaf: PRODUCTS_PER_LEAF },
  home: HOME,
  menu: MENU,
  categories,
  products,
};

const json = JSON.stringify(catalog);
for (const out of OUTPUTS) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, json);
}
console.log(`categories: ${categories.length} (${leaves.length} leaf, ${SMART.length} smart)`);
console.log(`products:   ${products.length}`);
console.log(`smallest collections:`, Object.entries(counts).sort((a, b) => a[1] - b[1]).slice(0, 6));
console.log(`size:       ${(json.length / 1024 / 1024).toFixed(1)} MB -> ${OUTPUTS.length} files`);
if (failures) process.exit(1);
