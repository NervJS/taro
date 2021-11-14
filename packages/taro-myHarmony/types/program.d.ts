import { TaroPlatformBase } from '@tarojs/service';
export default class MyHarmony extends TaroPlatformBase {
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
    template: any;
    constructor(ctx: any, config: any);
    modifyTemplate(): void;
}
