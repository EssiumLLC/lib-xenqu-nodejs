import { string as zstring, object as zobject, any as zany, date as zdate, number as znumber, boolean as zboolean, array as zarray, infer as zinfer } from "zod";

const BillingCustomerSchema = zobject({
  id: zstring(),
  invoice_settings: zobject({
    default_payment_method: zstring().nullable(),
  }),
  address: zany().nullable(),
  created: zdate(),
  currency: zstring(),
  default_source: zstring().nullable(),
  delinquent: zboolean(),
  description: zstring().nullable(),
  discount: zany().nullable(),
  email: zstring(),
  invoice_prefix: zstring(),
  livemode: zboolean(),
  metadata: zany().nullable(),
  name: zstring(),
  next_invoice_sequence: znumber(),
  object: zstring(),
  phone: zstring().nullable(),
  preferred_locales: zarray(zstring()),
  shipping: zany().nullable(),
  tax_exempt: zstring().nullable(),
});

const BillingActivityScehma = zobject({
  process_date: zdate(),
  new_records_count: znumber(),
  engaged_records_count: znumber(),
  active_records_count: znumber(),
});

const BillingOverviewSchema = zobject({
  cycle_date: zstring(),
  new_records_count: znumber(),
  engaged_records_count: znumber(),
  active_records_count: znumber(),
});

const BillingAlertSchema = zobject({
  active: zboolean(),
  billing_contact_id: znumber(),
  id: zstring(),
  last_triggered: zdate().nullable(),
  master_contact_id: znumber(),
  meter: zstring(),
  threshold: znumber(),
  triggered: zboolean(),
});

const PaymentMethodSchema = zobject({
  allow_redisplay: zboolean(),
  billing_details: zany(),
  created: znumber(),
  customer: zstring(),
  id: zstring(),
  livemode: zboolean(),
  metadata: zany(),
  object: zstring(),
  type: zstring(),
  us_bank_account: zobject({
    account_holder_type: zstring(),
    account_type: zstring(),
    bank_name: zstring(),
    financial_connections_account: zstring(),
    fingerprint: zstring(),
    last4: zstring(),
    networks: zany(),
    routing_number: zstring(),
    status_details: zany(),
  }).nullable(),
  card: zobject({
    brand: zstring(),
    checks: zany(),
    country: zstring(),
    display_brand: zstring(),
    exp_month: znumber(),
    exp_year: znumber(),
    fingerprint: zstring(),
    funding: zstring(),
    generated_from: zany().nullable(),
    last4: zstring(),
    networks: zany(),
    regulated_status: zstring().nullable(),
    three_d_secure_usage: zany().nullable(),
    wallet: zany().nullable(),
  }).nullable(),
});

const PaymentMethodsSchema = zobject({
  data: zarray(PaymentMethodSchema),
  error: zstring().optional(),
  has_more: zboolean(),
  object: zstring(),
});

const AcceptTermsSchema = zobject({
  id: zstring(),
  master_contact_id: znumber(),
  stripe_customer_id: zstring(),
  terms_agreed_at: zdate(),
  terms_agreed_by: zstring(),
  terms_agreed_to: zstring(),
});

const ProductSchema = zobject({
  id: zstring(),
  object: zstring(),
  active: zboolean(),
  created: znumber(),
  default_price: zstring().nullable(),
  description: zstring().nullable(),
  images: zarray(zstring()),
  marketing_features: zarray(zobject({
    name: zstring().nullable(),
  })),
  livemode: zboolean(),
  metadata: zobject({}),
  name: zstring(),
  package_dimensions: zobject({
    height: znumber(),
    length: znumber(),
    weight: znumber(),
    width: znumber(),
  }).nullable(),
  shippable: zboolean().nullable(),
  statement_descriptor: zstring().nullable(),
  tax_code: zstring().nullable(),
  unit_label: zstring().nullable(),
  updated: znumber(),
  url: zstring().nullable(),
});

const ProductsSchema = zobject({
  data: zarray(ProductSchema),
  error: zstring().optional(),
  has_more: zboolean(),
  object: zstring(),
});

