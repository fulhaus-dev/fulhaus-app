import { v } from 'convex/values';
import { productCategories, productStyles } from './constant';
import { vCurrencyCode } from '../../validator';

export const vProductStatus = v.union(
	v.literal('Active'),
	v.literal('Inactive'),
	v.literal('Discontinued')
);

export const vProductStyle = v.union(...productStyles.map((style) => v.literal(style)));
export const vProductCategory = v.union(
	...productCategories.map((category) => v.literal(category))
);

export const vProductPrice = v.object({
	currencyCode: vCurrencyCode,
	tradePrice: v.float64(),
	map: v.optional(v.float64()),
	msrp: v.optional(v.float64()),
	retailPrice: v.float64()
});

export const vCreateProductFields = {
	vendorId: v.id('productVendors'),
	ownerId: v.string(),
	location: v.optional(v.string()),
	sku: v.string(),
	fhSku: v.string(),
	itemId: v.optional(v.string()),
	gtin: v.optional(v.string()),
	mpn: v.optional(v.string()),
	brand: v.optional(v.string()),
	name: v.string(),
	description: v.string(),
	pdpLink: v.optional(v.string()),
	prices: v.array(vProductPrice),
	hasCAD: v.optional(v.boolean()),
	hasUSD: v.optional(v.boolean()),
	retailPriceCAD: v.optional(v.float64()),
	retailPriceUSD: v.optional(v.float64()),
	unitPerBox: v.number(),
	imageUrls: v.array(v.string()),
	mainImageUrl: v.string(),
	mainImageNoBgUrl: v.optional(v.string()),
	dimension: v.optional(v.string()),
	width: v.optional(v.number()),
	height: v.optional(v.number()),
	depth: v.optional(v.number()),
	dimensionUnit: v.literal('in'),
	vDimension: v.optional(v.string()),
	weight: v.optional(v.number()),
	weightUnit: v.literal('lb'),
	colorNames: v.array(v.string()),
	hexColors: v.array(v.string()),
	materials: v.array(v.string()),
	styles: v.array(vProductStyle),
	category: vProductCategory,
	stockQtyUSD: v.number(),
	stockQtyCAD: v.number(),
	restockDateUSD: v.optional(v.number()),
	restockDateCAD: v.optional(v.number())
};

export const vCreateProduct = v.object(vCreateProductFields);

export const vClientProduct = v.object({
	_id: v.id('products'),
	fhSku: v.string(),
	brand: v.optional(v.string()),
	name: v.string(),
	description: v.string(),
	retailPrice: v.number(),
	unitPerBox: v.number(),
	stockQty: v.number(),
	restockDate: v.optional(v.number()),
	imageUrls: v.array(v.string()),
	mainImageUrl: v.string(),
	currencyCode: vCurrencyCode,
	dimension: v.optional(v.string()),
	width: v.optional(v.number()),
	height: v.optional(v.number()),
	depth: v.optional(v.number()),
	dimensionUnit: v.literal('in'),
	weight: v.optional(v.number()),
	weightUnit: v.literal('lb'),
	colorNames: v.array(v.string()),
	hexColors: v.array(v.string()),
	materials: v.array(v.string()),
	styles: v.array(vProductStyle),
	category: vProductCategory,
	stockDate: v.number(),
	fullTextSearch: v.string(),
	status: vProductStatus
});

export const vUpdateProduct = v.object({
	prices: v.optional(v.array(vProductPrice)),
	hasCAD: v.optional(v.boolean()),
	hasUSD: v.optional(v.boolean()),
	retailPriceCAD: v.optional(v.float64()),
	retailPriceUSD: v.optional(v.float64()),
	stockDate: v.optional(v.number()),
	restockDate: v.optional(v.number()),
	status: v.optional(vProductStatus),
	stockQtyUSD: v.optional(v.number()),
	stockQtyCAD: v.optional(v.number()),
	restockDateUSD: v.optional(v.number()),
	restockDateCAD: v.optional(v.number())
});

const vProductAvailabilityFilter = v.union(
	v.literal('In Stock'),
	v.literal('Low Stock'),
	v.literal('Out of Stock')
);

