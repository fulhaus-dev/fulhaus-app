import { ClientProduct, Product, ProductCategory } from './type';

export function productsToClientProducts(products: (Product | null)[]) {
	const availableProducts = products.filter((product) => !!product);

	const designProducts: ClientProduct[] = availableProducts.map((product) => ({
		_id: product._id,
		fhSku: product.fhSku,
		brand: product.brand,
		name: product.name,
		description: product.description,
		pdpLink: product.pdpLink,
		retailPrice: product.msrp ?? product.tradePrice * 2,
		unitPerBox: product.unitPerBox,
		stockQty: product.stockQty,
		restockDate: product.restockDate,
		imageUrls: product.imageUrls,
		mainImageUrl: product.mainImageUrl,
		ludwigImageUrl: product.ludwigImageUrl,
		currencyCode: product.currencyCode,
		dimension: product.dimension,
		width: product.width,
		height: product.height,
		depth: product.depth,
		dimensionUnit: product.dimensionUnit,
		weight: product.weight,
		weightUnit: product.weightUnit,
		colorNames: product.colorNames,
		hexColors: product.hexColors,
		materials: product.materials,
		styles: product.styles,
		category: product.category as ProductCategory,
		stockDate: product.stockDate
	}));

	return designProducts;
}
