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

type BillingSetupSecret = z.infer<typeof BillingSetupSecretSchema>;
type BillingCustomer = z.infer<typeof BillingCustomerSchema>;

export { BillingSetupSecret, BillingSetupSecretSchema, BillingCustomer, BillingCustomerSchema };