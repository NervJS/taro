import { ComponentConfig, RecursiveTemplate } from '@tarojs/shared';
export declare class Template extends RecursiveTemplate {
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
    protected replacePropName(name: any, value: any): any;
    protected getEvents(): {
        onclick: string;
        ontouchstart: string;
        ontouchmove: string;
        ontouchend: string;
        ontouchcancel: string;
        onlongpress: string;
    };
    buildTemplate: (componentConfig: ComponentConfig) => any;
    buildPageTemplate: (baseTempPath: string) => any;
    buildCustomComponentTemplate: (_: string) => string;
}
