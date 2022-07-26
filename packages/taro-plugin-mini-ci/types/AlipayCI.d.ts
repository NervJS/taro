import BaseCI from './BaseCi';
/** 文档地址： https://opendocs.alipay.com/mini/miniu/api */
export default class AlipayCI extends BaseCI {
    miniu: any;
    /** 小程序开发者工具安装路径 */
    private devToolsInstallPath;
    protected _init(): void;
    open(): void;
    upload(): Promise<void>;
    preview(): Promise<void>;
}
