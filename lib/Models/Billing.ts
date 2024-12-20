import { z } from "zod";

const BillingSetupSecretSchema = z.object({
  clientSecret: z.string(),
});

const BillingCustomerSchema = z.object({
    id: z.string(),
    invoice_settings: z.object({
        default_payment_method: z.string().nullable(),
    })
});

const BillingActivityScehma = z.array(
  z.object({
    process_date: z.date(),
    new_records_count: z.number(),
    engaged_records_count: z.number(),
    active_records_count: z.number(),
  })
);

const BillingOverviewScehma = z.array(
  z.object({
    cycle_date: z.date(),
    new_records_count: z.number(),
    engaged_records_count: z.number(),
    active_records_count: z.number(),
  })
);

const BillingAlertSchema = z.array(
  z.object({
    active: z.boolean(),
    billing_contact_id: z.number(),
    id: z.string(),
    last_triggered: z.date().nullable(),
    master_contact_id: z.number(),
    meter: z.string(),
    threshold: z.number(),
    triggered: z.boolean(),
  })
);

type BillingSetupSecret = z.infer<typeof BillingSetupSecretSchema>;
type BillingCustomer = z.infer<typeof BillingCustomerSchema>;
type BillingActivity = z.infer<typeof BillingActivityScehma>;
type BillingOverview = z.infer<typeof BillingOverviewScehma>;
type BillingAlert = z.infer<typeof BillingAlertSchema>;

export { BillingSetupSecret, BillingSetupSecretSchema, BillingCustomer, BillingCustomerSchema, BillingActivity, BillingActivityScehma, BillingOverview, BillingOverviewScehma, BillingAlert, BillingAlertSchema };