export const vProductFilter = v.object({
	category: v.optional(vProductCategory),
	desc: v.optional(v.string()),
	availability: v.optional(vProductAvailabilityFilter),
	minPrice: v.optional(v.number()),
	maxPrice: v.optional(v.number()),
	minWidth: v.optional(v.number()),
	maxWidth: v.optional(v.number()),
	minHeight: v.optional(v.number()),
	maxHeight: v.optional(v.number()),
	minDepth: v.optional(v.number()),
	maxDepth: v.optional(v.number()),
	minWeight: v.optional(v.number()),
	maxWeight: v.optional(v.number()),
	brand: v.optional(v.string())
});

export const vProductSortOptions = v.object({
	index: v.union(
		v.literal('by_category_price_usd'),
		v.literal('by_category_price_cad'),
		v.literal('by_price_usd'),
		v.literal('by_price_cad')
	),
	order: v.union(v.literal('asc'), v.literal('desc'))
});

export const vProductPaginationOptions = v.object({
	cursor: v.optional(v.string()),
	numItems: v.optional(v.number())
});

export const vProductRecommendationFilter = v.object({
	minPrice: v.optional(v.float64()),
	maxPrice: v.optional(v.float64()),
	minWidth: v.optional(v.number()),
	maxWidth: v.optional(v.number()),
	minHeight: v.optional(v.number()),
	maxHeight: v.optional(v.number()),
	minDepth: v.optional(v.number()),
	maxDepth: v.optional(v.number())
});

export const vOrderProduct = v.object({
	productId: v.id('products'),
	vendorId: v.id('productVendors'),
	vendorName: v.string(),
	location: v.optional(v.string()),
	sku: v.string(),
	itemId: v.optional(v.string()),
	gtin: v.optional(v.string()),
	mpn: v.optional(v.string()),
	brand: v.optional(v.string()),
	name: v.string(),
	description: v.string(),
	pdpLink: v.optional(v.string()),
	unitPerBox: v.number(),
	imageUrls: v.array(v.string()),
	mainImageUrl: v.string(),
	dimension: v.optional(v.string()),
	weight: v.optional(v.number()),
	weightUnit: v.literal('lb'),
	category: vProductCategory
});

// const FURNITURE_STYLES = [
//     'Art Deco',
//     'Art Nouveau',
//     'Bauhaus',
//     'Biophilic',
//     'Bohemian',
//     'Brutalism',
//     'Coastal',
//     'Colonial',
//     'Contemporary',
//     'Craftsman',
//     'Eclectic',
//     'French Country',
//     'French Provincial',
//     'Grandmillennial',
//     'Hollywood Regency',
//     'Industrial',
//     'Japandi',
//     'Maximalist',
//     'Mediterranean',
//     'Memphis Design',
//     'Mid-Century Modern',
//     'Minimalist',
//     'Modern',
//     'Modern Farmhouse',
//     'Neoclassical',
//     'Postmodern',
//     'Rustic',
//     'Scandinavian',
//     'Shabby Chic',
//     'Southwestern',
//     'Traditional',
//     'Transitional',
//     'Tudor',
//     'Victorian',
//     'Wabi-Sabi'
// ] as const;
// type FurnitureStyle = typeof FURNITURE_STYLES[number];

// const FURNITURE_PRICE_TIERS = [
//     'Budget',
//     'Accessible',
//     'Mid-Range',
//     'Premium',
//     'Luxury',
//     'Bespoke',
// ] as const;
// type FurniturePriceTier = typeof FURNITURE_PRICE_TIERS[number];

// const FURNITURE_COLOR_FAMILIES = [
//     'Warm Neutrals',
//     'Cool Neutrals',
//     'Earth Tones',
//     'Jewel Tones',
//     'Pastels',
//     'Primary Colors',
//     'Monochrome',
//     'Natural Wood'
// ] as const;
// type FurnitureColorFamily = typeof FURNITURE_COLOR_FAMILIES[number];

