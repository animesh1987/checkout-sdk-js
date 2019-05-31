export enum CheckoutIncludes {
    AvailableShippingOptions = 'consignments.availableShippingOptions',
    AvailablePreQuoteShippingOptions = 'consignments.availablePreQuoteShippingOptions',
    PreQuoteShippingOptionValues = 'consignments.preQuoteShippingOptionValues',
    PhysicalItemsCategoryNames = 'cart.lineItems.physicalItems.categoryNames',
    DigitalItemsCategoryNames = 'cart.lineItems.digitalItems.categoryNames',
}

export default interface CheckoutParams {
    include?: CheckoutIncludes[];
}
