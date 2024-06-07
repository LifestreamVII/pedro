/// <reference lib="webworker" />

export {};

declare global {
  interface ServiceWorkerGlobalScope {
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => void;
    caches: CacheStorage;
    clients: Clients;
    importScripts: (...urls: string[]) => void;
    registration: ServiceWorkerRegistration;
    skipWaiting: () => Promise<void>;
  }

  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }

  interface FetchEvent extends ExtendableEvent {
    request: Request;
    respondWith(response: Response | Promise<Response>): void;
  }

  declare var self: ServiceWorkerGlobalScope;
}
