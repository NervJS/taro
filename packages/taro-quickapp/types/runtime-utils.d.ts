import { initNativeApi } from './apis';
export { initNativeApi };
export * from './components';
export declare const hostConfig: {
    initNativeApi: typeof initNativeApi;
    getPathIndex(indexOfNode: any): string;
    modifyTaroEvent(event: any, node: any): void;
};
