import Weapp from './program';
import type { IPluginContext } from '@tarojs/service';
export { Weapp };
export interface IOptions {
    enablekeyboardAccessory?: boolean;
}
declare const _default: (ctx: IPluginContext, options: IOptions) => void;
export default _default;
