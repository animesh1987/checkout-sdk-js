import BodlService from "./bodl-service";
import NoopBodlService from "./noop-bodl-service";
import BodlEmitterService from "./bodl-emitter-service";
import { isBodlEnabled } from "./is-bodl-enabled";
import { CheckoutService } from "../checkout";
import { MissingDataError, MissingDataErrorType } from "../common/error/errors";

/**
 * Creates an instance of `BodlService`.
 *
 * @remarks
 * 
 * ```js
 * const bodlService = BodlService();
 * bodlService.checkoutBegin();
 * 
 * ```
 *
 * @param {CheckoutService} checkoutService - An instance of CheckoutService
 * @returns an instance of `BodlService`.
 */
export default function createBodlService(
    checkoutService: CheckoutService,
): BodlService {
    const { data } = checkoutService.getState();
    const config = data.getConfig();

    if (!config) {
        throw new MissingDataError(MissingDataErrorType.MissingCheckoutConfig);
    }

    if (isBodlEnabled(window)) {
        return new BodlEmitterService(
            checkoutService,
            window.bodlEvents.checkout
        );
    }

    return new NoopBodlService();
}
