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
     * 1. setupTransaction - init
     * 2. setup
     * 3. setupTransaction - close
     * 4. buildTransaction - init
     * 5. build
     * 6. buildTransaction - close
     */
    constructor(ctx: any, config: any);
    /**
     * 增加组件或修改组件属性
     */
    modifyTemplate(): void;
}
