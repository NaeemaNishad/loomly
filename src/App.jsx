import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, User, ShoppingBag, Sun, Moon, ArrowRight, Sparkles, Heart,
  Star, Flower2, Grid, RotateCcw, Undo2, Redo2, Check, AlertTriangle,
  Sliders, Type, Image as ImageIcon, Palette, Layers, Shirt, Scissors,
  Eye, ShieldCheck, Truck, RefreshCw, Headphones, Plus, Minus, Trash2,
  Copy, Edit3, CheckCircle2, Info, ChevronRight, X, Upload, Maximize2,
  Move, Wand2, Award, MessageSquare, Send, Filter, Menu, EyeOff
} from 'lucide-react';

// ============================================================================
// 1. CONSTANTS, DESIGN TOKENS & CATALOG DATA
// ============================================================================

const GARMENT_TYPES = {
  tee: {
    id: 'tee',
    name: 'Classic Crew Tee',
    shortName: 'Tees',
    group: 'unisex',
    basePrice: 499,
    description: 'Midweight combed cotton with ribbed crew collar and tailored shoulder seams.',
    printZone: { x: 118, y: 115, w: 124, h: 155 }
  },
  polo: {
    id: 'polo',
    name: 'Court Pique Polo',
    shortName: 'Polos',
    group: 'unisex',
    basePrice: 699,
    description: 'Breathable pique knit with structured fold-over collar, two-button placket, and ribbed cuffs.',
    printZone: { x: 120, y: 128, w: 120, h: 140 }
  },
  tank: {
    id: 'tank',
    name: 'Summer Rib Tank',
    shortName: 'Tanks',
    group: 'unisex',
    basePrice: 399,
    description: 'Light jersey tank top with deep scoop neckline, bound straps, and clean athletic drape.',
    printZone: { x: 126, y: 118, w: 108, h: 145 }
  },
  hoodie: {
    id: 'hoodie',
    name: 'Studio Fleece Hoodie',
    shortName: 'Hoodies',
    group: 'unisex',
    basePrice: 1199,
    description: 'Brushed 380 GSM fleece with double-lined hood, kangaroo pouch pocket, and ribbed cuffs.',
    printZone: { x: 122, y: 135, w: 116, h: 120 }
  },
  shirt: {
    id: 'shirt',
    name: 'Cuban Collar Shirt',
    shortName: 'Shirts',
    group: 'unisex',
    basePrice: 1099,
    description: 'Relaxed resort collar button-down with fluid drape and breathable weave.',
    printZone: { x: 118, y: 125, w: 124, h: 145 }
  },
  trousers: {
    id: 'trousers',
    name: 'Utility Cargo Trousers',
    shortName: 'Trousers',
    group: 'unisex',
    basePrice: 1199,
    description: 'Multi-pocket relaxed-leg cargos with articulated knee pleats and ankle toggles.',
    printZone: { x: 112, y: 110, w: 136, h: 170 }
  },
  top: {
    id: 'top',
    name: "Women's Studio Top",
    shortName: 'Tops',
    group: 'women',
    basePrice: 899,
    description: 'Customizable neckline, sleeve architecture, and hemline length from crop to tunic.',
    printZone: { x: 122, y: 110, w: 116, h: 125 }
  },
  skirt: {
    id: 'skirt',
    name: 'Pleated A-Line Skirt',
    shortName: 'Skirts',
    group: 'women',
    basePrice: 1099,
    description: 'High-waisted tailored A-line skirt with crisp pleats and customizable mini-to-maxi hem.',
    printZone: { x: 118, y: 115, w: 124, h: 145 }
  },
  dress: {
    id: 'dress',
    name: 'Tailored Shift Dress',
    shortName: 'Dresses',
    group: 'women',
    basePrice: 1499,
    description: 'Sculpted waist seam silhouette with customizable sleeves and knee-to-midi hemline.',
    printZone: { x: 124, y: 108, w: 112, h: 130 }
  },
  frock: {
    id: 'frock',
    name: 'Flared Fit & Flare Frock',
    shortName: 'Frocks',
    group: 'women',
    basePrice: 1399,
    description: 'Fitted bodice flowing into a gathered flared skirt with ruffled hem and puff/cap sleeves.',
    printZone: { x: 126, y: 108, w: 108, h: 115 }
  },
  maxi: {
    id: 'maxi',
    name: 'Flowing Tiered Maxi Dress',
    shortName: 'Maxi Dresses',
    group: 'women',
    basePrice: 1799,
    description: 'Floor-sweeping tiered silhouette with fluid vertical drape and customizable sleeves.',
    printZone: { x: 126, y: 105, w: 108, h: 135 }
  }
};

const SLEEVE_OPTIONS = [
  { id: 'sleeveless', name: 'Sleeveless', priceAdd: 0 },
  { id: 'cap', name: 'Cap Sleeve', priceAdd: 50 },
  { id: 'short', name: 'Short Sleeve', priceAdd: 50 },
  { id: 'puff', name: 'Puff Sleeve', priceAdd: 120 },
  { id: 'long', name: 'Long Sleeve', priceAdd: 150 }
];

const LENGTH_OPTIONS_BY_GARMENT = {
  top: [
    { id: 'crop', name: 'Crop Length', priceAdd: 0 },
    { id: 'regular', name: 'Regular Hip', priceAdd: 50 },
    { id: 'tunic', name: 'Tunic Length', priceAdd: 120 }
  ],
  skirt: [
    { id: 'mini', name: 'Mini Cut', priceAdd: 0 },
    { id: 'midi', name: 'Midi Cut', priceAdd: 120 },
    { id: 'maxi', name: 'Maxi Sweep', priceAdd: 220 }
  ],
  dress: [
    { id: 'knee', name: 'Knee-Length', priceAdd: 0 },
    { id: 'midi', name: 'Midi Hem', priceAdd: 150 }
  ],
  frock: [
    { id: 'mini', name: 'Above-Knee Flare', priceAdd: 0 },
    { id: 'knee', name: 'Classic Knee Flare', priceAdd: 100 }
  ],
  maxi: [
    { id: 'ankle', name: 'Ankle Tiered', priceAdd: 0 },
    { id: 'floor', name: 'Floor Sweeping', priceAdd: 150 }
  ]
};

const COLOR_PALETTE = [
  { id: 'black', name: 'Obsidian Black', hex: '#1E1E22', isDark: true },
  { id: 'white', name: 'Ecru Cream', hex: '#EDEAE2', isDark: false },
  { id: 'olive', name: 'Forest Moss', hex: '#43533D', isDark: true },
  { id: 'navy', name: 'Midnight Navy', hex: '#28364F', isDark: true },
  { id: 'terracotta', name: 'Terracotta Clay', hex: '#C27D52', isDark: false },
  { id: 'ochre', name: 'Sienna Ochre', hex: '#A86428', isDark: true },
  { id: 'slate', name: 'Slate Mist', hex: '#6F7D8C', isDark: true },
  { id: 'lavender', name: 'Lilac Haze', hex: '#B799FF', isDark: false }
];

const FABRICS = [
  { id: 'cotton', name: '100% Combed Cotton (240 GSM)', priceAdd: 0, badge: 'Breathable' },
  { id: 'terry', name: 'Heavy French Terry (380 GSM)', priceAdd: 250, badge: 'Structured' },
  { id: 'linen', name: 'Organic Linen Blend', priceAdd: 200, badge: 'Airy' },
  { id: 'ripstop', name: 'Tech Ripstop Weave', priceAdd: 300, badge: 'Durable' }
];

const PATTERNS = [
  { id: 'solid', name: 'Solid Matte', priceAdd: 0 },
  { id: 'pinstripe', name: 'Pin Stripes', priceAdd: 100 },
  { id: 'grid', name: 'Architectural Grid', priceAdd: 120 },
  { id: 'tiedye', name: 'Acid Wash / Tie-Dye', priceAdd: 180 },
  { id: 'camo', name: 'Abstract Splatter', priceAdd: 150 }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FITS = [
  { id: 'slim', name: 'Slim Fit', scaleX: 0.92, note: 'Tailored closer to body' },
  { id: 'regular', name: 'Regular Fit', scaleX: 1.0, note: 'Classic balanced drape' },
  { id: 'oversized', name: 'Oversized', scaleX: 1.09, note: 'Drop-shoulder streetwear cut' }
];

const VECTOR_STAMPS = [
  { id: 'none', name: 'No Graphic' },
  { id: 'starburst', name: 'Y2K Starburst' },
  { id: 'ribbon', name: 'Cyber Bow' },
  { id: 'smiley', name: 'Good Vibes Smiley' },
  { id: 'heart', name: 'Doodle Heart' },
  { id: 'flower', name: 'Retro Blossom' },
  { id: 'checker', name: 'Checker Badge' },
  { id: 'bolt', name: 'Voltage Bolt' }
];

const FONT_STYLES = [
  { id: 'serif', name: 'Editorial Serif', css: "'Playfair Display', Georgia, serif" },
  { id: 'sans', name: 'Street Grotesk', css: "'Plus Jakarta Sans', sans-serif" },
  { id: 'mono', name: 'Tech Monospace', css: "monospace" },
  { id: 'script', name: 'Signature Script', css: "cursive" }
];

const INITIAL_SHOP_ITEMS = [
  {
    id: 'shop-1',
    name: 'Classic Crew Tee',
    category: 'tee',
    group: 'unisex',
    price: 499,
    rating: 4.9,
    reviews: 184,
    tag: 'T-Shirt • Classic',
    subtitle: 'Midweight cotton, relaxed fit.',
    preset: {
      garment: 'tee',
      color: '#EDEAE2',
      fabric: 'cotton',
      pattern: 'solid',
      fit: 'regular',
      front: { text: '', textColor: '#1E1E22', font: 'sans', fontSize: 18, stamp: 'none', stampColor: '#1E1E22', x: 50, y: 44, scale: 1.0 }
    }
  },
  {
    id: 'shop-2',
    name: 'Studio Hoodie',
    category: 'hoodie',
    group: 'unisex',
    price: 1199,
    rating: 4.9,
    reviews: 142,
    tag: 'Hoodie • Fleece',
    subtitle: 'Brushed fleece with a kangaroo pocket.',
    preset: {
      garment: 'hoodie',
      color: '#43533D',
      fabric: 'terry',
      pattern: 'solid',
      fit: 'regular',
      front: { text: '', textColor: '#EDEAE2', font: 'serif', fontSize: 18, stamp: 'none', stampColor: '#EDEAE2', x: 50, y: 46, scale: 1.0 }
    }
  },
  {
    id: 'shop-3',
    name: 'Court Polo',
    category: 'polo',
    group: 'unisex',
    price: 699,
    rating: 4.8,
    reviews: 119,
    tag: 'Polo • Pique',
    subtitle: 'Pique knit with a two-button placket.',
    preset: {
      garment: 'polo',
      color: '#28364F',
      fabric: 'cotton',
      pattern: 'solid',
      fit: 'regular',
      front: { text: '', textColor: '#EDEAE2', font: 'sans', fontSize: 16, stamp: 'none', stampColor: '#EDEAE2', x: 60, y: 38, scale: 0.75 }
    }
  },
  {
    id: 'shop-4',
    name: 'Summer Tank',
    category: 'tank',
    group: 'unisex',
    price: 399,
    rating: 4.8,
    reviews: 96,
    tag: 'Tank Top • Jersey',
    subtitle: 'Light jersey for warm days.',
    preset: {
      garment: 'tank',
      color: '#C27D52',
      fabric: 'cotton',
      pattern: 'solid',
      fit: 'regular',
      front: { text: '', textColor: '#EDEAE2', font: 'sans', fontSize: 16, stamp: 'none', stampColor: '#EDEAE2', x: 50, y: 44, scale: 0.9 }
    }
  },
  {
    id: 'shop-5',
    name: 'Heavy Tee',
    category: 'tee',
    group: 'unisex',
    price: 599,
    rating: 4.9,
    reviews: 210,
    tag: 'T-Shirt • 240 GSM',
    subtitle: '240 GSM cotton with a boxy cut.',
    preset: {
      garment: 'tee',
      color: '#1E1E22',
      fabric: 'cotton',
      pattern: 'solid',
      fit: 'oversized',
      front: { text: '', textColor: '#EDEAE2', font: 'sans', fontSize: 18, stamp: 'none', stampColor: '#EDEAE2', x: 50, y: 44, scale: 1.0 }
    }
  },
  {
    id: 'shop-6',
    name: 'Pullover Hoodie',
    category: 'hoodie',
    group: 'unisex',
    price: 1299,
    rating: 4.9,
    reviews: 158,
    tag: 'Hoodie • Heavyweight',
    subtitle: 'Double-lined hood, ribbed cuffs.',
    preset: {
      garment: 'hoodie',
      color: '#A86428',
      fabric: 'terry',
      pattern: 'solid',
      fit: 'oversized',
      front: { text: '', textColor: '#EDEAE2', font: 'serif', fontSize: 18, stamp: 'none', stampColor: '#EDEAE2', x: 50, y: 46, scale: 1.0 }
    }
  },
  {
    id: 'shop-7',
    name: 'Club Polo',
    category: 'polo',
    group: 'unisex',
    price: 749,
    rating: 4.8,
    reviews: 88,
    tag: 'Polo • Tailored',
    subtitle: 'Tailored collar, ribbed cuffs.',
    preset: {
      garment: 'polo',
      color: '#EDEAE2',
      fabric: 'linen',
      pattern: 'solid',
      fit: 'slim',
      front: { text: '', textColor: '#1E1E22', font: 'serif', fontSize: 16, stamp: 'none', stampColor: '#1E1E22', x: 60, y: 38, scale: 0.75 }
    }
  },
  {
    id: 'shop-8',
    name: 'Gym Tank',
    category: 'tank',
    group: 'unisex',
    price: 449,
    rating: 4.7,
    reviews: 104,
    tag: 'Tank Top • Active',
    subtitle: 'Quick-dry fabric, deep armholes.',
    preset: {
      garment: 'tank',
      color: '#6F7D8C',
      fabric: 'ripstop',
      pattern: 'solid',
      fit: 'slim',
      front: { text: '', textColor: '#EDEAE2', font: 'mono', fontSize: 16, stamp: 'none', stampColor: '#EDEAE2', x: 50, y: 44, scale: 0.9 }
    }
  },
  {
    id: 'shop-w1',
    name: 'Lilac Puff-Sleeve Crop Top',
    category: 'top',
    group: 'women',
    price: 1019,
    rating: 4.9,
    reviews: 164,
    tag: "Women's Studio Top",
    subtitle: 'Sculpted puff sleeves with cropped tailored hem.',
    preset: {
      garment: 'top',
      color: '#B799FF',
      fabric: 'cotton',
      pattern: 'solid',
      fit: 'regular',
      sleeve: 'puff',
      garmentLength: 'crop',
      front: { text: '', textColor: '#1E1E22', font: 'serif', fontSize: 17, stamp: 'none', stampColor: '#1E1E22', x: 50, y: 42, scale: 0.95 }
    }
  },
  {
    id: 'shop-w2',
    name: 'Obsidian Pleated Midi Skirt',
    category: 'skirt',
    group: 'women',
    price: 1219,
    rating: 4.8,
    reviews: 112,
    tag: "Women's Skirt",
    subtitle: 'Knife-pleated A-line drape with structured waistband.',
    preset: {
      garment: 'skirt',
      color: '#1E1E22',
      fabric: 'linen',
      pattern: 'solid',
      fit: 'regular',
      garmentLength: 'midi',
      front: { text: '', textColor: '#B799FF', font: 'serif', fontSize: 16, stamp: 'none', stampColor: '#B799FF', x: 60, y: 44, scale: 0.85 }
    }
  },
  {
    id: 'shop-w3',
    name: 'Atelier Flared Babydoll Frock',
    category: 'frock',
    group: 'women',
    price: 1519,
    rating: 4.9,
    reviews: 138,
    tag: "Women's Frock",
    subtitle: 'Fitted bodice with gathered flare skirt & puff sleeves.',
    preset: {
      garment: 'frock',
      color: '#EDEAE2',
      fabric: 'linen',
      pattern: 'solid',
      fit: 'regular',
      sleeve: 'puff',
      garmentLength: 'knee',
      front: { text: '', textColor: '#882433', font: 'serif', fontSize: 18, stamp: 'none', stampColor: '#882433', x: 50, y: 40, scale: 0.9 }
    }
  },
  {
    id: 'shop-w4',
    name: 'Sage Emerald Flowing Maxi Dress',
    category: 'maxi',
    group: 'women',
    price: 1849,
    rating: 5.0,
    reviews: 94,
    tag: "Women's Maxi Dress",
    subtitle: 'Floor-sweeping tiered silhouette in organic linen.',
    preset: {
      garment: 'maxi',
      color: '#43533D',
      fabric: 'linen',
      pattern: 'solid',
      fit: 'regular',
      sleeve: 'cap',
      garmentLength: 'floor',
      front: { text: '', textColor: '#EDEAE2', font: 'serif', fontSize: 16, stamp: 'none', stampColor: '#EDEAE2', x: 50, y: 38, scale: 0.85 }
    }
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Aarav Mehta',
    role: 'Verified Designer',
    rating: 5,
    tag: 'Live Preview & Print Quality',
    comment: 'The front-and-back live preview matched my delivered oversized hoodie down to the exact placement. The 380 GSM French Terry feels luxury.',
    date: '2 days ago'
  },
  {
    id: 'rev-2',
    author: 'Riya Kapoor',
    role: 'Fashion Student',
    rating: 5,
    tag: 'Ease of Customization',
    comment: 'Love the Undo/Redo history and style recommendations! Switched from a plain tee to a lilac acid-wash shirt in seconds.',
    date: '5 days ago'
  },
  {
    id: 'rev-3',
    author: 'Kabir Sharma',
    role: 'Streetwear Collector',
    rating: 4,
    tag: 'Fabric & Fit',
    comment: 'Being able to toggle between Slim, Regular, and Oversized silhouettes before ordering prevented me from picking the wrong size.',
    date: '1 week ago'
  }
];

const HCI_PRINCIPLES = [
  {
    title: '1. User-Friendly Interface',
    desc: 'Streamlined top navigation bar, clear icon-labeled studio tabs, and one-click entry from the Hero mini-widget into the full Design Lab.'
  },
  {
    title: '2. Immediate Feedback',
    desc: 'Every color swatch, fabric weave, pattern, text edit, and drag placement updates the front/back garment preview in real time (<16ms).'
  },
  {
    title: '3. Consistency',
    desc: 'Unified obsidian-and-lavender palette, editorial serif headings, consistent card radii, and predictable action button placement across all 9 pages.'
  },
  {
    title: '4. Visibility of System Status',
    desc: 'Active side indicator (Front/Back), live price breakdown, print-safe zone boundaries, and real-time cart/wishlist badge counters.'
  },
  {
    title: '5. User Control & Freedom',
    desc: 'Full Undo (Ctrl+Z), Redo (Ctrl+Y), and one-click Reset Canvas history stack so users can experiment without fear.'
  },
  {
    title: '6. Error Prevention',
    desc: 'Proactive warnings if size is unselected, artwork approaches print seams, or a view has zero customization.'
  },
  {
    title: '7. Accessibility & Contrast',
    desc: 'High-contrast Dark/Light theme toggle, ARIA-labeled controls, readable typography, and generous touch targets.'
  },
  {
    title: '8. Flexibility & Efficiency',
    desc: 'Customize via quick-presets, precision sliders, direct drag-and-drop canvas positioning, or custom image upload.'
  }
];

const createDefaultDesign = (overrides = {}) => {
  const garment = overrides.garment || 'tee';
  const defaultLengthByGarment = {
    top: 'regular',
    skirt: 'midi',
    dress: 'knee',
    frock: 'knee',
    maxi: 'floor'
  };
  return {
    id: `design-${Date.now()}`,
    name: overrides.name || 'Custom Studio Piece',
    garment,
    color: overrides.color || '#F4F3F6',
    fabric: overrides.fabric || 'cotton',
    pattern: overrides.pattern || 'solid',
    size: overrides.size || 'L',
    fit: overrides.fit || 'oversized',
    sleeve: overrides.sleeve || (garment === 'frock' ? 'puff' : garment === 'maxi' ? 'cap' : 'short'),
    garmentLength: overrides.garmentLength || defaultLengthByGarment[garment] || 'regular',
    front: {
      text: 'GOOD VIBES',
      textColor: '#18181B',
      font: 'sans',
      fontSize: 19,
      rotation: 0,
      stamp: 'smiley',
      stampColor: '#18181B',
      customImage: null,
      x: 50,
      y: 43,
      scale: 1.0,
      ...(overrides.front || {})
    },
    back: {
      text: 'LOOMLY',
      textColor: '#18181B',
      font: 'serif',
      fontSize: 20,
      rotation: 0,
      stamp: 'starburst',
      stampColor: '#18181B',
      customImage: null,
      x: 50,
      y: 38,
      scale: 1.15,
      ...(overrides.back || {})
    }
  };
};

// Calculate dynamic price based on garment, sleeve, length, fabric, pattern, and back print
const calculateDesignPrice = (design) => {
  const base = GARMENT_TYPES[design.garment]?.basePrice || 799;
  const fabricAdd = FABRICS.find((f) => f.id === design.fabric)?.priceAdd || 0;
  const patternAdd = PATTERNS.find((p) => p.id === design.pattern)?.priceAdd || 0;
  const hasSleeves = ['top', 'dress', 'frock', 'maxi'].includes(design.garment);
  const sleeveAdd = hasSleeves ? SLEEVE_OPTIONS.find((s) => s.id === design.sleeve)?.priceAdd || 0 : 0;
  const lenOpts = LENGTH_OPTIONS_BY_GARMENT[design.garment] || [];
  const lengthAdd = lenOpts.find((l) => l.id === design.garmentLength)?.priceAdd || 0;
  const hasBackPrint =
    (design.back?.text && design.back.text.trim().length > 0) ||
    (design.back?.stamp && design.back.stamp !== 'none') ||
    Boolean(design.back?.customImage);
  const backAdd = hasBackPrint ? 150 : 0;
  return base + fabricAdd + patternAdd + sleeveAdd + lengthAdd + backAdd;
};

// ============================================================================
// 2. CUSTOM VECTOR GRAPHICS & INTERACTIVE GARMENT SVG CANVAS
// ============================================================================

const FourPointStar = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 1L14.6 9.4L23 12L14.6 14.6L12 23L9.4 14.6L1 12L9.4 9.4L12 1Z" />
  </svg>
);

