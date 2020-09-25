import { TaroPlatformBase } from '@tarojs/service';
import { Template } from './template';
export default class TT extends TaroPlatformBase {
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
    /**
     * 增加组件或修改组件属性
     */
    modifyComponents(): void;
}
