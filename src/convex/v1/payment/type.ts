export type PaymentType = 'cart' | 'credits';

export type PaymentMetadata = {
	workspaceId: string;
	userId: string;
	currencyCode: string;
	type: PaymentType;
};
