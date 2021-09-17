import BaseCI from './BaseCi';
export default class SwanCI extends BaseCI {
    private swanBin;
    protected _init(): void;
    open(): void;
    upload(): Promise<void>;
    preview(): Promise<void>;
}
