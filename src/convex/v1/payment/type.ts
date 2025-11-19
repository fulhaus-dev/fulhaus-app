import { Infer } from 'convex/values';
import { vPaymentMetadata, vPaymentType } from './validator';

export type PaymentType = Infer<typeof vPaymentType>;

export type PaymentMetadata = Infer<typeof vPaymentMetadata>;
