export declare function request(options: any): any;
export declare function handleSyncApis(key: string, global: Record<string, any>, args: any[]): any;
export declare function transformMeta(api: string, options: Record<string, any>): {
    key: string;
    options: Record<string, any>;
};
export declare function modifyApis(apis: Set<string>): void;
export declare function modifyAsyncResult(key: any, res: any): void;
export declare function initNativeApi(taro: any): void;
