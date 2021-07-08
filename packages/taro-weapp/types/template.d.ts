import { UnRecursiveTemplate } from '@tarojs/shared';
export declare class Template extends UnRecursiveTemplate {
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
    buildXsTemplate(): string;
    replacePropName(name: string, value: string, componentName: string): string;
    modifyLoopContainer: (children: any, nodeName: any) => any;
    modifyTemplateResult: (res: string, nodeName: string) => string;
}
