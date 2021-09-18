import BaseCI from './BaseCi';
export default class WeappCI extends BaseCI {
    private instance;
    /** 微信开发者安装路径 */
    private devToolsInstallPath;
    _init(): void;
    open(): Promise<void>;
    preview(): Promise<void>;
    upload(): Promise<void>;
}
