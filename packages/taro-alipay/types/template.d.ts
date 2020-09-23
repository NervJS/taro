import { RecursiveTemplate } from '@tarojs/shared';
export declare class Template extends RecursiveTemplate {
    exportExpr: string;
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
    replacePropName(name: any, value: any): any;
    getEvents(): {
        onTap: string;
        onTouchMove: string;
        onTouchEnd: string;
        onTouchCancel: string;
        onLongTap: string;
    };
    buildThirdPartyAttr(attrs: Set<string>): string;
    modifyLoopBody: (child: string, nodeName: string) => string;
    modifyLoopContainer: (children: string, nodeName: string) => string;
    modifyTemplateResult: (res: string, nodeName: string) => string;
}
