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
    flattenCoverLevel: number;
    legacyMiniComponents: {
        [key: string]: Record<string, string>;
    };
    constructor(options?: TemplateOptions);
    createMiniComponents(components: any): any;
    buildXsTemplate(): string;
    dataKeymap(keymap: string): string;
    getAttrValue(value: string, key: string, nodeName: string): string;
    buildFlattenNodeAttributes(nodeName: string): string;
    buildFlattenView: (level?: number) => string;
    buildFlattenCover: (level?: number) => string;
    modifyLoopBody: (child: string, nodeName: string) => string;
    modifyLoopContainer: (children: string, nodeName: string) => string;
    modifyTemplateResult: (res: string, nodeName: string) => string;
}
export {};
