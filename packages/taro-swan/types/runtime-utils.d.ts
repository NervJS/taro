import { initNativeApi } from './apis';
export { initNativeApi };
export * from './components';
export * from './apis-list';
export declare const hostConfig: {
    initNativeApi: typeof initNativeApi;
    getPathIndex(indexOfNode: any): string;
    getSpecialNodes(): string[];
};
