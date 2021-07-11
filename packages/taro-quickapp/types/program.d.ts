import { TaroPlatformBase } from '@tarojs/service';
import { Template } from './template';
export default class QuickApp extends TaroPlatformBase {
    platform: string;
    globalObject: string;
    runtimePath: string;
    taroComponentsPath: string;
    fileType: {
        templ: string;
        style: string;
        config: string;
        script: string;
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
     * 转换用户编写的配置（微信小程序标准）为快应用标准
     */
    modifyMiniConfigs(): void;
    /**
   * 递归遍历修改config
   */
    protected traverseModifyConfig(obj: any, func: (key: string, value: any, parent: any) => void): void;
    /**
     * 增加组件或修改组件属性
     */
    modifyTemplate(): void;
}
