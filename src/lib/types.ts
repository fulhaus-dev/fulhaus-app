import type { Value } from 'convex/values';
import type { Doc, Id } from '../convex/_generated/dataModel';
import type z from 'zod';
import type {
	zProductFilter,
	zProductSortIndex,
	zProductSortOptions,
	zProductSortOrder
} from '$lib/zod-schemas';

type ErrorDetails = Record<string, Value>;

export type ErrorRecord = {
	statusCode: number;
	message: string;
	details?: ErrorDetails;
};

export type UserProfile = {
	_id: Id<'users'>;
	email: string;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	imageUrl?: string;
	phone?: string;
	currentWorkspaceId?: Id<'workspaces'>;
};

export type ImageData = {
	id: string;
	description?: string;
	url: string;
};

export type ChatUser = {
	userId: string;
	fullName?: string;
	imageUrl?: string;
};

export type DesignAssetFileType = Doc<'workspaceAssets'>['type'];

export type LudwigDesignDetails = {
	_id: Id<'designs'>;
	chatId: Id<'chats'>;
	name: string;
	description: string;
	spaceType: Doc<'designs'>['spaceType'];
	inspirationImageUrl: string;
	floorPlanFile?: FloorPlanFile;
	spaceImageUrl?: string;
	productCategories: Doc<'designs'>['productCategories'];
	publishedAt?: number;
	hasProducts: boolean;
};

export type UpdateProject = {
	name?: string;
	description?: string;
	summary?: string;
};

export type SpaceType = Doc<'designs'>['spaceType'];
export type DesignProductCategory = Doc<'designs'>['productCategories'][0];
export type ProductCategory = Doc<'designs'>['productCategories'][0]['category'];

export type FloorPlanFile = Doc<'designs'>['floorPlanFile'];

export type UpdateDesign = {
	name?: string;
	description?: string;
	inspirationImageUrl?: string;
	floorPlanFileUrl?: string;
	floorPlanFile?: FloorPlanFile;
	spaceImageUrl?: string;
	productCategories?: DesignProductCategory[];
	productIds?: Id<'products'>[];
};

export type UpdateDesignProduct = {
	productId: Id<'products'>;
	productCategory: DesignProductCategory;
};

export type ProductStyle = Doc<'products'>['styles'][0];

export type Design = Doc<'designs'>;

export type Product = {
	_id: Id<'products'>;
	fhSku: string;
	brand?: string;
	name: string;
	description: string;
	pdpLink?: string;
	retailPrice: number;
	unitPerBox: number;
	stockQty: number;
	restockDate?: number;
	imageUrls: string[];
	mainImageUrl?: string;
	currencyCode: CurrencyCode;
	dimension?: string;
	width?: number;
	height?: number;
	depth?: number;
	dimensionUnit: 'in';
	weight?: number;
	weightUnit: 'lb';
	colorNames?: string[];
	hexColors?: string[];
	materials: string[];
	styles: ProductStyle[];
	category: ProductCategory;
	stockDate: number;
};

export type CurrencyCode = Doc<'products'>['prices'][0]['currencyCode'];

export type CartItem = Doc<'cartItems'> & {
	product: Product;
};

export type Cart = {
	currencyCode: CurrencyCode;
	items: CartItem[];
};

export type CartSavedForLater = 'yes' | 'no';

export type CartItemQuantityChangeType = 'increment' | 'decrement';

export type Workspace = {
	_id: Id<'workspaces'>;
	name: string;
	logoUrl?: string;
	members: Id<'users'>[];
};

export type UserWorkspace = Omit<Workspace, 'members'>;

export type ProductFilter = z.infer<typeof zProductFilter>;

export type ProductFilterKey = keyof ProductFilter;
export type ProductFilterQueryString =
	| `${ProductFilterKey}-${string}`
	| `${ProductFilterKey}-${string},${ProductFilterKey}-${string}`;

export type ProductSortOptions = z.infer<typeof zProductSortOptions>;

export type ProductSortIndex = z.infer<typeof zProductSortIndex>;
export type ProductSortOrder = z.infer<typeof zProductSortOrder>;
export type ProductSortOptionsQueryString = `index-${ProductSortIndex},order-${ProductSortOrder}`;

export type DesignTag = {
	_id: Id<'designTags'>;
	workspaceId: Id<'workspaces'>;
	designId: Id<'designs'>;
	tag: string;
};

export type DesignLog = Doc<'designLogs'>['previous'];

export type DesignLogUser = {
	userId: Id<'users'>;
	fullName: string;
};

export type AppSubscriptionPlan = Doc<'workspacePlans'>['plan'];

export type PinterestPinItem = {
	id: string;
	link: string;
	board_owner: {
		username: string;
	};
	description: string;
	pin_metrics?: string;
	title: string;
	media: {
		media_type: string;
		images: {
			'150x150': {
				width: number;
				height: number;
				url: string;
			};
			'400x300': {
				width: number;
				height: number;
				url: string;
			};
			'600x': {
				width: number;
				height: number;
				url: string;
			};
			'1200x': {
				width: number;
				height: number;
				url: string;
			};
		};
	};
	created_at: string;
	product_tags: string[];
	alt_text?: string;
	board_section_id?: string;
	is_removable: boolean;
	dominant_color: string;
	has_been_promoted: boolean;
	board_id: string;
	is_standard: boolean;
	creative_type: string;
	is_owner: boolean;
	parent_pin_id: string;
};
