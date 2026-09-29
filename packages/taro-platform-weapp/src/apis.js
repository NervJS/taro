import { processApis } from '@tarojs/shared';
import { needPromiseApis } from './apis-list';
export function initNativeApi(taro) {
    processApis(taro, wx, {
        needPromiseApis,
        modifyApis(apis) {
            // fix https://github.com/NervJS/taro/issues/9899
            apis.delete('lanDebug');
        },
        transformMeta(api, options) {
            var _a;
            if (api === 'showShareMenu') {
                options.menus = (_a = options.showShareItems) === null || _a === void 0 ? void 0 : _a.map(item => item === 'wechatFriends' ? 'shareAppMessage' : item === 'wechatMoment' ? 'shareTimeline' : item);
            }
            return {
                key: api,
                options
            };
        }
    });
    taro.cloud = wx.cloud;
    taro.getTabBar = function (pageCtx) {
        var _a;
        if (typeof (pageCtx === null || pageCtx === void 0 ? void 0 : pageCtx.getTabBar) === 'function') {
            return (_a = pageCtx.getTabBar()) === null || _a === void 0 ? void 0 : _a.$taroInstances;
        }
    };
    taro.getRenderer = function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = taro.getCurrentInstance()) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.renderer) !== null && _c !== void 0 ? _c : 'webview';
    };
}
//# sourceMappingURL=apis.js.map