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
        type: string;
    };
    replacePropName(name: any, value: any): any;
}
