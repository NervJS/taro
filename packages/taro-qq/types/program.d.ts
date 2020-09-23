import { Weapp } from '@tarojs/plugin-platform-weapp';
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
    constructor(ctx: any, config: any);
    /**
     * 增加组件或修改组件属性
     */
    modifyComponents(): void;
}
