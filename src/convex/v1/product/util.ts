import { ClientProduct, Product, ProductCategory, ProductFilter } from './type';

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

export function filterClientProducts(
	clientProducts: ClientProduct[],
	productFilter: ProductFilter = {}
) {
	let filteredClientProducts = clientProducts;

	if (productFilter.category)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.category === productFilter.category
		);

	if (productFilter.name)
		filteredClientProducts = filteredClientProducts.filter((product) =>
			product.name.toLowerCase().includes((productFilter.name ?? '').toLowerCase())
		);

	if (productFilter.brand)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.brand === productFilter.brand
		);

	if (productFilter.maxWidth)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.width <= (productFilter.maxWidth ?? 0)
		);

	if (productFilter.minWidth)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.width >= (productFilter.minWidth ?? 0)
		);

	if (productFilter.maxHeight)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.height <= (productFilter.maxHeight ?? 0)
		);

	if (productFilter.minHeight)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.height >= (productFilter.minHeight ?? 0)
		);

	if (productFilter.maxDepth)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.depth <= (productFilter.maxDepth ?? 0)
		);

	if (productFilter.minDepth)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.depth >= (productFilter.minDepth ?? 0)
		);

	if (productFilter.maxWeight)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.weight <= (productFilter.maxWeight ?? 0)
		);

	if (productFilter.minWeight)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.weight >= (productFilter.minWeight ?? 0)
		);

	if (productFilter.maxRetailPrice)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.retailPrice <= (productFilter.maxRetailPrice ?? 0)
		);

	if (productFilter.minRetailPrice)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.retailPrice >= (productFilter.minRetailPrice ?? 0)
		);

	if (productFilter.maxStock)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.stockQty <= (productFilter.maxStock ?? 0)
		);

	if (productFilter.minStock)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.stockQty >= (productFilter.minStock ?? 0)
		);

	return filteredClientProducts;
}
