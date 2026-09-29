import { toCamelCase } from '@tarojs/shared';
import { initNativeApi } from './apis';
export { initNativeApi };
export * from './apis-list';
export * from './components';
export const hostConfig = {
    initNativeApi,
    getMiniLifecycle(config) {
        const methods = config.page[5];
        if (methods.indexOf('onSaveExitState') === -1) {
            methods.push('onSaveExitState');
        }
        return config;
    },
    transferHydrateData(data, element, componentsAlias) {
        var _a;
        if (element.isTransferElement) {
            const pages = getCurrentPages();
            const page = pages[pages.length - 1];
            data["nn" /* Shortcuts.NodeName */] = element.dataName;
            page.setData({
                [toCamelCase(data.nn)]: data
            });
            return {
                sid: element.sid,
                ["v" /* Shortcuts.Text */]: '',
                ["nn" /* Shortcuts.NodeName */]: ((_a = componentsAlias['#text']) === null || _a === void 0 ? void 0 : _a._num) || '8'
            };
        }
    },
};
//# sourceMappingURL=runtime-utils.js.map