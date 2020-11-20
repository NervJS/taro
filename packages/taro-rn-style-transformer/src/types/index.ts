declare interface TransformOptions {
  dev: boolean;
  hot: boolean;
  minify: boolean;
  platform: 'android' | 'ios';
  projectRoot: string;
  publicPath: string;
  customTransformOptions: any;
}
