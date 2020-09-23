import { TaroPlatformBase } from '@tarojs/shared';
import { Template } from './template';
export default class JD extends TaroPlatformBase {
    platform: string;
    globalObject: string;
    projectConfigJson: string;
    runtimePath: string;
    fileType: {
        templ: string;
        style: string;
        config: string;
        script: string;
    };
    template: Template;
    /**
     * 调用 mini-runner 开启编译
     */
    start(): Promise<void>;
}
