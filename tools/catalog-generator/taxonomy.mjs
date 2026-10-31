// Category tree, product "kinds", and the storefront menu for Vegas Clubwear.
// Leaf categories (no children) each get PRODUCTS_PER_LEAF generated products.
// Smart collections are rule-based filters over the catalog.

export const SIZES = {
  apparel: ['XS', 'S', 'M', 'L', 'XL'],
  plus: ['1X', '2X', '3X', '4X'],
  denim: ['1', '3', '5', '7', '9', '11', '13'],
  shoes: ['5', '6', '7', '8', '9', '10', '11'],
  lingerie: ['S', 'M', 'L', 'XL'],
  hosiery: ['One Size', 'Queen'],
  one: ['One Size'],
  ring: ['5', '6', '7', '8', '9'],
};

// kind -> nouns, size set, price range, silhouette image key
export const KINDS = {
  dress: { nouns: ['Mini Dress', 'Bodycon Dress', 'Midi Dress', 'Slip Dress', 'Bandage Dress', 'Cutout Dress'], sizes: 'apparel', price: [24, 89], image: 'dress' },
  maxi: { nouns: ['Maxi Dress', 'Slit Maxi Dress', 'Gown', 'Mermaid Maxi Dress'], sizes: 'apparel', price: [38, 120], image: 'gown' },
  top: { nouns: ['Crop Top', 'Bodysuit', 'Corset Top', 'Tube Top', 'Halter Top', 'Cami Top'], sizes: 'apparel', price: [14, 45], image: 'top' },
  outerwear: { nouns: ['Faux Fur Jacket', 'Moto Jacket', 'Blazer', 'Shrug', 'Trench Coat', 'Bomber Jacket'], sizes: 'apparel', price: [35, 120], image: 'jacket' },
  sweater: { nouns: ['Cropped Sweater', 'Off-Shoulder Sweater', 'Cardigan', 'Knit Sweater', 'Turtleneck'], sizes: 'apparel', price: [22, 55], image: 'top' },
  jeans: { nouns: ['Skinny Jeans', 'Ripped Jeans', 'High-Rise Jeans', 'Flare Jeans', 'Mom Jeans', 'Lace-Up Jeans'], sizes: 'denim', price: [25, 60], image: 'pants' },
  pants: { nouns: ['Wide Leg Pants', 'Leggings', 'Cargo Pants', 'Flare Pants', 'Joggers', 'Vinyl Pants'], sizes: 'apparel', price: [20, 55], image: 'pants' },
  shorts: { nouns: ['Booty Shorts', 'Denim Shorts', 'Biker Shorts', 'Hot Pants', 'Micro Shorts'], sizes: 'apparel', price: [12, 35], image: 'shorts' },
  skirt: { nouns: ['Mini Skirt', 'Pleated Skirt', 'Bodycon Skirt', 'Slit Maxi Skirt', 'Micro Skirt', 'Wrap Skirt'], sizes: 'apparel', price: [14, 45], image: 'skirt' },
  lingerie: { nouns: ['Babydoll Set', 'Bra & Panty Set', 'Teddy', 'Chemise', 'Garter Set', 'Bodystocking'], sizes: 'lingerie', price: [15, 55], image: 'lingerie' },
  hosiery: { nouns: ['Thigh High Stockings', 'Fishnet Tights', 'Pantyhose', 'Garter Stockings', 'Leg Warmers', 'Knee Socks'], sizes: 'hosiery', price: [6, 22], image: 'hosiery' },
  corset: { nouns: ['Overbust Corset', 'Underbust Corset', 'Waist Cincher', 'Bustier', 'Corset Dress'], sizes: 'lingerie', price: [30, 95], image: 'corset' },
  undergarment: { nouns: ['Thong', 'Bralette', 'Seamless Brief', 'Nipple Covers', 'Adhesive Bra', 'Cheeky Panty'], sizes: 'lingerie', price: [6, 25], image: 'lingerie' },
  jumpsuit: { nouns: ['Jumpsuit', 'Catsuit', 'Unitard', 'Wide Leg Jumpsuit'], sizes: 'apparel', price: [30, 75], image: 'jumpsuit' },
  romper: { nouns: ['Romper', 'Playsuit', 'Shorts Romper', 'Halter Romper'], sizes: 'apparel', price: [25, 55], image: 'romper' },
  set: { nouns: ['Two Piece Set', 'Crop Top & Skirt Set', 'Matching Set', 'Top & Pants Set', 'Shorts Set'], sizes: 'apparel', price: [28, 75], image: 'set' },
  lounge: { nouns: ['Lounge Set', 'Sweatsuit', 'Robe', 'Pajama Set', 'Hoodie Set'], sizes: 'apparel', price: [24, 65], image: 'set' },
  festival: { nouns: ['Festival Set', 'Rave Bodysuit', 'Fringe Set', 'Rave Outfit', 'Harness Set'], sizes: 'apparel', price: [22, 70], image: 'set' },
  bikini: { nouns: ['Triangle Bikini', 'Bandeau Bikini', 'Halter Bikini', 'Thong Bikini', 'Underwire Bikini', 'String Bikini'], sizes: 'apparel', price: [22, 65], image: 'bikini' },
  onepiece: { nouns: ['One Piece Swimsuit', 'Monokini', 'Plunge Swimsuit', 'Cutout Swimsuit', 'High Leg Swimsuit'], sizes: 'apparel', price: [28, 70], image: 'onepiece' },
  threepiece: { nouns: ['Three Piece Bikini Set', 'Bikini & Sarong Set', 'Bikini & Cover Up Set'], sizes: 'apparel', price: [38, 80], image: 'bikini' },
  coverup: { nouns: ['Sarong', 'Crochet Cover Up', 'Mesh Cover Up Dress', 'Kimono', 'Beach Pants'], sizes: 'apparel', price: [18, 48], image: 'coverup' },
  boot: { nouns: ['Thigh High Boots', 'Knee High Boots', 'Platform Boots', 'Combat Boots', 'Stiletto Boots'], sizes: 'shoes', price: [45, 150], image: 'boot' },
  bootie: { nouns: ['Ankle Booties', 'Platform Booties', 'Lace Up Booties', 'Peep Toe Booties'], sizes: 'shoes', price: [40, 110], image: 'bootie' },
  heel: { nouns: ['Stiletto Heels', 'Platform Pumps', 'Ankle Strap Heels', 'Mule Heels', 'Sandal Heels', 'Slingback Heels'], sizes: 'shoes', price: [16, 110], image: 'heel' },
  wedge: { nouns: ['Wedge Sandals', 'Platform Wedges', 'Espadrille Wedges'], sizes: 'shoes', price: [28, 75], image: 'heel' },
  flat: { nouns: ['Ballet Flats', 'Slides', 'Strappy Sandals', 'Flip Flops', 'Gladiator Sandals'], sizes: 'shoes', price: [12, 45], image: 'flat' },
  sneaker: { nouns: ['Platform Sneakers', 'High Top Sneakers', 'Chunky Sneakers', 'Slip-On Sneakers'], sizes: 'shoes', price: [30, 90], image: 'sneaker' },
  handbag: { nouns: ['Tote Bag', 'Shoulder Bag', 'Crossbody Bag', 'Mini Bag', 'Hobo Bag'], sizes: 'one', price: [25, 85], image: 'bag' },
  clutch: { nouns: ['Rhinestone Clutch', 'Evening Clutch', 'Box Clutch', 'Envelope Clutch'], sizes: 'one', price: [18, 60], image: 'bag' },
  wallet: { nouns: ['Zip Wallet', 'Card Holder', 'Wristlet Wallet', 'Coin Purse'], sizes: 'one', price: [12, 35], image: 'bag' },
  bracelet: { nouns: ['Bangle', 'Cuff Bracelet', 'Tennis Bracelet', 'Charm Bracelet', 'Chain Bracelet'], sizes: 'one', price: [6, 35], image: 'jewelry' },
  earrings: { nouns: ['Hoop Earrings', 'Drop Earrings', 'Stud Earrings', 'Chandelier Earrings', 'Huggie Earrings'], sizes: 'one', price: [6, 30], image: 'jewelry' },
  necklace: { nouns: ['Choker', 'Pendant Necklace', 'Layered Necklace', 'Collar Necklace', 'Chain Necklace'], sizes: 'one', price: [8, 40], image: 'jewelry' },
  ring: { nouns: ['Cocktail Ring', 'Stacking Ring Set', 'Statement Ring', 'Band Ring'], sizes: 'ring', price: [6, 28], image: 'jewelry' },
  belt: { nouns: ['Chain Belt', 'Corset Belt', 'Waist Belt', 'Studded Belt', 'O-Ring Belt'], sizes: 'apparel', price: [10, 35], image: 'belt' },
  harness: { nouns: ['Body Harness', 'Leg Harness', 'Chest Harness', 'Garter Harness'], sizes: 'one', price: [15, 45], image: 'harness' },
  body: { nouns: ['Body Chain', 'Body Glitter Kit', 'Rhinestone Body Jewelry', 'Belly Chain', 'Pasties'], sizes: 'one', price: [8, 30], image: 'jewelry' },
  costume: { nouns: ['Costume', 'Costume Set', 'Deluxe Costume', 'Dress Costume', 'Bodysuit Costume'], sizes: 'apparel', price: [35, 110], image: 'costume' },
  costumeAccessory: { nouns: ['Wig', 'Mask', 'Gloves', 'Ears & Tail Set', 'Wings', 'Hat', 'Tiara'], sizes: 'one', price: [8, 35], image: 'accessory' },
};

