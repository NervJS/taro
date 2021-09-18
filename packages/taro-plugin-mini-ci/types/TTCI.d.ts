import BaseCI from './BaseCi';
export default class TTCI extends BaseCI {
    _init(): Promise<void>;
    _beforeCheck(): Promise<any>;
    open(): void;
    preview(): Promise<void>;
    upload(): Promise<void>;
}
