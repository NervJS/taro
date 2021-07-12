import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template';
import type { IPluginContext } from '../types/index';
interface IFileType {
    templ: string;
    style: string;
    config: string;
    script: string;
    xs?: string;
}
interface IWrapper {
    init?(): void;
    close?(): void;
}
declare class Transaction {
    wrappers: IWrapper[];
    perform(fn: Function, scope: TaroPlatformBase, ...args: any[]): Promise<void>;
    initAll(scope: any): void;
    closeAll(scope: any): void;
    addWrapper(wrapper: IWrapper): void;
}
export declare abstract class TaroPlatformBase {
    ctx: IPluginContext;
    helper: IPluginContext['helper'];
    config: any;
    abstract platform: string;
    abstract globalObject: string;
    abstract runtimePath: string | string[];
    abstract fileType: IFileType;
    abstract template: RecursiveTemplate | UnRecursiveTemplate;
    projectConfigJson?: string;
    taroComponentsPath?: string;
    setupTransaction: Transaction;
    buildTransaction: Transaction;
    constructor(ctx: IPluginContext, config: any);
    /**
     * 1. 清空 dist 文件夹
     * 2. 输出编译提示
     * 3. 生成 project.config.json
     */
    private setup;
    private setupImpl;
    protected emptyOutputDir(): void;
    protected printDevelopmentTip(platform: string): void;
    /**
     * 返回当前项目内的 @tarojs/mini-runner 包
     */
    protected getRunner(): Promise<any>;
    /**
     * 准备 mini-runner 参数
     * @param extraOptions 需要额外合入 Options 的配置项
     */
    protected getOptions(extraOptions?: {}): any;
    /**
     * 调用 mini-runner 开始编译
     * @param extraOptions 需要额外传入 @tarojs/mini-runner 的配置项
     */
    private build;
    private buildImpl;
    /**
     * 生成 project.config.json
     * @param src 项目源码中配置文件的名称
     * @param dist 编译后配置文件的名称，默认为 'project.config.json'
     */
    protected generateProjectConfig(src: string, dist?: string): void;
    /**
     * 递归替换对象的 key 值
     */
    protected recursiveReplaceObjectKeys(obj: any, keyMap: any): void;
    /**
     * 调用 mini-runner 开启编译
     */
    start(): Promise<void>;
}
export {};