// Helper to define a category node.
// opts: kind (product kind for leaves), theme (word injected into names), sizes override,
// forceColor, plus (plus-size sizing), description
const c = (slug, name, opts = {}, children = []) => ({ slug, name, ...opts, children });

export const TREE = [
  c('clothing', 'Clothing', { description: 'Head-turning club and party clothing.' }, [
    c('sexy-dresses', 'Dresses', { description: 'Sexy dresses for every night out.' }, [
      c('party-dress', 'Party Dresses', { kind: 'dress', theme: 'Party' }),
      c('club-dresses', 'Club Dresses', { kind: 'dress', theme: 'Club' }),
      c('cocktail-dresses', 'Cocktail Dresses', { kind: 'dress', theme: 'Cocktail' }),
      c('little-black-dress', 'Little Black Dresses', { kind: 'dress', theme: 'Little Black', forceColor: 'Black' }),
      c('maxi-dress', 'Maxi Dresses', { kind: 'maxi' }),
      c('rhinestone-dresses', 'Rhinestone Dresses', { kind: 'dress', theme: 'Rhinestone' }),
      c('sequin-dresses', 'Sequin Dresses', { kind: 'dress', theme: 'Sequin' }),
      c('printed-dress', 'Printed Dresses', { kind: 'dress', theme: 'Printed' }),
    ]),
    c('tops', 'Clothing Tops', { description: 'Crop tops, bodysuits and statement layers.' }, [
      c('crop-tops', 'Crop Tops & Bodysuits', { kind: 'top' }),
      c('outerwear', 'Outerwear', { kind: 'outerwear' }),
      c('sheer-top', 'Sheer Tops', { kind: 'top', theme: 'Sheer Mesh' }),
      c('sweater', 'Sweaters', { kind: 'sweater' }),
    ]),
    c('bottoms', 'Bottoms', { description: 'Jeans, skirts, shorts and pants.' }, [
      c('jeans', 'Jeans', { kind: 'jeans' }),
      c('pants', 'Pants', { kind: 'pants' }),
      c('shorts', 'Shorts', { kind: 'shorts' }),
      c('skinny-jeans', 'Skinny Jeans', { kind: 'jeans', theme: 'Skinny' }),
      c('sexy-skirts', 'Skirts', { kind: 'skirt' }),
    ]),
    c('outfit', 'Outfits', { description: 'Matching sets and head-to-toe looks.' }, [
      c('loungewear', 'Loungewear', { kind: 'lounge' }),
      c('jumpsuits', 'Jumpsuits', { kind: 'jumpsuit' }),
      c('romper', 'Rompers', { kind: 'romper' }),
      c('two-piece-dresses', '2-Piece Dresses', { kind: 'set', theme: 'Two Piece' }),
      c('festival-outfits', 'Festival Outfits', { kind: 'festival', theme: 'Festival' }),
      c('goth-outfits', 'Goth Outfits', { kind: 'set', theme: 'Gothic', forceColor: 'Black' }),
      c('spring-outfits', 'Spring Outfits', { kind: 'set', theme: 'Floral' }),
      c('vacation-outfits', 'Vacation Outfits', { kind: 'set', theme: 'Resort' }),
    ]),
  ]),
  c('intimates', 'Intimates', { description: 'Lingerie, corsets, hosiery and more.' }, [
    c('undergarment', 'Undergarments', { kind: 'undergarment' }),
    c('lingerie', 'Lingerie', { kind: 'lingerie' }),
    c('hosiery', 'Leggings & Hosiery', { kind: 'hosiery' }),
    c('corsets', 'Corsets', { kind: 'corset' }),
    c('black-lingerie', 'Black Lingerie', { kind: 'lingerie', forceColor: 'Black' }),
    c('fishnet-lingerie', 'Fishnet Lingerie', { kind: 'lingerie', theme: 'Fishnet' }),
    c('naughty-lingerie', 'Naughty Lingerie', { kind: 'lingerie', theme: 'Strappy' }),
    c('exotic-costume', 'Exotic Costumes', { kind: 'costume', theme: 'Exotic Dancer' }),
    c('bedroom-costumes', 'Bedroom Costumes', { kind: 'costume', theme: 'Boudoir' }),
  ]),
  c('swimsuits', 'Swimsuits', { description: 'Bikinis, one-pieces and cover ups.' }, [
    c('one-piece-swimsuit', 'One-Piece Swimsuits', { kind: 'onepiece' }),
    c('two-piece-swimsuit', 'Two-Piece Swimsuits', { kind: 'bikini' }),
    c('three-piece-swimsuits', 'Three-Piece Swimsuits', { kind: 'threepiece' }),
    c('swimsuit-cover-ups', 'Cover Ups', { kind: 'coverup' }),
    c('swim-styles', 'Shop by Style', { description: 'Find your signature swim style.' }, [
      c('crochet', 'Crochet', { kind: 'bikini', theme: 'Crochet' }),
      c('patriotic', 'Flag Print', { kind: 'bikini', theme: 'Stars & Stripes' }),
      c('strappy', 'Strappy', { kind: 'bikini', theme: 'Strappy' }),
      c('high-waist', 'High Waist', { kind: 'bikini', theme: 'High Waist' }),
      c('animal-print', 'Animal Print', { kind: 'bikini', theme: 'Leopard' }),
      c('sequin', 'Bling / Sequin', { kind: 'bikini', theme: 'Sequin' }),
      c('bandeau-bikinis', 'Bandeau', { kind: 'bikini', theme: 'Bandeau' }),
      c('lace', 'Lace Bikinis', { kind: 'bikini', theme: 'Lace' }),
      c('rhinestone-swimsuits', 'Rhinestone Swimwear', { kind: 'bikini', theme: 'Rhinestone' }),
      c('color-block-swimsuits', 'Color Block', { kind: 'onepiece', theme: 'Color Block' }),
      c('fringe', 'Fringe', { kind: 'bikini', theme: 'Fringe' }),
      c('snake-print-swimsuits', 'Snake Print', { kind: 'bikini', theme: 'Snake Print' }),
      c('scrunch-butt', 'Pucker Back / Scrunch Butt', { kind: 'bikini', theme: 'Scrunch Butt' }),
    ]),
  ]),
  c('shoes', 'Shoes', { description: 'Platforms, stilettos, boots and more.' }, [
    c('boots', 'Boots', {}, [
      c('thigh-high-boots', 'Thigh High Boots', { kind: 'boot', theme: 'Thigh High' }),
      c('booties', 'Booties', { kind: 'bootie' }),
      c('gogo-boots', 'GoGo Boots', { kind: 'boot', theme: 'GoGo' }),
      c('high-heel-boots', 'High Heel Boots', { kind: 'boot', theme: 'High Heel' }),
      c('lace-up-booties', 'Lace Up Booties', { kind: 'bootie', theme: 'Lace Up' }),
    ]),
    c('high-heels', 'High Heels', {}, [
      c('clear-heels', 'Clear Heels', { kind: 'heel', theme: 'Clear' }),
      c('fur-heels', 'Fur Heels', { kind: 'heel', theme: 'Faux Fur' }),
      c('pumps', 'Pumps', { kind: 'heel', theme: 'Pointed Toe' }),
      c('single-sole-heels', 'Single Sole Heels', { kind: 'heel', theme: 'Single Sole' }),
      c('stilettos', 'Stilettos', { kind: 'heel', theme: 'Stiletto' }),
      c('wedges', 'Wedges', { kind: 'wedge' }),
    ]),
    c('flats', 'Flats', {}, [
      c('sandals', 'Sandals', { kind: 'flat' }),
      c('sneakers', 'Sneakers', { kind: 'sneaker' }),
    ]),
  ]),
  c('plus-size', 'Plus Size', { description: 'Curvy styles in sizes 1X-4X.' }, [
    c('plus-size-costume', 'Plus Size Costumes', { kind: 'costume', plus: true, theme: 'Curvy' }),
    c('plus-size-black-dresses', 'Plus Black Dresses', { kind: 'dress', plus: true, forceColor: 'Black' }),
    c('plus-dresses', 'Plus Dresses', { kind: 'dress', plus: true }),
    c('plus-lingerie', 'Plus Lingerie', { kind: 'lingerie', plus: true }),
    c('plus-size-pants', 'Plus Pants', { kind: 'pants', plus: true }),
    c('plus-size-party-dresses', 'Plus Party Dresses', { kind: 'dress', plus: true, theme: 'Party' }),
    c('plus-size-skirts', 'Plus Skirts', { kind: 'skirt', plus: true }),
    c('plus-swimsuits', 'Plus Swimsuits', { kind: 'bikini', plus: true }),
  ]),
  c('accessories', 'Accessories', { description: 'Bags, jewelry, harnesses and finishing touches.' }, [
    c('body', 'Body', { kind: 'body' }),
    c('belt', 'Belts', { kind: 'belt' }),
    c('harnesses', 'Harnesses', { kind: 'harness' }),
    c('handbags', 'Handbags', { kind: 'handbag' }),
    c('clutch-purse', 'Clutches', { kind: 'clutch' }),
    c('wallet', 'Wallets', { kind: 'wallet' }),
    c('all-jewelry', 'Jewelry', {}, [
      c('bracelets', 'Bracelets', { kind: 'bracelet' }),
      c('earrings', 'Earrings', { kind: 'earrings' }),
      c('necklace', 'Necklaces', { kind: 'necklace' }),
      c('ring', 'Rings', { kind: 'ring' }),
    ]),
    c('costume-accessory', 'Costume Accessories', { kind: 'costumeAccessory' }),
  ]),
  c('costumes', 'Costumes', { description: 'Halloween, cosplay and role play costumes.' }, [
    c('cosplay-costumes', 'Cosplay Costumes', {}, [
      c('catwomen-costumes', 'Cat Burglar Costumes', { kind: 'costume', theme: 'Cat Burglar' }),
      c('harley-quinn-costumes', 'Harlequin Costumes', { kind: 'costume', theme: 'Harlequin' }),
      c('jessica-rabbit-costumes', 'Retro Bombshell Costumes', { kind: 'costume', theme: 'Retro Bombshell' }),
      c('ninja-costumes', 'Ninja Costumes', { kind: 'costume', theme: 'Ninja' }),
      c('sailor-costume', 'Sailor Costumes', { kind: 'costume', theme: 'Sailor' }),
      c('school-girl-costume', 'Schoolgirl Costumes', { kind: 'costume', theme: 'Schoolgirl' }),
      c('sexy-superhero-costumes', 'Superhero Costumes', { kind: 'costume', theme: 'Superhero' }),
    ]),
    c('sexy-costume', 'Sexy Costumes', {}, [
      c('sexy-bunny-costumes', 'Bunny Costumes', { kind: 'costume', theme: 'Bunny' }),
      c('dominatrix-costumes', 'Dominatrix Costumes', { kind: 'costume', theme: 'Dominatrix' }),
      c('geisha-costume', 'Geisha Costumes', { kind: 'costume', theme: 'Geisha' }),
      c('maids-costumes', 'Maid Costumes', { kind: 'costume', theme: 'French Maid' }),
      c('nurse-costume', 'Nurse Costumes', { kind: 'costume', theme: 'Nurse' }),
      c('playboy-bunny-costumes', 'Playmate Bunny Costumes', { kind: 'costume', theme: 'Playmate Bunny' }),
      c('sexy-cop', 'Police Costumes', { kind: 'costume', theme: 'Police' }),
    ]),
    c('storybook-costume', 'Storybook Costumes', {}, [
      c('alice-in-wonderland-costumes', 'Wonderland Costumes', { kind: 'costume', theme: 'Wonderland' }),
      c('cleopatra-costume', 'Cleopatra Costumes', { kind: 'costume', theme: 'Cleopatra' }),
      c('cruella-deville-costume', 'Spotted Villainess Costumes', { kind: 'costume', theme: 'Spotted Villainess' }),
      c('devil-costumes', 'Devil Costumes', { kind: 'costume', theme: 'Devil' }),
      c('fairy-costumes', 'Fairy Costumes', { kind: 'costume', theme: 'Fairy' }),
      c('mermaid-costume', 'Mermaid Costumes', { kind: 'costume', theme: 'Mermaid' }),
      c('princess-costumes', 'Princess Costumes', { kind: 'costume', theme: 'Princess' }),
      c('witch-costume', 'Witch Costumes', { kind: 'costume', theme: 'Witch' }),
    ]),
    c('role-play-costumes', 'Role Play Costumes', {}, [
      c('cheerleader-costume', 'Cheerleader Costumes', { kind: 'costume', theme: 'Cheerleader' }),
      c('group-halloween-costumes', 'Group Costumes', { kind: 'costume', theme: 'Squad' }),
      c('movie-character-costumes', 'Movie Character Costumes', { kind: 'costume', theme: 'Silver Screen' }),
      c('nun-costumes', 'Nun Costumes', { kind: 'costume', theme: 'Nun' }),
      c('prisoner-costumes', 'Prisoner Costumes', { kind: 'costume', theme: 'Prisoner' }),
      c('race-car-driver-costume', 'Racer Costumes', { kind: 'costume', theme: 'Race Car Driver' }),
      c('sexy-sports-costume', 'Sports Costumes', { kind: 'costume', theme: 'Sports Fan' }),
    ]),
  ]),
];

