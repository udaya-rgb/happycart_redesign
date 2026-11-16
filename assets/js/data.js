// =========================================================================
// A. PRODUCT CATALOG (Exact 6 Products from Reference + Corrected Spelling)
// =========================================================================
const PRODUCTS = [
  {
    id: 'earbuds-anc',
    title: 'Wireless Earbuds',
    subtitle: 'ANC, 40H Battery',
    category: 'Audio & Wearables',
    price: 3499,
    mrp: 5999,
    discount: 42,
    rating: 4.8,
    reviews: '12,480',
    highlights: ['Active Noise Cancellation up to 45dB', '40-Hour Total Playtime with Fast Charge', 'Dual-Device Bluetooth 5.4 Multipoint'],
    image: 'assets/images/products/earbuds-anc.jpg'
  },
  {
    id: 'smartwatch-bt',
    title: 'Smartwatch',
    subtitle: 'BT Calling, Health Tracking',
    category: 'Audio & Wearables',
    price: 2799,
    mrp: 4499,
    discount: 38,
    rating: 4.6,
    reviews: '9,310',
    highlights: ['1.96" Always-On AMOLED Display', 'Crystal-Clear Single-Chip BT Calling', '24/7 SpO2, Heart Rate & 100+ Sports Modes'],
    image: 'assets/images/products/smartwatch-bt.jpg'
  },
  {
    id: 'laptop-14-i5',
    title: 'Laptop (14", i5, 16GB)',
    subtitle: 'Performance Laptop',
    category: 'Computing',
    price: 54990,
    mrp: 78990,
    discount: 30,
    rating: 4.7,
    reviews: '4,820',
    highlights: ['14" Full HD+ Anti-Glare IPS Display', '13th Gen Core i5 · 16GB LPDDR5 · 512GB NVMe SSD', 'Featherlight 1.38kg Aluminum Chassis'],
    image: 'assets/images/products/laptop-14-i5.jpg'
  },
  {
    id: 'mirrorless-camera',
    title: 'Mirrorless Camera',
    subtitle: '4K Recording',
    category: 'Cameras',
    price: 59990,
    mrp: 83990,
    discount: 28,
    rating: 4.9,
    reviews: '2,190',
    highlights: ['24.2MP APS-C Exmor CMOS Sensor', '4K 60fps 10-Bit Cinematic Video Recording', 'Real-Time Eye Autofocus & Vari-Angle LCD'],
    image: 'assets/images/products/mirrorless-camera.jpg'
  },
  {
    id: 'gaming-headset',
    title: 'Gaming Headset',
    subtitle: '7.1 Surround Sound',
    category: 'Gaming',
    price: 1649,
    mrp: 2999,
    discount: 45,
    rating: 4.5,
    reviews: '15,640',
    highlights: ['Virtual 7.1 Spatial Surround Drivers', 'Dynamic RGB Breathing Earcup Rings', 'Detachable Noise-Isolating Boom Mic'],
    image: 'assets/images/products/gaming-headset.jpg'
  },
  {
    id: 'portable-speaker-20w',
    title: 'Portable Speaker (20W)',
    subtitle: 'Deep Bass, Bluetooth 5.3',
    category: 'Audio & Wearables',
    price: 5999,
    mrp: 9999,
    discount: 40,
    rating: 4.8,
    reviews: '8,940',
    highlights: ['20W Racetrack Driver + Dual Bass Radiators', 'IP67 Waterproof & Dustproof Rugged Fabric', 'Bluetooth 5.3 with PartyBoost Stereo Pairing'],
    image: 'assets/images/products/portable-speaker-20w.jpg'
  }
];

