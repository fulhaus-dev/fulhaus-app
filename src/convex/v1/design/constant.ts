import { ProductCategory } from '../product/type';
import { SpaceType } from './type';

export const spaceTypes = [
	'Attic',
	'Basement',
	'Bathroom',
	'Bedroom',
	'Classroom',
	'Dining Room',
	'Entryway',
	'Event Space',
	'Exercise Room',
	'Kitchen',
	'Laundry Room',
	'Library',
	'Living Room',
	'Lobby',
	'Locker Room',
	'Lounge',
	'Media Room',
	'Medical Room',
	'Meeting Room',
	'Mudroom',
	'Office',
	'Outdoor Space',
	'Spa',
	'Walk-in Closet',
	'Garage'
] as const;

export const spaceTypeProductCategories: Record<
	SpaceType,
	{
		all: ProductCategory[];
		recommended: ProductCategory[];
	}
> = {
	Attic: {
		all: [
			'Arm Chair',
			'Artwork',
			'Bench',
			'Blind',
			'Bookcase',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chest',
			'Curtain',
			'Floor Lamp',
			'Rug',
			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Table Lamp',
			'Wall Mirror',
			'Wardrobe',
			'Plant',
			'Planter'
		],
		recommended: [
			'Shelf',
			'Storage Cabinet',
			'Rug',
			'Ceiling Lamp',
			'Floor Lamp',
			'Bench',
			'Arm Chair',
			'Curtain',
			'Standing Mirror',
			'Plant'
		]
	},
	Basement: {
		all: [
			'Arm Chair',
			'Artwork',
			'Bar Cart',
			'Bar Stool',
			'Bar Table',
			'Bench',
			'Bookcase',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Coffee Table',
			'Console Table',
			'Counter',
			'Counter Stool',
			'Curtain',
			'Desk',
			'Desk Chair',
			'Dresser',
			'Floor Lamp',
			'Kettle',
			'Loveseat',
			'Ottoman',
			'Pendant Light',
			'Pillow',
			'Rug',
			'Sconce',
			'Sculpture',
			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sideboard',
			'Sofa',
			'Sofa Bed',
			'Table Lamp',
			'TV Media Console',
			'Wall Mirror',
			'Waste basket',
			'Plant',
			'Planter'
		],
		recommended: [
			'Sectional',
			'Sofa',
			'Coffee Table',
			'Side Table',
			'TV Media Console',
			'Rug',
			'Floor Lamp',
			'Sconce',
			'Ottoman',
			'Throw Blanket'
		]
	},
	Bathroom: {
		all: [
			'Artwork',
			'Bath Linens',
			'Cabinet',
			'Ceiling Lamp',
			'Ceiling Mirror',
			'Curtain',
			'Floor Lamp',
			'Pendant Light',
			'Rug',
			'Sconce',
			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Table Lamp',
			'Vanity',
			'Vanity Light',
			'Wall Mirror',
			'Waste basket',
			'Plant',
			'Planter',
			'Bathtub',
			'Shower Curtain'
		],
		recommended: [
			'Vanity',
			'Vanity Light',
			'Wall Mirror',
			'Bath Linens',
			'Rug',
			'Shower Curtain',
			'Waste basket',
			'Bathtub'
		]
	},
	Bedroom: {
		all: [
			'Arm Chair',
			'Artwork',
			'Bed',
			'Bedding',
			'Bench',
			'Blind',
			'Bookcase',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Chest',
			'Console Table',
			'Curtain',
			'Dresser',
			'Floor Lamp',
			'King Mattress',
			'Nightstand',
			'Ottoman',
			'Pendant Light',
			'Pillow',
			'Queen Mattress',
			'Rug',
			'Sconce',
			'Sculpture',
			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sofa Bed',
			'Standing Mirror',
			'Table Lamp',
			'Throw Blanket',
			'Throw Pillow',
			'TV Media Console',
			'Twin Mattress',
			'Wall Mirror',
			'Wardrobe',
			'Plant',
			'Planter'
		],
		recommended: [
			'Bed',
			'Nightstand',
			'Dresser',
			'Wardrobe',
			'Rug',
			'Table Lamp',
			'Curtain',
			'Standing Mirror',
			'Pillow',
			'Artwork'
		]
	},
	Classroom: {
		all: [
			'Artwork',
			'Bench',
			'Blind',
			'Bookcase',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Console Table',
			'Curtain',
			'Desk',
			'Desk Chair',
			'Floor Lamp',
			'Pendant Light',
			'Rug',
			'Sconce',
			'Shelf',
			'Shelving Unit',
			'Table Lamp',
			'Plant',
			'Planter'
		],
		recommended: [
			'Desk',
			'Desk Chair',
			'Bookcase',
			'Shelving Unit',
			'Ceiling Lamp',
			'Pendant Light',
			'Rug',
			'Artwork',
			'Plant'
		]
	},
	'Dining Room': {
		all: [
			'Arm Chair',
			'Artwork',
			'Bar Cart',
			'Bar Stool',
			'Bar Table',
			'Bench',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Console Table',
			'Curtain',
			'Dining Chair',
			'Dining Table',
			'Dinnerware',
			'Floor Lamp',
			'Pendant Light',
			'Rug',
			'Sconce',
			'Sculpture',
			'Sideboard',
			'Table Lamp',
			'Tablecloth',
			'Wall Mirror',
			'Plant',
			'Planter'
		],
		recommended: ['Dining Table', 'Dining Chair', 'Pendant Light', 'Rug', 'Artwork', 'Plant']
	},
	Entryway: {
		all: [
			'Artwork',
			'Bench',
			'Blind',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Coat Rack',
			'Console Table',
			'Curtain',
			'Entry Hook',
			'Floor Lamp',
			'Rug',
			'Sconce',
			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Table Lamp',
			'Wall Mirror',
			'Wardrobe',
			'Rack',
			'Waste basket',
			'Plant',
			'Planter'
		],
		recommended: ['Bench', 'Coat Rack', 'Entry Hook', 'Rug', 'Wall Mirror', 'Sconce', 'Plant']
	},
	'Event Space': {
		all: [
			'Arm Chair',
			'Artwork',
			'Bar Cart',
			'Bar Stool',
			'Bar Table',
			'Bench',
			'Carpet',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Coffee Table',
			'Console Table',
			'Curtain',
			'Dining Chair',
			'Dining Table',
			'Floor Lamp',
			'Ottoman',
			'Pendant Light',
			'Rug',
			'Sconce',
			'Sculpture',
			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sideboard',
			'Stands',
			'Table Lamp',
			'Tablecloth',
			'Plant',
			'Planter'
		],
		recommended: [
			'Dining Chair',
			'Bar Stool',
			'Bar Table',
			'Stands',
			'Rug',
			'Pendant Light',
			'Sconce',
			'Artwork',
			'Plant'
		]
	},
	'Exercise Room': {
		all: [
			'Bench',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Curtain',
			'Floor Lamp',
			'Pendant Light',
			'Rug',
			'Sconce',
			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Table Lamp',
			'Wall Mirror',
			'Waste basket',
			'Plant',
			'Planter'
		],
		recommended: ['Standing Mirror', 'Bench', 'Rack', 'Shelf', 'Rug', 'Ceiling Lamp', 'Sconce']
	},
	Kitchen: {
		all: [
			'Artwork',
			'Baking Dish',
			'Bar Stool',
			'Bar Table',
			'Cabinet',
			'Ceiling Lamp',
			'Cookware',
			'Counter',
			'Counter Stool',
			'Curtain',
			'Dinnerware',
			'Floor Lamp',
			'Kettle',
			'Kitchen Accessory',
			'Pendant Light',
			'Rug',
			'Sconce',
			'Shelf',
			'Shelving Unit',
			'Table Lamp',
			'Tablecloth',
			'Plant',
			'Planter'
		],
		recommended: [
			'Cabinet',
			'Counter',
			'Pendant Light',
			'Bar Stool',
			'Cookware',
			'Dinnerware',
			'Kettle'
		]
	},
	'Laundry Room': {
		all: [
			'Artwork',
			'Cabinet',
			'Ceiling Lamp',
			'Counter',
			'Curtain',
			'Floor Lamp',
			'Pendant Light',
			'Rack',
			'Rug',
			'Sconce',
			'Shelf',
			'Shelving Unit',
			'Storage Cabinet',
			'Table Lamp',
			'Waste basket',
			'Plant',
			'Planter'
		],
		recommended: [
			'Storage Cabinet',
			'Counter',
			'Rack',
			'Shelving Unit',
			'Ceiling Lamp',
			'Waste basket'
		]
	},
	Library: {
		all: [
			'Arm Chair',
			'Artwork',
			'Bench',
			'Blind',
			'Bookcase',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Coffee Table',
			'Console Table',
			'Curtain',
			'Desk',
			'Desk Chair',
			'Floor Lamp',
			'Loveseat',
			'Ottoman',
			'Pendant Light',
			'Rug',
			'Sconce',
			'Sculpture',
			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sofa',
			'Standing Mirror',
			'Table Lamp',

			'Wall Mirror',

			'Plant',
			'Planter'
		],
		recommended: [
			'Bookcase',
			'Arm Chair',
			'Sofa',
			'Desk',
			'Desk Chair',
			'Rug',
			'Floor Lamp',
			'Table Lamp',
			'Artwork',
			'Plant'
		]
	},
	'Living Room': {
		all: [
			'Arm Chair',
			'Artwork',

			'Bench',
			'Blind',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Coffee Table',
			'Console Table',

			'Curtain',

			'Floor Lamp',

			'Loveseat',
			'Ottoman',
			'Pendant Light',
			'Pillow',
			'Rug',

			'Sconce',
			'Sculpture',

			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sideboard',
			'Sofa',
			'Sofa Bed',

			'Standing Mirror',
			'Table Lamp',
			'Throw Blanket',
			'Throw Pillow',

			'TV Media Console',

			'Wall Mirror',

			'Stands',
			'Plant',
			'Planter'
		],
		recommended: [
			'Sofa',
			'Arm Chair',
			'Coffee Table',
			'Side Table',
			'Rug',
			'Floor Lamp',
			'Throw Pillow',
			'Throw Blanket',
			'TV Media Console',
			'Artwork',
			'Plant'
		]
	},
	Lobby: {
		all: [
			'Arm Chair',
			'Artwork',

			'Bench',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Coffee Table',
			'Console Table',

			'Curtain',

			'Floor Lamp',

			'Loveseat',
			'Ottoman',
			'Pendant Light',
			'Rug',

			'Sconce',
			'Sculpture',

			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sideboard',
			'Sofa',
			'Standing Mirror',
			'Table Lamp',

			'Wall Mirror',

			'Storage Cabinet',
			'Plant',
			'Planter'
		],
		recommended: [
			'Sofa',
			'Arm Chair',
			'Bench',
			'Coffee Table',
			'Rug',
			'Pendant Light',
			'Sconce',
			'Console Table',
			'Artwork',
			'Plant',
			'Sculpture'
		]
	},
	'Locker Room': {
		all: [
			'Bath Linens',
			'Bathroom Accessory',
			'Bench',
			'Cabinet',
			'Ceiling Lamp',
			'Ceiling Mirror',
			'Coat Rack',
			'Curtain',

			'Floor Lamp',

			'Pendant Light',
			'Rack',
			'Rug',

			'Sconce',

			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Storage Cabinet',
			'Table Lamp',

			'Wall Mirror',
			'Waste basket',
			'Wardrobe',
			'Plant',
			'Planter'
		],
		recommended: [
			'Bench',
			'Rack',
			'Wardrobe',

			'Wall Mirror',
			'Standing Mirror',

			'Ceiling Lamp',
			'Storage Cabinet'
		]
	},
	Lounge: {
		all: [
			'Arm Chair',
			'Artwork',
			'Bar Cart',
			'Bar Stool',
			'Bar Table',
			'Bench',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Coffee Table',
			'Console Table',
			'Curtain',

			'Floor Lamp',

			'Loveseat',
			'Ottoman',
			'Pendant Light',
			'Pillow',
			'Rug',

			'Sconce',
			'Sculpture',

			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sideboard',
			'Sofa',

			'Standing Mirror',
			'Table Lamp',
			'Throw Blanket',
			'Throw Pillow',

			'TV Media Console',

			'Wall Mirror',

			'Plant',
			'Planter'
		],
		recommended: [
			'Sofa',
			'Arm Chair',
			'Coffee Table',
			'Side Table',
			'Rug',
			'Pendant Light',
			'Bar Cart',
			'Throw Pillow',
			'Throw Blanket',
			'Artwork'
		]
	},
	'Media Room': {
		all: [
			'Arm Chair',
			'Artwork',
			'Bench',
			'Blind',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Coffee Table',
			'Console Table',
			'Curtain',

			'Floor Lamp',
			'Loveseat',
			'Ottoman',
			'Pendant Light',
			'Pillow',
			'Rug',

			'Sconce',

			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sofa',
			'Sofa Bed',

			'Standing Mirror',
			'Table Lamp',
			'Throw Blanket',
			'Throw Pillow',

			'TV Media Console',

			'Wall Mirror',

			'Plant',
			'Planter'
		],
		recommended: [
			'Sectional',
			'Sofa',
			'Ottoman',
			'TV Media Console',

			'Sconce',
			'Curtain',
			'Rug',
			'Throw Pillow',
			'Throw Blanket'
		]
	},
	'Medical Room': {
		all: [
			'Artwork',
			'Bath Linens',
			'Bed',
			'Bedding',
			'Cabinet',
			'Ceiling Lamp',
			'Ceiling Mirror',
			'Curtain',

			'Floor Lamp',

			'Nightstand',
			'Pendant Light',
			'Pillow',
			'Rack',
			'Rug',

			'Sconce',

			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Storage Cabinet',
			'Table Lamp',

			'Vanity',
			'Vanity Light',

			'Wall Mirror',
			'Waste basket',
			'Wardrobe',
			'Plant',
			'Planter'
		],
		recommended: [
			'Bed',
			'Nightstand',
			'Cabinet',
			'Curtain',
			'Ceiling Lamp',
			'Wall Mirror',
			'Storage Cabinet'
		]
	},
	'Meeting Room': {
		all: [
			'Arm Chair',
			'Artwork',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Console Table',
			'Curtain',

			'Desk',
			'Desk Chair',
			'Dining Chair',
			'Dining Table',
			'Floor Lamp',

			'Pendant Light',
			'Rug',

			'Sconce',
			'Sculpture',

			'Shelf',
			'Shelving Unit',
			'Sideboard',
			'Table Lamp',

			'Wall Mirror',

			'Plant',
			'Planter'
		],
		recommended: [
			'Dining Table',
			'Dining Chair',
			'Pendant Light',
			'Rug',
			'Console Table',
			'Sideboard',
			'Artwork',
			'Plant'
		]
	},
	Mudroom: {
		all: [
			'Artwork',
			'Bench',
			'Cabinet',
			'Ceiling Lamp',
			'Coat Rack',
			'Curtain',

			'Entry Hook',
			'Floor Lamp',

			'Pendant Light',
			'Rack',
			'Rug',

			'Sconce',
			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Storage Cabinet',
			'Table Lamp',

			'Wall Mirror',

			'Wardrobe',
			'Waste basket',
			'Plant',
			'Planter',
			'Chest'
		],
		recommended: [
			'Bench',
			'Coat Rack',
			'Entry Hook',
			'Rack',
			'Storage Cabinet',
			'Rug',

			'Wall Mirror',
			'Waste basket'
		]
	},
	Office: {
		all: [
			'Arm Chair',
			'Artwork',

			'Bar Cart',
			'Bench',
			'Blind',
			'Bookcase',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Coffee Table',
			'Console Table',

			'Curtain',

			'Desk',
			'Desk Chair',

			'Floor Lamp',

			'Loveseat',
			'Ottoman',
			'Pendant Light',
			'Rug',

			'Sconce',
			'Sculpture',

			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sofa',

			'Standing Mirror',
			'Table Lamp',

			'Wall Mirror',

			'Storage Cabinet',
			'Plant',
			'Planter'
		],
		recommended: [
			'Desk',
			'Desk Chair',
			'Bookcase',
			'Shelving Unit',
			'Rug',
			'Floor Lamp',
			'Table Lamp',
			'Sofa',
			'Arm Chair',
			'Artwork',
			'Plant'
		]
	},
	'Outdoor Space': {
		all: [
			'Arm Chair',
			'Artwork',
			'Bar Cart',
			'Bar Stool',
			'Bar Table',
			'Bench',
			'Ceiling Lamp',
			'Chaise Lounge',
			'Coffee Table',
			'Console Table',
			'Counter',
			'Counter Stool',
			'Dining Chair',
			'Dining Table',
			'Floor Lamp',
			'Ottoman',
			'Pendant Light',
			'Planter',
			'Plant',
			'Rug',

			'Sconce',

			'Sculpture',
			'Shelf',
			'Shelving Unit',
			'Side Table',
			'Sideboard',
			'Stands',
			'Table Lamp'
		],
		recommended: [
			'Arm Chair',
			'Bench',
			'Chaise Lounge',
			'Dining Table',
			'Dining Chair',
			'Bar Table',
			'Bar Stool',
			'Side Table',
			'Coffee Table',
			'Planter',
			'Rug',
			'Sconce',
			'Sculpture'
		]
	},
	Spa: {
		all: [
			'Artwork',
			'Bath Linens',
			'Bathroom Accessory',
			'Bench',
			'Cabinet',
			'Ceiling Lamp',
			'Ceiling Mirror',
			'Chaise Lounge',
			'Curtain',

			'Floor Lamp',

			'Ottoman',
			'Pendant Light',
			'Rug',

			'Sconce',
			'Sculpture',

			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Table Lamp',

			'Vanity',
			'Vanity Light',

			'Wall Mirror',

			'Waste basket',

			'Plant',
			'Planter'
		],
		recommended: [
			'Chaise Lounge',
			'Vanity',
			'Vanity Light',

			'Bath Linens',
			'Bathroom Accessory',
			'Sconce',
			'Wall Mirror',
			'Rug',
			'Plant'
		]
	},
	'Walk-in Closet': {
		all: [
			'Arm Chair',
			'Artwork',

			'Bench',
			'Cabinet',
			'Carpet',
			'Ceiling Lamp',
			'Chest',

			'Curtain',

			'Dresser',

			'Floor Lamp',

			'Ottoman',
			'Pendant Light',
			'Rack',
			'Rug',

			'Sconce',

			'Shelf',
			'Shelving Unit',
			'Standing Mirror',
			'Storage Cabinet',
			'Table Lamp',

			'Wall Mirror',

			'Wardrobe',
			'Plant',
			'Planter'
		],
		recommended: [
			'Dresser',
			'Rack',
			'Shelving Unit',
			'Standing Mirror',
			'Bench',
			'Rug',
			'Ceiling Lamp'
		]
	},
	Garage: {
		all: [
			'Cabinet',
			'Storage Cabinet',
			'Shelf',
			'Shelving Unit',
			'Rack',
			'Stands',

			'Bench',

			'Ceiling Lamp',
			'LED Light',
			'Pendant Light',
			'Sconce',

			'Runner',
			'Rug',

			'Waste basket',

			'Wall Mirror',

			'Door',
			'Tile',

			'Tabletop Decor',
			'Seasonal Decor'
		],
		recommended: [
			'Storage Cabinet',
			'Shelving Unit',
			'Rack',
			'Bench',
			'LED Light',
			'Ceiling Lamp',
			'Runner'
		]
	}
} as const;
