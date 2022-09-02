import { LineItemMap } from '../cart';
import { Checkout, CheckoutService } from '../checkout';
import { ShopperCurrency } from '../config';
import { Order } from '../order';

import BodlService from "./bodl-service";
import { BodlEventsCheckout } from './bodl-window';

export default class BodlEmitterService implements BodlService {
    private _checkoutStarted = false;

    constructor(
        private checkoutService: CheckoutService,
        private bodlEvents: BodlEventsCheckout
    ) { }

    checkoutBegin(): void {
        if (this._checkoutStarted) {
            return;
        }

        const checkout = this.getCheckout();

        if (!checkout) {
            return;
        }


        const {
            cart: {
                cartAmount,
                currency,
                lineItems,
                id,
                coupons
            },
        } = checkout;

        this.bodlEvents.emit('create_checkout_begin', {
            id,
            currency: currency.code,
            cart_value: cartAmount,
            coupon: coupons.map(coupon => coupon.code.toUpperCase()).join(','),
            lineItems: this.getProducts(lineItems, currency.code)
        });

        this._checkoutStarted = true;
    }

    orderPurchased(): void {
        const order = this.getOrder();

        if (!order) {
            return;
        }


        const {
            currency,
            isComplete,
            orderId,
            orderAmount,
            shippingCostTotal,
            lineItems,
            cartId,
            coupons
        } = order;

        if (!isComplete) {
            return;
        }

        this.bodlEvents.emit('create_order_purchased', {
            id: cartId,
            currency: currency.code,
            transaction_id: orderId,
            cart_value: orderAmount,
            coupon: coupons.map(coupon => coupon.code.toUpperCase()).join(','),
            shipping_cost: shippingCostTotal,
            line_items: this.getProducts(lineItems, currency.code),
        });
    }

    private getOrder(): Order | undefined {
        const { data: { getOrder } } = this.checkoutService.getState();

        return getOrder();
    }

    private getCheckout(): Checkout | undefined {
        const { data: { getCheckout } } = this.checkoutService.getState();

        return getCheckout();
    }

    private getProducts(lineItems: LineItemMap, currency: string): BODLProduct[] {
        const customItems: BODLProduct[] = (lineItems.customItems || []).map(item => ({
            product_id: item.id,
            product_sku: item.sku,
            price: item.listPrice,
            quantity: item.quantity,
            product_name: item.name,
            currency,
        }));

        const giftCertificateItems: BODLProduct[] = lineItems.giftCertificates.map(item => {
            return {
                product_id: item.id,
                gift_certificate_id: item.id,
                price: this.toShopperCurrency(item.amount),
                product_name: item.name,
                gift_certificate_name: item.name,
                gift_certificate_theme: item.theme,
                quantity: 1,
                currency,
            };
        });

        const physicalAndDigitalItems: BODLProduct[] = [
            ...lineItems.physicalItems,
            ...lineItems.digitalItems,
        ].map(item => {
            let itemAttributes;

            if (item.options && item.options.length) {
                itemAttributes = item.options.map(option => `${option.name}:${option.value}`);
                itemAttributes.sort();
            }

            return {
                product_id: item.productId,
                quantity: item.quantity,
                product_name: item.name,
                price: item.salePrice,
                product_sku: item.sku,
                variant_id: item.variantId,
                discount: item.discountAmount,
                brand_name: item.brand,
                currency,
                category_name: item.categoryNames ? item.categoryNames.join(', ') : '',
            };
        });

        return [
            ...customItems,
            ...physicalAndDigitalItems,
            ...giftCertificateItems,
        ];
    }

    private toShopperCurrency(amount: number): number {
        const { exchangeRate = 1 } = this.getShopperCurrency() || {};

        return Math.round(amount * exchangeRate * 100) / 100;
    }

    private getShopperCurrency(): ShopperCurrency | undefined {
        const { data: { getConfig } } = this.checkoutService.getState();
        const config = getConfig();

        return config && config.shopperCurrency;
    }

}

export interface BODLProduct {
    product_id: string | number;
    product_name: string;
    product_sku?: string;
    variant_id?: number;
    variant_sku?: string;
    gift_certificate_id?: string | number;
    gift_certificate_name?: string;
    gift_certificate_theme?: string;
    price: number;
    sale_price?: number;
    base_price?: number;
    retail_price?: number;
    quantity: number;
    discount?: number;
    index?: number;
    brand_name?: string;
    category_name?: string;
    currency?: string;
}