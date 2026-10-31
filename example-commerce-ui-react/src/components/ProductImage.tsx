// Product "photography" is drawn as an SVG silhouette tinted with the product color,
// so the demo ships without third-party images.

interface Shape { fill: string[]; stroke?: string[] }

const SHAPES: Record<string, Shape> = {
  dress: { fill: ['M40 14 L60 14 L59 34 L72 104 L28 104 L41 34 Z'], stroke: ['M41 14 L39 4', 'M59 14 L61 4'] },
  gown: { fill: ['M41 12 L59 12 L58 36 L80 112 L20 112 L42 36 Z'], stroke: ['M42 12 L40 3', 'M58 12 L60 3'] },
  top: { fill: ['M28 26 L42 18 Q50 24 58 18 L72 26 L67 42 L61 39 L61 72 L39 72 L39 39 L33 42 Z'] },
  jacket: { fill: ['M26 24 L42 15 L50 30 L58 15 L74 24 L82 84 L70 84 L67 48 L67 98 L33 98 L33 48 L30 84 L18 84 Z'], stroke: ['M50 30 L50 98'] },
  pants: { fill: ['M33 12 L67 12 L71 112 L56 112 L50 44 L44 112 L29 112 Z'] },
  shorts: { fill: ['M31 34 L69 34 L74 76 L55 76 L50 54 L45 76 L26 76 Z'] },
  skirt: { fill: ['M38 30 L62 30 L76 84 L24 84 Z'], stroke: ['M44 34 L38 82', 'M56 34 L62 82'] },
  lingerie: { fill: ['M28 30 Q38 18 50 34 Q62 18 72 30 L69 46 Q50 52 31 46 Z', 'M33 64 L67 64 L58 86 L50 90 L42 86 Z'], stroke: ['M34 30 L36 12', 'M66 30 L64 12'] },
  hosiery: { fill: ['M36 8 L48 8 L47 98 L54 110 L36 110 L38 98 Z', 'M53 8 L65 8 L63 98 L71 110 L53 110 L55 98 Z'] },
  corset: { fill: ['M32 20 Q50 32 68 20 L62 60 L69 98 L31 98 L38 60 Z'], stroke: ['M50 28 L50 96', 'M45 40 L55 40', 'M45 52 L55 52', 'M45 64 L55 64', 'M45 76 L55 76'] },
  jumpsuit: { fill: ['M38 12 L62 12 L62 42 L69 112 L54 112 L50 62 L46 112 L31 112 L38 42 Z'] },
  romper: { fill: ['M38 16 L62 16 L64 52 L69 78 L52 78 L50 64 L48 78 L31 78 L36 52 Z'] },
  set: { fill: ['M35 14 L65 14 L63 40 L37 40 Z', 'M36 48 L64 48 L73 94 L27 94 Z'] },
  bikini: { fill: ['M30 28 L46 28 L50 37 L54 28 L70 28 L65 44 L50 41 L35 44 Z', 'M35 64 L65 64 L57 80 L43 80 Z'], stroke: ['M38 28 L44 12', 'M62 28 L56 12'] },
  onepiece: { fill: ['M38 14 L62 14 L60 46 Q64 66 69 76 L56 94 L44 94 L31 76 Q36 66 40 46 Z'] },
  coverup: { fill: ['M20 20 L80 20 L84 62 L67 62 L67 108 L33 108 L33 62 L16 62 Z'], stroke: ['M50 20 L44 108'] },
  boot: { fill: ['M42 6 L60 6 L60 80 L80 92 L80 104 L40 104 L40 92 L42 80 Z'], stroke: ['M42 104 L42 112'] },
  bootie: { fill: ['M40 46 L58 46 L58 80 L80 92 L80 104 L38 104 L38 92 L40 80 Z'] },
  heel: { fill: ['M14 92 Q24 58 46 70 L82 86 L84 96 L56 96 L28 80 L27 104 L21 104 L22 86 Z'] },
  flat: { fill: ['M14 90 Q28 80 60 84 L84 88 Q88 98 78 100 L20 100 Q12 98 14 90 Z'], stroke: ['M40 82 L52 70 L64 84'] },
  sneaker: { fill: ['M14 70 L38 62 L56 72 L82 80 L86 96 L14 96 Z'], stroke: ['M14 90 L86 90', 'M42 68 L48 76', 'M48 66 L54 74'] },
  bag: { fill: ['M26 46 L74 46 L79 102 L21 102 Z'], stroke: ['M37 46 Q37 20 50 20 Q63 20 63 46'] },
  jewelry: { fill: ['M50 78 L58 88 L50 100 L42 88 Z'], stroke: ['M26 24 Q50 96 74 24'] },
  belt: { fill: ['M8 54 L92 54 L92 68 L8 68 Z'], stroke: ['M40 48 L58 48 L58 74 L40 74 Z'] },
  harness: { fill: ['M44 50 L56 50 L56 62 L44 62 Z'], stroke: ['M30 14 L50 56 L70 14', 'M24 44 L76 44', 'M50 62 L50 104', 'M30 84 L70 84'] },
  costume: { fill: ['M50 4 L62 28 L38 28 Z', 'M36 32 L64 32 L60 52 L73 108 L27 108 L40 52 Z'], stroke: ['M30 28 L70 28'] },
  accessory: { fill: ['M18 52 Q34 36 50 50 Q66 36 82 52 Q78 68 62 66 Q50 58 38 66 Q22 68 18 52 Z'] },
};

function shade(hex: string, amt: number) {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c((n >> 16) & 255)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

export function ProductImage({ imageKey, color = '#ff2d87', label, size = 'card' }: {
  imageKey: string; color?: string; label?: string; size?: 'card' | 'large' | 'thumb';
}) {
  const shape = SHAPES[imageKey] ?? SHAPES.dress;
  const outline = shade(color, -60);
  const light = ['#f5f5f5', '#e9d7b8', '#f4c2c2', '#c0c0c0'].includes(color.toLowerCase());
  return (
    <div className={`pimg pimg--${size}`} role="img" aria-label={label ?? imageKey}>
      <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`g-${imageKey}-${color.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shade(color, 40)} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="114" rx="30" ry="3" fill="rgba(0,0,0,.12)" />
        {shape.fill.map((d) => (
          <path key={d} d={d} fill={`url(#g-${imageKey}-${color.slice(1)})`} stroke={light ? '#8a8a8a' : outline}
            strokeWidth="1.2" strokeLinejoin="round" />
        ))}
        {shape.stroke?.map((d) => (
          <path key={d} d={d} fill="none" stroke={light ? '#8a8a8a' : outline} strokeWidth="2.2" strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
}