const PriceSchema = zobject({
  id: zstring(),
  object: zstring(),
  active: zboolean(),
  billing_scheme: zstring(),
  created: znumber(),
  currency: zstring(),
  custom_unit_amount: zobject({
    maximum: znumber().nullable(),
    minimum: znumber().nullable(),
    preset: znumber().nullable(),
  }).nullable(),
  livemode: zboolean(),
  lookup_key: zstring().nullable(),
  metadata: zobject({}),
  nickname: zstring().nullable(),
  product: zstring(),
  recurring: zobject({
    interval: zstring(),
    interval_count: znumber(),
    trial_period_days: zstring().nullable(),
    usage_type: zstring(),
  }).nullable(),
  tax_behavior: zstring().nullable(),
  tiers_mode: zstring().nullable(),
  transform_quantity: zobject({
    divide_by: znumber(),
    round: zstring(),
  }).nullable(),
  type: zstring(),
  unit_amount: znumber().nullable(),
  unit_amount_decimal: zstring().nullable(),
});

const PricesSchema = zobject({
  data: zarray(PriceSchema),
  error: zstring().optional(),
  has_more: zboolean(),
  object: zstring(),
});

const CheckoutSessionSchema = zobject({
  id: zstring(),
  url: zstring().nullable(),
});

const BillingBalanceSchema = zobject({
  balance: znumber(),
  last_updated: zstring().nullable(),
});

const BillingLedgerSchema = zobject({
  id: zstring(),
  product_id: zstring(),
  master_contact_id: znumber(),
  xenqu_red_id: zstring().nullable(),
  ext_ref_id: zstring(),
  amount: znumber(),
  memo: zstring().nullable(),
  ledger_type: zstring(),
  create_date: zstring().or(zdate()),
});

const BillingLedgerResponseSchema = zobject({
  data: zarray(BillingLedgerSchema),
});

const BillingPermissionsResponseSchema = zobject({
  credit_admin: zboolean(),
});

const BillingIdentifiersResponseSchema = zobject({
  stripe_customer_id: zstring(),
  jira_customer_id: zstring(),
  front_account_id: zstring(),
})

type BillingCustomer = zinfer<typeof BillingCustomerSchema>;
type BillingActivity = zinfer<typeof BillingActivityScehma>;
type BillingOverview = zinfer<typeof BillingOverviewSchema>;
type BillingAlert = zinfer<typeof BillingAlertSchema>;
type PaymentMethod = zinfer<typeof PaymentMethodSchema>;
type PaymentMethods = zinfer<typeof PaymentMethodsSchema>;
type AcceptTerms = zinfer<typeof AcceptTermsSchema>;
type Product = zinfer<typeof ProductSchema>;
type Products = zinfer<typeof ProductsSchema>;
type Price = zinfer<typeof PriceSchema>;
type Prices = zinfer<typeof PricesSchema>;
type CheckoutSession = zinfer<typeof CheckoutSessionSchema>;
type BillingBalance = zinfer<typeof BillingBalanceSchema>;
type BillingLedgerResponse = zinfer<typeof BillingLedgerResponseSchema>;
type BillingPermissionsResponse = zinfer<typeof BillingPermissionsResponseSchema>;
type BillingIdentifiersResponse = zinfer<typeof BillingIdentifiersResponseSchema>;

export { BillingActivity, BillingActivityScehma, BillingAlert, BillingAlertSchema, BillingCustomer, BillingCustomerSchema, BillingOverview, BillingOverviewSchema, PaymentMethod, PaymentMethodSchema, AcceptTerms, AcceptTermsSchema, PaymentMethods, PaymentMethodsSchema, Product, ProductSchema, Products, ProductsSchema, Price, PriceSchema, Prices, PricesSchema, CheckoutSession, CheckoutSessionSchema, BillingBalance, BillingBalanceSchema, BillingLedgerResponse, BillingLedgerResponseSchema, BillingPermissionsResponse, BillingPermissionsResponseSchema, BillingIdentifiersResponse, BillingIdentifiersResponseSchema };
