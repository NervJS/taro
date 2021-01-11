export interface TransformOptions {
  dev: boolean;
  hot: boolean;
  minify: boolean;
  platform: 'android' | 'ios';
  projectRoot: string;
  publicPath: string;
  customTransformOptions: any;
}

export enum LogLevelEnum {
  ERROR = 'error',
  WARNING = 'warning',
}

export interface ResolveStyleOptions {
  basedir: string,
  platform: 'android' | 'ios';
  paths?: string[],
  logLevel?: LogLevelEnum,
}
