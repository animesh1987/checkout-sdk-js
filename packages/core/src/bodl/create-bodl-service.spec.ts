import { createCheckoutService, CheckoutService } from '../checkout';
import { MissingDataError } from '../common/error/errors';
import { StoreConfig } from '../config';

import BodlEmitterService from "./bodl-emitter-service";
import BodlEventsWindow, { BodlEvents } from './bodl-window';
import createBodlService from './create-bodl-service';
import NoopBodlService from './noop-bodl-service';

declare let window: BodlEventsWindow;

describe('createBodl', () => {
    let checkoutService: CheckoutService;

    beforeEach(() => {
        checkoutService = createCheckoutService();
    });

    describe('#createBodlService()', () => {
        describe('when checkoutService has not been initialized', () => {
            it('returns instance of noop logger', () => {
                expect(() => createBodlService(checkoutService)).toThrowError(MissingDataError);
            });
        });

        describe('when window.bodlEvents is undefined', () => {
            beforeEach(() => {
                jest.spyOn(checkoutService.getState().data, 'getConfig').mockReturnValue({
                    checkoutSettings: {},
                } as StoreConfig);
            });

            it('returns instance of noop logger', () => {
                expect(createBodlService(checkoutService)).toBeInstanceOf(NoopBodlService);
            });
        });

        describe('when window.bodlEvents is defined', () => {
            beforeEach(() => {
                jest.spyOn(checkoutService.getState().data, 'getConfig').mockReturnValue({
                    checkoutSettings: {},
                } as StoreConfig);

                window.bodlEvents = {} as BodlEvents;
            });

            it('returns instance of BodlService', () => {
                expect(createBodlService(checkoutService)).toBeInstanceOf(BodlEmitterService);
            });
        });
    });
});
