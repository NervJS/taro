import { TaroPlatformBase } from '@tarojs/shared';
import { Template } from './template';
export default class Swan extends TaroPlatformBase {
    platform: string;
    globalObject: string;
    projectConfigJson: string;
    fileType: {
        templ: string;
        style: string;
        config: string;
        script: string;
        xs: string;
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
    /**
     * 修改 webpack 配置
     */
    modifyWebpackChain(): void;
}
