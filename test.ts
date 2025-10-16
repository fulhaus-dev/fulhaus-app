export const test = {
	id: 'evt_1SInh8CmdDV1L6zEOHaGHwUj',
	object: 'event',
	api_version: '2025-09-30.clover',
	created: 1760607719,
	data: {
		object: {
			id: 'in_1SInh4CmdDV1L6zEIFFGDs87',
			object: 'invoice',
			account_country: 'CA',
			account_name: 'Fulhaus Canada Sandbox',
			account_tax_ids: null,
			amount_due: 1151789,
			amount_overpaid: 0,
			amount_paid: 1151789,
			amount_remaining: 0,
			amount_shipping: 0,
			application: null,
			attempt_count: 1,
			attempted: true,
			auto_advance: false,
			automatic_tax: {
				disabled_reason: null,
				enabled: false,
				liability: null,
				provider: null,
				status: null
			},
			automatically_finalizes_at: null,
			billing_reason: 'manual',
			collection_method: 'send_invoice',
			created: 1760607716,
			currency: 'cad',
			custom_fields: null,
			customer: 'cus_TFIH1kvy1B9IhZ',
			customer_address: {
				city: 'Longueuil',
				country: 'CA',
				line1: '545 Rue Grant',
				line2: null,
				postal_code: 'J4H 3J3',
				state: 'QC'
			},
			customer_email: 'idumajogu@gmail.com',
			customer_name: 'Uneku Idumajogu',
			customer_phone: null,
			customer_shipping: {
				address: {
					city: 'Longueuil',
					country: 'CA',
					line1: '545 Rue Grant',
					line2: null,
					postal_code: 'J4H 3J3',
					state: 'QC'
				},
				name: 'Uneku Idumajogu',
				phone: null
			},
			customer_tax_exempt: 'none',
			customer_tax_ids: [],
			default_payment_method: null,
			default_source: null,
			default_tax_rates: [],
			description:
				'Wire/ EFT Instruction\nBank Name: Bank of Montreal\nInstitution Number: 001\nTransit Number: 21181\nAccount Number: 1991757\nSWIFT Code: BOFMCAM2XXX',
			discounts: [],
			due_date: 1760607716,
			effective_at: 1760607716,
			ending_balance: 0,
			footer: null,
			from_invoice: null,
			hosted_invoice_url:
				'https://invoice.stripe.com/i/acct_1SInYxCmdDV1L6zE/test_YWNjdF8xU0luWXhDbWREVjFMNnpFLF9URklIMThGZzc3NUtGWHVNYkU5T1FETmU5aHdXSnJnLDE1MTE0ODUyMg0200vwf9GqGy?s=ap',
			invoice_pdf:
				'https://pay.stripe.com/invoice/acct_1SInYxCmdDV1L6zE/test_YWNjdF8xU0luWXhDbWREVjFMNnpFLF9URklIMThGZzc3NUtGWHVNYkU5T1FETmU5aHdXSnJnLDE1MTE0ODUyMg0200vwf9GqGy/pdf?s=ap',
			issuer: {
				type: 'self'
			},
			last_finalization_error: null,
			latest_revision: null,
			lines: {
				object: 'list',
				data: [
					[Object],
					[Object],
					[Object],
					[Object],
					[Object],
					[Object],
					[Object],
					[Object],
					[Object],
					[Object]
				],
				has_more: true,
				total_count: 11,
				url: '/v1/invoices/in_1SInh4CmdDV1L6zEIFFGDs87/lines'
			},
			livemode: false,
			metadata: {
				workspaceId: 'jn78tsj6mfzcp8ef65py808gk57s51et',
				type: 'cart',
				currencyCode: 'CAD',
				userId: 'jd7agr57mm2jtxt5bjmgjghvjd7s48hs'
			},
			next_payment_attempt: null,
			number: 'JO3UPDFP-0001',
			on_behalf_of: null,
			parent: null,
			payment_settings: {
				default_mandate: null,
				payment_method_options: null,
				payment_method_types: null
			},
			period_end: 1760607716,
			period_start: 1760607716,
			post_payment_credit_notes_amount: 0,
			pre_payment_credit_notes_amount: 0,
			receipt_number: null,
			rendering: {
				amount_tax_display: null,
				pdf: {
					page_size: 'letter'
				},
				template: null,
				template_version: null
			},
			shipping_cost: null,
			shipping_details: {
				address: {
					city: 'Longueuil',
					country: 'CA',
					line1: '545 Rue Grant',
					line2: null,
					postal_code: 'J4H 3J3',
					state: 'QC'
				},
				name: 'Uneku Idumajogu',
				phone: null
			},
			starting_balance: 0,
			statement_descriptor: null,
			status: 'paid',
			status_transitions: {
				finalized_at: 1760607716,
				marked_uncollectible_at: null,
				paid_at: 1760607716,
				voided_at: null
			},
			subtotal: 1151789,
			subtotal_excluding_tax: 1151789,
			test_clock: null,
			total: 1151789,
			total_discount_amounts: [],
			total_excluding_tax: 1151789,
			total_pretax_credit_amounts: [],
			total_taxes: [],
			webhooks_delivered_at: 1760607716
		}
	},
	livemode: false,
	pending_webhooks: 1,
	request: {
		id: null,
		idempotency_key: null
	},
	type: 'invoice.payment_succeeded'
};