// Rule-based collections. Rule fields (all optional, AND-ed):
//   scope: category slug (product must be in it or a descendant)
//   isNew, onSale, doorbuster: boolean flags
//   maxPrice: number (price < maxPrice)
//   brand: brand name
export const SMART = [
  { slug: 'just-in', name: 'New Arrivals', description: 'Fresh drops, just landed.', rule: { isNew: true } },
  { slug: 'halloween', name: 'Halloween', description: 'Every costume for the spookiest night of the year.', rule: { scope: 'costumes' } },
  { slug: 'clearance', name: 'Clearance', description: 'Final markdowns across the store.', rule: { onSale: true } },
  { slug: 'accessories-sale', name: 'Accessory Clearance', rule: { onSale: true, scope: 'accessories' } },
  { slug: 'clothing-clearance', name: 'Clothing Clearance', rule: { onSale: true, scope: 'clothing' } },
  { slug: 'lingerie-sale', name: 'Lingerie Clearance', rule: { onSale: true, scope: 'intimates' } },
  { slug: 'shoe-sale', name: 'Shoe Clearance', rule: { onSale: true, scope: 'shoes' } },
  { slug: 'swimsuit-sale', name: 'Swimsuit Clearance', rule: { onSale: true, scope: 'swimsuits' } },
  { slug: 'clearance-costumes', name: 'Costume Clearance', rule: { onSale: true, scope: 'costumes' } },
  { slug: 'under-20', name: 'Under $20', description: 'Big looks, small prices.', rule: { maxPrice: 20 } },
  { slug: 'under-20-clothing', name: 'Clothing Under $20', rule: { maxPrice: 20, scope: 'clothing' } },
  { slug: 'under-20-shoes', name: 'Shoes Under $20', rule: { maxPrice: 20, scope: 'shoes' } },
  { slug: 'under-20-costumes', name: 'Costumes Under $20', rule: { maxPrice: 20, scope: 'costumes' } },
  { slug: 'doorbuster', name: 'Doorbusters', description: 'Limited-time deals while supplies last.', rule: { doorbuster: true } },
  { slug: 'party-shoes', name: 'Party Shoes', rule: { scope: 'high-heels' } },
  { slug: 'pleaser-shoes', name: 'Stiletto Society Shoes', rule: { brand: 'Stiletto Society' } },
  { slug: 'pleaser-boots', name: 'Stiletto Society Boots', rule: { brand: 'Stiletto Society', scope: 'boots' } },
  { slug: 'pleaser-heels', name: 'Stiletto Society Heels', rule: { brand: 'Stiletto Society', scope: 'high-heels' } },
  { slug: 'demonia-shoes', name: 'Gothika Shoes', rule: { brand: 'Gothika' } },
  { slug: 'cape-robbin-shoes', name: 'Cape Royale Shoes', rule: { brand: 'Cape Royale' } },
  { slug: 'cape-robbin-boots', name: 'Cape Royale Boots', rule: { brand: 'Cape Royale', scope: 'boots' } },
  { slug: 'cape-robbin-heels', name: 'Cape Royale Heels', rule: { brand: 'Cape Royale', scope: 'high-heels' } },
];

