import { RecursiveTemplate } from '@tarojs/shared';
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
    buildXsTemplate(): string;
    dataKeymap(keymap: string): string;
    getAttrValue(value: string, key: string, nodeName: string): string;
    modifyLoopBody: (child: string, nodeName: string) => string;
}
