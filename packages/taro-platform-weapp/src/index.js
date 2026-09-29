var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Weapp from './program';
// 让其它平台插件可以继承此平台
export { Weapp };
export default (ctx, options) => {
    ctx.registerPlatform({
        name: 'weapp',
        useConfigName: 'mini',
        fn(_a) {
            return __awaiter(this, arguments, void 0, function* ({ config }) {
                const program = new Weapp(ctx, config, options || {});
                yield program.start();
            });
        }
    });
};
//# sourceMappingURL=index.js.map