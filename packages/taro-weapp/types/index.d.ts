import { TaroPlatformBase, IPluginContext } from "@tarojs/service";
import { UnRecursiveTemplate } from "@tarojs/shared/dist/template";
declare class Template extends UnRecursiveTemplate {
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
declare class Weapp extends TaroPlatformBase {
    template: Template;
    platform: string;
    globalObject: string;
    projectConfigJson: string;
    runtimePath: string;
    taroComponentsPath: string;
    fileType: {
        templ: string;
        style: string;
        config: string;
        script: string;
        xs: string;
    };
    /**
     * 1. setupTransaction - init
     * 2. setup
     * 3. setupTransaction - close
     * 4. buildTransaction - init
     * 5. build
     * 6. buildTransaction - close
     */
    constructor(ctx: any, config: any, pluginOptions?: IOptions);
    /**
     * 增加组件或修改组件属性
     */
    modifyTemplate(pluginOptions?: IOptions): void;
    /**
     * 修改 Webpack 配置
     */
    modifyWebpackConfig(): void;
}
interface IOptions {
    enablekeyboardAccessory?: boolean;
}
declare const _default: (ctx: IPluginContext, options: IOptions) => void;
export { _default as default, Weapp, IOptions };
