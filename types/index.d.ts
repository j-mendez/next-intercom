import type { IntercomProps } from "./types";
declare let APP_ID: string;
declare function setAppId(id: string): void;
declare function updateIntercom(event?: string, settings?: any): void;
declare function trackEvent(type: string, metadata?: any): void;
declare function createIntercomSSR(appId?: string): Promise<any>;
declare function loadIntercom({ appId, callBack, delay, email, name, initWindow, scriptType, scriptInitDelay, ...extra }: IntercomProps): Promise<any> | undefined;
declare function initIntercomWindow({ appId, ...otherProps }: {
    [x: string]: any;
    appId?: string | undefined;
}): void;
declare function shutdownIntercom(): void;
export { updateIntercom, trackEvent, createIntercomSSR, setAppId, loadIntercom, initIntercomWindow, shutdownIntercom, APP_ID };
