import { RecursiveTemplate } from '@tarojs/shared/dist/template';
interface TemplateOptions {
    flattenViewLevel?: number;
}
export declare class Template extends RecursiveTemplate {
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
    flattenViewLevel: number;
    constructor(options?: TemplateOptions);
    createMiniComponents(components: any): any;
    buildXsTemplate(): string;
    dataKeymap(keymap: string): string;
    getAttrValue(value: string, key: string, nodeName: string): string;
    buildFlattenView: (level?: number) => string;
    modifyLoopBody: (child: string, nodeName: string) => string;
    modifyTemplateResult: (res: string, nodeName: string) => string;
}
