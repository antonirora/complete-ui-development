// ============================================
// AutoParts Pro - Comprehensive Mock Database
// ============================================

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  image: string;
  partNumber: string;
  compatibility: string[];
  description: string;
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  productCount: number;
  description: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  items: { productId: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

// ============================================
// Categories
// ============================================
export const CATEGORIES: Category[] = [
  { id: "1", slug: "brakes", name: "Brakes", icon: "disc", productCount: 245, description: "Brake pads, rotors, calipers, and brake fluid" },
  { id: "2", slug: "engine", name: "Engine Parts", icon: "cog", productCount: 512, description: "Spark plugs, timing belts, gaskets, and engine components" },
  { id: "3", slug: "suspension", name: "Suspension", icon: "spring", productCount: 189, description: "Shocks, struts, control arms, and suspension kits" },
  { id: "4", slug: "electrical", name: "Electrical", icon: "zap", productCount: 334, description: "Batteries, alternators, starters, and lighting" },
  { id: "5", slug: "filters", name: "Filters", icon: "filter", productCount: 156, description: "Oil, air, fuel, and cabin filters" },
  { id: "6", slug: "exhaust", name: "Exhaust", icon: "wind", productCount: 98, description: "Mufflers, catalytic converters, and exhaust pipes" },
  { id: "7", slug: "cooling", name: "Cooling", icon: "thermometer", productCount: 127, description: "Radiators, water pumps, thermostats, and hoses" },
  { id: "8", slug: "transmission", name: "Transmission", icon: "settings", productCount: 203, description: "Clutches, flywheels, and transmission parts" },
];

// ============================================
// Brands
// ============================================
export const BRANDS: Brand[] = [
  { id: "1", name: "Brembo", logo: "/brands/brembo.png", productCount: 45 },
  { id: "2", name: "K&N", logo: "/brands/kn.png", productCount: 32 },
  { id: "3", name: "NGK", logo: "/brands/ngk.png", productCount: 28 },
  { id: "4", name: "Sylvania", logo: "/brands/sylvania.png", productCount: 21 },
  { id: "5", name: "Monroe", logo: "/brands/monroe.png", productCount: 38 },
  { id: "6", name: "Gates", logo: "/brands/gates.png", productCount: 55 },
  { id: "7", name: "Bosch", logo: "/brands/bosch.png", productCount: 89 },
  { id: "8", name: "ACDelco", logo: "/brands/acdelco.png", productCount: 67 },
  { id: "9", name: "Denso", logo: "/brands/denso.png", productCount: 43 },
  { id: "10", name: "Moog", logo: "/brands/moog.png", productCount: 52 },
  { id: "11", name: "Motorcraft", logo: "/brands/motorcraft.png", productCount: 61 },
  { id: "12", name: "Wagner", logo: "/brands/wagner.png", productCount: 34 },
];

// ============================================
// Products - Comprehensive catalog
// ============================================
export const ALL_PRODUCTS: Product[] = [
  // BRAKES (8 products)
  {
    id: "1",
    name: "Ceramic Brake Pads - Front",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "Brembo",
    price: 89.99,
    originalPrice: 119.99,
    inStock: true,
    stockCount: 24,
    rating: 4.8,
    reviewCount: 342,
    image: "/products/brake-pads.jpg",
    partNumber: "BRM-P83024",
    compatibility: ["Toyota Camry 2018-2024", "Honda Accord 2018-2024", "Nissan Altima 2019-2024"],
    description: "Premium ceramic brake pads with advanced noise reduction technology. Low dust formula keeps wheels cleaner longer.",
    specifications: { Material: "Ceramic", Position: "Front", "Pad Thickness": "12mm", "Wear Indicator": "Yes" },
  },
  {
    id: "2",
    name: "Performance Brake Rotors - Front Pair",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "Brembo",
    price: 189.99,
    originalPrice: 249.99,
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 156,
    image: "/products/brake-rotors.jpg",
    partNumber: "BRM-R83201",
    compatibility: ["Ford Mustang 2015-2024", "Chevrolet Camaro 2016-2024"],
    description: "Drilled and slotted performance rotors for improved heat dissipation and wet weather performance.",
    specifications: { "Rotor Type": "Drilled & Slotted", "Diameter": "13.6 inches", Material: "Cast Iron", Position: "Front" },
  },
  {
    id: "3",
    name: "Brake Caliper - Rear Left",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "ACDelco",
    price: 149.99,
    inStock: true,
    stockCount: 8,
    rating: 4.6,
    reviewCount: 89,
    image: "/products/brake-caliper.jpg",
    partNumber: "ACD-18FR2389",
    compatibility: ["Chevrolet Silverado 2014-2019", "GMC Sierra 2014-2019"],
    description: "OEM-quality replacement brake caliper with new hardware included.",
    specifications: { Position: "Rear Left", "Piston Count": "Single", Material: "Aluminum", "Includes Hardware": "Yes" },
  },
  {
    id: "4",
    name: "DOT 4 Brake Fluid - 32oz",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "Bosch",
    price: 12.99,
    inStock: true,
    stockCount: 156,
    rating: 4.7,
    reviewCount: 234,
    image: "/products/brake-fluid.jpg",
    partNumber: "BSH-ESI6-32N",
    compatibility: ["Universal - Check owner's manual"],
    description: "High performance DOT 4 brake fluid with low moisture absorption.",
    specifications: { Type: "DOT 4", "Boiling Point": "446°F dry", Volume: "32 oz", "Low Moisture": "Yes" },
  },
  {
    id: "5",
    name: "Ceramic Brake Pads - Rear",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "Wagner",
    price: 64.99,
    inStock: true,
    stockCount: 45,
    rating: 4.5,
    reviewCount: 278,
    image: "/products/brake-pads-rear.jpg",
    partNumber: "WAG-QC1194",
    compatibility: ["Honda CR-V 2017-2024", "Toyota RAV4 2019-2024"],
    description: "OE-quality ceramic brake pads with integrated wear indicator.",
    specifications: { Material: "Ceramic", Position: "Rear", "Pad Thickness": "10mm", "Wear Indicator": "Yes" },
  },
  {
    id: "6",
    name: "Brake Master Cylinder",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "Motorcraft",
    price: 178.99,
    inStock: false,
    stockCount: 0,
    rating: 4.8,
    reviewCount: 67,
    image: "/products/master-cylinder.jpg",
    partNumber: "MTC-BRMC35",
    compatibility: ["Ford F-150 2015-2020", "Ford Expedition 2018-2024"],
    description: "OEM replacement brake master cylinder with reservoir.",
    specifications: { "Bore Size": "1.0 inch", "Reservoir Included": "Yes", Material: "Aluminum", "Port Count": "2" },
  },
  {
    id: "7",
    name: "Brake Line Set - Stainless Steel",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "Brembo",
    price: 124.99,
    inStock: true,
    stockCount: 18,
    rating: 4.9,
    reviewCount: 134,
    image: "/products/brake-lines.jpg",
    partNumber: "BRM-SS5463",
    compatibility: ["Universal fit - trim to size"],
    description: "Braided stainless steel brake lines for improved pedal feel and durability.",
    specifications: { Material: "Stainless Steel", "Line Count": "4", "DOT Approved": "Yes", Length: "Adjustable" },
  },
  {
    id: "8",
    name: "Brake Pad Wear Sensor",
    category: "Brakes",
    categorySlug: "brakes",
    brand: "Bosch",
    price: 18.99,
    inStock: true,
    stockCount: 89,
    rating: 4.4,
    reviewCount: 56,
    image: "/products/wear-sensor.jpg",
    partNumber: "BSH-1987473522",
    compatibility: ["BMW 3-Series 2012-2018", "BMW 5-Series 2011-2017"],
    description: "Electronic brake pad wear sensor for dashboard indicator.",
    specifications: { Position: "Front", "Connector Type": "2-Pin", Length: "450mm", OE: "Yes" },
  },

  // ENGINE PARTS (8 products)
  {
    id: "9",
    name: "Spark Plugs Set (4 Pack)",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "NGK",
    price: 32.99,
    originalPrice: 44.99,
    inStock: true,
    stockCount: 128,
    rating: 4.7,
    reviewCount: 567,
    image: "/products/spark-plugs.jpg",
    partNumber: "NGK-7092",
    compatibility: ["Honda Civic 2016-2024", "Toyota Corolla 2019-2024", "Mazda 3 2019-2024"],
    description: "Iridium spark plugs for improved fuel efficiency and longer life.",
    specifications: { Type: "Iridium", "Gap": "0.044 inches", "Heat Range": "5", Quantity: "4" },
  },
  {
    id: "10",
    name: "Timing Belt Kit",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "Gates",
    price: 189.99,
    originalPrice: 249.99,
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 445,
    image: "/products/timing-belt.jpg",
    partNumber: "GAT-TCKWP328",
    compatibility: ["Honda Odyssey 2008-2017", "Honda Pilot 2009-2015", "Acura MDX 2010-2013"],
    description: "Complete timing belt kit with water pump, tensioner, and idler pulleys.",
    specifications: { "Includes Water Pump": "Yes", "Belt Material": "HNBR", Tensioner: "Included", Idlers: "2 Included" },
  },
  {
    id: "11",
    name: "Ignition Coil Pack",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "Denso",
    price: 89.99,
    inStock: true,
    stockCount: 34,
    rating: 4.6,
    reviewCount: 189,
    image: "/products/ignition-coil.jpg",
    partNumber: "DEN-673-1303",
    compatibility: ["Toyota Tacoma 2005-2015", "Toyota 4Runner 2003-2009"],
    description: "Direct-fit ignition coil with OEM-quality construction.",
    specifications: { Type: "Pencil Coil", "Primary Resistance": "0.7Ω", "Secondary Resistance": "12kΩ", OE: "Yes" },
  },
  {
    id: "12",
    name: "Engine Oil - 5W-30 Synthetic (5 Qt)",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "Mobil 1",
    price: 34.99,
    inStock: true,
    stockCount: 200,
    rating: 4.9,
    reviewCount: 1234,
    image: "/products/motor-oil.jpg",
    partNumber: "MOB-120764",
    compatibility: ["Most vehicles requiring 5W-30"],
    description: "Full synthetic motor oil for maximum engine protection.",
    specifications: { Viscosity: "5W-30", Type: "Full Synthetic", Volume: "5 Quarts", "API Rating": "SN Plus" },
  },
  {
    id: "13",
    name: "Valve Cover Gasket Set",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "Fel-Pro",
    price: 45.99,
    inStock: true,
    stockCount: 23,
    rating: 4.5,
    reviewCount: 156,
    image: "/products/valve-gasket.jpg",
    partNumber: "FEL-VS50738R",
    compatibility: ["Chevrolet LS Engines V8", "GM 5.3L, 6.0L, 6.2L"],
    description: "Molded rubber valve cover gasket with steel carrier for leak-free seal.",
    specifications: { Material: "Molded Rubber", "Steel Core": "Yes", Position: "Both Sides", "Grommets Included": "Yes" },
  },
  {
    id: "14",
    name: "Serpentine Belt",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "Gates",
    price: 28.99,
    inStock: true,
    stockCount: 67,
    rating: 4.7,
    reviewCount: 345,
    image: "/products/serpentine-belt.jpg",
    partNumber: "GAT-K061031",
    compatibility: ["Ford F-150 2011-2014", "Ford Expedition 2011-2014"],
    description: "Premium serpentine belt with EPDM compound for extended life.",
    specifications: { Material: "EPDM", "Rib Count": "6", Length: "103.1 inches", "OE Quality": "Yes" },
  },
  {
    id: "15",
    name: "Oxygen Sensor - Upstream",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "Bosch",
    price: 67.99,
    inStock: true,
    stockCount: 41,
    rating: 4.6,
    reviewCount: 234,
    image: "/products/o2-sensor.jpg",
    partNumber: "BSH-15733",
    compatibility: ["Toyota Camry 2007-2011", "Lexus ES350 2007-2012"],
    description: "Direct-fit heated oxygen sensor for accurate fuel mixture monitoring.",
    specifications: { Position: "Upstream", "Wire Count": "4", "Heated": "Yes", "Connector Type": "Direct Fit" },
  },
  {
    id: "16",
    name: "Fuel Injector Set (6 Pack)",
    category: "Engine Parts",
    categorySlug: "engine",
    brand: "Bosch",
    price: 289.99,
    originalPrice: 349.99,
    inStock: false,
    stockCount: 0,
    rating: 4.8,
    reviewCount: 167,
    image: "/products/fuel-injectors.jpg",
    partNumber: "BSH-62693",
    compatibility: ["BMW 328i 2007-2013", "BMW 528i 2008-2010"],
    description: "Remanufactured fuel injector set with OE spray pattern.",
    specifications: { Type: "Port Injection", "Flow Rate": "226g/min", Quantity: "6", Remanufactured: "Yes" },
  },

  // FILTERS (6 products)
  {
    id: "17",
    name: "Performance Air Filter",
    category: "Filters",
    categorySlug: "filters",
    brand: "K&N",
    price: 54.99,
    inStock: true,
    stockCount: 56,
    rating: 4.9,
    reviewCount: 891,
    image: "/products/air-filter.jpg",
    partNumber: "KN-33-2499",
    compatibility: ["Universal Fit - Most vehicles"],
    description: "Washable, reusable high-flow air filter with million-mile warranty.",
    specifications: { Type: "Washable", "Filter Media": "Cotton Gauze", "Million Mile Warranty": "Yes", "Flow Increase": "Up to 50%" },
  },
  {
    id: "18",
    name: "Oil Filter",
    category: "Filters",
    categorySlug: "filters",
    brand: "Bosch",
    price: 8.99,
    inStock: true,
    stockCount: 234,
    rating: 4.6,
    reviewCount: 678,
    image: "/products/oil-filter.jpg",
    partNumber: "BSH-3330",
    compatibility: ["Honda Accord 2008-2017", "Honda CR-V 2007-2016", "Acura TL 2009-2014"],
    description: "Premium oil filter with synthetic blend media for extended protection.",
    specifications: { Media: "Synthetic Blend", "Anti-Drainback Valve": "Yes", "Micron Rating": "25", "Thread Size": "M20x1.5" },
  },
  {
    id: "19",
    name: "Cabin Air Filter",
    category: "Filters",
    categorySlug: "filters",
    brand: "Denso",
    price: 18.99,
    inStock: true,
    stockCount: 89,
    rating: 4.5,
    reviewCount: 345,
    image: "/products/cabin-filter.jpg",
    partNumber: "DEN-453-4015",
    compatibility: ["Toyota Camry 2012-2017", "Toyota Avalon 2013-2018"],
    description: "Activated charcoal cabin filter for improved air quality and odor removal.",
    specifications: { Type: "Activated Charcoal", "Particle Size": "2.5 microns", "Deodorizing": "Yes", Dimensions: "10x8x1 inches" },
  },
  {
    id: "20",
    name: "Fuel Filter",
    category: "Filters",
    categorySlug: "filters",
    brand: "ACDelco",
    price: 24.99,
    inStock: true,
    stockCount: 45,
    rating: 4.7,
    reviewCount: 189,
    image: "/products/fuel-filter.jpg",
    partNumber: "ACD-GF832",
    compatibility: ["Chevrolet Silverado 2004-2007", "GMC Sierra 2004-2007"],
    description: "In-line fuel filter with high-efficiency media.",
    specifications: { Type: "In-Line", "Micron Rating": "10", "Flow Rate": "90 GPH", "Mounting": "Hose Clamp" },
  },
  {
    id: "21",
    name: "Transmission Filter Kit",
    category: "Filters",
    categorySlug: "filters",
    brand: "ACDelco",
    price: 39.99,
    inStock: true,
    stockCount: 28,
    rating: 4.6,
    reviewCount: 123,
    image: "/products/trans-filter.jpg",
    partNumber: "ACD-TF292",
    compatibility: ["GM 6L80 Transmission", "Chevrolet, GMC, Cadillac 2006-2015"],
    description: "Complete transmission filter kit with gasket.",
    specifications: { "Filter Type": "Deep Pan", "Gasket Material": "Cork/Rubber", "Magnet Included": "Yes", "OE Quality": "Yes" },
  },
  {
    id: "22",
    name: "PCV Valve",
    category: "Filters",
    categorySlug: "filters",
    brand: "Motorcraft",
    price: 14.99,
    inStock: true,
    stockCount: 112,
    rating: 4.4,
    reviewCount: 89,
    image: "/products/pcv-valve.jpg",
    partNumber: "MTC-EV276",
    compatibility: ["Ford F-150 2015-2020", "Ford Mustang 2015-2020"],
    description: "OE replacement PCV valve for emission system.",
    specifications: { Type: "Diaphragm", "Vacuum Rating": "18 in/Hg", OE: "Yes", Material: "Plastic" },
  },

  // ELECTRICAL (6 products)
  {
    id: "23",
    name: "LED Headlight Bulbs H11",
    category: "Electrical",
    categorySlug: "electrical",
    brand: "Sylvania",
    price: 79.99,
    inStock: true,
    stockCount: 43,
    rating: 4.6,
    reviewCount: 234,
    image: "/products/led-bulbs.jpg",
    partNumber: "SYL-H11LED",
    compatibility: ["Most vehicles with H11 bulbs"],
    description: "Ultra-bright LED headlight bulbs with 300% more brightness than halogen.",
    specifications: { Type: "LED", Lumens: "6000", Color: "6000K Cool White", "Lifespan": "30,000 hours" },
  },
  {
    id: "24",
    name: "Car Battery - 12V Group 35",
    category: "Electrical",
    categorySlug: "electrical",
    brand: "ACDelco",
    price: 159.99,
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 456,
    image: "/products/battery.jpg",
    partNumber: "ACD-35AGM",
    compatibility: ["Honda, Toyota, Nissan, Mazda - Many models"],
    description: "AGM battery with enhanced cycling capability and maintenance-free design.",
    specifications: { Type: "AGM", "Group Size": "35", CCA: "650", "Reserve Capacity": "100 min", Warranty: "36 months" },
  },
  {
    id: "25",
    name: "Alternator - Remanufactured",
    category: "Electrical",
    categorySlug: "electrical",
    brand: "Bosch",
    price: 189.99,
    originalPrice: 249.99,
    inStock: true,
    stockCount: 8,
    rating: 4.5,
    reviewCount: 178,
    image: "/products/alternator.jpg",
    partNumber: "BSH-AL8810X",
    compatibility: ["Ford F-150 2009-2014", "Ford Expedition 2009-2014"],
    description: "Premium remanufactured alternator with new bearings and voltage regulator.",
    specifications: { Amperage: "200A", Voltage: "12V", "Pulley Type": "Serpentine 6-Groove", Remanufactured: "Yes" },
  },
  {
    id: "26",
    name: "Starter Motor",
    category: "Electrical",
    categorySlug: "electrical",
    brand: "Denso",
    price: 234.99,
    inStock: false,
    stockCount: 0,
    rating: 4.7,
    reviewCount: 145,
    image: "/products/starter.jpg",
    partNumber: "DEN-280-0429",
    compatibility: ["Toyota Tundra 2007-2013", "Toyota Sequoia 2008-2013"],
    description: "OE-quality replacement starter motor with gear reduction design.",
    specifications: { Type: "Gear Reduction", Voltage: "12V", "Kilowatts": "2.0kW", "Rotation": "CW", OE: "Yes" },
  },
  {
    id: "27",
    name: "Fuse Box Cover",
    category: "Electrical",
    categorySlug: "electrical",
    brand: "Dorman",
    price: 29.99,
    inStock: true,
    stockCount: 34,
    rating: 4.3,
    reviewCount: 67,
    image: "/products/fuse-box.jpg",
    partNumber: "DOR-923-030",
    compatibility: ["Chevrolet Silverado 2007-2013", "GMC Sierra 2007-2013"],
    description: "Direct-fit fuse box cover replacement.",
    specifications: { Position: "Under Hood", Material: "ABS Plastic", "Color": "Black", "Direct Fit": "Yes" },
  },
  {
    id: "28",
    name: "Tail Light Assembly - Left",
    category: "Electrical",
    categorySlug: "electrical",
    brand: "TYC",
    price: 89.99,
    inStock: true,
    stockCount: 12,
    rating: 4.4,
    reviewCount: 98,
    image: "/products/tail-light.jpg",
    partNumber: "TYC-11-6849",
    compatibility: ["Honda Civic 2016-2021"],
    description: "Replacement tail light assembly with all bulbs included.",
    specifications: { Position: "Left/Driver", "Bulbs Included": "Yes", "DOT Approved": "Yes", Type: "Incandescent" },
  },

  // SUSPENSION (4 products)
  {
    id: "29",
    name: "Shock Absorber - Front Left",
    category: "Suspension",
    categorySlug: "suspension",
    brand: "Monroe",
    price: 124.99,
    inStock: false,
    stockCount: 0,
    rating: 4.5,
    reviewCount: 189,
    image: "/products/shock-absorber.jpg",
    partNumber: "MNR-72369",
    compatibility: ["Ford F-150 2015-2020", "Ford Expedition 2018-2021"],
    description: "Premium shock absorber with nitrogen gas charge for consistent performance.",
    specifications: { Type: "Gas-Charged", Position: "Front Left", "Extended Length": "23.8 inches", "Compressed": "15.4 inches" },
  },
  {
    id: "30",
    name: "Complete Strut Assembly - Front Right",
    category: "Suspension",
    categorySlug: "suspension",
    brand: "Monroe",
    price: 189.99,
    inStock: true,
    stockCount: 6,
    rating: 4.7,
    reviewCount: 234,
    image: "/products/strut-assembly.jpg",
    partNumber: "MNR-172563",
    compatibility: ["Toyota Camry 2012-2017", "Lexus ES350 2013-2018"],
    description: "Complete ready-to-install strut assembly with spring and mount.",
    specifications: { "Assembly Type": "Complete", Position: "Front Right", "Spring Included": "Yes", "Mount Included": "Yes" },
  },
  {
    id: "31",
    name: "Control Arm - Front Lower",
    category: "Suspension",
    categorySlug: "suspension",
    brand: "Moog",
    price: 149.99,
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewCount: 156,
    image: "/products/control-arm.jpg",
    partNumber: "MOG-RK620325",
    compatibility: ["Honda Accord 2008-2012", "Acura TSX 2009-2014"],
    description: "Premium control arm with pre-installed ball joint and bushings.",
    specifications: { Position: "Front Lower Left", "Ball Joint": "Pre-Installed", "Bushings": "Pre-Installed", Material: "Aluminum" },
  },
  {
    id: "32",
    name: "Sway Bar End Link Kit",
    category: "Suspension",
    categorySlug: "suspension",
    brand: "Moog",
    price: 34.99,
    inStock: true,
    stockCount: 45,
    rating: 4.6,
    reviewCount: 178,
    image: "/products/end-link.jpg",
    partNumber: "MOG-K750106",
    compatibility: ["Chevrolet Silverado 1500 2007-2018", "GMC Sierra 1500 2007-2018"],
    description: "Heavy-duty stabilizer bar end link with greaseable design.",
    specifications: { Position: "Front", "Greaseable": "Yes", Material: "Steel", "Hardware Included": "Yes" },
  },

  // COOLING (4 products)
  {
    id: "33",
    name: "Radiator - All Aluminum",
    category: "Cooling",
    categorySlug: "cooling",
    brand: "Denso",
    price: 249.99,
    inStock: true,
    stockCount: 7,
    rating: 4.8,
    reviewCount: 134,
    image: "/products/radiator.jpg",
    partNumber: "DEN-221-3149",
    compatibility: ["Honda Civic 2006-2011", "Acura CSX 2006-2011"],
    description: "All-aluminum performance radiator with increased cooling capacity.",
    specifications: { Material: "Aluminum", "Row Count": "2", "Core Size": "26x15x1", "Trans Cooler": "Yes" },
  },
  {
    id: "34",
    name: "Water Pump",
    category: "Cooling",
    categorySlug: "cooling",
    brand: "Gates",
    price: 89.99,
    inStock: true,
    stockCount: 19,
    rating: 4.7,
    reviewCount: 267,
    image: "/products/water-pump.jpg",
    partNumber: "GAT-41185",
    compatibility: ["Toyota Camry 2007-2017", "Toyota RAV4 2006-2018"],
    description: "Premium water pump with ceramic seal for extended life.",
    specifications: { "Seal Type": "Ceramic", "Impeller": "Cast Iron", "Bearing": "Sealed", "Gasket Included": "Yes" },
  },
  {
    id: "35",
    name: "Thermostat Housing Assembly",
    category: "Cooling",
    categorySlug: "cooling",
    brand: "Dorman",
    price: 67.99,
    inStock: true,
    stockCount: 23,
    rating: 4.5,
    reviewCount: 145,
    image: "/products/thermostat.jpg",
    partNumber: "DOR-902-2071",
    compatibility: ["Ford Edge 2007-2014", "Lincoln MKX 2007-2015"],
    description: "Complete thermostat housing with thermostat and gasket.",
    specifications: { "Thermostat Included": "Yes", "Opening Temp": "195°F", Material: "Aluminum", "Gasket Included": "Yes" },
  },
  {
    id: "36",
    name: "Coolant Reservoir Tank",
    category: "Cooling",
    categorySlug: "cooling",
    brand: "Dorman",
    price: 45.99,
    inStock: true,
    stockCount: 31,
    rating: 4.4,
    reviewCount: 89,
    image: "/products/coolant-tank.jpg",
    partNumber: "DOR-603-078",
    compatibility: ["Chevrolet Silverado 2007-2013", "GMC Sierra 2007-2013"],
    description: "Direct-fit coolant recovery tank with cap.",
    specifications: { "Cap Included": "Yes", Material: "HDPE Plastic", "Sensor Port": "Yes", "Direct Fit": "Yes" },
  },
];

// Helper to get featured products (those with discounts or high ratings)
export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(
  (p) => p.originalPrice || p.rating >= 4.8
).slice(0, 6);

// Helper to get products by category
export function getProductsByCategory(categorySlug: string): Product[] {
  return ALL_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

// Helper to get products on sale
export function getDealsProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.originalPrice);
}

