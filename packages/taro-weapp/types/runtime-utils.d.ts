import { initNativeApi } from './apis';
export { components } from './components';
export { initNativeApi };
export { _noPromiseApis, _onAndSyncApis, _otherApis } from './apis-list';
export declare const hostConfig: {
    initNativeApi: typeof initNativeApi;
    onTaroElementCreate(tagName: string): void;
};