const VectorStampArt = ({ type, color = '#18181B', size = 46 }) => {
  switch (type) {
    case 'starburst':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path
            d="M32 2L37 22L58 14L43 30L62 40L40 41L46 61L32 45L18 61L24 41L2 40L21 30L6 14L27 22L32 2Z"
            stroke={color}
            strokeWidth="2.8"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.16"
          />
          <circle cx="32" cy="32" r="5" fill={color} />
        </svg>
      );
    case 'ribbon':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path
            d="M32 30C24 18 10 18 10 28C10 36 22 36 32 30ZM32 30C40 18 54 18 54 28C54 36 42 36 32 30Z"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M30 31L20 52M34 31L44 52" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="30" r="4" fill={color} />
        </svg>
      );
    case 'smiley':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="22" stroke={color} strokeWidth="3.2" />
          <circle cx="24" cy="26" r="2.8" fill={color} />
          <circle cx="40" cy="26" r="2.8" fill={color} />
          <path d="M22 36C25 43 39 43 42 36" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path
            d="M32 52C32 52 10 38 10 22C10 15 15.5 10 22 10C26.5 10 30.2 12.6 32 16.2C33.8 12.6 37.5 10 42 10C48.5 10 54 15 54 22C54 38 32 52 32 52Z"
            stroke={color}
            strokeWidth="3.2"
            fill={color}
            fillOpacity="0.18"
          />
        </svg>
      );
    case 'flower':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="32"
              cy="17"
              rx="6"
              ry="10"
              transform={`rotate(${deg} 32 32)`}
              stroke={color}
              strokeWidth="2.5"
              fill={color}
              fillOpacity="0.12"
            />
          ))}
          <circle cx="32" cy="32" r="6" fill={color} />
        </svg>
      );
    case 'checker':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <rect x="12" y="12" width="40" height="40" rx="6" stroke={color} strokeWidth="2.8" />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) =>
              (r + c) % 2 === 0 ? (
                <rect key={`${r}-${c}`} x={14 + c * 9} y={14 + r * 9} width="9" height="9" fill={color} />
              ) : null
            )
          )}
        </svg>
      );
    case 'bolt':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path
            d="M36 6L14 35H31L27 58L50 28H33L36 6Z"
            stroke={color}
            strokeWidth="2.8"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.2"
          />
        </svg>
      );
    default:
      return null;
  }
};

