import { CurrencyCode } from '../../type';
import number from '../../util/number';
import { ClientProduct, Product, ProductFilter } from './type';

export function productsToClientProducts(products: (Product | null)[], currencyCode: CurrencyCode) {
	const availableProducts = products.filter((product) => !!product);

	const designProducts: (ClientProduct | null)[] = availableProducts.map((product) => {
		const retailPrice = product.prices.find(
			(price) => price.currencyCode === currencyCode
		)?.retailPrice;
		if (!retailPrice) return null;

		return {
			_id: product._id,
			fhSku: product.fhSku,
			brand: product.brand,
			name: product.name,
			description: product.description,
			pdpLink: product.pdpLink,
			retailPrice,
			unitPerBox: product.unitPerBox,
			stockQty: currencyCode === 'USD' ? product.stockQtyUSD : product.stockQtyCAD,
			restockDate: currencyCode === 'USD' ? product.restockDateUSD : product.restockDateCAD,
			imageUrls: product.imageUrls,
			mainImageUrl: product.mainImageUrl,
			currencyCode,
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
			category: product.category,
			stockDate: product.stockDate,
			fullTextSearch: product.fullTextSearch
		};
	});

	return designProducts.filter((product) => product !== null);
}

export function filterClientProducts(
	clientProducts: ClientProduct[],
	productFilter?: ProductFilter
) {
	if (!productFilter) return clientProducts;

	let filteredClientProducts = clientProducts.filter((product) => (product.retailPrice ?? 0) > 0);

	if (productFilter.category)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.category === productFilter.category
		);

	if (productFilter.desc)
		filteredClientProducts = filteredClientProducts.filter((product) =>
			product.fullTextSearch.toLowerCase().includes((productFilter.desc ?? '').toLowerCase())
		);

	if (productFilter.availability === 'In Stock')
		filteredClientProducts = filteredClientProducts.filter((product) => product.stockQty >= 1);

	if (productFilter.availability === 'Low Stock')
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.stockQty >= 1 && product.stockQty <= 10
		);

	if (productFilter.availability === 'Out of Stock')
		filteredClientProducts = filteredClientProducts.filter((product) => product.stockQty <= 0);

	if (number.isNumber(productFilter.minPrice))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.retailPrice >= productFilter.minPrice!
		);

	if (number.isNumber(productFilter.maxPrice))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.retailPrice <= productFilter.maxPrice!
		);

	if (number.isNumber(productFilter.maxWidth))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.width ?? 0 <= productFilter.maxWidth!
		);

	if (number.isNumber(productFilter.minWidth))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.width && product.width >= productFilter.minWidth!
		);

	if (number.isNumber(productFilter.minHeight))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.height && product.height >= productFilter.minHeight!
		);

	if (number.isNumber(productFilter.maxHeight))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.height && product.height <= productFilter.maxHeight!
		);

	if (number.isNumber(productFilter.minDepth))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.depth && product.depth >= productFilter.minDepth!
		);

	if (number.isNumber(productFilter.maxDepth))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.depth && product.depth <= productFilter.maxDepth!
		);

	if (number.isNumber(productFilter.minWeight))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.weight && product.weight >= productFilter.minWeight!
		);

	if (number.isNumber(productFilter.maxWeight))
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.weight && product.weight <= productFilter.maxWeight!
		);

	if (productFilter.brand)
		filteredClientProducts = filteredClientProducts.filter(
			(product) => product.brand === decodeURIComponent(productFilter.brand!)
		);

	return filteredClientProducts;
}
