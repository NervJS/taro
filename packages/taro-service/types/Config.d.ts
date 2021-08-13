import { IProjectConfig } from '@tarojs/taro/types/compile';
interface IConfigOptions {
    appPath: string;
}
export default class Config {
    appPath: string;
    configPath: string;
    initialConfig: IProjectConfig;
    isInitSuccess: boolean;
    constructor(opts: IConfigOptions);
    init(): void;
    getConfigWithNamed(platform: any, useConfigName: any): any;
}
export {};
