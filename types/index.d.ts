import type { IntercomProps } from "./types";
declare let APP_ID: string;
declare function setAppId(id: string): void;
declare function updateIntercom(event?: string, settings?: any): void;
declare function trackEvent(type: string, metadata?: any): void;
declare function createIntercomSSR(appId?: string): Promise<string>;
declare function initIntercomWindow({ appId, ...otherProps }: {
    [x: string]: any;
    appId?: string | undefined;
}): void;
declare function loadIntercom({ appId, delay, initWindow, ...extra }: IntercomProps): Promise<string> | undefined;
declare function showIntercomWindow(): void;
declare function shutdownIntercom(): void;
export { updateIntercom, trackEvent, createIntercomSSR, setAppId, loadIntercom, initIntercomWindow, showIntercomWindow, shutdownIntercom, APP_ID };
