import { TaroPlatformBase } from '@tarojs/service';
import { Template } from './template';
export default class Alipay extends TaroPlatformBase {
    platform: string;
    globalObject: string;
    runtimePath: string;
    taroComponentsPath: string;
    fileType: {
        templ: string;
        style: string;
        config: string;
        script: string;
        xs: string;
    };
    template: Template;
    /**
     * 1. setupTransaction - init
     * 2. setup
     * 3. setupTransaction - close
     * 4. buildTransaction - init
     * 5. build
     * 6. buildTransaction - close
     */
    constructor(ctx: any, config: any);
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
     * 修改 Swiper 组件属性
     */
    modifySwiper(swiper: any): void;
    /**
     * 修改 Webpack 配置
     */
    modifyWebpackConfig(): void;
}
