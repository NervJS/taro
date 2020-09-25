import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared'
import type { IPluginContext } from '../types/index';
interface IFileType {
    templ: string;
    style: string;
    config: string;
    script: string;
    xs?: string;
}
export declare class TaroPlatformBase {
    ctx: IPluginContext;
    helper: IPluginContext['helper'];
    config: any;
    platform: string;
    globalObject: string;
    fileType: IFileType;
    template: RecursiveTemplate | UnRecursiveTemplate;
    constructor(ctx: IPluginContext, config: any);
    /**
     * 1. 清空 dist 文件夹
     * 2. 输出提示
     */
    setup(): void;
    emptyOutputDir(): void;
    printDevelopmentTip(platform: string): void;
    /**
     * 返回当前项目内的 @tarojs/mini-runner 包
     */
    getRunner(): Promise<any>;
    /**
     * 准备 mini-runner 参数
     * @param extraOptions 需要额外合入 Options 的配置项
     */
    getOptions(extraOptions?: {}): any;
    /**
     * 生成 project.config.json
     * @param src 项目源码中配置文件的名称
     * @param dist 编译后配置文件的名称，默认为 'project.config.json'
     */
    generateProjectConfig(src: string, dist?: string): void;
    /**
     * 递归替换对象的 key 值
     */
    recursiveReplaceObjectKeys(obj: any, keyMap: any): void;
}
export {};
