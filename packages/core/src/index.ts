import { createRequestSender } from '@bigcommerce/request-sender';
import { createScriptLoader } from '@bigcommerce/script-loader';
import { BillingAddressActionCreator, BillingAddressRequestSender } from './billing';
import { CheckoutRequestSender, CheckoutActionCreator, CheckoutValidator } from './checkout';
import { ConfigActionCreator, ConfigRequestSender } from './config';
import { FormFieldsActionCreator, FormFieldsRequestSender } from './form';
import { OrderActionCreator, OrderRequestSender } from './order';
import { createPaymentClient, PaymentActionCreator, PaymentMethodActionCreator, PaymentMethodRequestSender, PaymentRequestSender, PaymentRequestTransformer } from './payment';
import { ConsignmentActionCreator, ConsignmentRequestSender } from './shipping';
import { createSpamProtection, PaymentHumanVerificationHandler } from './spam-protection';
import { SubscriptionsActionCreator, SubscriptionsRequestSender } from './subscription';

export { BillingAddress, BillingAddressRequestBody, BillingAddressActionCreator } from './billing';
export { getBillingAddress } from './billing/billing-addresses.mock';
export { createDataStoreProjection, DataStoreProjection } from './common/data-store';
export { cloneResult as clone } from './common/utility';
export { Cart } from './cart';
export { createCheckoutStore, createInternalCheckoutSelectors, Checkout, CheckoutActionCreator, CheckoutStore, InternalCheckoutSelectors, ReadableCheckoutStore } from './checkout';
export { getCheckoutStoreStateWithOrder } from './checkout/checkouts.mock';
export { StoreConfig } from './config';
export { Customer } from './customer';
export { Order, OrderActionCreator, OrderRequestBody } from './order';
export { getOrder } from './order/orders.mock';
export { Payment, PaymentActionCreator, PaymentMethodActionCreator, PaymentMethod } from './payment';
export { getPayment } from './payment/payments.mock';
export { CardInstrument } from './payment/instrument';
export { Consignment, ConsignmentActionCreator, ShippingAddress, ShippingAddressRequestBody } from './shipping';
export { getShippingAddress } from './shipping/shipping-addresses.mock';


const requestSender = createRequestSender();
const checkoutRequestSender = new CheckoutRequestSender(requestSender);
const configActionCreator = new ConfigActionCreator(new ConfigRequestSender(requestSender));
const formFieldsActionCreator = new FormFieldsActionCreator(new FormFieldsRequestSender(requestSender));

const checkoutValidator = new CheckoutValidator(checkoutRequestSender);
const orderRequestSender = new OrderRequestSender(requestSender);

const billingAddressRequestSender = new BillingAddressRequestSender(requestSender);
const subscriptionRequestSender = new SubscriptionsRequestSender(requestSender);
const subscriptionsActionCreator = new SubscriptionsActionCreator(subscriptionRequestSender);

const consignmentRequestSender = new ConsignmentRequestSender(requestSender);

const paymentMethodRequestSender = new PaymentMethodRequestSender(requestSender);

const paymentClient = createPaymentClient(store);
const paymentRequestSender = new PaymentRequestSender(paymentClient);
const paymentRequestTransformer = new PaymentRequestTransformer();
const paymentHumanVerificationHandler = new PaymentHumanVerificationHandler(createSpamProtection(createScriptLoader()));

export const checkoutActionCreator = new CheckoutActionCreator(checkoutRequestSender, configActionCreator, formFieldsActionCreator);
export const orderActionCreator = new OrderActionCreator(orderRequestSender, checkoutValidator);
export const billingAddressActionCreator = new BillingAddressActionCreator(
    billingAddressRequestSender,
    subscriptionsActionCreator
);
export const consignmentActionCreator =  new ConsignmentActionCreator(
    consignmentRequestSender,
    checkoutRequestSender
);
export const paymentMethodActionCreator = new PaymentMethodActionCreator(paymentMethodRequestSender);
export const paymentActionCreator = new PaymentActionCreator(paymentRequestSender, orderActionCreator, paymentRequestTransformer, paymentHumanVerificationHandler);
