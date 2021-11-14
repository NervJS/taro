import { RecursiveTemplate } from '@tarojs/shared/dist/template';
export declare class Template extends RecursiveTemplate {
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
    constructor();
}