// Storefront mega-menu (mirrors the reference site's navigation).
const g = (slug, label, items = []) => ({ slug, label, items });
const l = (slug, label) => ({ slug, label });
export const MENU = [
  g('just-in', 'New'),
  g('halloween', 'Halloween'),
  g('clothing', 'Clothing', [
    g('sexy-dresses', 'Dresses', [l('party-dress', 'Party Dresses'), l('club-dresses', 'Club Dresses'), l('cocktail-dresses', 'Cocktail Dresses'), l('little-black-dress', 'Little Black Dresses'), l('maxi-dress', 'Maxi Dresses'), l('rhinestone-dresses', 'Rhinestone Dresses'), l('sequin-dresses', 'Sequin Dresses'), l('printed-dress', 'Printed Dress')]),
    g('tops', 'Clothing Tops', [l('outerwear', 'Outerwear'), l('sheer-top', 'Sheer'), l('sweater', 'Sweaters')]),
    g('bottoms', 'Bottoms', [l('jeans', 'Jeans'), l('pants', 'Pants'), l('shorts', 'Shorts'), l('skinny-jeans', 'Skinny Jeans'), l('sexy-skirts', 'Skirts')]),
    g('intimates', 'Intimates', [l('undergarment', 'Undergarment'), l('lingerie', 'Lingerie'), l('hosiery', 'Leggings & Hosiery'), l('corsets', 'Corsets'), l('black-lingerie', 'Black Lingerie'), l('fishnet-lingerie', 'Fishnet Lingerie'), l('naughty-lingerie', 'Naughty Lingerie')]),
    g('outfit', 'Outfits', [l('loungewear', 'Loungewear'), l('jumpsuits', 'Jumpsuits'), l('romper', 'Rompers'), l('two-piece-dresses', '2-piece Dresses'), l('festival-outfits', 'Festival Outfits'), l('goth-outfits', 'Goth Outfits'), l('spring-outfits', 'Spring Outfits'), l('vacation-outfits', 'Vacation Outfits')]),
  ]),
  g('swimsuits', 'Swimsuit', [
    g('one-piece-swimsuit', 'One-Piece Swimsuits', [l('swimsuit-cover-ups', 'Cover Ups'), l('crochet', 'Crochet'), l('patriotic', 'Flag Print'), l('strappy', 'Strappy'), l('plus-swimsuits', 'Plus Size Swim')]),
    g('two-piece-swimsuit', 'Two-Piece', [l('high-waist', 'High Waist'), l('animal-print', 'Animal Print'), l('sequin', 'Bling / Sequin'), l('bandeau-bikinis', 'Bandeau'), l('lace', 'Lace Bikinis')]),
    g('two-piece-swimsuit', '2026 Trends', [l('three-piece-swimsuits', 'Three-Piece Swimsuits'), l('rhinestone-swimsuits', 'Rhinestone Swimwear'), l('color-block-swimsuits', 'Color Block'), l('fringe', 'Fringe'), l('snake-print-swimsuits', 'Snake Print'), l('scrunch-butt', 'Pucker Back / Scrunch Butt')]),
  ]),
  g('shoes', 'Shoes', [
    g('boots', 'Boots', [l('thigh-high-boots', 'Thigh High Boots'), l('booties', 'Booties'), l('gogo-boots', 'GoGo Boots'), l('high-heel-boots', 'High Heel Boots'), l('lace-up-booties', 'Lace Up Booties')]),
    g('high-heels', 'High Heels', [l('clear-heels', 'Clear Heels'), l('fur-heels', 'Fur Heels'), l('pumps', 'Pumps'), l('single-sole-heels', 'Single Sole Heels'), l('stilettos', 'Stilettos'), l('wedges', 'Wedges')]),
    g('flats', 'Flats', [l('sandals', 'Sandals'), l('sneakers', 'Sneakers')]),
    g('pleaser-shoes', 'Stiletto Society', [l('pleaser-boots', 'Stiletto Society Boots'), l('pleaser-heels', 'Stiletto Society Heels'), l('demonia-shoes', 'Gothika Shoes')]),
    g('cape-robbin-shoes', 'Cape Royale', [l('cape-robbin-boots', 'Cape Royale Boots'), l('cape-robbin-heels', 'Cape Royale Heels')]),
  ]),
  g('plus-size', 'Plus Size', [
    g('plus-size', 'Shop Plus', [l('plus-size-costume', 'Plus Size Costumes'), l('plus-size-black-dresses', 'Plus Black Dresses'), l('plus-dresses', 'Plus Dresses'), l('plus-lingerie', 'Plus Lingerie'), l('plus-size-pants', 'Plus Pants'), l('plus-size-party-dresses', 'Plus Party Dresses'), l('plus-size-skirts', 'Plus Skirts'), l('plus-swimsuits', 'Plus Swimsuits')]),
  ]),
  g('accessories', 'Accessories', [
    g('body', 'Body', [l('belt', 'Belts'), l('harnesses', 'Harnesses')]),
    g('handbags', 'Handbags', [l('clutch-purse', 'Clutches'), l('wallet', 'Wallet')]),
    g('all-jewelry', 'Jewelry', [l('bracelets', 'Bracelets'), l('earrings', 'Earrings'), l('necklace', 'Necklaces'), l('ring', 'Rings')]),
    g('costume-accessory', 'Costume', [l('party-shoes', 'Party Shoes')]),
  ]),
  g('intimates', 'Intimates', [
    g('intimates', 'Shop Intimates', [l('corsets', 'Corsets'), l('hosiery', 'Hosiery'), l('lingerie', 'Lingerie'), l('exotic-costume', 'Exotic Costumes'), l('bedroom-costumes', 'Bedroom Costume')]),
  ]),
  g('costumes', 'Costumes', [
    g('cosplay-costumes', 'Cosplay Costumes', [l('catwomen-costumes', 'Cat Burglar'), l('harley-quinn-costumes', 'Harlequin Costumes'), l('jessica-rabbit-costumes', 'Retro Bombshell Costume'), l('ninja-costumes', 'Ninja Costumes'), l('sailor-costume', 'Sailor Costumes'), l('school-girl-costume', 'Schoolgirl Costumes'), l('sexy-superhero-costumes', 'Superhero Costumes')]),
    g('sexy-costume', 'Sexy Costumes', [l('sexy-bunny-costumes', 'Bunny Costumes'), l('dominatrix-costumes', 'Dominatrix Costumes'), l('geisha-costume', 'Geisha Costumes'), l('maids-costumes', 'Maids Costumes'), l('nurse-costume', 'Nurse Costumes'), l('playboy-bunny-costumes', 'Playmate Bunny Costume'), l('sexy-cop', 'Police Costume')]),
    g('storybook-costume', 'Storybook Costumes', [l('alice-in-wonderland-costumes', 'Wonderland'), l('cleopatra-costume', 'Cleopatra Costumes'), l('cruella-deville-costume', 'Spotted Villainess'), l('devil-costumes', 'Devil Costumes'), l('fairy-costumes', 'Fairy Costumes'), l('mermaid-costume', 'Mermaid Costumes'), l('princess-costumes', 'Princess Costumes'), l('witch-costume', 'Witch Costume')]),
    g('role-play-costumes', 'Role Play Costumes', [l('cheerleader-costume', 'Cheerleader Costumes'), l('group-halloween-costumes', 'Group Costumes'), l('movie-character-costumes', 'Movie Character Costume'), l('nun-costumes', 'Nun Costumes'), l('prisoner-costumes', 'Prisoner Costumes'), l('race-car-driver-costume', 'Racer Costumes'), l('sexy-sports-costume', 'Sports Costumes')]),
  ]),
  g('clearance', 'Clearance', [
    g('clearance', 'Shop Clearance', [l('accessories-sale', 'Accessory Clearance'), l('clothing-clearance', 'Clothing Clearance'), l('lingerie-sale', 'Lingerie Clearance'), l('shoe-sale', 'Shoe Clearance'), l('swimsuit-sale', 'Swimsuit Clearance'), l('clearance-costumes', 'Costume Clearance')]),
  ]),
  g('under-20', 'Under $20', [
    g('under-20', 'Shop Under $20', [l('under-20-clothing', 'Clothing Under 20'), l('under-20-shoes', 'Shoes Under $20'), l('under-20-costumes', 'Costumes Under $20')]),
  ]),
  g('doorbuster', 'Doorbusters'),
];

