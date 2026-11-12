import { UnRecursiveTemplate } from '@tarojs/shared/dist/template';
import type { IOptions } from './index';
export declare class Template extends UnRecursiveTemplate {
    pluginOptions: IOptions;
    supportXS: boolean;
    Adapter: {
        if: string;
        else: string;
        elseif: string;
        for: string;
        forItem: string;
        forIndex: string;
        key: string;
        xs: string;
        type: string;
    };
    transferComponents: Record<string, Record<string, string>>;
    constructor(pluginOptions?: IOptions);
    buildXsTemplate(filePath?: string): string;
    createMiniComponents(components: any): any;
    replacePropName(name: string, value: string, componentName: string, componentAlias: any): string;
    buildXSTepFocus(nn: string): string;
    modifyTemplateResult: (res: string, nodeName: string, _: any, children: any) => string;
    buildPageTemplate: (baseTempPath: string, page: any) => string;
}
