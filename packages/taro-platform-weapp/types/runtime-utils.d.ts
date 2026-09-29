import { initNativeApi } from './apis';
export { initNativeApi };
export * from './apis-list';
export * from './components';
export declare const hostConfig: {
    initNativeApi: typeof initNativeApi;
    getMiniLifecycle(config: any): any;
    transferHydrateData(data: any, element: any, componentsAlias: any): {
        sid: any;
        v: string;
        nn: any;
    } | undefined;
};
