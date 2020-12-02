import * as chalk from 'chalk';
export declare const PLATFORMS: {};
export declare const enum processTypeEnum {
  START = "start",
  CREATE = "create",
  COMPILE = "compile",
  CONVERT = "convert",
  COPY = "copy",
  GENERATE = "generate",
  MODIFY = "modify",
  ERROR = "error",
  WARNING = "warning",
  UNLINK = "unlink",
  REFERENCE = "reference",
  REMIND = "remind"
}
export interface IProcessTypeMap {
  [key: string]: {
    name: string;
    color: string | chalk.Chalk;
  };
}
export declare const processTypeMap: IProcessTypeMap;
export declare const CSS_EXT: string[];
export declare const SCSS_EXT: string[];
export declare const JS_EXT: string[];
export declare const TS_EXT: string[];
export declare const UX_EXT: string[];
export declare const SCRIPT_EXT: string[];
export declare const VUE_EXT: string[];
export declare const REG_JS: RegExp;
export declare const REG_SCRIPT: RegExp;
export declare const REG_TYPESCRIPT: RegExp;
export declare const REG_SCRIPTS: RegExp;
export declare const REG_VUE: RegExp;
export declare const REG_SASS: RegExp;
export declare const REG_SASS_SASS: RegExp;
export declare const REG_SASS_SCSS: RegExp;
export declare const REG_LESS: RegExp;
export declare const REG_STYLUS: RegExp;
export declare const REG_STYLE: RegExp;
export declare const REG_CSS: RegExp;
export declare const REG_MEDIA: RegExp;
export declare const REG_IMAGE: RegExp;
export declare const REG_FONT: RegExp;
export declare const REG_JSON: RegExp;
export declare const REG_UX: RegExp;
export declare const REG_TEMPLATE: RegExp;
export declare const REG_WXML_IMPORT: RegExp;
export declare const REG_URL: RegExp;
export declare const CSS_IMPORT_REG: RegExp;
export declare const NODE_MODULES = "node_modules";
export declare const NODE_MODULES_REG: RegExp;
export declare const PROJECT_CONFIG = "config/index";
export declare const DEVICE_RATIO: {
  640: number;
  750: number;
  828: number;
};
export declare const FILE_PROCESSOR_MAP: {
  '.js': string;
  '.scss': string;
  '.sass': string;
  '.less': string;
  '.styl': string;
};
export declare const UPDATE_PACKAGE_LIST: string[];
export declare const taroJsComponents = "@tarojs/components";
export declare const taroJsQuickAppComponents = "@tarojs/components-qa";
export declare const taroJsFramework = "@tarojs/taro";
export declare const taroJsRedux = "@tarojs/redux";
export declare const taroJsMobx = "@tarojs/mobx";
export declare const taroJsMobxCommon = "@tarojs/mobx-common";
export declare const DEVICE_RATIO_NAME = "deviceRatio";
export declare const isWindows: boolean;
export declare const DEFAULT_TEMPLATE_SRC = "github:NervJS/taro-project-templates#v3";
export declare const DEFAULT_TEMPLATE_SRC_GITEE = "direct:https://gitee.com/o2team/taro-project-templates.git#v3";
export declare const TARO_CONFIG_FLODER = ".taro3";
export declare const TARO_BASE_CONFIG = "index.json";
export declare const OUTPUT_DIR = "dist";
export declare const SOURCE_DIR = "src";
export declare const TEMP_DIR = ".temp";
export declare const NPM_DIR = "npm";
export declare const ENTRY = "app";
