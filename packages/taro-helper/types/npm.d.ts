declare type pluginFunction = (pluginName: string, content: string | null, file: string, config: object, root: string) => any;
export interface IInstallOptions {
    dev: boolean;
    peerDependencies?: boolean;
}
export declare const taroPluginPrefix = "@tarojs/plugin-";
export declare function resolveNpm(pluginName: string, root: any): Promise<string>;
export declare function resolveNpmSync(pluginName: string, root: any): string;
export declare function installNpmPkg(pkgList: string[] | string, options: IInstallOptions): any;
export declare const callPlugin: pluginFunction;
export declare const callPluginSync: pluginFunction;
export declare function getNpmPkgSync(npmName: string, root: string): any;
export declare function getNpmPkg(npmName: string, root: string): Promise<any>;
export {};