// const FURNITURE_SOURCING_TYPES = [
//     'New',
//     'Made-to-Order',
//     'Floor Model',
//     'Vintage',
//     'Antique',
//     'Reproduction',
//     'Upcycled'
// ] as const;
// type FurnitureSourcingType = typeof FURNITURE_SOURCING_TYPES[number];

// const FURNITURE_MATERIALS = [
//     'Acrylic',
//     'Alabaster',
//     'Aluminum',
//     'Ash',
//     'Bamboo',
//     'Beech',
//     'Bone',
//     'Boucle',
//     'Brass',
//     'Bronze',
//     'Burl',
//     'Cane',
//     'Canvas',
//     'Ceramic',
//     'Chenille',
//     'Cherry',
//     'Chrome',
//     'Concrete',
//     'Copper',
//     'Cork',
//     'Cotton',
//     'Fiberglass',
//     'Glass',
//     'Granite',
//     'Horn',
//     'Iron',
//     'Jute',
//     'Leather',
//     'Limestone',
//     'Linen',
//     'Lucite',
//     'Mahogany',
//     'Mango',
//     'Maple',
//     'Marble',
//     'Microfiber',
//     'Mirror',
//     'Mohair',
//     'Oak',
//     'Onyx',
//     'Parchment',
//     'Pine',
//     'Plastic',
//     'Plywood',
//     'Polyester',
//     'Quartz',
//     'Rattan',
//     'Resin',
//     'Rosewood',
//     'Seagrass',
//     'Shagreen',
//     'Silk',
//     'Slate',
//     'Steel',
//     'Suede',
//     'Teak',
//     'Terrazzo',
//     'Travertine',
//     'Velvet',
//     'Walnut',
//     'Wicker',
//     'Wool'
// ] as const;
// type FurnitureMaterial = typeof FURNITURE_MATERIALS[number];

// const FURNITURE_CATEGORIES = [
//     'Armchair',
//     'Artwork',
//     'Bar Cart',
//     'Bar Stool',
//     'Bar Table',
//     'Bath Linens',
//     'Bathroom Accessory',
//     'Bathtub',
//     'Bed',
//     'Bedding',
//     'Bench',
//     'Blind',
//     'Bookcase',
//     'Bookends',
//     'Cabinet',
//     'Carpet',
//     'Ceiling Lamp',
//     'Ceiling Mirror',
//     'Chaise Lounge',
//     'Chest',
//     'Coat Rack',
//     'Coffee Table',
//     'Console Table',
//     'Cookware',
//     'Counter',
//     'Counter Stool',
//     'Crib',
//     'Crib Bedding',
//     'Curtain',
//     'Desk',
//     'Desk Chair',
//     'Dining Chair',
//     'Dining Table',
//     'Dinnerware',
//     'Door',
//     'Dresser',
//     'Entry Hook',
//     'Floor Lamp',
//     'Kitchen Accessory',
//     'Kitchen Appliance',
//     'LED Light',
//     'Loveseat',
//     'Mattress',
//     'Nightstand',
//     'Ornament',
//     'Ottoman',
//     'Pendant Light',
//     'Pillow',
//     'Plant',
//     'Planter',
//     'Rack',
//     'Rug',
//     'Runner',
//     'Sconce',
//     'Sculpture',
//     'Seasonal Decor',
//     'Sectional',
//     'Shelf',
//     'Shelving Unit',
//     'Shower Curtain',
//     'Side Table',
//     'Sideboard',
//     'Sofa',
//     'Sofa Bed',
//     'Standing Mirror',
//     'Storage Cabinet',
//     'Table Lamp',
//     'Tablecloth',
//     'Tabletop Decor',
//     'Throw Blanket',
//     'Throw Pillow',
//     'Tile',
//     'TV Media Console',
//     'Vanity',
//     'Vanity Light',
//     'Vase',
//     'Wall Mirror',
//     'Wallpaper',
//     'Wardrobe',
//     'Waste Basket'
// ] as const;
// type FurnitureCategory = typeof FURNITURE_CATEGORIES[number];