// Helper to get product by ID
export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

// Helper to search products
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return ALL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.compatibility.some((c) => c.toLowerCase().includes(q))
  );
}

// ============================================
// Stats
// ============================================
export const STATS = {
  productsInStock: ALL_PRODUCTS.filter((p) => p.inStock).length,
  brandsCarried: BRANDS.length,
  ordersToday: 43,
  averageRating: 4.7,
  totalProducts: ALL_PRODUCTS.length,
};

// ============================================
// Orders - Comprehensive order history
// ============================================
export const ORDERS: Order[] = [
  {
    id: "ORD-001",
    date: "2024-03-10",
    customer: "John D.",
    email: "john.d@email.com",
    items: [
      { productId: "1", quantity: 2, price: 89.99 },
      { productId: "17", quantity: 1, price: 54.99 },
    ],
    subtotal: 234.97,
    shipping: 12.99,
    tax: 19.12,
    total: 267.08,
    status: "shipped",
    trackingNumber: "1Z999AA10123456784",
    estimatedDelivery: "2024-03-14",
    shippingAddress: { street: "123 Main St", city: "Los Angeles", state: "CA", zip: "90001" },
  },
  {
    id: "ORD-002",
    date: "2024-03-09",
    customer: "Sarah M.",
    email: "sarah.m@email.com",
    items: [{ productId: "2", quantity: 1, price: 189.99 }],
    subtotal: 189.99,
    shipping: 0,
    tax: 15.47,
    total: 205.46,
    status: "processing",
    shippingAddress: { street: "456 Oak Ave", city: "San Diego", state: "CA", zip: "92101" },
  },
  {
    id: "ORD-003",
    date: "2024-03-08",
    customer: "Mike R.",
    email: "mike.r@email.com",
    items: [
      { productId: "10", quantity: 1, price: 189.99 },
      { productId: "34", quantity: 1, price: 89.99 },
      { productId: "18", quantity: 3, price: 8.99 },
      { productId: "12", quantity: 2, price: 34.99 },
    ],
    subtotal: 376.93,
    shipping: 15.99,
    tax: 31.95,
    total: 424.87,
    status: "delivered",
    trackingNumber: "1Z999AA10123456785",
    shippingAddress: { street: "789 Pine Rd", city: "Phoenix", state: "AZ", zip: "85001" },
  },
  {
    id: "ORD-004",
    date: "2024-03-07",
    customer: "Emily K.",
    email: "emily.k@email.com",
    items: [
      { productId: "24", quantity: 1, price: 159.99 },
      { productId: "25", quantity: 1, price: 189.99 },
    ],
    subtotal: 349.98,
    shipping: 0,
    tax: 28.49,
    total: 378.47,
    status: "delivered",
    trackingNumber: "1Z999AA10123456786",
    shippingAddress: { street: "321 Elm Blvd", city: "Denver", state: "CO", zip: "80201" },
  },
  {
    id: "ORD-005",
    date: "2024-03-06",
    customer: "David L.",
    email: "david.l@email.com",
    items: [{ productId: "30", quantity: 2, price: 189.99 }],
    subtotal: 379.98,
    shipping: 19.99,
    tax: 32.60,
    total: 432.57,
    status: "shipped",
    trackingNumber: "1Z999AA10123456787",
    estimatedDelivery: "2024-03-12",
    shippingAddress: { street: "555 Cedar Ln", city: "Seattle", state: "WA", zip: "98101" },
  },
  {
    id: "ORD-006",
    date: "2024-03-05",
    customer: "Lisa P.",
    email: "lisa.p@email.com",
    items: [
      { productId: "9", quantity: 2, price: 32.99 },
      { productId: "11", quantity: 1, price: 89.99 },
    ],
    subtotal: 155.97,
    shipping: 8.99,
    tax: 13.43,
    total: 178.39,
    status: "pending",
    shippingAddress: { street: "888 Birch Way", city: "Portland", state: "OR", zip: "97201" },
  },
  {
    id: "ORD-007",
    date: "2024-03-04",
    customer: "James W.",
    email: "james.w@email.com",
    items: [
      { productId: "31", quantity: 2, price: 149.99 },
      { productId: "32", quantity: 2, price: 34.99 },
    ],
    subtotal: 369.96,
    shipping: 14.99,
    tax: 31.35,
    total: 416.30,
    status: "cancelled",
    shippingAddress: { street: "222 Maple Dr", city: "Austin", state: "TX", zip: "73301" },
  },
  {
    id: "ORD-008",
    date: "2024-03-03",
    customer: "Amanda B.",
    email: "amanda.b@email.com",
    items: [
      { productId: "33", quantity: 1, price: 249.99 },
      { productId: "35", quantity: 1, price: 67.99 },
    ],
    subtotal: 317.98,
    shipping: 0,
    tax: 25.90,
    total: 343.88,
    status: "delivered",
    trackingNumber: "1Z999AA10123456788",
    shippingAddress: { street: "444 Walnut St", city: "Miami", state: "FL", zip: "33101" },
  },
  {
    id: "ORD-009",
    date: "2024-03-02",
    customer: "Chris H.",
    email: "chris.h@email.com",
    items: [{ productId: "23", quantity: 1, price: 79.99 }],
    subtotal: 79.99,
    shipping: 5.99,
    tax: 6.99,
    total: 92.97,
    status: "processing",
    shippingAddress: { street: "666 Spruce Ave", city: "Boston", state: "MA", zip: "02101" },
  },
  {
    id: "ORD-010",
    date: "2024-03-01",
    customer: "Rachel T.",
    email: "rachel.t@email.com",
    items: [
      { productId: "5", quantity: 1, price: 64.99 },
      { productId: "19", quantity: 2, price: 18.99 },
      { productId: "22", quantity: 1, price: 14.99 },
    ],
    subtotal: 117.96,
    shipping: 7.99,
    tax: 10.24,
    total: 136.19,
    status: "delivered",
    trackingNumber: "1Z999AA10123456789",
    shippingAddress: { street: "999 Aspen Ct", city: "Chicago", state: "IL", zip: "60601" },
  },
];

// Recent orders for dashboard display
export const RECENT_ORDERS = ORDERS.slice(0, 5).map((order) => ({
  id: order.id,
  customer: order.customer,
  total: order.total,
  items: order.items.length,
  status: order.status,
}));

// Order status counts
export const ORDER_STATS = {
  pending: ORDERS.filter((o) => o.status === "pending").length,
  processing: ORDERS.filter((o) => o.status === "processing").length,
  shipped: ORDERS.filter((o) => o.status === "shipped").length,
  delivered: ORDERS.filter((o) => o.status === "delivered").length,
  cancelled: ORDERS.filter((o) => o.status === "cancelled").length,
};
