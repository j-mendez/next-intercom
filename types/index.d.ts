declare global {
    interface Window {
        Intercom: any;
        intercomSettings: any;
    }
}
declare type ScriptType = 'defer' | 'async';
interface IntercomProps {
    [x: string]: any;
    appId?: string;
    ssr?: boolean;
    callBack?(param?: any): any;
    delay?: number;
    email?: string | null;
    name?: string;
    initWindow?: boolean;
    scriptType?: ScriptType;
    scriptInitDelay?: number;
}
declare function setAppId(id: string): void;
declare function updateIntercom(event?: string, settings?: any): void;
declare function createIntercomSSR(appId?: string): Promise<any>;
declare function loadIntercom({ appId, ssr, callBack, delay, email, name, initWindow, scriptType, scriptInitDelay, ...extra }: IntercomProps): Promise<any> | undefined;
declare function initIntercomWindow({ appId, ...otherProps }: {
    [x: string]: any;
    appId?: string | undefined;
}): void;
declare function shutdownIntercom(): void;
export { updateIntercom, createIntercomSSR, setAppId, loadIntercom, initIntercomWindow, shutdownIntercom, };
