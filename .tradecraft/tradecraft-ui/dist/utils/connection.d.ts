export declare function hasConnection(navigator: Navigator): navigator is Navigator & {
    connection: any;
};
export declare function isSavingData(): boolean | undefined;
export declare function isSlowConnection(): boolean | undefined;
