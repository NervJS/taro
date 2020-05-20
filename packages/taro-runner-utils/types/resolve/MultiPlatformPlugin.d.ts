interface IOptions {
    include?: string[];
}
/**
 * @description 此 enhance-resolve 插件用于根据当前编译的平台，解析多端文件的后缀
 *
 * @property {string} source resolver hook 类别
 * @property {string} target 解析完成后需要触发的钩子
 * @property {IOptions} options 插件配置项
 *
 * @example
 *   there's filepath 'src/index'
 *   when platform is weapp, we get 'src/index.weapp.[js|ts|jsx|tsx]'
 *   when platform is h5, we get 'src/index.h5.[js|ts|jsx|tsx]'
 *   by default, we get 'src/index.[js|ts|jsx|tsx]'
 *
 * @class MultiPlatformPlugin
 */
export declare class MultiPlatformPlugin {
    private source;
    private target;
    private options;
    constructor(source: string, target: string, options?: IOptions);
    apply(resolver: any): void;
    private includes;
}
export {};
