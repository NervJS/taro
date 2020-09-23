import { TaroPlatformBase } from '@tarojs/shared';
import { Template } from './template';
export default class Alipay extends TaroPlatformBase {
    platform: string;
    globalObject: string;
    runtimePath: string;
    reactComponents: string;
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
     * 转换用户编写的配置（微信小程序标准）为支付宝小程序标准
     */
    modifyMiniConfigs(): void;
    /**
     * 增加组件或修改组件属性
     */
    modifyComponents(): void;
    /**
     * 修改 Slider 组件属性
     */
    modifySlider(slider: any): void;
    /**
     * 修改 webpack 配置
     */
    modifyWebpackChain(): void;
}