// Interactive & Static Realistic Garment Preview Canvas (Supports Front & Back + Drag Positioning)
const GarmentCanvas = ({
  design,
  side = 'front',
  interactive = false,
  showSafeZone = false,
  onUpdateLayer,
  onSelectForEdit,
  compact = false
}) => {
  const svgRef = useRef(null);
  const [dragMode, setDragMode] = useState(null); // 'move' | 'resize' | null
  const [is3DMode, setIs3DMode] = useState(false);
  const [threeLoaded, setThreeLoaded] = useState(() => Boolean(window.THREE));
  const threeMountRef = useRef(null);
  const threeStateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    garmentGroup: null,
    frontTex: null,
    backTex: null,
    rotY: 0.35,
    rotX: 0.08,
    isOrbiting: false,
    isDraggingDecal: false,
    prevX: 0,
    prevY: 0,
    rafId: null
  });
  const dragStartRef = useRef({ clientX: 0, clientY: 0, startX: 50, startY: 43, startScale: 1 });
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  // Load Three.js dynamically when 3D view is activated
  useEffect(() => {
    if (!is3DMode || window.THREE) {
      if (window.THREE) setThreeLoaded(true);
      return;
    }
    const existing = document.querySelector('script[data-threejs="true"]');
    if (existing) {
      existing.addEventListener('load', () => setThreeLoaded(true));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.dataset.threejs = 'true';
    script.onload = () => setThreeLoaded(true);
    document.head.appendChild(script);
  }, [is3DMode]);

  // Helper to paint current design (color + pattern + custom text + vector stamp/image) onto a high-res canvas texture
  const paintGarmentTexture = (targetSide) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const targetLayer = design[targetSide] || design.front;

    // Base Garment Color
    ctx.fillStyle = design.color || '#EDEAE2';
    ctx.fillRect(0, 0, 1024, 1024);

    // Surface Pattern Overlay
    if (design.pattern === 'pinstripe') {
      ctx.strokeStyle = 'rgba(183, 153, 255, 0.45)';
      ctx.lineWidth = 4;
      for (let x = 0; x < 1024; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
    } else if (design.pattern === 'grid') {
      ctx.strokeStyle = 'rgba(158, 154, 168, 0.35)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 1024; i += 44) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 1024);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1024, i);
        ctx.stroke();
      }
    } else if (design.pattern === 'tiedye') {
      const grad = ctx.createRadialGradient(480, 440, 40, 512, 512, 560);
      grad.addColorStop(0, 'rgba(183, 153, 255, 0.65)');
      grad.addColorStop(0.5, 'rgba(109, 74, 255, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);
    } else if (design.pattern === 'camo') {
      ctx.fillStyle = 'rgba(183, 153, 255, 0.25)';
      for (let y = 60; y < 1024; y += 160) {
        for (let x = 60; x < 1024; x += 160) {
          ctx.beginPath();
          ctx.arc(x, y, 36, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Subtle woven fabric micro-grain
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let y = 0; y < 1024; y += 8) {
      ctx.fillRect(0, y, 1024, 2);
    }

    // Map layer (x%, y%, scale, rotation, text, stamp) onto chest/back print area
    const cx = ((targetLayer.x ?? 50) / 100) * 1024;
    const cy = ((targetLayer.y ?? 43) / 100) * 1024;
    const sc = (targetLayer.scale ?? 1) * 2.35;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(((targetLayer.rotation || 0) * Math.PI) / 180);
    ctx.scale(sc, sc);

    // Draw Vector Graphic on 3D Texture
    const ink = targetLayer.stampColor || targetLayer.textColor || '#18181B';
    if (!targetLayer.customImage && targetLayer.stamp && targetLayer.stamp !== 'none') {
      ctx.save();
      ctx.translate(0, targetLayer.text ? 34 : 0);
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      ctx.lineWidth = 4;

      if (targetLayer.stamp === 'starburst') {
        ctx.beginPath();
        for (let i = 0; i < 16; i++) {
          const r = i % 2 === 0 ? 46 : 16;
          const a = (i * Math.PI) / 8;
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
      } else if (targetLayer.stamp === 'smiley') {
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-11, -8, 4, 0, Math.PI * 2);
        ctx.arc(11, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 4, 18, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else if (targetLayer.stamp === 'heart') {
        ctx.beginPath();
        ctx.moveTo(0, 26);
        ctx.bezierCurveTo(-42, -4, -22, -34, 0, -14);
        ctx.bezierCurveTo(22, -34, 42, -4, 0, 26);
        ctx.stroke();
      } else if (targetLayer.stamp === 'bolt') {
        ctx.beginPath();
        ctx.moveTo(6, -34);
        ctx.lineTo(-22, 4);
        ctx.lineTo(-2, 4);
        ctx.lineTo(-8, 36);
        ctx.lineTo(22, -4);
        ctx.lineTo(2, -4);
        ctx.closePath();
        ctx.stroke();
      } else {
        // Default geometric emblem for ribbon/flower/checker
        ctx.strokeRect(-26, -26, 52, 52);
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw Custom Text on 3D Texture
    if (targetLayer.text) {
      const fontObj = FONT_STYLES.find((f) => f.id === targetLayer.font) || FONT_STYLES[1];
      ctx.fillStyle = targetLayer.textColor || '#18181B';
      ctx.font = `800 ${Math.round((targetLayer.fontSize || 18) * 1.45)}px ${fontObj.css}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(targetLayer.text, 0, targetLayer.stamp && targetLayer.stamp !== 'none' ? -24 : 0);
    }

    ctx.restore();
    return canvas;
  };

  // Initialize Three.js 3D Scene & Sculpted 3D Garment Mesh
  useEffect(() => {
    if (!is3DMode || !threeLoaded || !threeMountRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const container = threeMountRef.current;
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Three-Point Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(2.5, 3.5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb799ff, 0.55);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    const garmentGroup = new THREE.Group();
    scene.add(garmentGroup);

    const st = threeStateRef.current;
    st.scene = scene;
    st.camera = camera;
    st.renderer = renderer;
    st.garmentGroup = garmentGroup;

    // Ground Contact Shadow Disc
    const shadowGeo = new THREE.CircleGeometry(1.15, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = -1.45;
    scene.add(shadowDisc);

    // Animation Loop
    const animate = () => {
      st.rafId = requestAnimationFrame(animate);
      if (!st.isOrbiting && !st.isDraggingDecal) {
        st.rotY += 0.004; // Gentle turntable preview
      }
      garmentGroup.rotation.y = st.rotY;
      garmentGroup.rotation.x = st.rotX;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (st.rafId) cancelAnimationFrame(st.rafId);
      renderer.dispose();
    };
  }, [is3DMode, threeLoaded]);

  // Rebuild 3D Garment Geometry & Live Canvas Textures whenever design changes
  useEffect(() => {
    if (!is3DMode || !threeLoaded || !threeStateRef.current.garmentGroup || !window.THREE) return;
    const THREE = window.THREE;
    const group = threeStateRef.current.garmentGroup;

    // Clear previous meshes
    while (group.children.length > 0) {
      const child = group.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
      group.remove(child);
    }

    const fitObj = FITS.find((f) => f.id === design.fit) || FITS[1];
    const widthScale = fitObj.scaleX;

    const frontCanvas = paintGarmentTexture('front');
    const backCanvas = paintGarmentTexture('back');
    const frontTex = new THREE.CanvasTexture(frontCanvas);
    const backTex = new THREE.CanvasTexture(backCanvas);

    // Base solid material for sleeves/sides
    const baseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(design.color || '#EDEAE2'),
      roughness: design.fabric === 'terry' ? 0.88 : design.fabric === 'linen' ? 0.78 : 0.68,
      metalness: 0.04
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.68,
      metalness: 0.04
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.68,
      metalness: 0.04
    });

    // If user uploaded a custom image, asynchronously draw it onto the 3D texture
    ['front', 'back'].forEach((s) => {
      const imgUrl = design[s]?.customImage;
      if (!imgUrl) return;
      const img = new Image();
      img.onload = () => {
        const cvs = s === 'front' ? frontCanvas : backCanvas;
        const tex = s === 'front' ? frontTex : backTex;
        const ctx = cvs.getContext('2d');
        const lyr = design[s];
        const cx = ((lyr.x ?? 50) / 100) * 1024;
        const cy = ((lyr.y ?? 43) / 100) * 1024;
        const size = 210 * (lyr.scale ?? 1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(((lyr.rotation || 0) * Math.PI) / 180);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
        tex.needsUpdate = true;
      };
      img.src = imgUrl;
    });

    // Build 3D Garment Silhouette based on garment type
    const g = design.garment;
    const isDressLike = ['dress', 'frock', 'maxi', 'skirt'].includes(g);
    const isPants = g === 'trousers';

    if (isPants) {
      // 3D Waistband + Two Articulated Legs
      const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.56 * widthScale, 0.58 * widthScale, 0.35, 32), frontMat);
      waist.position.y = 0.85;
      group.add(waist);

      [-0.28 * widthScale, 0.28 * widthScale].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.26 * widthScale, 0.24 * widthScale, 1.85, 28), baseMat);
        leg.position.set(lx, -0.2, 0);
        leg.scale.set(1, 1, 0.72);
        group.add(leg);
      });
    } else if (g === 'skirt') {
      const skirtH = design.garmentLength === 'mini' ? 1.1 : design.garmentLength === 'maxi' ? 2.1 : 1.6;
      const botR = design.garmentLength === 'mini' ? 0.72 : design.garmentLength === 'maxi' ? 1.05 : 0.88;
      const skirtMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.52 * widthScale, botR * widthScale, skirtH, 36, 1, false),
        frontMat
      );
      skirtMesh.scale.set(1, 1, 0.68);
      group.add(skirtMesh);
    } else {
      // Sculpted 3D Torso (Top, Tee, Polo, Tank, Hoodie, Shirt, Dress, Frock, Maxi)
      const torsoH =
        g === 'maxi' ? 2.35 : g === 'dress' || g === 'frock' ? 1.95 : g === 'top' && design.garmentLength === 'crop' ? 1.15 : 1.65;
      const topR = 0.58 * widthScale;
      const botR = isDressLike ? (g === 'frock' ? 0.98 : 0.86) * widthScale : 0.62 * widthScale;

      const torsoGeo = new THREE.CylinderGeometry(topR, botR, torsoH, 40, 12, false);
      const torsoMesh = new THREE.Mesh(torsoGeo, baseMat);
      torsoMesh.scale.set(1, 1, 0.62); // Natural anatomical chest depth
      group.add(torsoMesh);

      // Curved Front & Back Graphic Print Panels hugging the 3D chest & back
      const panelH = Math.min(1.35, torsoH * 0.82);
      const frontPanelGeo = new THREE.CylinderGeometry(
        topR + 0.008,
        botR + 0.008,
        panelH,
        32,
        1,
        true,
        -Math.PI * 0.36,
        Math.PI * 0.72
      );
      const frontPanel = new THREE.Mesh(frontPanelGeo, frontMat);
      frontPanel.scale.set(1, 1, 0.63);
      frontPanel.position.y = isDressLike ? 0.25 : 0.04;
      group.add(frontPanel);

      const backPanelGeo = new THREE.CylinderGeometry(
        topR + 0.008,
        botR + 0.008,
        panelH,
        32,
        1,
        true,
        Math.PI - Math.PI * 0.36,
        Math.PI * 0.72
      );
      const backPanel = new THREE.Mesh(backPanelGeo, backMat);
      backPanel.scale.set(1, 1, 0.63);
      backPanel.position.y = isDressLike ? 0.25 : 0.04;
      group.add(backPanel);

      // Collar Ribbing / Polo Collar / Hood
      if (g === 'hoodie') {
        const hood = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), baseMat);
        hood.position.set(0, torsoH / 2 + 0.12, -0.06);
        hood.scale.set(1, 1.05, 0.9);
        group.add(hood);
      } else {
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 12, 32), baseMat);
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, torsoH / 2 - 0.02, 0.02);
        collar.scale.set(1, 0.75, 1);
        group.add(collar);
      }

      // 3D Sleeves (unless tank or sleeveless)
      const isSleeveless = g === 'tank' || (['top', 'dress', 'frock', 'maxi'].includes(g) && design.sleeve === 'sleeveless');
      if (!isSleeveless) {
        const isLong = g === 'hoodie' || (['top', 'dress', 'frock', 'maxi'].includes(g) && design.sleeve === 'long');
        const isPuff = ['top', 'dress', 'frock', 'maxi'].includes(g) && design.sleeve === 'puff';
        const isCap = ['top', 'dress', 'frock', 'maxi'].includes(g) && design.sleeve === 'cap';

        const sleeveLen = isLong ? 1.25 : isCap ? 0.32 : isPuff ? 0.44 : 0.56;
        const sleeveTopR = isPuff ? 0.26 : 0.21;
        const sleeveBotR = isLong ? 0.14 : isPuff ? 0.17 : 0.18;

        [-1, 1].forEach((dir) => {
          const slGeo = new THREE.CylinderGeometry(sleeveTopR, sleeveBotR, sleeveLen, 24);
          const slMesh = new THREE.Mesh(slGeo, baseMat);
          const angle = isLong ? 0.38 : 0.68;
          slMesh.rotation.z = dir * angle;
          slMesh.position.set(
            dir * (topR + Math.sin(angle) * (sleeveLen * 0.45) - 0.04),
            torsoH / 2 - Math.cos(angle) * (sleeveLen * 0.45) - 0.08,
            0
          );
          slMesh.scale.set(1, 1, 0.75);
          group.add(slMesh);
        });
      }
    }
  }, [is3DMode, threeLoaded, design]);

  // 3D Mouse/Touch Interaction: Left-drag orbits 360°, Shift+Drag or Right-Drag moves artwork across 3D garment
  const handle3DPointerDown = (e) => {
    const st = threeStateRef.current;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    st.prevX = clientX;
    st.prevY = clientY;
    if (e.shiftKey || e.button === 2) {
      st.isDraggingDecal = true;
    } else {
      st.isOrbiting = true;
    }
  };

  const handle3DPointerMove = (e) => {
    const st = threeStateRef.current;
    if (!st.isOrbiting && !st.isDraggingDecal) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - st.prevX;
    const dy = clientY - st.prevY;
    st.prevX = clientX;
    st.prevY = clientY;

    if (st.isDraggingDecal && onUpdateLayer) {
      const curLayer = design[side] || design.front;
      const nextX = Math.max(22, Math.min(78, Math.round((curLayer.x ?? 50) + dx * 0.25)));
      const nextY = Math.max(22, Math.min(78, Math.round((curLayer.y ?? 43) + dy * 0.25)));
      onUpdateLayer({ x: nextX, y: nextY });
    } else if (st.isOrbiting) {
      st.rotY += dx * 0.012;
      st.rotX = Math.max(-0.55, Math.min(0.55, st.rotX + dy * 0.008));
    }
  };

  const handle3DPointerUp = () => {
    threeStateRef.current.isOrbiting = false;
    threeStateRef.current.isDraggingDecal = false;
  };

  const garmentInfo = GARMENT_TYPES[design.garment] || GARMENT_TYPES.tee;
  const fitConfig = FITS.find((f) => f.id === design.fit) || FITS[1];
  const layer = design[side] || design.front;

  const startDrag = (e, mode = 'move') => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      clientX,
      clientY,
      startX: layer.x ?? 50,
      startY: layer.y ?? 43,
      startScale: layer.scale ?? 1
    };
    setDragMode(mode);
  };

  useEffect(() => {
    if (!dragMode || !interactive || !onUpdateLayer) return;

    const handleWindowMove = (e) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      // Account for preserveAspectRatio="xMidYMid meet" on 360x380 viewBox
      const scaleFactor = Math.min(rect.width / 360, rect.height / 380) || 1;
      const renderedW = 360 * scaleFactor;
      const renderedH = 380 * scaleFactor;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStartRef.current.clientX;
      const dy = clientY - dragStartRef.current.clientY;

      if (dragMode === 'move') {
        const deltaPctX = (dx / renderedW) * 100;
        const deltaPctY = (dy / renderedH) * 100;
        const clampedX = Math.max(22, Math.min(78, Math.round(dragStartRef.current.startX + deltaPctX)));
        const clampedY = Math.max(22, Math.min(78, Math.round(dragStartRef.current.startY + deltaPctY)));
        onUpdateLayer({ x: clampedX, y: clampedY });
      } else if (dragMode === 'resize') {
        const deltaScale = (dx + dy) / 140;
        const nextScale = Math.max(0.35, Math.min(1.85, Number((dragStartRef.current.startScale + deltaScale).toFixed(2))));
        onUpdateLayer({ scale: nextScale });
      }
    };

    const stop = () => setDragMode(null);
    window.addEventListener('mousemove', handleWindowMove);
    window.addEventListener('touchmove', handleWindowMove, { passive: false });
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, [dragMode, interactive, onUpdateLayer]);

  // Garment silhouettes: Realistic, tailored technical fashion flats with seamlines, ribbing & natural drape
  const renderGarmentShape = () => {
    const fillUrl = design.pattern === 'solid' ? design.color : `url(#pat-${design.pattern}-${uid})`;
    const isVeryDark = ['#18181B', '#1E1E22', '#28364F', '#2D3A30'].includes(design.color);
    const strokeCol = isVeryDark ? 'rgba(255,255,255,0.28)' : 'rgba(20,19,24,0.28)';
    const seamCol = isVeryDark ? 'rgba(255,255,255,0.16)' : 'rgba(20,19,24,0.16)';
    const shadowShade = isVeryDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.12)';
    const sleeveStyle = design.sleeve || 'short';
    const gLen = design.garmentLength || 'regular';

    // Tailored Women's Sleeve Paths with natural shoulder curves & cuff stitching
    const renderWomensSleeves = () => {
      switch (sleeveStyle) {
        case 'sleeveless':
          return null;
        case 'cap':
          return (
            <g fill={fillUrl} stroke={strokeCol} strokeWidth="1.75" strokeLinejoin="round">
              <path d="M126 76 C100 84 90 102 94 116 L120 120 Z" />
              <path d="M234 76 C260 84 270 102 266 116 L240 120 Z" />
            </g>
          );
        case 'puff':
          return (
            <g fill={fillUrl} stroke={strokeCol} strokeWidth="1.75" strokeLinejoin="round">
              <path d="M126 76 C88 66 76 110 94 134 L120 124 Z" />
              <path d="M234 76 C272 66 284 110 266 134 L240 124 Z" />
              <path d="M93 128 Q106 134 120 124" fill="none" stroke={seamCol} strokeWidth="1.3" />
              <path d="M267 128 Q254 134 240 124" fill="none" stroke={seamCol} strokeWidth="1.3" />
            </g>
          );
        case 'long':
          return (
            <g fill={fillUrl} stroke={strokeCol} strokeWidth="1.75" strokeLinejoin="round">
              <path d="M126 76 L68 232 L90 240 L120 128 Z" />
              <path d="M234 76 L292 232 L270 240 L240 128 Z" />
              <line x1="71" y1="224" x2="92" y2="232" stroke={seamCol} strokeWidth="1.4" />
              <line x1="289" y1="224" x2="268" y2="232" stroke={seamCol} strokeWidth="1.4" />
            </g>
          );
        case 'short':
        default:
          return (
            <g fill={fillUrl} stroke={strokeCol} strokeWidth="1.75" strokeLinejoin="round">
              <path d="M126 76 L76 130 L96 148 L120 124 Z" />
              <path d="M234 76 L284 130 L264 148 L240 124 Z" />
              <line x1="80" y1="126" x2="99" y2="144" stroke={seamCol} strokeWidth="1.3" />
              <line x1="280" y1="126" x2="261" y2="144" stroke={seamCol} strokeWidth="1.3" />
            </g>
          );
      }
    };

    switch (design.garment) {
      case 'polo':
        return (
          <g>
            {/* Left & Right Tailored Sleeves with Ribbed Cuffs */}
            <path
              d="M122 76 L62 128 L86 154 L116 132 L116 326 L244 326 L244 132 L274 154 L298 128 L238 76 C214 84 146 84 122 76 Z"
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            {/* Sleeve Armhole & Ribbed Cuff Seams */}
            <g stroke={seamCol} strokeWidth="1.35" fill="none">
              <path d="M122 76 C116 98 115 116 116 132" />
              <path d="M238 76 C244 98 245 116 244 132" />
              <line x1="67" y1="124" x2="90" y2="149" strokeWidth="3.5" stroke={strokeCol} opacity="0.45" />
              <line x1="293" y1="124" x2="270" y2="149" strokeWidth="3.5" stroke={strokeCol} opacity="0.45" />
              <line x1="116" y1="316" x2="244" y2="316" strokeDasharray="3 2" />
            </g>
            {side === 'front' ? (
              <g>
                {/* Inner Collar Band */}
                <path d="M144 74 C162 84 198 84 216 74 L208 92 L152 92 Z" fill={shadowShade} />
                {/* Two-Button Placket Box */}
                <rect x="173" y="88" width="14" height="58" rx="2" fill={fillUrl} stroke={strokeCol} strokeWidth="1.4" />
                <circle cx="180" cy="108" r="2.3" fill={strokeCol} />
                <circle cx="180" cy="130" r="2.3" fill={strokeCol} />
                {/* Fold-Over Pique Collar Flaps */}
                <path d="M144 74 L180 96 L156 112 L136 86 Z" fill={fillUrl} stroke={strokeCol} strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M216 74 L180 96 L204 112 L224 86 Z" fill={fillUrl} stroke={strokeCol} strokeWidth="1.6" strokeLinejoin="round" />
              </g>
            ) : (
              <g>
                <path d="M142 74 C164 82 196 82 218 74 L214 88 C194 94 166 94 146 88 Z" fill={fillUrl} stroke={strokeCol} strokeWidth="1.6" />
                <line x1="118" y1="108" x2="242" y2="108" stroke={seamCol} strokeWidth="1.2" />
              </g>
            )}
          </g>
        );

      case 'tank':
        return (
          <g>
            {/* Clean Athletic Tank Silhouette with Deep Scoop Neck & Straps */}
            <path
              d={
                side === 'front'
                  ? 'M130 68 L152 68 C156 116 204 116 208 68 L230 68 C228 112 234 134 242 146 L242 328 L118 328 L118 146 C126 134 132 112 130 68 Z'
                  : 'M130 68 L154 68 C162 96 198 96 206 68 L230 68 C228 112 234 134 242 146 L242 328 L118 328 L118 146 C126 134 132 112 130 68 Z'
              }
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            {/* Bound Neckline, Armhole Piping & Bottom Hem Stitching */}
            <g stroke={seamCol} strokeWidth="1.4" fill="none">
              {side === 'front' ? (
                <path d="M148 68 C153 122 207 122 212 68" />
              ) : (
                <path d="M150 68 C160 102 200 102 210 68" />
              )}
              <path d="M134 68 C132 114 138 136 146 148" />
              <path d="M226 68 C228 114 222 136 214 148" />
              <line x1="118" y1="316" x2="242" y2="316" strokeDasharray="3 2" />
            </g>
          </g>
        );

      case 'top': {
        const bottomY = gLen === 'crop' ? 208 : gLen === 'tunic' ? 314 : 262;
        const flareOut = gLen === 'tunic' ? 14 : gLen === 'crop' ? -4 : 4;
        return (
          <g>
            {renderWomensSleeves()}
            <path
              d={`M126 76 L118 124 L${114 - flareOut} ${bottomY} L${246 + flareOut} ${bottomY} L242 124 L234 76 C212 88 148 88 126 76 Z`}
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            {side === 'front' ? (
              <g fill="none">
                <path d="M144 77 C160 108 200 108 216 77" stroke={strokeCol} strokeWidth="2.8" strokeLinecap="round" />
                <path d="M141 79 C159 114 201 114 219 79" stroke={seamCol} strokeWidth="1.2" />
              </g>
            ) : (
              <path d="M144 77 C162 94 198 94 216 77" fill="none" stroke={strokeCol} strokeWidth="2.4" strokeLinecap="round" />
            )}
            <line
              x1={115 - flareOut}
              y1={bottomY - 9}
              x2={245 + flareOut}
              y2={bottomY - 9}
              stroke={seamCol}
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
          </g>
        );
      }

      case 'skirt': {
        const hemY = gLen === 'mini' ? 218 : gLen === 'maxi' ? 342 : 286;
        const hemSpread = gLen === 'mini' ? 40 : gLen === 'maxi' ? 74 : 58;
        return (
          <g>
            <path
              d={`M128 74 L232 74 L${232 + hemSpread} ${hemY} Q180 ${hemY + 10} ${128 - hemSpread} ${hemY} Z`}
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            <rect x="128" y="74" width="104" height="18" fill={shadowShade} stroke={strokeCol} strokeWidth="1.6" />
            <g stroke={seamCol} strokeWidth="1.3">
              <line x1="154" y1="92" x2={146 - hemSpread * 0.45} y2={hemY + 2} />
              <line x1="180" y1="92" x2="180" y2={hemY + 5} />
              <line x1="206" y1="92" x2={214 + hemSpread * 0.45} y2={hemY + 2} />
            </g>
          </g>
        );
      }

      case 'dress': {
        const hemY = gLen === 'midi' ? 322 : 276;
        return (
          <g>
            {renderWomensSleeves()}
            <path
              d={`M126 76 L118 124 L126 174 L104 ${hemY} Q180 ${hemY + 8} 256 ${hemY} L234 174 L242 124 L234 76 C212 88 148 88 126 76 Z`}
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            <path d="M126 174 Q180 182 234 174" fill="none" stroke={seamCol} strokeWidth="1.6" />
            {side === 'front' ? (
              <path d="M144 77 L180 112 L216 77" fill="none" stroke={strokeCol} strokeWidth="2.6" strokeLinejoin="round" />
            ) : (
              <line x1="180" y1="86" x2="180" y2="174" stroke={seamCol} strokeWidth="1.3" strokeDasharray="3 2" />
            )}
          </g>
        );
      }

      case 'frock': {
        const hemY = gLen === 'mini' ? 254 : 290;
        return (
          <g>
            {renderWomensSleeves()}
            <path
              d="M126 76 L118 124 L132 164 L228 164 L242 124 L234 76 C212 88 148 88 126 76 Z"
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            <path
              d={`M132 164 L84 ${hemY} Q108 ${hemY + 8} 132 ${hemY} Q156 ${hemY + 10} 180 ${hemY} Q204 ${hemY + 10} 228 ${hemY} Q252 ${hemY + 8} 276 ${hemY} L228 164 Z`}
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            <rect x="131" y="158" width="98" height="10" rx="3" fill={shadowShade} stroke={strokeCol} strokeWidth="1.4" />
            <g stroke={seamCol} strokeWidth="1.2">
              <line x1="154" y1="168" x2="132" y2={hemY} />
              <line x1="180" y1="168" x2="180" y2={hemY} />
              <line x1="206" y1="168" x2="228" y2={hemY} />
            </g>
            {side === 'front' && (
              <path d="M144 77 C160 106 200 106 216 77" fill="none" stroke={strokeCol} strokeWidth="2.6" strokeLinecap="round" />
            )}
          </g>
        );
      }

      case 'maxi': {
        const hemY = gLen === 'ankle' ? 326 : 350;
        return (
          <g>
            {renderWomensSleeves()}
            <path
              d={`M126 74 L118 122 L128 162 L88 ${hemY} Q180 ${hemY + 10} 272 ${hemY} L232 162 L242 122 L234 74 C212 88 148 88 126 74 Z`}
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            <path d="M128 162 Q180 170 232 162" fill="none" stroke={seamCol} strokeWidth="1.6" />
            <path d="M110 236 Q180 246 250 236" fill="none" stroke={seamCol} strokeWidth="1.3" strokeDasharray="4 3" />
            <path d="M96 294 Q180 304 264 294" fill="none" stroke={seamCol} strokeWidth="1.3" strokeDasharray="4 3" />
            {side === 'front' && (
              <path d="M144 75 L180 108 L216 75" fill="none" stroke={strokeCol} strokeWidth="2.5" strokeLinejoin="round" />
            )}
          </g>
        );
      }

      case 'hoodie':
        return (
          <g>
            {/* Structured Hoodie Torso & Long Set-In Sleeves */}
            <path
              d="M118 82 L68 124 L56 268 L80 274 L108 154 L108 328 L252 328 L252 154 L280 274 L304 268 L292 124 L242 82 C222 92 138 92 118 82 Z"
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            {/* Double-Lined Sculpted Hood */}
            {side === 'front' ? (
              <g>
                <path
                  d="M128 84 C132 42 228 42 232 84 C216 106 144 106 128 84 Z"
                  fill={fillUrl}
                  stroke={strokeCol}
                  strokeWidth="1.85"
                />
                <path
                  d="M138 82 C142 54 218 54 222 82 C206 100 154 100 138 82 Z"
                  fill={shadowShade}
                />
              </g>
            ) : (
              <g>
                <path
                  d="M126 84 C130 38 230 38 234 84 C234 120 126 120 126 84 Z"
                  fill={fillUrl}
                  stroke={strokeCol}
                  strokeWidth="1.85"
                />
                <line x1="180" y1="48" x2="180" y2="112" stroke={seamCol} strokeWidth="1.3" />
              </g>
            )}
            {/* Drawstrings, Armhole Seams, Kangaroo Pouch & Ribbed Waistband/Cuffs */}
            <g stroke={seamCol} strokeWidth="1.4" fill="none">
              <path d="M118 82 C110 108 108 132 108 154" />
              <path d="M242 82 C250 108 252 132 252 154" />
              {side === 'front' && (
                <>
                  <line x1="165" y1="102" x2="165" y2="136" stroke={strokeCol} strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="195" y1="102" x2="195" y2="136" stroke={strokeCol} strokeWidth="1.8" strokeLinecap="round" />
                  <path
                    d="M136 244 L224 244 L236 312 L124 312 Z"
                    fill={shadowShade}
                    stroke={strokeCol}
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </>
              )}
              {/* Ribbed Waistband & Sleeve Cuffs */}
              <rect x="108" y="312" width="144" height="16" fill={shadowShade} stroke={strokeCol} strokeWidth="1.4" />
              <path d="M58 254 L82 260 L80 274 L56 268 Z" fill={shadowShade} stroke={strokeCol} strokeWidth="1.3" />
              <path d="M302 254 L278 260 L280 274 L304 268 Z" fill={shadowShade} stroke={strokeCol} strokeWidth="1.3" />
            </g>
          </g>
        );

      case 'shirt':
        return (
          <g>
            <path
              d="M116 76 L54 134 L82 164 L112 140 L112 330 L248 330 L248 140 L278 164 L306 134 L244 76 L210 68 C196 84 164 84 150 68 Z"
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            {side === 'front' ? (
              <g stroke={strokeCol} strokeWidth="1.5" fill="none">
                <path d="M150 68 L180 108 L146 118 L136 80 Z" fill={shadowShade} />
                <path d="M210 68 L180 108 L214 118 L224 80 Z" fill={shadowShade} />
                <line x1="180" y1="108" x2="180" y2="330" stroke={seamCol} />
                {[142, 182, 222, 262, 302].map((by) => (
                  <circle key={by} cx="180" cy={by} r="2.2" fill={strokeCol} />
                ))}
              </g>
            ) : (
              <line x1="112" y1="112" x2="248" y2="112" stroke={seamCol} strokeWidth="1.4" />
            )}
          </g>
        );

      case 'trousers':
        return (
          <g>
            <path
              d="M116 58 L244 58 L264 344 L204 344 L180 176 L156 344 L96 344 Z"
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            <rect x="116" y="58" width="128" height="18" fill={shadowShade} stroke={strokeCol} strokeWidth="1.5" />
            <rect x="98" y="168" width="22" height="52" rx="3" fill={shadowShade} stroke={strokeCol} strokeWidth="1.4" />
            <rect x="240" y="168" width="22" height="52" rx="3" fill={shadowShade} stroke={strokeCol} strokeWidth="1.4" />
            {side === 'front' && (
              <line x1="180" y1="76" x2="180" y2="146" stroke={seamCol} strokeWidth="1.6" />
            )}
          </g>
        );

      case 'tee':
      default:
        return (
          <g>
            {/* Tailored Crewneck T-Shirt with Natural Shoulder Slope & Set-In Sleeves */}
            <path
              d="M122 74 L58 128 L84 156 L114 132 L114 328 L246 328 L246 132 L276 156 L302 128 L238 74 C216 86 144 86 122 74 Z"
              fill={fillUrl}
              stroke={strokeCol}
              strokeWidth="1.85"
              strokeLinejoin="round"
            />
            {/* Ribbed Crew Collar Band */}
            {side === 'front' ? (
              <g fill="none">
                <path
                  d="M142 75 C156 102 204 102 218 75"
                  stroke={strokeCol}
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
                <path
                  d="M142 75 C156 102 204 102 218 75"
                  stroke={shadowShade}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path d="M138 77 C154 108 206 108 222 77" stroke={seamCol} strokeWidth="1.1" />
              </g>
            ) : (
              <g fill="none">
                <path
                  d="M142 75 C162 87 198 87 218 75"
                  stroke={strokeCol}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path d="M140 77 C160 91 200 91 220 77" stroke={seamCol} strokeWidth="1.1" />
              </g>
            )}
            {/* Armhole, Sleeve Cuff & Twin-Needle Bottom Hem Stitching */}
            <g stroke={seamCol} strokeWidth="1.25" fill="none">
              <path d="M122 74 C115 96 114 114 114 132" />
              <path d="M238 74 C245 96 246 114 246 132" />
              <line x1="63" y1="124" x2="88" y2="151" strokeDasharray="2.5 2" />
              <line x1="297" y1="124" x2="272" y2="151" strokeDasharray="2.5 2" />
              <line x1="114" y1="318" x2="246" y2="318" strokeDasharray="3 2" />
            </g>
          </g>
        );
    }
  };

  const posX = (layer.x / 100) * 360;
  const posY = (layer.y / 100) * 380;
  const fontObj = FONT_STYLES.find((f) => f.id === layer.font) || FONT_STYLES[1];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 2D / 3D Interactive Mode Pill inside Studio Canvas */}
      {interactive && (
        <button
          type="button"
          onClick={() => setIs3DMode((v) => !v)}
          className={`absolute top-2.5 right-2.5 z-20 px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 shadow-md ${
            is3DMode
              ? 'bg-[#B799FF] text-[#121116] border-[#B799FF]'
              : 'bg-[#17151D]/90 text-[#B799FF] border-[#B799FF]/40 hover:bg-[#B799FF] hover:text-[#121116]'
          }`}
        >
          <Maximize2 className="w-3 h-3" />
          <span>{is3DMode ? '2D Flat Edit' : '3D Studio View'}</span>
        </button>
      )}

      {is3DMode ? (
        <div
          className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handle3DPointerDown}
          onMouseMove={handle3DPointerMove}
          onMouseUp={handle3DPointerUp}
          onMouseLeave={handle3DPointerUp}
          onTouchStart={handle3DPointerDown}
          onTouchMove={handle3DPointerMove}
          onTouchEnd={handle3DPointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div ref={threeMountRef} className="w-full h-full" />
          {!threeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-[#B799FF]">
              Initializing 3D Studio Engine...
            </div>
          )}
          <div className="absolute top-2.5 left-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-[10px] text-white/90 pointer-events-none">
            Drag: Rotate 360° • Shift+Drag: Move Print
          </div>
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox="0 0 360 380"
          className={`w-full h-full select-none ${dragMode === 'move' ? 'cursor-grabbing' : ''}`}
          role="img"
          aria-label={`${design.name} ${side} preview`}
        >
          <defs>
            {/* Surface Fabric Patterns */}
            <pattern id={`pat-pinstripe-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill={design.color} />
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(183, 153, 255, 0.35)" strokeWidth="1.5" />
            </pattern>
            <pattern id={`pat-grid-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill={design.color} />
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(158, 154, 168, 0.3)" strokeWidth="1" />
            </pattern>
            <radialGradient id={`pat-tiedye-${uid}`} cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#B799FF" stopOpacity="0.65" />
              <stop offset="50%" stopColor={design.color} stopOpacity="0.92" />
              <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0.45" />
            </radialGradient>
            <pattern id={`pat-camo-${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill={design.color} />
              <circle cx="12" cy="14" r="8" fill="rgba(183, 153, 255, 0.22)" />
              <circle cx="30" cy="28" r="10" fill="rgba(255, 255, 255, 0.12)" />
            </pattern>

            {/* Studio Lighting & Soft Shadow */}
            <linearGradient id={`shade-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.16" />
              <stop offset="22%" stopColor="#FFFFFF" stopOpacity="0.06" />
              <stop offset="78%" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
            <filter id={`drop-${uid}`} x="-15%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000000" floodOpacity="0.38" />
            </filter>
          </defs>

          {/* Garment Silhouette Group */}
          <g
            filter={`url(#drop-${uid})`}
            transform={`translate(180, 190) scale(${fitConfig.scaleX}, 1) translate(-180, -190)`}
          >
            {renderGarmentShape()}
            {/* Subtle fabric lighting overlay */}
            <rect
              x="40"
              y="40"
              width="280"
              height="310"
              fill={`url(#shade-${uid})`}
              style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
            />
          </g>

          {/* Print-Safe Zone Overlay */}
          {showSafeZone && !compact && (
            <g>
              <rect
                x={garmentInfo.printZone.x}
                y={garmentInfo.printZone.y}
                width={garmentInfo.printZone.w}
                height={garmentInfo.printZone.h}
                rx="8"
                fill="none"
                stroke="#B799FF"
                strokeWidth="1.4"
                strokeDasharray="5 4"
              />
              <text
                x={garmentInfo.printZone.x + garmentInfo.printZone.w / 2}
                y={garmentInfo.printZone.y - 6}
                textAnchor="middle"
                fill="#B799FF"
                fontSize="9"
                fontWeight="600"
              >
                PRINT SAFE ZONE
              </text>
            </g>
          )}

          {/* Draggable Custom Artwork + Typography Layer */}
          <g
            transform={`translate(${posX}, ${posY}) scale(${layer.scale}) rotate(${layer.rotation || 0})`}
            onMouseDown={(e) => startDrag(e, 'move')}
            onTouchStart={(e) => startDrag(e, 'move')}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (onSelectForEdit) onSelectForEdit();
            }}
            style={{ cursor: interactive ? (dragMode === 'move' ? 'grabbing' : 'grab') : 'default' }}
          >
            {/* Large Invisible Grab Hit-Area for effortless mouse dragging */}
            {interactive && (
              <rect x="-66" y="-52" width="132" height="104" fill="transparent" />
            )}

            {/* Selection Bounding Box when Interactive */}
            {interactive && (
              <rect
                x="-64"
                y="-50"
                width="128"
                height="100"
                rx="8"
                fill={dragMode ? 'rgba(183, 153, 255, 0.08)' : 'none'}
                stroke={dragMode ? '#B799FF' : 'rgba(183, 153, 255, 0.55)'}
                strokeWidth={dragMode ? '1.8' : '1.2'}
                strokeDasharray="4 3"
              />
            )}

            {/* Custom Uploaded Image */}
            {layer.customImage && (
              <image
                href={layer.customImage}
                x="-42"
                y={layer.text ? '-14' : '-42'}
                width="84"
                height="84"
                preserveAspectRatio="xMidYMid meet"
              />
            )}

            {/* Built-In Vector Graphic Stamp */}
            {!layer.customImage && layer.stamp && layer.stamp !== 'none' && (
              <g transform={`translate(-23, ${layer.text ? 2 : -23})`}>
                <VectorStampArt type={layer.stamp} color={layer.stampColor || layer.textColor} size={46} />
              </g>
            )}

            {/* Custom Typography */}
            {layer.text && (
              <text
                x="0"
                y={layer.stamp !== 'none' || layer.customImage ? '-10' : '6'}
                textAnchor="middle"
                fill={layer.textColor}
                fontSize={layer.fontSize || 18}
                fontWeight="800"
                letterSpacing="0.06em"
                style={{ fontFamily: fontObj.css }}
              >
                {layer.text}
              </text>
            )}

            {/* Interactive Corner Resize Handle */}
            {interactive && (
              <g
                transform="translate(64, 50)"
                onMouseDown={(e) => startDrag(e, 'resize')}
                onTouchStart={(e) => startDrag(e, 'resize')}
                style={{ cursor: 'nwse-resize' }}
              >
                <circle cx="0" cy="0" r="8" fill="#B799FF" stroke="#121116" strokeWidth="2" />
                <path d="M-3 -3 L3 3 M3 -1 L3 3 L-1 3" stroke="#121116" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
          </g>
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Navigation & Theme State
  const [activePage, setActivePage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Customizer Studio State + Undo/Redo History Stack (HCI: User Control & Freedom)
  const [history, setHistory] = useState(() => [createDefaultDesign()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const design = history[historyIndex];

  const [activeSide, setActiveSide] = useState('front');
  const [studioTab, setStudioTab] = useState('garment');
  const [showSafeZone, setShowSafeZone] = useState(true);

  // Shop Filter State
  const [shopCategoryFilter, setShopCategoryFilter] = useState('all');
  const [shopSort, setShopSort] = useState('featured');

  // Saved Designs, Wishlist, Cart & Orders
  const [savedDesigns, setSavedDesigns] = useState(() => [
    createDefaultDesign({
      id: 'saved-1',
      name: 'Good Vibes Oversized Tee',
      garment: 'tee',
      color: '#F4F3F6',
      size: 'L',
      fit: 'oversized'
    }),
    createDefaultDesign({
      id: 'saved-2',
      name: 'Lilac Puff Crop Top',
      garment: 'top',
      color: '#B799FF',
      fabric: 'cotton',
      sleeve: 'puff',
      garmentLength: 'crop',
      size: 'M',
      fit: 'regular',
      front: { text: 'ATELIER', textColor: '#18181B', font: 'serif', fontSize: 17, stamp: 'ribbon', stampColor: '#18181B', x: 50, y: 42, scale: 0.95 }
    })
  ]);

  const [wishlist, setWishlist] = useState(() => [INITIAL_SHOP_ITEMS[0], INITIAL_SHOP_ITEMS[8]]);
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Aanya Verma',
    email: 'aanya.verma@loomly.studio',
    preferredSize: 'L',
    preferredFit: 'oversized',
    favoriteStyle: 'Streetwear & Minimalist Graphics'
  });

  const [orders, setOrders] = useState([
    {
      id: 'SC-89412',
      date: '14 Nov 2026',
      status: 'Delivered',
      total: 1549,
      items: [createDefaultDesign({ name: 'Midnight Starburst Hoodie', garment: 'hoodie', color: '#18181B' })]
    }
  ]);

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Helper: Show Non-Intrusive Feedback Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Helper: Push new state onto Undo/Redo stack
  const commitDesignChange = (updater) => {
    setHistory((prev) => {
      const current = prev[historyIndex];
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, next];
    });
    setHistoryIndex((idx) => idx + 1);
  };

  // Helper: Live update without flooding history stack during continuous drag
  const updateDesignLive = (updater) => {
    setHistory((prev) => {
      const copy = [...prev];
      const current = copy[historyIndex];
      copy[historyIndex] = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      return copy;
    });
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    setHistoryIndex((i) => i - 1);
    showToast('Undid last customization step', 'info');
  };

  const handleRedo = () => {
    if (!canRedo) return;
    setHistoryIndex((i) => i + 1);
    showToast('Redid customization step', 'info');
  };

  const handleResetDesign = () => {
    commitDesignChange(createDefaultDesign({ garment: design.garment, name: design.name }));
    showToast('Canvas reset to clean studio base', 'info');
  };

  // Keyboard shortcuts for Undo / Redo
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Load any preset/saved design into the Customizer Studio
  const openInCustomizer = (presetDesign) => {
    const loaded = createDefaultDesign(presetDesign);
    setHistory([loaded]);
    setHistoryIndex(0);
    setActiveSide('front');
    setActivePage('customize');
    showToast(`Loaded "${loaded.name}" into Design Lab`);
  };

  // Save current design to "My Designs"
  const saveCurrentDesign = () => {
    const copy = {
      ...JSON.parse(JSON.stringify(design)),
      id: `design-${Date.now()}`
    };
    setSavedDesigns((prev) => [copy, ...prev]);
    showToast(`Saved "${copy.name}" to My Designs!`);
  };

  // Add item to Cart with Error Prevention check
  const addToCart = (itemDesign, qty = 1) => {
    if (!itemDesign.size) {
      showToast('Please select a garment size (XS–XXL) before adding to bag!', 'error');
      setStudioTab('fit');
      return;
    }
    const unitPrice = itemDesign.price || calculateDesignPrice(itemDesign);
    setCart((prev) => [
      ...prev,
      {
        cartId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        design: JSON.parse(JSON.stringify(itemDesign)),
        price: unitPrice,
        qty
      }
    ]);
    showToast(`Added "${itemDesign.name}" (${itemDesign.size}) to your bag!`);
  };

  const toggleWishlistShopItem = (shopItem) => {
    const exists = wishlist.some((w) => w.id === shopItem.id);
    if (exists) {
      setWishlist((prev) => prev.filter((w) => w.id !== shopItem.id));
      showToast(`Removed "${shopItem.name}" from Wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, shopItem]);
      showToast(`Saved "${shopItem.name}" to Wishlist`);
    }
  };

  // AI Style Recommendations Engine based on current design
  const styleRecommendations = useMemo(() => {
    const recs = [];
    const isDarkGarment = ['#18181B', '#2D3A30', '#1E293B'].includes(design.color);

    if (isDarkGarment) {
      recs.push({
        title: 'High-Contrast Lilac Street Pop',
        desc: 'Pair your dark base with our signature #B799FF lavender ink and Y2K Starburst graphic.',
        apply: () =>
          commitDesignChange((d) => ({
            ...d,
            [activeSide]: { ...d[activeSide], textColor: '#B799FF', stampColor: '#B799FF', stamp: 'starburst' }
          }))
      });
    } else {
      recs.push({
        title: 'Editorial Noir Contrast',
        desc: 'Use deep obsidian #18181B typography with Heavy French Terry fabric for crisp gallery contrast.',
        apply: () =>
          commitDesignChange((d) => ({
            ...d,
            fabric: 'terry',
            [activeSide]: { ...d[activeSide], textColor: '#18181B', stampColor: '#18181B' }
          }))
      });
    }

    if (design.garment === 'tee') {
      recs.push({
        title: 'Upgrade to Drop-Shoulder Hoodie',
        desc: 'Keep your exact artwork & colors on our 380 GSM heavyweight fleece hoodie silhouette.',
        apply: () => commitDesignChange((d) => ({ ...d, garment: 'hoodie', fit: 'oversized' }))
      });
    } else if (['top', 'dress', 'frock', 'maxi'].includes(design.garment)) {
      recs.push({
        title: 'Romantic Puff-Sleeve Atelier Edit',
        desc: 'Elevate your silhouette with sculpted puff sleeves and breathable organic linen blend.',
        apply: () =>
          commitDesignChange((d) => ({
            ...d,
            sleeve: 'puff',
            fabric: 'linen',
            [activeSide]: { ...d[activeSide], stamp: 'ribbon', font: 'serif' }
          }))
      });
    } else if (design.garment === 'skirt') {
      recs.push({
        title: 'Flowing Pleated Midi Drape',
        desc: 'Switch to a mid-calf pleated cut in Lilac Haze with minimal editorial typography.',
        apply: () =>
          commitDesignChange((d) => ({
            ...d,
            garmentLength: 'midi',
            color: '#B799FF',
            [activeSide]: { ...d[activeSide], textColor: '#18181B', stampColor: '#18181B' }
          }))
      });
    } else {
      recs.push({
        title: 'Minimalist Left-Chest Placement',
        desc: 'Scale artwork to 0.7x and align to left chest for an understated luxury streetwear look.',
        apply: () =>
          commitDesignChange((d) => ({
            ...d,
            [activeSide]: { ...d[activeSide], x: 60, y: 36, scale: 0.7 }
          }))
      });
    }

    recs.push({
      title: 'Acid-Wash / Tie-Dye Finish',
      desc: 'Add an artisan wash pattern to elevate solid garments into one-of-one pieces.',
      apply: () => commitDesignChange((d) => ({ ...d, pattern: 'tiedye' }))
    });

    return recs;
  }, [design, activeSide]);

  // HCI Error Prevention Warnings
  const validationWarnings = useMemo(() => {
    const warnings = [];
    const curLayer = design[activeSide];
    if (!design.size) warnings.push('No size selected. Choose XS–XXL in the Size & Fit tab.');
    if (curLayer.x < 30 || curLayer.x > 70 || curLayer.y < 28 || curLayer.y > 68) {
      warnings.push('Artwork is close to the garment seam edge. Center it for cleanest print results.');
    }
    if (!curLayer.text && curLayer.stamp === 'none' && !curLayer.customImage) {
      warnings.push(`The ${activeSide.toUpperCase()} view currently has no text or graphic applied.`);
    }
    return warnings;
  }, [design, activeSide]);

  // Theme Utility Classes
  const bgPage = darkMode ? 'bg-[#0D0C10] text-[#F4F3F6]' : 'bg-[#F7F6FA] text-[#141318]';
  const bgCard = darkMode
    ? 'bg-[#17151D] border-white/[0.08]'
    : 'bg-white border-black/[0.08] shadow-sm';
  const bgSubtle = darkMode
    ? 'bg-[#211E29] border-white/[0.08]'
    : 'bg-[#EFEDF5] border-black/[0.08]';
  const textMuted = darkMode ? 'text-[#9E9AA8]' : 'text-[#5C5866]';

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'customize', label: 'Customize' },
    { id: 'designs', label: 'My Designs' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartDiscount = promoApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const cartShipping = cartSubtotal - cartDiscount >= 999 || cartSubtotal === 0 ? 0 : 99;
  const cartGrandTotal = cartSubtotal - cartDiscount + cartShipping;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgPage}`} style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Google Fonts Import for Playfair Display & Plus Jakarta Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-editorial { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      {/* Non-Intrusive Feedback Toast (HCI: Immediate Feedback) */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl transition-all ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-100'
              : 'bg-[#1C1924]/95 border-[#B799FF]/40 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#B799FF] shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-3xl border p-6 ${bgCard}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-editorial text-2xl font-bold">Universal Fit & Size Chart</h3>
              <button onClick={() => setSizeGuideOpen(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Close Size Chart">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-xs mb-4 ${textMuted}`}>
              Measurements in inches. Choose <strong>Oversized</strong> fit for a drop-shoulder streetwear drape (+2" chest).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[#B799FF]">
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest (in)</th>
                    <th className="py-2.5 px-3">Length (in)</th>
                    <th className="py-2.5 px-3">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['XS', '36"', '25.5"', '17.0"'],
                    ['S', '38"', '26.5"', '18.0"'],
                    ['M', '40"', '27.5"', '19.0"'],
                    ['L', '42"', '28.5"', '20.0"'],
                    ['XL', '44"', '29.5"', '21.0"'],
                    ['XXL', '46"', '30.5"', '22.0"']
                  ].map(([sz, ch, len, sh]) => (
                    <tr key={sz}>
                      <td className="py-2.5 px-3 font-bold">{sz}</td>
                      <td className="py-2.5 px-3">{ch}</td>
                      <td className="py-2.5 px-3">{len}</td>
                      <td className="py-2.5 px-3">{sh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          TOP NAVIGATION BAR (Matches Reference Screenshot Layout)
      ======================================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-opacity-85 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <FourPointStar className="w-5 h-5 text-[#B799FF] transition-transform duration-300 group-hover:rotate-45" />
            <span className="font-editorial text-2xl font-bold tracking-tight">Loomly</span>
          </button>

          {/* Center Navigation Links with Active Lilac Underline */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? darkMode
                        ? 'text-white'
                        : 'text-[#141318]'
                      : `${textMuted} hover:text-[#B799FF]`
                  }`}
                >
                  {link.label}
                  {link.id === 'wishlist' && wishlist.length > 0 && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[#B799FF]/20 text-[#B799FF]">
                      {wishlist.length}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#B799FF]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Utility Icons (Search, Profile, Shopping Bag) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-full hover:bg-white/[0.07] transition-colors"
              aria-label="Search Outfits"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActivePage('profile')}
              className={`p-2 rounded-full hover:bg-white/[0.07] transition-colors ${
                activePage === 'profile' ? 'text-[#B799FF]' : ''
              }`}
              aria-label="User Profile"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActivePage('cart')}
              className="relative p-2 rounded-full hover:bg-white/[0.07] transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B799FF] text-[#121116] text-[10px] font-bold flex items-center justify-center">
                {totalCartItems}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-full hover:bg-white/[0.07]"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expandable Quick Search Bar */}
        {searchOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${bgCard}`}>
              <Search className="w-4 h-4 text-[#B799FF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'shop') setActivePage('shop');
                }}
                placeholder="Search tees, hoodies, tops, dresses, frocks, skirts..."
                className="w-full bg-transparent text-sm focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-[#B799FF]">
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t px-4 py-3 space-y-1 ${bgCard}`}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                  activePage === link.id ? 'bg-[#B799FF]/15 text-[#B799FF]' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Sub-header Floating Theme Switcher Pill (Matches Screenshot Top-Right Toggle) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex justify-end">
        <div
          className={`inline-flex items-center gap-1 p-1 rounded-full border ${
            darkMode ? 'bg-[#17151D] border-white/10' : 'bg-white border-black/10 shadow-sm'
          }`}
          role="group"
          aria-label="Theme Switcher"
        >
          <button
            onClick={() => setDarkMode(false)}
            className={`p-1.5 rounded-full transition-colors ${
              !darkMode ? 'bg-[#B799FF] text-[#121116]' : 'text-[#9E9AA8] hover:text-white'
            }`}
            aria-label="Light Mode"
            title="High-Contrast Light Mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`p-1.5 rounded-full transition-colors ${
              darkMode ? 'bg-[#2C2836] text-white' : 'text-[#5C5866] hover:text-black'
            }`}
            aria-label="Dark Mode"
            title="Obsidian Dark Mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================
          PAGE 1: HOME LANDING PAGE (Exact Visual Match to Reference Screenshot)
      ======================================================================== */}
      {activePage === 'home' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* 1. HERO SECTION */}
          <section className="relative pt-4 pb-10 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Editorial Headline Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6 z-10">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium ${
                  darkMode ? 'bg-[#17151D] border-white/15 text-[#E5E3EC]' : 'bg-white border-black/10'
                }`}
              >
                <FourPointStar className="w-3.5 h-3.5 text-[#B799FF]" />
                <span>Your Style. Our Canvas.</span>
              </div>

              <div className="space-y-1">
                <h1 className="font-editorial text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.03] tracking-tight">
                  <span>Loom</span>
                  <span className="italic text-[#B799FF] font-semibold">ly</span>
                </h1>
                <p className="font-editorial text-3xl sm:text-4xl lg:text-[40px] font-semibold leading-tight pt-1">
                  Design. Wear. Repeat.
                </p>
              </div>

              <p className={`text-sm sm:text-base max-w-md leading-relaxed ${textMuted}`}>
                Create your own outfits with our easy customization tool and turn your ideas into fashion.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActivePage('customize')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#B799FF] hover:bg-[#A682FF] text-[#121116] font-semibold text-sm transition-all shadow-lg shadow-[#B799FF]/20"
                >
                  <span>Start Designing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Editorial Archway Portrait + Floating Editorial Cards (Matches image_4dbf27.jpg) */}
            <div className="lg:col-span-3 relative flex items-center justify-center min-h-[380px] py-2">
              {/* Subtle Thin Orbital Ring */}
              <div
                className="w-[310px] h-[310px] rounded-full border border-[#B799FF]/20 absolute pointer-events-none"
                aria-hidden="true"
              />

              {/* Floating Four-Point Sparkles */}
              <FourPointStar className="w-6 h-6 text-[#B799FF] absolute top-6 left-1 z-20" />
              <FourPointStar className="w-5 h-5 text-[#B799FF] absolute bottom-8 right-0 z-20" />

              {/* Deep Teal Arched Editorial Portrait */}
              <div className="relative z-10 w-60 sm:w-64 h-[355px] rounded-t-full rounded-b-2xl overflow-hidden bg-[#165963] shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85"
                  alt="Loomly Editorial Lookbook"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C10] via-transparent to-transparent opacity-65" />
              </div>

              {/* Top-Right Floating "THE CUSTOM EDIT" Card */}
              <div
                onClick={() => setActivePage('customize')}
                className="hidden sm:block absolute top-8 -right-4 z-20 w-44 p-3.5 bg-[#17151D]/95 backdrop-blur-md border border-white/10 shadow-2xl cursor-pointer hover:border-[#B799FF]/50 transition-colors"
              >
                <span className="block text-[9px] font-bold tracking-[0.14em] uppercase text-[#9E9AA8]">
                  THE CUSTOM EDIT
                </span>
                <p className="font-editorial text-sm font-bold text-white leading-snug mt-1">
                  Make it
                  <br />
                  uniquely yours
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B799FF] mt-2">
                  <span>Open studio</span>
                  <span>↗</span>
                </span>
              </div>

              {/* Bottom-Left Tilted Lilac Manifesto Badge */}
              <div className="absolute bottom-7 -left-3 z-20 px-3.5 py-2.5 bg-[#B799FF] text-[#121116] -rotate-6 shadow-[4px_5px_0px_#121116] border border-[#121116]/20 pointer-events-none">
                <p className="font-editorial text-[11px] font-extrabold leading-tight tracking-wide uppercase">
                  NOT JUST
                  <br />
                  AN OUTFIT.
                  <br />
                  <span className="italic">YOUR</span> OUTFIT.
                </p>
              </div>
            </div>

            {/* Right Interactive "Customize Your Outfit" Mini-Widget Card (4 cols) */}
            <div className="lg:col-span-4 z-10">
              <div className={`rounded-[28px] border p-5 sm:p-6 backdrop-blur-xl ${bgCard}`}>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${bgSubtle}`}>
                      <Shirt className="w-5 h-5 text-[#B799FF]" />
                    </div>
                    <div>
                      <h2 className="font-editorial text-lg font-bold leading-snug">Customize Your Outfit</h2>
                      <p className={`text-xs ${textMuted}`}>
                        Pick a clothing type, add your design, choose colours and more!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePage('customize')}
                    className="w-8 h-8 rounded-full bg-[#B799FF] text-[#121116] flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                    aria-label="Open Full Designer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Live Mini Preview + Interactive Controls Split */}
                <div className="grid grid-cols-12 gap-3 items-center pt-1">
                  {/* Left Live Mini Tee Canvas */}
                  <div className={`col-span-6 h-48 rounded-2xl border p-2 flex items-center justify-center ${bgSubtle}`}>
                    <GarmentCanvas design={design} side="front" compact />
                  </div>

                  {/* Right Quick Controls */}
                  <div className="col-span-6 space-y-2.5">
                    {/* Quick Garment Type Switcher (Unisex & Women's) */}
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: 'tee', label: 'Tee' },
                        { id: 'top', label: 'Top' },
                        { id: 'frock', label: 'Frock' },
                        { id: 'dress', label: 'Dress' }
                      ].map((gItem) => (
                        <button
                          key={gItem.id}
                          onClick={() =>
                            commitDesignChange((d) => ({
                              ...d,
                              garment: gItem.id,
                              sleeve: gItem.id === 'frock' ? 'puff' : 'short',
                              garmentLength: LENGTH_OPTIONS_BY_GARMENT[gItem.id]?.[0]?.id || 'regular'
                            }))
                          }
                          className={`py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                            design.garment === gItem.id
                              ? 'bg-[#B799FF] text-[#121116] border-[#B799FF]'
                              : `${bgSubtle} hover:border-[#B799FF]/50`
                          }`}
                        >
                          {gItem.label}
                        </button>
                      ))}
                    </div>

                    {/* 4 Quick Color Swatches matching screenshot */}
                    <div className="flex items-center justify-between gap-1.5">
                      {[
                        { hex: '#F4F3F6', ink: '#18181B', label: 'White' },
                        { hex: '#18181B', ink: '#F4F3F6', label: 'Black' },
                        { hex: '#B799FF', ink: '#18181B', label: 'Lilac' },
                        { hex: '#D8B49A', ink: '#18181B', label: 'Sand' }
                      ].map((sw) => (
                        <button
                          key={sw.hex}
                          onClick={() =>
                            commitDesignChange((d) => ({
                              ...d,
                              color: sw.hex,
                              front: { ...d.front, textColor: sw.ink, stampColor: sw.ink }
                            }))
                          }
                          className={`w-7 h-7 rounded-full border transition-transform ${
                            design.color === sw.hex ? 'ring-2 ring-[#B799FF] scale-110' : 'border-white/20'
                          }`}
                          style={{ backgroundColor: sw.hex }}
                          aria-label={`Color ${sw.label}`}
                        />
                      ))}
                    </div>

                    {/* Live Text Input */}
                    <input
                      type="text"
                      maxLength={18}
                      value={design.front.text}
                      onChange={(e) =>
                        commitDesignChange((d) => ({
                          ...d,
                          front: { ...d.front, text: e.target.value }
                        }))
                      }
                      placeholder="Good Vibes"
                      aria-label="Quick Front Text"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#B799FF] ${bgSubtle}`}
                    />

                    {/* 4 Mini Graphic Stamp Buttons */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'starburst', icon: Star },
                        { id: 'heart', icon: Heart },
                        { id: 'flower', icon: Flower2 },
                        { id: 'checker', icon: Grid }
                      ].map(({ id, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() =>
                            commitDesignChange((d) => ({
                              ...d,
                              front: { ...d.front, stamp: d.front.stamp === id ? 'none' : id, customImage: null }
                            }))
                          }
                          className={`h-8 rounded-lg border flex items-center justify-center transition-colors ${
                            design.front.stamp === id
                              ? 'bg-[#B799FF] text-[#121116] border-[#B799FF]'
                              : `${bgSubtle} hover:border-[#B799FF]/50`
                          }`}
                          aria-label={`Stamp ${id}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>

                    {/* Open Designer CTA */}
                    <button
                      onClick={() => setActivePage('customize')}
                      className="w-full py-2.5 px-4 rounded-full bg-[#B799FF] hover:bg-[#A682FF] text-[#121116] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Open Designer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. TRUST / SERVICE HIGHLIGHTS STRIP */}
          <section className={`rounded-3xl border px-6 py-5 mb-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${bgCard}`}>
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'On orders above ₹999' },
              { icon: RefreshCw, title: 'Easy Returns', sub: 'Within 7 days' },
              { icon: ShieldCheck, title: 'Secure Payments', sub: '100% Safe & Encrypted' },
              { icon: Headphones, title: '24/7 Support', sub: "We're here to help" }
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${bgSubtle}`}>
                  <Icon className="w-5 h-5 text-[#B799FF]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className={`text-xs ${textMuted}`}>{sub}</p>
                </div>
              </div>
            ))}
          </section>

          {/* 3. TRENDING COLLECTIONS ROW (6-Column Layout matching screenshot + Women's Wear Toggle) */}
          <section className="mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-stretch">
              {/* Column 1: Section Intro Card */}
              <div className="flex flex-col justify-between py-2 pr-2">
                <div className="space-y-3">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${
                      darkMode ? 'bg-[#17151D] border-white/15' : 'bg-white border-black/10'
                    }`}
                  >
                    <span>Trending Now</span>
                    <FourPointStar className="w-3 h-3 text-[#B799FF]" />
                  </div>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold leading-tight">
                    Trending Collections
                  </h2>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    Discover our most loved styles and express your unique vibe.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setActivePage('shop')}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold transition-colors ${
                      darkMode ? 'border-white/20 hover:border-[#B799FF]' : 'border-black/20 hover:border-black'
                    }`}
                  >
                    <span>Explore Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Columns 2-5: Unified Trending Clothing Categories */}
              {[
                {
                  id: 'tee',
                  title: 'Tees',
                  price: 'From ₹499',
                  img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'
                },
                {
                  id: 'hoodie',
                  title: 'Hoodies',
                  price: 'From ₹1,199',
                  img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80'
                },
                {
                  id: 'frock',
                  title: 'Frocks & Dresses',
                  price: 'From ₹1,399',
                  img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80'
                },
                {
                  id: 'top',
                  title: 'Tops & Skirts',
                  price: 'From ₹899',
                  img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=600&q=80'
                }
              ].map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => openInCustomizer({ garment: cat.id, name: `Custom ${cat.title}` })}
                  className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-white/10"
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <h3 className="font-bold text-base">{cat.title}</h3>
                      <p className="text-xs text-white/75">{cat.price}</p>
                    </div>
                    <span className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-[#B799FF] group-hover:text-[#121116] group-hover:border-[#B799FF] transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}

              {/* Column 6: Lavender "Design from Scratch" Card */}
              <div
                onClick={() => setActivePage('customize')}
                className="relative h-64 rounded-3xl bg-[#C8B1FF] text-[#121116] p-5 flex flex-col items-center justify-between text-center cursor-pointer group overflow-hidden"
              >
                <FourPointStar className="w-5 h-5 text-[#121116]/70 self-end" />
                <div className="space-y-1">
                  <p className="font-editorial italic text-2xl font-bold leading-tight">
                    Design
                    <br />
                    from
                    <br />
                    Scratch
                  </p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#121116] text-xs font-semibold group-hover:bg-[#121116] group-hover:text-white transition-colors">
                  <span>Create Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* 4. BOTTOM BENTO ROW (Matches Reference Screenshot Bottom Row) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Card: Why Choose Loomly? (4 cols) */}
            <div className={`lg:col-span-4 rounded-3xl border p-6 sm:p-7 flex flex-col justify-between ${bgCard}`}>
              <div>
                <h2 className="font-editorial text-2xl font-bold">Why Choose Loomly?</h2>
                <p className={`text-xs mt-1 ${textMuted}`}>More than just clothes — it's your style, your way.</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6">
                {[
                  { icon: Palette, label: 'Fully Customizable' },
                  { icon: Award, label: 'Trendy Designs' },
                  { icon: Heart, label: 'Save Your Favorites' }
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2">
                    <div className={`w-11 h-11 rounded-full border flex items-center justify-center ${bgSubtle}`}>
                      <Icon className="w-4 h-4 text-[#B799FF]" />
                    </div>
                    <span className="text-[11px] font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Card: Woven StyleCraft Garment Tag Close-up (5 cols) */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[200px] border border-white/10 flex items-center justify-center bg-[#231F20]">
              <img
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80"
                alt="Premium Fleece Fabric Texture"
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
              {/* Woven Neck Label Badge */}
              <div className="relative z-10 px-8 py-4 bg-[#121116] border border-white/15 shadow-2xl -rotate-6 flex items-center gap-2">
                <span className="font-editorial italic text-xl text-white tracking-wide">Loomly</span>
                <FourPointStar className="w-4 h-4 text-[#B799FF]" />
              </div>
            </div>

            {/* Right Card: Editorial Manifesto "Be Bold. Be You." (3 cols) */}
            <div className={`lg:col-span-3 rounded-3xl border p-6 sm:p-7 flex flex-col justify-center items-end text-right ${bgCard}`}>
              <p className="font-editorial italic text-3xl sm:text-4xl font-bold leading-tight">
                Be Bold.
                <br />
                Be You.
              </p>
              <button
                onClick={() => setActivePage('about')}
                className="mt-4 text-xs text-[#B799FF] hover:underline inline-flex items-center gap-1"
              >
                <span>Our Design Philosophy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================
          PAGE 2: CUSTOMIZE YOUR OUTFIT STUDIO (HCI Core Interactive Design Lab)
      ======================================================================== */}
      {activePage === 'customize' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
          {/* Studio Top Action & History Bar (HCI: User Control, Undo/Redo, Status Visibility) */}
          <div className={`rounded-3xl border p-4 mb-6 flex flex-wrap items-center justify-between gap-4 ${bgCard}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B799FF]/15 text-[#B799FF] flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={design.name}
                    onChange={(e) => updateDesignLive((d) => ({ ...d, name: e.target.value }))}
                    aria-label="Design Title"
                    className="font-editorial text-lg sm:text-xl font-bold bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#B799FF] focus:outline-none"
                  />
                  <Edit3 className="w-3.5 h-3.5 text-[#B799FF]" />
                </div>
                <p className={`text-xs ${textMuted}`}>
                  Interactive Design Lab • Drag artwork directly on garment or toggle 3D Studio View
                </p>
              </div>
            </div>

            {/* Undo / Redo / Reset / Safe-Zone Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium transition-colors ${
                  canUndo ? `${bgSubtle} hover:border-[#B799FF]` : 'opacity-40 cursor-not-allowed border-white/10'
                }`}
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              <button
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium transition-colors ${
                  canRedo ? `${bgSubtle} hover:border-[#B799FF]` : 'opacity-40 cursor-not-allowed border-white/10'
                }`}
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span>Redo</span>
              </button>

              <button
                onClick={handleResetDesign}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium hover:border-red-400/50 ${bgSubtle}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setShowSafeZone((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium ${
                  showSafeZone ? 'bg-[#B799FF]/15 border-[#B799FF] text-[#B799FF]' : bgSubtle
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Print Guide</span>
              </button>
            </div>
          </div>

          {/* 3-Column Studio Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: CUSTOMIZATION CONTROLS PANEL (5 cols) */}
            <div className={`lg:col-span-5 rounded-3xl border p-5 space-y-5 ${bgCard}`}>
              {/* Studio Category Tabs */}
              <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-black/20">
                {[
                  { id: 'garment', label: 'Style', icon: Shirt },
                  { id: 'fabric', label: 'Fabric', icon: Layers },
                  { id: 'text', label: 'Text', icon: Type },
                  { id: 'graphics', label: 'Art', icon: ImageIcon },
                  { id: 'fit', label: 'Fit', icon: Sliders }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setStudioTab(id)}
                    className={`py-2.5 px-1 rounded-xl flex flex-col items-center gap-1 text-[11px] font-semibold transition-all ${
                      studioTab === id
                        ? 'bg-[#B799FF] text-[#121116] shadow-md'
                        : `${textMuted} hover:text-white`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* TAB 1: GARMENT & COLOUR */}
              {studioTab === 'garment' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#B799FF]">
                        1. Select Clothing Type
                      </label>
                      <span className={`text-[11px] ${textMuted}`}>
                        {Object.keys(GARMENT_TYPES).length} Silhouettes
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.values(GARMENT_TYPES).map((g) => (
                          <button
                            key={g.id}
                            onClick={() =>
                              commitDesignChange((d) => {
                                const defaultLen = LENGTH_OPTIONS_BY_GARMENT[g.id]?.[0]?.id || 'regular';
                                return {
                                  ...d,
                                  garment: g.id,
                                  sleeve: g.id === 'frock' ? 'puff' : g.id === 'maxi' ? 'cap' : d.sleeve || 'short',
                                  garmentLength: defaultLen
                                };
                              })
                            }
                            className={`p-2 rounded-2xl border text-left transition-all flex items-center gap-2 ${
                              design.garment === g.id
                                ? 'border-[#B799FF] bg-[#B799FF]/15'
                                : `${bgSubtle} hover:border-white/25`
                            }`}
                          >
                            <div className="w-9 h-9 rounded-xl bg-black/15 p-0.5 shrink-0">
                              <GarmentCanvas
                                compact
                                design={{
                                  name: g.name,
                                  garment: g.id,
                                  color: design.color,
                                  pattern: 'solid',
                                  fit: 'regular',
                                  sleeve: g.id === 'frock' ? 'puff' : 'short',
                                  garmentLength: LENGTH_OPTIONS_BY_GARMENT[g.id]?.[0]?.id || 'regular',
                                  front: { text: '', stamp: 'none', x: 50, y: 44, scale: 1 }
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-xs truncate">{g.shortName}</div>
                              <div className={`text-[11px] ${textMuted}`}>₹{g.basePrice}</div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Contextual Sleeve & Length Customization for Tops, Skirts, Dresses, Frocks & Maxi Dresses */}
                  {(['top', 'skirt', 'dress', 'frock', 'maxi'].includes(design.garment)) && (
                    <div className={`p-3 rounded-2xl border space-y-3 ${bgSubtle}`}>
                      {['top', 'dress', 'frock', 'maxi'].includes(design.garment) && (
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#B799FF] mb-1.5">
                            Sleeve Style
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {SLEEVE_OPTIONS.map((sl) => (
                              <button
                                key={sl.id}
                                onClick={() => commitDesignChange((d) => ({ ...d, sleeve: sl.id }))}
                                className={`py-1.5 px-2 rounded-xl border text-[11px] font-medium transition-colors ${
                                  design.sleeve === sl.id
                                    ? 'bg-[#B799FF] text-[#121116] border-[#B799FF] font-semibold'
                                    : `${bgCard} hover:border-[#B799FF]/50`
                                }`}
                              >
                                {sl.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {LENGTH_OPTIONS_BY_GARMENT[design.garment] && (
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#B799FF] mb-1.5">
                            Hemline / Length Cut
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {LENGTH_OPTIONS_BY_GARMENT[design.garment].map((ln) => (
                              <button
                                key={ln.id}
                                onClick={() => commitDesignChange((d) => ({ ...d, garmentLength: ln.id }))}
                                className={`py-1.5 px-2 rounded-xl border text-[11px] font-medium transition-colors ${
                                  design.garmentLength === ln.id
                                    ? 'bg-[#B799FF] text-[#121116] border-[#B799FF] font-semibold'
                                    : `${bgCard} hover:border-[#B799FF]/50`
                                }`}
                              >
                                {ln.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#B799FF]">
                        2. Choose Garment Colour
                      </label>
                      <span className={`text-xs ${textMuted}`}>
                        {COLOR_PALETTE.find((c) => c.hex === design.color)?.name || design.color}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            const autoInk = c.isDark ? '#F4F3F6' : '#18181B';
                            commitDesignChange((d) => ({
                              ...d,
                              color: c.hex,
                              [activeSide]: { ...d[activeSide], textColor: autoInk, stampColor: autoInk }
                            }));
                          }}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium ${
                            design.color === c.hex ? 'border-[#B799FF] bg-[#B799FF]/10' : bgSubtle
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="truncate">{c.name.split(' ')[1] || c.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Color Picker */}
                    <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl border border-white/10">
                      <span className="text-xs">Custom Shade Picker</span>
                      <input
                        type="color"
                        value={design.color}
                        onChange={(e) => commitDesignChange((d) => ({ ...d, color: e.target.value }))}
                        className="w-8 h-6 rounded cursor-pointer bg-transparent border-0"
                        aria-label="Custom Garment Color"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FABRIC & PATTERNS */}
              {studioTab === 'fabric' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B799FF] mb-2.5">
                      Select Fabric Material
                    </label>
                    <div className="space-y-2">
                      {FABRICS.map((fab) => (
                        <button
                          key={fab.id}
                          onClick={() => commitDesignChange((d) => ({ ...d, fabric: fab.id }))}
                          className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left ${
                            design.fabric === fab.id ? 'border-[#B799FF] bg-[#B799FF]/15' : bgSubtle
                          }`}
                        >
                          <div>
                            <div className="text-sm font-semibold">{fab.name}</div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] bg-white/10">
                              {fab.badge}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-[#B799FF]">
                            {fab.priceAdd === 0 ? 'Included' : `+₹${fab.priceAdd}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B799FF] mb-2.5">
                      Select Surface Pattern
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PATTERNS.map((pat) => (
                        <button
                          key={pat.id}
                          onClick={() => commitDesignChange((d) => ({ ...d, pattern: pat.id }))}
                          className={`p-3 rounded-xl border text-left ${
                            design.pattern === pat.id ? 'border-[#B799FF] bg-[#B799FF]/15' : bgSubtle
                          }`}
                        >
                          <div className="text-xs font-semibold">{pat.name}</div>
                          <div className={`text-[11px] ${textMuted}`}>
                            {pat.priceAdd === 0 ? 'Standard' : `+₹${pat.priceAdd}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOM TEXT & TYPOGRAPHY */}
              {studioTab === 'text' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#B799FF]">
                      Custom Text ({activeSide.toUpperCase()} View)
                    </label>
                    <span className={`text-xs ${textMuted}`}>{design[activeSide].text.length}/22</span>
                  </div>

                  <input
                    type="text"
                    maxLength={22}
                    value={design[activeSide].text}
                    onChange={(e) =>
                      commitDesignChange((d) => ({
                        ...d,
                        [activeSide]: { ...d[activeSide], text: e.target.value }
                      }))
                    }
                    placeholder="Enter name, quote, or slogan..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:border-[#B799FF] ${bgSubtle}`}
                  />

                  <div>
                    <label className="block text-xs font-medium mb-2">Typography Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONT_STYLES.map((f) => (
                        <button
                          key={f.id}
                          onClick={() =>
                            commitDesignChange((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], font: f.id }
                            }))
                          }
                          style={{ fontFamily: f.css }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold ${
                            design[activeSide].font === f.id ? 'border-[#B799FF] bg-[#B799FF]/15' : bgSubtle
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ink Color Swatches */}
                  <div>
                    <label className="block text-xs font-medium mb-2">Print Ink Colour</label>
                    <div className="flex items-center gap-2.5">
                      {['#18181B', '#F4F3F6', '#B799FF', '#F87171', '#34D399', '#FBBF24'].map((ink) => (
                        <button
                          key={ink}
                          onClick={() =>
                            commitDesignChange((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], textColor: ink, stampColor: ink }
                            }))
                          }
                          className={`w-7 h-7 rounded-full border ${
                            design[activeSide].textColor === ink ? 'ring-2 ring-[#B799FF] scale-110' : 'border-white/20'
                          }`}
                          style={{ backgroundColor: ink }}
                          aria-label={`Ink color ${ink}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Size & Rotation Sliders */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Font Size: <strong>{design[activeSide].fontSize}px</strong></span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              commitDesignChange((d) => ({
                                ...d,
                                [activeSide]: { ...d[activeSide], fontSize: Math.max(8, (d[activeSide].fontSize || 18) - 2) }
                              }))
                            }
                            className="w-5 h-5 rounded bg-white/10 hover:bg-[#B799FF] hover:text-[#121116] flex items-center justify-center font-bold"
                            aria-label="Decrease font size"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              commitDesignChange((d) => ({
                                ...d,
                                [activeSide]: { ...d[activeSide], fontSize: Math.min(48, (d[activeSide].fontSize || 18) + 2) }
                              }))
                            }
                            className="w-5 h-5 rounded bg-white/10 hover:bg-[#B799FF] hover:text-[#121116] flex items-center justify-center font-bold"
                            aria-label="Increase font size"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="48"
                        value={design[activeSide].fontSize}
                        onChange={(e) =>
                          updateDesignLive((d) => ({
                            ...d,
                            [activeSide]: { ...d[activeSide], fontSize: Number(e.target.value) }
                          }))
                        }
                        className="w-full accent-[#B799FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Rotation: {design[activeSide].rotation || 0}°</label>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        value={design[activeSide].rotation || 0}
                        onChange={(e) =>
                          updateDesignLive((d) => ({
                            ...d,
                            [activeSide]: { ...d[activeSide], rotation: Number(e.target.value) }
                          }))
                        }
                        className="w-full accent-[#B799FF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GRAPHICS, CUSTOM IMAGE UPLOAD & PLACEMENT */}
              {studioTab === 'graphics' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B799FF] mb-2">
                      Built-in Vector Stamps ({activeSide.toUpperCase()})
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {VECTOR_STAMPS.map((st) => (
                        <button
                          key={st.id}
                          onClick={() =>
                            commitDesignChange((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], stamp: st.id, customImage: null }
                            }))
                          }
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[10px] ${
                            design[activeSide].stamp === st.id && !design[activeSide].customImage
                              ? 'border-[#B799FF] bg-[#B799FF]/15 text-[#B799FF]'
                              : bgSubtle
                          }`}
                        >
                          {st.id === 'none' ? (
                            <X className="w-5 h-5 my-1" />
                          ) : (
                            <VectorStampArt type={st.id} color={darkMode ? '#F4F3F6' : '#18181B'} size={26} />
                          )}
                          <span className="truncate w-full text-center">{st.name.split(' ').pop()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real Image Upload Input */}
                  <div className={`p-3 rounded-2xl border border-dashed ${bgSubtle}`}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <Upload className="w-4 h-4 text-[#B799FF]" />
                        <div>
                          <div className="text-xs font-semibold">Upload Your Own Graphic / Logo</div>
                          <div className={`text-[11px] ${textMuted}`}>PNG, JPG, or SVG artwork</div>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-[#B799FF] text-[#121116] text-xs font-semibold">
                        Browse
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            commitDesignChange((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], customImage: reader.result, stamp: 'none' }
                            }));
                            showToast('Uploaded custom artwork onto garment!');
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {design[activeSide].customImage && (
                      <button
                        onClick={() =>
                          commitDesignChange((d) => ({
                            ...d,
                            [activeSide]: { ...d[activeSide], customImage: null }
                          }))
                        }
                        className="mt-2 text-xs text-red-400 hover:underline"
                      >
                        Remove Uploaded Image
                      </button>
                    )}
                  </div>

                  {/* Placement Presets & Precision Sliders */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Placement Presets</span>
                      <span className={`text-[11px] ${textMuted}`}>Or drag directly on garment</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: 'Center Chest', x: 50, y: 43, scale: 1.0 },
                        { label: 'Left Pocket', x: 61, y: 36, scale: 0.65 },
                        { label: 'Oversized Graphic', x: 50, y: 48, scale: 1.35 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() =>
                            commitDesignChange((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], x: preset.x, y: preset.y, scale: preset.scale }
                            }))
                          }
                          className={`py-2 px-2 rounded-xl border text-[11px] font-medium hover:border-[#B799FF] ${bgSubtle}`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] mb-1">X: {design[activeSide].x}%</label>
                        <input
                          type="range"
                          min="25"
                          max="75"
                          value={design[activeSide].x}
                          onChange={(e) =>
                            commitDesignChange((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], x: Number(e.target.value) }
                            }))
                          }
                          className="w-full accent-[#B799FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">Y: {design[activeSide].y}%</label>
                        <input
                          type="range"
                          min="25"
                          max="75"
                          value={design[activeSide].y}
                          onChange={(e) =>
                            commitDesignChange((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], y: Number(e.target.value) }
                            }))
                          }
                          className="w-full accent-[#B799FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">Scale: {design[activeSide].scale}x</label>
                        <input
                          type="range"
                          min="0.35"
                          max="1.85"
                          step="0.05"
                          value={design[activeSide].scale}
                          onChange={(e) =>
                            updateDesignLive((d) => ({
                              ...d,
                              [activeSide]: { ...d[activeSide], scale: Number(e.target.value) }
                            }))
                          }
                          className="w-full accent-[#B799FF]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SIZE & FIT SELECTION */}
              {studioTab === 'fit' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#B799FF]">
                        Select Size
                      </label>
                      <button
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-xs text-[#B799FF] hover:underline flex items-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Size Chart</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {SIZES.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => commitDesignChange((d) => ({ ...d, size: sz }))}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            design.size === sz
                              ? 'bg-[#B799FF] text-[#121116] border-[#B799FF]'
                              : `${bgSubtle} hover:border-white/30`
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#B799FF] mb-2.5">
                      Select Silhouette Fit
                    </label>
                    <div className="space-y-2">
                      {FITS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => commitDesignChange((d) => ({ ...d, fit: f.id }))}
                          className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left ${
                            design.fit === f.id ? 'border-[#B799FF] bg-[#B799FF]/15' : bgSubtle
                          }`}
                        >
                          <div>
                            <div className="text-sm font-semibold">{f.name}</div>
                            <div className={`text-xs ${textMuted}`}>{f.note}</div>
                          </div>
                          {design.fit === f.id && <Check className="w-4 h-4 text-[#B799FF]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CENTER COLUMN: INTERACTIVE FRONT / BACK LIVE CANVAS (4 cols) */}
            <div className={`lg:col-span-4 rounded-3xl border p-5 flex flex-col items-center justify-between ${bgCard}`}>
              {/* Front / Back View Switcher */}
              <div className="w-full flex items-center justify-between mb-3">
                <div className="inline-flex p-1 rounded-full bg-black/25 border border-white/10">
                  {['front', 'back'].map((side) => (
                    <button
                      key={side}
                      onClick={() => setActiveSide(side)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                        activeSide === side ? 'bg-[#B799FF] text-[#121116]' : `${textMuted} hover:text-white`
                      }`}
                    >
                      {side} View
                    </button>
                  ))}
                </div>
                <span className={`text-xs ${textMuted}`}>
                  {design.size || 'No Size'} • {FITS.find((f) => f.id === design.fit)?.name}
                </span>
              </div>

              {/* Garment Preview Canvas */}
              <div className={`w-full h-[360px] rounded-2xl border relative overflow-hidden flex items-center justify-center ${bgSubtle}`}>
                <GarmentCanvas
                  design={design}
                  side={activeSide}
                  interactive
                  showSafeZone={showSafeZone}
                  onSelectForEdit={() => setStudioTab('text')}
                  onUpdateLayer={(patch) =>
                    updateDesignLive((d) => ({
                      ...d,
                      [activeSide]: { ...d[activeSide], ...patch }
                    }))
                  }
                />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-[#9E9AA8] pointer-events-none">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3 text-[#B799FF]" /> Drag to move • Corner dot to resize
                  </span>
                  <span>{FABRICS.find((f) => f.id === design.fabric)?.badge}</span>
                </div>
              </div>

              {/* Direct Quick Text & Size Bar right beneath the Canvas */}
              <div className={`w-full mt-3 p-3 rounded-2xl border space-y-2.5 ${bgSubtle}`}>
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#B799FF] shrink-0" />
                  <input
                    type="text"
                    maxLength={24}
                    value={design[activeSide].text}
                    onChange={(e) =>
                      updateDesignLive((d) => ({
                        ...d,
                        [activeSide]: { ...d[activeSide], text: e.target.value }
                      }))
                    }
                    placeholder={`Edit ${activeSide} text directly...`}
                    aria-label="Direct Canvas Text Edit"
                    className={`flex-1 px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-[#B799FF] ${bgCard}`}
                  />
                  {design[activeSide].text && (
                    <button
                      type="button"
                      onClick={() =>
                        commitDesignChange((d) => ({
                          ...d,
                          [activeSide]: { ...d[activeSide], text: '' }
                        }))
                      }
                      className="p-1.5 rounded-lg text-xs text-[#9E9AA8] hover:text-red-400"
                      title="Clear text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 font-medium">Text: {design[activeSide].fontSize}px</span>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      value={design[activeSide].fontSize}
                      onChange={(e) =>
                        updateDesignLive((d) => ({
                          ...d,
                          [activeSide]: { ...d[activeSide], fontSize: Number(e.target.value) }
                        }))
                      }
                      className="w-full accent-[#B799FF]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 font-medium">Scale: {design[activeSide].scale}x</span>
                    <input
                      type="range"
                      min="0.35"
                      max="1.85"
                      step="0.05"
                      value={design[activeSide].scale}
                      onChange={(e) =>
                        updateDesignLive((d) => ({
                          ...d,
                          [activeSide]: { ...d[activeSide], scale: Number(e.target.value) }
                        }))
                      }
                      className="w-full accent-[#B799FF]"
                    />
                  </div>
                </div>
              </div>

              {/* HCI Error Prevention Warnings */}
              {validationWarnings.length > 0 && (
                <div className="w-full mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  {validationWarnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: PRICE SUMMARY, ACTIONS & AI STYLE RECOMMENDATIONS (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Order Summary & Actions Card */}
              <div className={`rounded-3xl border p-5 space-y-4 ${bgCard}`}>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">
                    Custom Specification
                  </span>
                  <h2 className="font-editorial text-2xl font-bold mt-0.5">
                    ₹{calculateDesignPrice(design).toLocaleString('en-IN')}
                  </h2>
                  <p className={`text-xs mt-1 ${textMuted}`}>
                    Includes {GARMENT_TYPES[design.garment]?.name}
                    {['top', 'dress', 'frock', 'maxi'].includes(design.garment) &&
                      ` (${SLEEVE_OPTIONS.find((s) => s.id === design.sleeve)?.name || 'Short Sleeve'})`}
                    {LENGTH_OPTIONS_BY_GARMENT[design.garment] &&
                      ` • ${LENGTH_OPTIONS_BY_GARMENT[design.garment].find((l) => l.id === design.garmentLength)?.name || ''}`}
                    , {FABRICS.find((f) => f.id === design.fabric)?.name}, and custom print.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => addToCart(design, 1)}
                    className="w-full py-3 px-4 rounded-full bg-[#B799FF] hover:bg-[#A682FF] text-[#121116] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B799FF]/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Outfit to Bag</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={saveCurrentDesign}
                      className={`py-2.5 px-3 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-[#B799FF] ${bgSubtle}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B799FF]" />
                      <span>Save Design</span>
                    </button>

                    <button
                      onClick={() => {
                        setWishlist((prev) => [
                          ...prev,
                          {
                            id: `wish-custom-${Date.now()}`,
                            name: design.name,
                            category: design.garment,
                            price: calculateDesignPrice(design),
                            rating: 5.0,
                            tag: 'Custom',
                            preset: design
                          }
                        ]);
                        showToast('Saved custom creation to Wishlist!');
                      }}
                      className={`py-2.5 px-3 rounded-full border text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-[#B799FF] ${bgSubtle}`}
                    >
                      <Heart className="w-3.5 h-3.5 text-[#B799FF]" />
                      <span>Wishlist</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Style Recommendations Card */}
              <div className={`rounded-3xl border p-5 space-y-3 ${bgCard}`}>
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-[#B799FF]" />
                  <h3 className="font-semibold text-sm">Style Recommendations</h3>
                </div>
                <p className={`text-xs ${textMuted}`}>
                  Smart suggestions tailored to your current garment and palette:
                </p>
                <div className="space-y-2.5">
                  {styleRecommendations.map((rec, i) => (
                    <div key={i} className={`p-3 rounded-2xl border space-y-2 ${bgSubtle}`}>
                      <div className="text-xs font-semibold text-[#B799FF]">{rec.title}</div>
                      <p className={`text-[11px] leading-relaxed ${textMuted}`}>{rec.desc}</p>
                      <button
                        onClick={rec.apply}
                        className="text-[11px] font-semibold underline hover:text-[#B799FF]"
                      >
                        Apply Suggestion →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================
          PAGE 3: SHOP PAGE (CATALOG WITH FILTERING, WISHLIST & QUICK CUSTOMIZE)
      ======================================================================== */}
      {activePage === 'shop' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">Curated & Customizable</span>
              <h1 className="font-editorial text-4xl font-bold mt-1">Explore Loomly Collection</h1>
              <p className={`text-sm mt-1 ${textMuted}`}>
                Order ready-to-wear drops or click "Customize" on any piece to remix it in the Design Lab.
              </p>
            </div>

            {/* Category & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Styles' },
                { id: 'tee', label: 'T-Shirts' },
                { id: 'hoodie', label: 'Hoodies' },
                { id: 'polo', label: 'Polos' },
                { id: 'tank', label: 'Tank Tops' },
                { id: 'top', label: 'Tops' },
                { id: 'skirt', label: 'Skirts' },
                { id: 'frock', label: 'Frocks' },
                { id: 'maxi', label: 'Maxi Dresses' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setShopCategoryFilter(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${
                    shopCategoryFilter === cat.id
                      ? 'bg-[#B799FF] text-[#121116] border-[#B799FF]'
                      : `${bgCard} hover:border-[#B799FF]`
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              <select
                value={shopSort}
                onChange={(e) => setShopSort(e.target.value)}
                aria-label="Sort Products"
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border focus:outline-none ${bgCard}`}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INITIAL_SHOP_ITEMS.filter((item) => {
              const matchesCat =
                shopCategoryFilter === 'all' || item.category === shopCategoryFilter;
              const matchesSearch =
                !searchQuery.trim() ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCat && matchesSearch;
            })
              .sort((a, b) => {
                if (shopSort === 'price-asc') return a.price - b.price;
                if (shopSort === 'price-desc') return b.price - a.price;
                return 0;
              })
              .map((item) => {
                const isWished = wishlist.some((w) => w.id === item.id);
                return (
                  <div key={item.id} className={`rounded-3xl border p-4 flex flex-col justify-between ${bgCard} group transition-all hover:border-[#B799FF]/50`}>
                    <div>
                      {/* Tailored Flat Garment Card Stage matching reference image_4da15d.jpg */}
                      <div className={`relative h-56 rounded-2xl p-4 mb-4 flex items-center justify-center border ${
                        darkMode ? 'bg-[#22202A] border-white/[0.06]' : 'bg-[#E9E4D8] border-black/[0.06]'
                      }`}>
                        <div className="w-44 h-44 transition-transform duration-300 group-hover:scale-105">
                          <GarmentCanvas
                            compact
                            design={createDefaultDesign({ ...item.preset, name: item.name })}
                          />
                        </div>
                        <button
                          onClick={() => toggleWishlistShopItem(item)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isWished
                              ? 'bg-[#B799FF] text-[#121116]'
                              : darkMode
                              ? 'bg-black/40 text-white/80 hover:bg-[#B799FF] hover:text-[#121116]'
                              : 'bg-white/80 text-black/70 hover:bg-[#B799FF]'
                          }`}
                          aria-label="Toggle Wishlist"
                        >
                          <Heart className="w-3.5 h-3.5" fill={isWished ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="space-y-1 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B799FF]">
                          {GARMENT_TYPES[item.category]?.shortName}
                        </span>
                        <h3 className="font-bold text-base leading-snug">{item.name}</h3>
                        <p className={`text-xs leading-relaxed line-clamp-2 ${textMuted}`}>
                          {item.subtitle || GARMENT_TYPES[item.category]?.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-4 mt-3 px-1 border-t border-white/[0.06]">
                      <div>
                        <span className={`text-[11px] ${textMuted}`}>from </span>
                        <span className="font-bold text-base">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            addToCart(
                              createDefaultDesign({
                                ...item.preset,
                                name: item.name,
                                price: item.price,
                                size: userProfile.preferredSize || 'L'
                              })
                            )
                          }
                          className={`p-2 rounded-xl border hover:border-[#B799FF] transition-colors ${bgSubtle}`}
                          title="Quick Add to Bag"
                          aria-label="Quick Add to Bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openInCustomizer({ ...item.preset, name: `Custom ${item.name}` })}
                          className="py-2 px-3.5 rounded-xl bg-[#B799FF] hover:bg-[#A682FF] text-[#121116] text-xs font-bold transition-colors"
                        >
                          Customise
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
      )}

      {/* ========================================================================
          PAGE 4: MY DESIGNS PAGE (STORES SAVED CUSTOM OUTFITS)
      ======================================================================== */}
      {activePage === 'designs' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">Personal Studio Vault</span>
              <h1 className="font-editorial text-4xl font-bold mt-1">My Saved Designs ({savedDesigns.length})</h1>
              <p className={`text-sm mt-1 ${textMuted}`}>
                Reopen any custom creation in the Design Lab, duplicate variations, or order immediately.
              </p>
            </div>
            <button
              onClick={() => openInCustomizer({})}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#B799FF] text-[#121116] font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Design</span>
            </button>
          </div>

          {savedDesigns.length === 0 ? (
            <div className={`rounded-3xl border p-12 text-center ${bgCard}`}>
              <p className="font-editorial text-2xl font-bold mb-2">No custom designs saved yet</p>
              <p className={`text-sm mb-6 ${textMuted}`}>Head to the Customizer Studio to craft your first outfit.</p>
              <button
                onClick={() => setActivePage('customize')}
                className="px-6 py-3 rounded-full bg-[#B799FF] text-[#121116] font-semibold text-sm"
              >
                Open Customizer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesigns.map((sd) => (
                <div key={sd.id} className={`rounded-3xl border p-5 flex flex-col justify-between space-y-4 ${bgCard}`}>
                  <div>
                    <div className={`h-60 rounded-2xl border p-3 mb-4 ${bgSubtle}`}>
                      <GarmentCanvas design={sd} side="front" compact />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">{sd.name}</h3>
                        <p className={`text-xs ${textMuted}`}>
                          {GARMENT_TYPES[sd.garment]?.name} • {sd.size} ({sd.fit})
                        </p>
                      </div>
                      <span className="font-editorial font-bold text-lg text-[#B799FF]">
                        ₹{calculateDesignPrice(sd).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                      onClick={() => openInCustomizer(sd)}
                      className="py-2 px-3 rounded-full bg-[#B799FF] text-[#121116] text-xs font-bold"
                    >
                      Edit Design
                    </button>
                    <button
                      onClick={() => addToCart(sd, 1)}
                      className={`py-2 px-3 rounded-full border text-xs font-semibold hover:border-[#B799FF] ${bgSubtle}`}
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={() => {
                        setSavedDesigns((prev) => prev.filter((item) => item.id !== sd.id));
                        showToast('Deleted saved design', 'info');
                      }}
                      className="py-2 px-3 rounded-full border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ========================================================================
          PAGE 5: WISHLIST PAGE
      ======================================================================== */}
      {activePage === 'wishlist' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">Saved Favourites</span>
            <h1 className="font-editorial text-4xl font-bold mt-1">Your Wishlist ({wishlist.length})</h1>
          </div>

          {wishlist.length === 0 ? (
            <div className={`rounded-3xl border p-12 text-center ${bgCard}`}>
              <p className="font-editorial text-2xl font-bold mb-2">Your wishlist is empty</p>
              <p className={`text-sm mb-6 ${textMuted}`}>Tap the heart icon on any product or custom creation to save it here.</p>
              <button
                onClick={() => setActivePage('shop')}
                className="px-6 py-3 rounded-full bg-[#B799FF] text-[#121116] font-semibold text-sm"
              >
                Explore Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className={`rounded-3xl border p-5 flex flex-col justify-between space-y-4 ${bgCard}`}>
                  <div>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-56 object-cover rounded-2xl mb-4" />
                    ) : (
                      <div className={`h-56 rounded-2xl p-3 mb-4 border ${bgSubtle}`}>
                        <GarmentCanvas design={item.preset} compact />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="font-editorial text-xl font-bold text-[#B799FF] mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        addToCart(
                          createDefaultDesign({
                            ...(item.preset || {}),
                            name: item.name,
                            price: item.price,
                            size: userProfile.preferredSize || 'L'
                          })
                        )
                      }
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#B799FF] text-[#121116] text-xs font-bold"
                    >
                      Move to Bag
                    </button>
                    <button
                      onClick={() => setWishlist((prev) => prev.filter((w) => w.id !== item.id))}
                      className="p-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ========================================================================
          PAGE 6: SHOPPING CART PAGE
      ======================================================================== */}
      {activePage === 'cart' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">Checkout Bag</span>
            <h1 className="font-editorial text-4xl font-bold mt-1">Shopping Bag ({totalCartItems})</h1>
          </div>

          {cart.length === 0 ? (
            <div className={`rounded-3xl border p-12 text-center ${bgCard}`}>
              <p className="font-editorial text-2xl font-bold mb-2">Your shopping bag is empty</p>
              <p className={`text-sm mb-6 ${textMuted}`}>Design a custom outfit or explore our trending collections.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setActivePage('customize')}
                  className="px-6 py-3 rounded-full bg-[#B799FF] text-[#121116] font-semibold text-sm"
                >
                  Start Designing
                </button>
                <button
                  onClick={() => setActivePage('shop')}
                  className={`px-6 py-3 rounded-full border text-sm font-semibold ${bgSubtle}`}
                >
                  Browse Shop
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className={`rounded-3xl border p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 ${bgCard}`}>
                    <div className={`w-28 h-28 rounded-2xl p-2 shrink-0 border ${bgSubtle}`}>
                      <GarmentCanvas design={item.design} compact />
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="font-semibold text-lg">{item.design.name}</h3>
                      <p className={`text-xs ${textMuted}`}>
                        {GARMENT_TYPES[item.design.garment]?.name}
                        {['top', 'dress', 'frock', 'maxi'].includes(item.design.garment) &&
                          ` (${SLEEVE_OPTIONS.find((s) => s.id === item.design.sleeve)?.name || ''})`}
                        {LENGTH_OPTIONS_BY_GARMENT[item.design.garment] &&
                          ` • ${LENGTH_OPTIONS_BY_GARMENT[item.design.garment].find((l) => l.id === item.design.garmentLength)?.name || ''}`}{' '}
                        • Size <strong>{item.design.size}</strong> •{' '}
                        {FITS.find((f) => f.id === item.design.fit)?.name}
                      </p>
                      <p className={`text-xs ${textMuted}`}>
                        Fabric: {FABRICS.find((f) => f.id === item.design.fabric)?.name}
                      </p>
                      <div className="font-editorial text-lg font-bold text-[#B799FF] pt-1">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center rounded-full border p-1 ${bgSubtle}`}>
                        <button
                          onClick={() =>
                            setCart((prev) =>
                              prev
                                .map((c) => (c.cartId === item.cartId ? { ...c, qty: c.qty - 1 } : c))
                                .filter((c) => c.qty > 0)
                            )
                          }
                          className="p-1.5 rounded-full hover:bg-white/10"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.qty}</span>
                        <button
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((c) => (c.cartId === item.cartId ? { ...c, qty: c.qty + 1 } : c))
                            )
                          }
                          className="p-1.5 rounded-full hover:bg-white/10"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => setCart((prev) => prev.filter((c) => c.cartId !== item.cartId))}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary & Checkout */}
              <div className={`lg:col-span-4 rounded-3xl border p-6 space-y-5 ${bgCard}`}>
                <h2 className="font-editorial text-2xl font-bold">Order Summary</h2>

                {/* Free Shipping Progress Bar */}
                <div className={`p-3.5 rounded-2xl border ${bgSubtle}`}>
                  {cartShipping === 0 ? (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> You unlocked FREE Express Shipping!
                    </p>
                  ) : (
                    <p className="text-xs">
                      Add <strong>₹{999 - (cartSubtotal - cartDiscount)}</strong> more for Free Shipping!
                    </p>
                  )}
                </div>

                {/* Promo Code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (try STYLE10)"
                    className={`flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${bgSubtle}`}
                  />
                  <button
                    onClick={() => {
                      if (promoCode.trim().toUpperCase() === 'STYLE10') {
                        setPromoApplied(true);
                        showToast('Applied 10% STYLE10 discount!');
                      } else {
                        showToast('Invalid promo code. Try STYLE10', 'error');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#B799FF]/20 text-[#B799FF] text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className={textMuted}>Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount (10%)</span>
                      <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className={textMuted}>Shipping</span>
                    <span>{cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-[#B799FF]">₹{cartGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const newOrder = {
                      id: `SC-${Math.floor(10000 + Math.random() * 90000)}`,
                      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                      status: 'In Production',
                      total: cartGrandTotal,
                      items: cart.map((c) => c.design)
                    };
                    setOrders((prev) => [newOrder, ...prev]);
                    setCart([]);
                    setPromoApplied(false);
                    setActivePage('profile');
                    showToast(`Order ${newOrder.id} placed! Custom printing started.`);
                  }}
                  className="w-full py-3.5 px-5 rounded-full bg-[#B799FF] hover:bg-[#A682FF] text-[#121116] font-bold text-sm transition-all shadow-lg shadow-[#B799FF]/20"
                >
                  Place Custom Order →
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================
          PAGE 7: USER PROFILE PAGE (ACCOUNT, ORDER HISTORY & HCI AUDIT)
      ======================================================================== */}
      {activePage === 'profile' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Profile Preferences Editor */}
            <div className={`lg:col-span-5 rounded-3xl border p-6 space-y-5 ${bgCard}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#B799FF] text-[#121116] font-editorial text-2xl font-bold flex items-center justify-center">
                  {userProfile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="font-editorial text-2xl font-bold">{userProfile.name}</h1>
                  <p className={`text-xs ${textMuted}`}>{userProfile.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile((p) => ({ ...p, name: e.target.value }))}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${bgSubtle}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Default Size</label>
                    <select
                      value={userProfile.preferredSize}
                      onChange={(e) => setUserProfile((p) => ({ ...p, preferredSize: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${bgSubtle}`}
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Preferred Fit</label>
                    <select
                      value={userProfile.preferredFit}
                      onChange={(e) => setUserProfile((p) => ({ ...p, preferredFit: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${bgSubtle}`}
                    >
                      {FITS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Profile preferences updated!')}
                  className="w-full py-2.5 rounded-full bg-[#B799FF] text-[#121116] font-semibold text-xs"
                >
                  Save Profile Preferences
                </button>
              </div>
            </div>

            {/* Previous Orders History */}
            <div className={`lg:col-span-7 rounded-3xl border p-6 space-y-4 ${bgCard}`}>
              <h2 className="font-editorial text-2xl font-bold">Order History ({orders.length})</h2>
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${bgSubtle}`}>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm">Order #{ord.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#B799FF]/20 text-[#B799FF] font-semibold">
                          {ord.status}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${textMuted}`}>
                        Placed on {ord.date} • {ord.items.map((i) => i.name).join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-editorial font-bold text-lg">₹{ord.total.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => openInCustomizer(ord.items[0])}
                        className="px-3.5 py-1.5 rounded-full border border-[#B799FF] text-[#B799FF] text-xs font-semibold hover:bg-[#B799FF] hover:text-[#121116]"
                      >
                        Re-Customize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HCI Principles Matrix */}
          <section className={`rounded-3xl border p-6 sm:p-8 ${bgCard}`}>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">Human-Computer Interaction</span>
              <h2 className="font-editorial text-3xl font-bold mt-1">8 Core HCI Principles Demonstrated</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HCI_PRINCIPLES.map((p) => (
                <div key={p.title} className={`p-4 rounded-2xl border space-y-1.5 ${bgSubtle}`}>
                  <h3 className="font-semibold text-sm text-[#B799FF]">{p.title}</h3>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================
          PAGE 8: ABOUT US PAGE
      ======================================================================== */}
      {activePage === 'about' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 space-y-10">
          <section className={`rounded-3xl border p-8 sm:p-12 ${bgCard}`}>
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B799FF]/15 text-[#B799FF] text-xs font-semibold">
                <FourPointStar className="w-3.5 h-3.5" />
                <span>Our Story & Mission</span>
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl font-bold leading-tight">
                Your Style. Our Canvas.
              </h1>
              <p className={`text-base leading-relaxed ${textMuted}`}>
                Loomly was born from a simple belief: fashion shouldn't be mass-produced templates—it should be an interactive canvas where anyone can become the designer. By pairing zero-waste on-demand garment production with an intuitive real-time Design Lab, we empower creators to craft personalized apparel in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                {
                  title: 'Zero-Waste On-Demand',
                  desc: 'Every garment is cut, stitched, and printed only after you finalize your design—eliminating deadstock.'
                },
                {
                  title: 'Atelier-Grade Fabrics',
                  desc: 'From 240 GSM combed organic cotton to 380 GSM heavyweight French terry built to last.'
                },
                {
                  title: 'HCI-First Design Studio',
                  desc: 'Engineered with instant visual feedback, undo/redo safety nets, and accessible controls for all skill levels.'
                }
              ].map((item) => (
                <div key={item.title} className={`p-5 rounded-2xl border space-y-2 ${bgSubtle}`}>
                  <h3 className="font-editorial text-xl font-bold text-[#B799FF]">{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================
          PAGE 9: CONTACT, FEEDBACK & RATINGS PAGE
      ======================================================================== */}
      {activePage === 'contact' && (
        <ContactAndFeedbackPage
          bgCard={bgCard}
          bgSubtle={bgSubtle}
          textMuted={textMuted}
          reviews={reviews}
          onAddReview={(rev) => {
            setReviews((prev) => [rev, ...prev]);
            showToast('Thank you! Your rating & feedback have been published.');
          }}
          onSendSupport={() => showToast('Support ticket received! Our team responds within 2 hours.')}
        />
      )}

      {/* Minimal Footer */}
      <footer className={`border-t py-8 px-4 sm:px-6 lg:px-8 ${darkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <FourPointStar className="w-4 h-4 text-[#B799FF]" />
            <span className="font-editorial font-bold text-base">Loomly</span>
            <span className={textMuted}>• Design. Wear. Repeat.</span>
          </div>
          <div className={`flex flex-wrap gap-5 ${textMuted}`}>
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => setActivePage(l.id)} className="hover:text-[#B799FF]">
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// 5. CONTACT & COMMUNITY RATINGS SUB-COMPONENT
// ============================================================================

function ContactAndFeedbackPage({ bgCard, bgSubtle, textMuted, reviews, onAddReview, onSendSupport }) {
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [tag, setTag] = useState('Live Preview & Ease of Design');
  const [comment, setComment] = useState('');

  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMsg, setSupportMsg] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddReview({
      id: `rev-${Date.now()}`,
      author: author.trim() || 'Loomly Creator',
      role: 'Verified Customer',
      rating,
      tag,
      comment: comment.trim(),
      date: 'Just now'
    });
    setAuthor('');
    setComment('');
    setRating(5);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Rate Your Customization Experience */}
        <div className={`lg:col-span-6 rounded-3xl border p-6 sm:p-8 space-y-5 ${bgCard}`}>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">Feedback & Ratings</span>
            <h1 className="font-editorial text-3xl font-bold mt-1">Rate Your Loomly Experience</h1>
            <p className={`text-xs mt-1 ${textMuted}`}>
              Help us refine our customization tools and fabric quality.
            </p>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2">Overall Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 rounded-lg hover:scale-110 transition-transform"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold ml-2 text-[#B799FF]">{rating} / 5 Stars</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your Name"
                className={`px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${bgSubtle}`}
              />
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${bgSubtle}`}
              >
                <option>Live Preview & Ease of Design</option>
                <option>Fabric & Print Quality</option>
                <option>Size & Fit Accuracy</option>
                <option>AI Style Recommendations</option>
              </select>
            </div>

            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you loved about customizing your outfit..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${bgSubtle}`}
            />

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#B799FF] text-[#121116] font-bold text-xs inline-flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Feedback</span>
            </button>
          </form>
        </div>

        {/* Right: 24/7 Customer Support Form */}
        <div className={`lg:col-span-6 rounded-3xl border p-6 sm:p-8 space-y-5 ${bgCard}`}>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#B799FF] font-semibold">24/7 Support Desk</span>
            <h2 className="font-editorial text-3xl font-bold mt-1">Need Help With a Custom Order?</h2>
            <p className={`text-xs mt-1 ${textMuted}`}>
              Reach out for bulk studio orders, artwork guidelines, or sizing advice.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSupportName('');
              setSupportEmail('');
              setSupportMsg('');
              onSendSupport();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              required
              value={supportName}
              onChange={(e) => setSupportName(e.target.value)}
              placeholder="Your Name"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${bgSubtle}`}
            />
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="Email Address"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${bgSubtle}`}
            />
            <textarea
              rows={3}
              required
              value={supportMsg}
              onChange={(e) => setSupportMsg(e.target.value)}
              placeholder="How can our design specialists help you?"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${bgSubtle}`}
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-full border border-[#B799FF] text-[#B799FF] hover:bg-[#B799FF] hover:text-[#121116] font-bold text-xs transition-colors`}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Community Reviews Feed */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl font-bold">Community Reviews ({reviews.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((rev) => (
            <div key={rev.id} className={`rounded-3xl border p-5 space-y-3 ${bgCard}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className={`text-[11px] ${textMuted}`}>{rev.date}</span>
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] bg-[#B799FF]/15 text-[#B799FF] font-semibold">
                {rev.tag}
              </span>
              <p className="text-xs leading-relaxed">"{rev.comment}"</p>
              <div className="pt-1 text-xs font-semibold">
                {rev.author} <span className={`font-normal ${textMuted}`}>• {rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}