// Additional Products for Tech Wishes & Beauty/Home Care Rows
const EXTRA_PRODUCTS = [
  {
    id: 'gan-charger-65w',
    title: '65W GaN III Fast Charger',
    subtitle: '3-Port USB-C PD + PPS',
    category: 'Power & Tech',
    section: 'tech',
    price: 1999,
    mrp: 3499,
    discount: 43,
    rating: 4.8,
    reviews: '6,410',
    highlights: ['Charges MacBook, iPhone & Earbuds simultaneously', 'GaN III Cool-Tech thermal protection', 'Foldable Indian pins'],
    image: 'assets/images/products/gan-charger-65w.jpg'
  },
  {
    id: 'powerbank-20k',
    title: '20,000mAh MagSafe Power Bank',
    subtitle: '22.5W Wireless + Wired PD',
    category: 'Power & Tech',
    section: 'tech',
    price: 2499,
    mrp: 4299,
    discount: 42,
    rating: 4.7,
    reviews: '8,120',
    highlights: ['Strong N52 Magnetic Snap Alignment', 'Digital LED Battery Percentage Display', 'Airline-Safe Li-Polymer Cells'],
    image: 'assets/images/products/powerbank-20k.jpg'
  },
  {
    id: 'nvme-ssd-1tb',
    title: '1TB Portable NVMe SSD',
    subtitle: '1050MB/s USB 3.2 Gen 2',
    category: 'Computing',
    section: 'tech',
    price: 6999,
    mrp: 11999,
    discount: 42,
    rating: 4.9,
    reviews: '3,950',
    highlights: ['Blazing 1050MB/s Read & Write Speeds', 'Shock-Resistant Anodized Aluminum Body', 'Includes USB-C to C & USB-A Cables'],
    image: 'assets/images/products/nvme-ssd-1tb.jpg'
  },
  {
    id: 'usb-c-hub-7in1',
    title: '7-in-1 Aluminum USB-C Hub',
    subtitle: '4K HDMI, 100W PD, SD/TF',
    category: 'Computing',
    section: 'tech',
    price: 1799,
    mrp: 3299,
    discount: 45,
    rating: 4.6,
    reviews: '5,290',
    highlights: ['4K @ 60Hz Ultra-HD HDMI Output', '100W Pass-Through Power Delivery', '3x USB 3.0 High-Speed Ports'],
    image: 'assets/images/products/usb-c-hub-7in1.jpg'
  },
  {
    id: 'smart-cam-360',
    title: '360° AI Home Security Cam',
    subtitle: '2K QHD, Night Vision, Two-Way Audio',
    category: 'Smart Home',
    section: 'tech',
    price: 1899,
    mrp: 3499,
    discount: 46,
    rating: 4.7,
    reviews: '11,040',
    highlights: ['360° Pan & 114° Vertical Tilt Coverage', 'AI Human Motion Detection Alerts', 'Supports up to 256GB microSD + Cloud'],
    image: 'assets/images/products/smart-cam-360.jpg'
  },
  {
    id: 'surge-protector',
    title: 'Smart Wi-Fi Surge Power Strip',
    subtitle: '4 AC Sockets + 4 USB Ports',
    category: 'Power & Tech',
    section: 'tech',
    price: 1299,
    mrp: 2199,
    discount: 41,
    rating: 4.6,
    reviews: '4,680',
    highlights: ['App & Voice Control (Alexa & Google Home)', '1500J Surge & Overload Protection', 'Individual Socket Scheduling'],
    image: 'assets/images/products/surge-protector.jpg'
  },
  {
    id: 'air-fryer-45l',
    title: 'Digital Air Fryer (4.5L)',
    subtitle: '8 Presets, 90% Less Oil',
    category: 'Home & Kitchen',
    section: 'lifestyle',
    price: 4499,
    mrp: 7999,
    discount: 44,
    rating: 4.8,
    reviews: '7,820',
    highlights: ['360° Rapid Air Crisp Convection', 'Touch LED Digital Control Panel', 'Dishwasher-Safe Non-Stick Basket'],
    image: 'assets/images/products/air-fryer-45l.jpg'
  },
  {
    id: 'vitamin-c-serum',
    title: '15% Vitamin C Glow Serum',
    subtitle: 'Dermatologist Tested · 30ml',
    category: 'Beauty',
    section: 'lifestyle',
    price: 499,
    mrp: 899,
    discount: 44,
    rating: 4.7,
    reviews: '14,210',
    highlights: ['Pure L-Ascorbic Acid + Ferulic Acid', 'Brightens Dark Spots & Boosts Collagen', 'Fragrance-Free & Non-Comedogenic'],
    image: 'assets/images/products/vitamin-c-serum.jpg'
  },
  {
    id: 'espresso-maker',
    title: 'Barista Espresso Coffee Maker',
    subtitle: '15-Bar Pressure + Milk Frother',
    category: 'Home & Kitchen',
    section: 'lifestyle',
    price: 7499,
    mrp: 12999,
    discount: 42,
    rating: 4.8,
    reviews: '3,110',
    highlights: ['15-Bar Italian Pump for Rich Crema', '360° Swivel Steam Wand for Cappuccinos', '1.5L Removable Transparent Water Tank'],
    image: 'assets/images/products/espresso-maker.jpg'
  },
  {
    id: 'air-purifier-hepa',
    title: 'True HEPA H13 Air Purifier',
    subtitle: 'Covers 450 sq.ft · PM2.5 Sensor',
    category: 'Home & Kitchen',
    section: 'lifestyle',
    price: 6499,
    mrp: 10999,
    discount: 41,
    rating: 4.7,
    reviews: '5,490',
    highlights: ['Captures 99.97% Allergens, Dust & Smoke', 'Whisper-Quiet 22dB Sleep Mode', 'Real-Time Air Quality Color Ring'],
    image: 'assets/images/products/air-purifier-hepa.jpg'
  },
  {
    id: 'electric-toothbrush',
    title: 'Sonic Pro Electric Toothbrush',
    subtitle: '5 Brushing Modes · 60-Day Battery',
    category: 'Beauty',
    section: 'lifestyle',
    price: 1499,
    mrp: 2999,
    discount: 50,
    rating: 4.8,
    reviews: '9,870',
    highlights: ['42,000 Micro-Brushes Per Minute', 'Smart 2-Minute QuadPacer Timer', 'Includes 4 DuPont Replacement Heads'],
    image: 'assets/images/products/electric-toothbrush.jpg'
  },
  {
    id: 'aroma-diffuser',
    title: 'Ultrasonic Aroma Diffuser',
    subtitle: '7 Ambient LED Colors · Auto Shut-Off',
    category: 'Home & Kitchen',
    section: 'lifestyle',
    price: 1199,
    mrp: 2299,
    discount: 48,
    rating: 4.6,
    reviews: '4,320',
    highlights: ['Whisper-Quiet Ultrasonic Cool Mist', '7 Soothing Mood Lighting Presets', 'BPA-Free 400ml Capacity'],
    image: 'assets/images/products/aroma-diffuser.jpg'
  }
];

