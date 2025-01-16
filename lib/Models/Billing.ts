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

type BillingCustomer = zinfer<typeof BillingCustomerSchema>;
type BillingActivity = zinfer<typeof BillingActivityScehma>;
type BillingOverview = zinfer<typeof BillingOverviewSchema>;
type BillingAlert = zinfer<typeof BillingAlertSchema>;
type PaymentMethod = zinfer<typeof PaymentMethodSchema>;
type PaymentMethods = zinfer<typeof PaymentMethodsSchema>;
type AcceptTerms = zinfer<typeof AcceptTermsSchema>;

export { BillingActivity, BillingActivityScehma, BillingAlert, BillingAlertSchema, BillingCustomer, BillingCustomerSchema, BillingOverview, BillingOverviewSchema, PaymentMethod, PaymentMethodSchema, AcceptTerms, AcceptTermsSchema, PaymentMethods, PaymentMethodsSchema };