// const BED_SIZES = ['Twin', 'Twin XL', 'Double', 'Queen', 'King', 'California King'] as const;
// type BedSize = typeof BED_SIZES[number];

// const CRIB_SIZES = ['Standard Crib', 'Mini Crib'] as const;
// type CribSize = typeof CRIB_SIZES[number];

// const PILLOW_SIZES = ['Standard', 'Queen', 'King', 'Euro', 'Lumbar', 'Square'] as const;
// type PillowSize = typeof PILLOW_SIZES[number];

// const RUG_SIZES = [
// 	'2x3',
// 	'3x5',
// 	'4x6',
// 	'5x8',
// 	'6x9',
// 	'8x10',
// 	'9x12',
// 	'10x14',
// 	'Runner',
// 	'Round',
// 	'Square'
// ] as const;
// type RugSize = typeof RUG_SIZES[number];

// const STOOL_HEIGHTS = [
// 	'Table Height (18"-20")',
// 	'Counter Height (24"-26")',
// 	'Bar Height (28"-30")',
// 	'Spectator (32"-34")'
// ] as const;
// type StoolHeight = typeof STOOL_HEIGHTS[number];

// const BATH_LINEN_TYPES = ['Washcloth', 'Hand Towel', 'Bath Towel', 'Bath Sheet'] as const;
// type BathLinenType = typeof BATH_LINEN_TYPES[number];

// const CURTAIN_SIZES = ['63 inch', '84 inch', '96 inch', '108 inch', '120 inch'] as const;
// type CurtainSize = typeof CURTAIN_SIZES[number];

// const DINING_TABLE_SIZES = ['2-Seater', '4-Seater', '6-Seater', '8-Seater', '10+ Seater'] as const;
// type DiningTableSize = typeof DINING_TABLE_SIZES[number];

// const SECTIONAL_SHAPES = ['L-Shape', 'U-Shape', 'Modular'] as const;
// type SectionalShape = typeof SECTIONAL_SHAPES[number];

// const SOFA_SIZES = ['2-Seater', '3-Seater', '4+ Seater'] as const;
// type SofaSize = typeof SOFA_SIZES[number];

// const TILE_TYPES = ['Mosaic', 'Subway', 'Square', 'Plank', 'Large Format'] as const;
// type TileType = typeof TILE_TYPES[number];

// 	const TV_MEDIA_CONSOLE_SIZES = ['Up to 45"', 'Up to 55"', 'Up to 65"', 'Up to 75"', '80"+'] as const;
// 	type TVMediaConsoleSize = typeof TV_MEDIA_CONSOLE_SIZES[number];

// type Sizes =
// 	| BedSize[]
// 	| CribSize[]
// 	| PillowSize[]
// 	| RugSize[]
// 	| StoolHeight[]
// 	| BathLinenType[]
// 	| CurtainSize[]
// 	| DiningTableSize[]
// 	| SectionalShape[]
// 	| SofaSize[]
// 	| TileType[]
// 	| TVMediaConsoleSize[]
// 	| null;

