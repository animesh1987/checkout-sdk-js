export interface BodlEventsCheckout { 
    emit(eventName: string | symbol, ...args: any[]): boolean;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    checkoutBegin(cb: () => void): this;
    orderPurchased(cb: () => void): this;
}

export interface BodlEvents {
    checkout: BodlEventsCheckout;
}

export default interface BodlEventsWindow extends Window {
    bodlEvents: BodlEvents;
}
