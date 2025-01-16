import XenquAPI from "..";
import { AcceptTerms, BillingActivity, BillingAlert, BillingCustomer, BillingOverview, PaymentMethod, PaymentMethods } from "../Models/Billing";

export default class BillingRoutes {

    //Get the client secret used by stripe to setup a payment method for a client
    public GetSetupSecret(): Promise<string> {
        return XenquAPI.Base.makeGet(`/billing/payment-method/secret`);
    }

    //Get the Customer of the master account of the user 
    public GetCustomer(): Promise<BillingCustomer> {
        return XenquAPI.Base.makeGet(`/billing/customer`);
    }

    public GetPaymentMethodList(): Promise<PaymentMethods> {
        return XenquAPI.Base.makeGet(`/billing/payment-method/list`)
    }

    public GetBillingActivity(days_away: string): Promise<BillingActivity[]> {
        return XenquAPI.Base.makeGet(`/billing/meter-event/summary`, { days_away: days_away });
    }

    public GetBillingOverview(): Promise<BillingOverview[]> {
        return XenquAPI.Base.makeGet(`/billing/meter-event/overview`);
    }

    public DetachPaymentMethod(payment_method: string): Promise<PaymentMethod> {
        return XenquAPI.Base.makeDelete(`/billing/payment-method/${payment_method}`);
    }

    public SetDefaultPaymentMethod(payment_method: string): Promise<BillingCustomer> {
        return XenquAPI.Base.makePut(`/billing/payment-method/${payment_method}/default`, '');
    }

    public AcceptTerms(terms: object): Promise<AcceptTerms> {
        return XenquAPI.Base.makePost(`/billing/terms/accept`, JSON.stringify(terms));
    }

    public GenerateCSV(billing_period: string): Promise<{file: string}> {
        return XenquAPI.Base.makeGet(`/billing/generate_csv`, { billing_period: billing_period });
    }

    public GetInvoices(billing_period: string): Promise<string[]> {
        return XenquAPI.Base.makeGet(`/billing/invoices`, { billing_period: billing_period });
    }

    public GetAlerts(): Promise<BillingAlert[]> {
        return XenquAPI.Base.makeGet(`/billing/alert`);
    }

    public SetAlert(meter: string, active: boolean, threshold: number): Promise<BillingAlert> {
        return XenquAPI.Base.makePost(`/billing/alert`, undefined, { meter: meter, active: active, threshold: threshold });
    }
}
