import { billingAddressActionCreator,
    checkoutActionCreator,
    CheckoutStore,
    consignmentActionCreator,
    orderActionCreator,
    paymentActionCreator,
    paymentMethodActionCreator,
} from "@bigcommerce/checkout-sdk/core";
import createPaymentIntegrationSelectors from "./create-payment-integration-selectors";
import DefaultPaymentIntegrationService from "./default-payment-integration-service";
import PaymentIntegrationStoreProjectionFactory from "./payment-integration-store-projection-factory";

export function createPaymentIntegrationService(
    store: CheckoutStore,
) {
    const storeProjectionFactory = new PaymentIntegrationStoreProjectionFactory(createPaymentIntegrationSelectors);

    return new DefaultPaymentIntegrationService(
        store,
        storeProjectionFactory,
        checkoutActionCreator,
        orderActionCreator,
        billingAddressActionCreator,
        consignmentActionCreator,
        paymentMethodActionCreator,
        paymentActionCreator
    );
}
