import { TaroPlatformBase } from '@tarojs/service';
import { Template } from './template';
import type { IOptions } from './index';
export default class Weapp extends TaroPlatformBase {
    template: Template;
    platform: string;
    globalObject: string;
    projectConfigJson: string;
    runtimePath: string;
    taroComponentsPath: string;
    fileType: {
        templ: string;
        style: string;
        config: string;
        script: string;
        xs: string;
    };
    /**
     * 1. setupTransaction - init
     * 2. setup
     * 3. setupTransaction - close
     * 4. buildTransaction - init
     * 5. build
     * 6. buildTransaction - close
     */
    constructor(ctx: any, config: any, pluginOptions?: IOptions);
    /**
     * 增加组件或修改组件属性
     */
    modifyTemplate(pluginOptions?: IOptions): void;
    /**
     * 修改 Webpack 配置
     */
    modifyWebpackConfig(): void;
}