const ALL_CATALOG = [...PRODUCTS, ...EXTRA_PRODUCTS];

const FASHION_COLLECTIONS = [
  { name: 'Puma, Adidas & More', offer: 'From ₹99', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><path d="M12 42C12 34 22 30 30 30L42 22L52 34V44H12V42Z" fill="#0b57d0"/><path d="M12 44H52V48H12V44Z" fill="#ffffff" stroke="#0b57d0" stroke-width="1.5"/></svg>` },
  { name: 'Peter England, Allen Solly', offer: 'Min. 10% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><path d="M20 14L10 22L16 28L20 25V50H44V25L48 28L54 22L44 14L32 20L20 14Z" fill="#1e3a8a"/></svg>` },
  { name: 'Fashion Accessories', offer: 'Min. 30% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><rect x="16" y="24" width="32" height="24" rx="6" fill="#0ea5e9"/><path d="M24 24V18C24 14 40 14 40 18V24" stroke="#0f172a" stroke-width="3"/></svg>` },
  { name: 'Groversons & Beauty', offer: 'Min. 10% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><rect x="22" y="22" width="20" height="30" rx="5" fill="#ec4899"/><rect x="26" y="14" width="12" height="8" rx="2" fill="#0f172a"/></svg>` },
  { name: 'Running & Walking Shoes', offer: 'From ₹100', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><path d="M10 40L26 26L38 32L54 36V44H10V40Z" fill="#2563eb"/><circle cx="24" cy="36" r="2" fill="#ffffff"/><circle cx="32" cy="36" r="2" fill="#ffffff"/></svg>` },
  { name: 'Everyday Fashion', offer: 'Min. 30% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><path d="M22 14H42L46 50H18L22 14Z" fill="#3b82f6"/><path d="M22 24H42" stroke="#ffffff" stroke-width="2"/></svg>` }
];

const SPORTS_COLLECTIONS = [
  { name: 'Fitness Essentials', offer: 'From ₹99', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><rect x="12" y="22" width="8" height="20" rx="3" fill="#0f172a"/><rect x="44" y="22" width="8" height="20" rx="3" fill="#0f172a"/><rect x="20" y="29" width="24" height="6" fill="#0b57d0"/></svg>` },
  { name: 'Sports Shoes & Sandals', offer: 'Min. 10% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><path d="M12 42C16 30 34 26 52 38V44H12V42Z" fill="#059669"/></svg>` },
  { name: 'Gym & Activewear', offer: 'Min. 30% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><path d="M20 14H44L40 48H24L20 14Z" fill="#0284c7"/></svg>` },
  { name: 'Health & Wellness', offer: 'Min. 10% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><rect x="18" y="18" width="28" height="28" rx="8" fill="#ef4444"/><path d="M32 24V40M24 32H40" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/></svg>` },
  { name: 'Running & Walking', offer: 'From ₹100', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="18" stroke="#0b57d0" stroke-width="4"/><path d="M32 22V32L38 36" stroke="#0b57d0" stroke-width="3" stroke-linecap="round"/></svg>` },
  { name: 'Outdoor & Adventure', offer: 'Min. 30% Off', svg: `<svg width="68" height="68" viewBox="0 0 64 64" fill="none"><path d="M12 46L32 16L52 46H12Z" fill="#1d4ed8"/><path d="M26 46L32 34L38 46H26Z" fill="#93c5fd"/></svg>` }
];

const FEATURED_BRANDS = [
  { name: 'Apple', mono: '', logo: 'assets/images/brands/apple.svg', offer: 'Up to ₹10,000 Off' },
  { name: 'Sony', mono: 'SN', logo: 'assets/images/brands/sony.png', offer: 'Up to 35% Off' },
  { name: 'Samsung', mono: 'SM', logo: 'assets/images/brands/samsung.png', offer: 'Up to 40% Off' },
  { name: 'Puma', mono: 'PM', logo: 'assets/images/brands/puma.svg', offer: 'Min. 50% Off' },
  { name: 'JBL', mono: 'JBL', logo: 'assets/images/brands/jbl.svg', offer: 'Up to 45% Off' },
  { name: 'Bosch', mono: 'BS', logo: 'assets/images/brands/bosch.svg', offer: 'Up to 30% Off' },
  { name: 'Havells', mono: 'HV', logo: 'assets/images/brands/havells.svg', offer: 'Up to 40% Off' },
  { name: 'Logitech', mono: 'LG', logo: 'assets/images/brands/logitech.png', offer: 'Up to 35% Off' }
];

const DISCOVERY_QUADS = [
  {
    title: 'More Items to Consider',
    cta: 'See all recommendations →',
    items: ['earbuds-anc', 'gan-charger-65w', 'smartwatch-bt', 'powerbank-20k']
  },
  {
    title: 'Keep Shopping For',
    cta: 'Continue shopping →',
    items: ['laptop-14-i5', 'nvme-ssd-1tb', 'usb-c-hub-7in1', 'gaming-headset']
  },
  {
    title: 'New Collection Near You',
    cta: 'Explore Chennai store →',
    items: ['air-fryer-45l', 'espresso-maker', 'air-purifier-hepa', 'aroma-diffuser']
  },
  {
    title: 'Electronics for Home & Office',
    cta: 'Shop Smart Office →',
    items: ['mirrorless-camera', 'portable-speaker-20w', 'smart-cam-360', 'surge-protector']
  }
];

const COUPONS_DATA = [
  { tag: 'Electronics Special', title: 'Flat ₹500 Instant Off', desc: 'Valid on orders above ₹2,999', code: 'HAPPY500', discount: 500 },
  { tag: 'HDFC & ICICI Cards', title: '10% Bank Cashback', desc: 'Up to ₹1,500 on Credit/Debit EMI', code: 'BANK10', discount: 350 },
  { tag: 'New User Welcome', title: 'Extra ₹100 Off First Order', desc: 'Applicable across all categories', code: 'FIRST100', discount: 100 },
  { tag: 'Audio & Gaming Fest', title: 'Flat ₹250 Off Audio', desc: 'On Earbuds, Headsets & Speakers', code: 'SOUND250', discount: 250 }
];

const HOT_TAGS = [
  'iPhone 17 Pro', 'Wireless Earbuds', '65W GaN Charger', 'AMOLED Smartwatch',
  '4K Mirrorless Camera', 'Gaming Headset 7.1', '20W Bluetooth Speaker',
  'Digital Air Fryer', '1TB NVMe SSD', 'MagSafe Power Bank', 'HEPA Air Purifier', 'Running Shoes'
];


const HERO_SPECIAL_ITEMS = {
  iphone17pro: {
    id: 'iphone-17-pro',
    title: 'iPhone 17 Pro (256GB, Titanium Blue)',
    subtitle: 'A19 Pro Chip · Pro Camera System',
    category: 'Computing',
    price: 134900,
    mrp: 144900,
    discount: 7,
    image: 'assets/images/hero/hero-iphone.jpg'
  }
};

// =========================================================================
// B. 11 CATEGORY STRIP ITEMS (Exact Match to Screenshot)
// =========================================================================
const CATEGORIES = [
  { name: 'Mobiles', filter: 'Computing', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="14" y="6" width="20" height="36" rx="4" fill="#0f172a"/><rect x="16" y="9" width="16" height="30" rx="2" fill="#2563eb"/><circle cx="24" cy="12" r="1.2" fill="#0f172a"/></svg>` },
  { name: 'Laptops', filter: 'Computing', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="10" y="10" width="28" height="20" rx="3" fill="#0f172a"/><rect x="13" y="13" width="22" height="14" fill="#38bdf8"/><path d="M6 30H42L39 34H9L6 30Z" fill="#64748b"/></svg>` },
  { name: 'Electronics', filter: 'Audio & Wearables', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><path d="M12 26C12 16 36 16 36 26" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/><rect x="9" y="24" width="7" height="14" rx="3.5" fill="#0b57d0"/><rect x="32" y="24" width="7" height="14" rx="3.5" fill="#0b57d0"/></svg>` },
  { name: 'Fashion', filter: 'all', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><path d="M16 10L8 16L13 22L17 19V38H31V19L35 22L40 16L32 10C30 13 18 13 16 10Z" fill="#2563eb"/></svg>` },
  { name: 'Home & Kitchen', filter: 'all', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="12" y="18" width="24" height="18" rx="4" fill="#64748b"/><path d="M10 18H38" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><rect x="20" y="13" width="8" height="3" rx="1.5" fill="#0f172a"/></svg>` },
  { name: 'Appliances', filter: 'all', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="12" y="8" width="24" height="32" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2"/><circle cx="24" cy="26" r="8" fill="#1e3a8a" stroke="#ffffff" stroke-width="2"/></svg>` },
  { name: 'Beauty', filter: 'all', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="14" y="16" width="9" height="22" rx="2" fill="#38bdf8"/><rect x="16" y="11" width="5" height="5" fill="#0284c7"/><rect x="26" y="20" width="8" height="18" rx="2" fill="#93c5fd"/><rect x="28" y="15" width="4" height="5" fill="#1d4ed8"/></svg>` },
  { name: 'Toys & Games', filter: 'Gaming', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="8" y="16" width="32" height="18" rx="9" fill="#1e293b"/><circle cx="16" cy="25" r="3" fill="#38bdf8"/><circle cx="31" cy="23" r="2" fill="#f43f5e"/><circle cx="35" cy="27" r="2" fill="#10b981"/></svg>` },
  { name: 'Books', filter: 'all', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="10" y="12" width="28" height="7" rx="2" fill="#2563eb"/><rect x="12" y="20" width="26" height="7" rx="2" fill="#f59e0b"/><rect x="10" y="28" width="28" height="7" rx="2" fill="#0ea5e9"/></svg>` },
  { name: 'Sports', filter: 'all', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" fill="#ea580c"/><path d="M10 24H38M24 10V38" stroke="#7c2d12" stroke-width="2"/></svg>` },
  { name: 'More', filter: 'all', svg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="13" y="13" width="9" height="9" rx="2" stroke="#0b57d0" stroke-width="2.4"/><rect x="26" y="13" width="9" height="9" rx="2" stroke="#0b57d0" stroke-width="2.4"/><rect x="13" y="26" width="9" height="9" rx="2" stroke="#0b57d0" stroke-width="2.4"/><rect x="26" y="26" width="9" height="9" rx="2" stroke="#0b57d0" stroke-width="2.4"/></svg>` }
];
