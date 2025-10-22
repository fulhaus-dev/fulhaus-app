import { defineTable } from 'convex/server';
import { vCreateProductEmbeddingFields } from './validator';

export const productEmbeddingTable = defineTable(vCreateProductEmbeddingFields).vectorIndex(
	'by_image_embedding',
	{
		vectorField: 'imageEmbedding',
		dimensions: 512,
		filterFields: [
			'categoryCAD',
			'categoryUSD',
			'retailPriceUSD',
			'retailPriceCAD',
			'weight',
			'width',
			'height',
			'depth'
		]
	}
);
