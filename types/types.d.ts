declare global {
    interface Window {
        Intercom: any;
        intercomSettings: any;
    }
}
export declare type ScriptType = "defer" | "async";
export interface IntercomProps {
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
export declare type IntercomLoad = {
    src: string;
    callBack?(param?: any): any;
    initWindow?: boolean;
    initIntercomWindow: (props?: any) => void;
    scriptType?: ScriptType;
};
