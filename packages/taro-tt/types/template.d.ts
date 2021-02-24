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
        type: string;
    };
}