export const HOME = {
  announcement: 'Free U.S. ground shipping on orders over $50 — no coupon code needed',
  heroes: [
    { title: 'Halloween Headquarters', subtitle: '2,000+ costumes ready to ship', cta: 'Shop Costumes', collection: 'halloween', theme: 'dark' },
    { title: 'Just Dropped', subtitle: 'New arrivals for your next night on the Strip', cta: 'Shop New', collection: 'just-in', theme: 'pink' },
    { title: 'Doorbusters', subtitle: 'Limited-time deals — while supplies last', cta: 'Shop Deals', collection: 'doorbuster', theme: 'gold' },
  ],
  tiles: [
    { slug: 'sexy-dresses', name: 'Dresses', imageKey: 'dress' },
    { slug: 'shoes', name: 'Shoes', imageKey: 'heel' },
    { slug: 'swimsuits', name: 'Swimwear', imageKey: 'bikini' },
    { slug: 'intimates', name: 'Intimates', imageKey: 'lingerie' },
    { slug: 'costumes', name: 'Costumes', imageKey: 'costume' },
    { slug: 'accessories', name: 'Accessories', imageKey: 'bag' },
  ],
  sections: [
    { title: 'New Arrivals', collection: 'just-in' },
    { title: 'Halloween Costumes', collection: 'halloween' },
    { title: 'Under $20', collection: 'under-20' },
    { title: 'Doorbusters', collection: 'doorbuster' },
  ],
};
