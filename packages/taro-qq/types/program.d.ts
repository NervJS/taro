import { Weapp } from '@tarojs/plugin-platform-weapp';
import type { IOptions } from '@tarojs/plugin-platform-weapp';
export default class QQ extends Weapp {
    platform: string;
    globalObject: string;
    projectConfigJson: string;
    runtimePath: string;
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
    constructor(ctx: any, config: any, pluginOptions: IOptions);
    beforeBuild(): void;
}
