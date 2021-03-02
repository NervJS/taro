import { TaroPlatformBase } from '@tarojs/service';
import { Template } from './template';
export default class JD extends TaroPlatformBase {
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
}
