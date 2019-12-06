import { BundleResult } from 'scss-bundle';
interface LoaderOption {
    data?: string;
    [key: string]: any;
}
interface BuildConfig {
    sass?: {
        resource?: string | string[];
        projectDirectory?: string;
        data?: string;
    };
    sassLoaderOption?: LoaderOption;
}
/**
 * Return bundled sass content.
 *
 * @param {string} url Absolute file path.
 * @param {(string | undefined)} projectDirectory Absolute project location, where node_modules are located. Used for resolving tilde imports.
 * @returns Bundle result.
 */
export declare function getBundleResult(url: string, projectDirectory?: string | undefined): Promise<BundleResult>;
export declare function getBundleContent(resource: string | string[], projectDirectory?: string | undefined): Promise<string | undefined>;
export declare function getSassLoaderOption({ sass, sassLoaderOption }: BuildConfig): Promise<LoaderOption>;
export default getSassLoaderOption;
