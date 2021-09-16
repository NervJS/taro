import BaseCI from './BaseCi';
/** 文档地址： https://opendocs.alipay.com/mini/miniu/api */
export default class AlipayCI extends BaseCI {
    protected _init(): void;
    open(): void;
    upload(): Promise<void>;
    preview(): Promise<void>;
}