// const FURNITURE_TYPES: Record<FurnitureCategory, Sizes> = {
// 	Armchair: null,
// 	Artwork: null,
// 	'Bar Cart': null,
// 	'Bar Stool': [...STOOL_HEIGHTS],
// 	'Bar Table': null,
// 	'Bath Linens': [...BATH_LINEN_TYPES],
// 	'Bathroom Accessory': null,
// 	Bathtub: null,
// 	Bed: [...BED_SIZES],
// 	Bedding: [...BED_SIZES],
// 	Bench: null,
// 	Blind: null,
// 	Bookcase: null,
// 	Bookends: null,
// 	Cabinet: null,
// 	Carpet: [...RUG_SIZES],
// 	'Ceiling Lamp': null,
// 	'Ceiling Mirror': null,
// 	'Chaise Lounge': null,
// 	Chest: null,
// 	'Coat Rack': null,
// 	'Coffee Table': null,
// 	'Console Table': null,
// 	Cookware: null,
// 	Counter: null,
// 	'Counter Stool': [...STOOL_HEIGHTS],
// 	Crib: [...CRIB_SIZES],
// 	'Crib Bedding': [...CRIB_SIZES],
// 	Curtain: [...CURTAIN_SIZES],
// 	Desk: null,
// 	'Desk Chair': null,
// 	'Dining Chair': null,
// 	'Dining Table': [...DINING_TABLE_SIZES],
// 	Dinnerware: null,
// 	Door: null,
// 	Dresser: null,
// 	'Entry Hook': null,
// 	'Floor Lamp': null,
// 	'Kitchen Accessory': null,
// 	'Kitchen Appliance': null,
// 	'LED Light': null,
// 	Mattress: [...BED_SIZES],
// 	Nightstand: null,
// 	Ornament: null,
// 	Ottoman: null,
// 	'Pendant Light': null,
// 	Pillow: [...PILLOW_SIZES],
// 	Plant: null,
// 	Planter: null,
// 	Rack: null,
// 	Rug: [...RUG_SIZES],
// 	Sconce: null,
// 	Sculpture: null,
// 	'Seasonal Decor': null,
// 	Sectional: [...SECTIONAL_SHAPES],
// 	Shelf: null,
// 	'Shelving Unit': null,
// 	'Shower Curtain': null,
// 	'Side Table': null,
// 	Sideboard: null,
// 	Sofa: [...SOFA_SIZES],
// 	'Sofa Bed': [...BED_SIZES],
// 	'Standing Mirror': null,
// 	'Storage Cabinet': null,
// 	'Table Lamp': null,
// 	Tablecloth: null,
// 	'Tabletop Decor': null,
// 	'Throw Blanket': null,
// 	'Throw Pillow': [...PILLOW_SIZES],
// 	Tile: [...TILE_TYPES],
// 	'TV Media Console': [...TV_MEDIA_CONSOLE_SIZES],
// 	Vanity: null,
// 	'Vanity Light': null,
// 	Vase: null,
// 	'Wall Mirror': null,
// 	Wallpaper: null,
// 	Wardrobe: null,
// 	'Waste Basket': null
// };
// type FurnitureType = typeof FURNITURE_TYPES[FurnitureCategory][0];

// const FURNITURE_ENVIRONMENTS = [
// 	'Indoor',
// 	'Outdoor'
// ] as const;
// type FurnitureEnvironment = typeof FURNITURE_ENVIRONMENTS[number];

// const FURNITURE_STATUSES = [
// 	'Active',
// 	'Inactive',
// 	'Discontinued'
// ] as const;
// type FurnitureStatus = typeof FURNITURE_STATUSES[number];

// type FurnitureDimension = {
// 	unit: "in",
// 	width: number,
// 	height: number,
// 	depth: number
// }

// type FurnitureWeight = {
// 	unit: "lb",
// 	value: number,
// }

// type FurnitureImage = {
// 	urls: string[],
// 	croppedUrl: string
// }

// type FurniturePrice = {
// 	currencyCode: string,
// 	locations: [string],
// 	wholesale: number,
// 	retail: number,
// 	tier: FurniturePriceTier,
// 	unitPerBox:number,
// 	stockQty: number,
// 	stockDate: number,
// 	restockDate?: number
// }

// type Furniture = {
// 	vendorId: string;
// 	ownerId: string;
// 	locations: [string];
// 	sku: string;
// 	originalData: string;
// 	gtin?: string;
// 	mpn?: string;
// 	brand: string;
// 	name: string;
// 	description: string;
// 	pdpLink?: string;
// 	price: FurniturePrice[];
// 	image: FurnitureImage;
// 	dimension: FurnitureDimension;
// 	weight: FurnitureWeight;
// 	colorNames: string[];
// 	hexColors: string[];
// 	colorFamily: FurnitureColorFamily;
// 	materials: FurnitureMaterial[];
// 	styles: FurnitureStyle[];
// 	sourcingType: FurnitureSourcingType;
// 	category: FurnitureCategory;
// 	type: FurnitureType;
// 	environment: FurnitureEnvironment;
// 	status: FurnitureStatus;
// 	createdAt: Date;
// 	updatedAt: Date;
// };
