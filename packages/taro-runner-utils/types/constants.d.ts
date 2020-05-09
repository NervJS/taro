import * as chalk from 'chalk';
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
export declare const enum BUILD_TYPES {
    WEAPP = "weapp",
    SWAN = "swan",
    ALIPAY = "alipay",
    TT = "tt",
    UI = "ui",
    PLUGIN = "plugin",
    QUICKAPP = "quickapp",
    QQ = "qq",
    JD = "jd"
}
export declare const enum TEMPLATE_TYPES {
    WEAPP = ".wxml",
    SWAN = ".swan",
    ALIPAY = ".axml",
    TT = ".ttml",
    QUICKAPP = ".ux",
    QQ = ".wxml",
    JD = ".jxml"
}
export declare const enum STYLE_TYPES {
    WEAPP = ".wxss",
    SWAN = ".css",
    ALIPAY = ".acss",
    TT = ".ttss",
    QUICKAPP = ".css",
    QQ = ".qss",
    JD = ".jxss"
}
export declare const enum SCRIPT_TYPES {
    WEAPP = ".js",
    SWAN = ".js",
    ALIPAY = ".js",
    TT = ".js",
    QUICKAPP = ".js",
    QQ = ".js",
    JD = ".js"
}
export declare const enum XS_TYPES {
    WEAPP = ".wxs",
    SWAN = ".sjs",
    ALIPAY = ".sjs",
    TT = ".sjs",
    QUICKAPP = ".js",
    QQ = ".wxs",
    JD = ".js"
}
export declare const enum CONFIG_TYPES {
    WEAPP = ".json",
    SWAN = ".json",
    ALIPAY = ".json",
    TT = ".json",
    QUICKAPP = ".json",
    QQ = ".json",
    JD = ".json"
}
export declare type IMINI_APP_FILE_TYPE = {
    TEMPL: TEMPLATE_TYPES;
    STYLE: STYLE_TYPES;
    SCRIPT: SCRIPT_TYPES;
    CONFIG: CONFIG_TYPES;
    XS?: XS_TYPES;
};
export declare type IMINI_APP_FILES = {
    [key: string]: IMINI_APP_FILE_TYPE;
};
export declare const MINI_APP_FILES: IMINI_APP_FILES;
export declare const CONFIG_MAP: {
    weapp: {
        navigationBarTitleText: string;
        navigationBarBackgroundColor: string;
        enablePullDownRefresh: string;
        list: string;
        text: string;
        iconPath: string;
        selectedIconPath: string;
        color: string;
    };
    swan: {
        navigationBarTitleText: string;
        navigationBarBackgroundColor: string;
        enablePullDownRefresh: string;
        list: string;
        text: string;
        iconPath: string;
        selectedIconPath: string;
        color: string;
    };
    tt: {
        navigationBarTitleText: string;
        navigationBarBackgroundColor: string;
        enablePullDownRefresh: string;
        list: string;
        text: string;
        iconPath: string;
        selectedIconPath: string;
        color: string;
    };
    alipay: {
        navigationBarTitleText: string;
        navigationBarBackgroundColor: string;
        enablePullDownRefresh: string;
        list: string;
        text: string;
        iconPath: string;
        selectedIconPath: string;
        color: string;
    };
    quickapp: {
        navigationBarTitleText: string;
        navigationBarBackgroundColor: string;
        navigationBarTextStyle: string;
        pageOrientation: string;
        list: string;
        text: string;
        iconPath: string;
        selectedIconPath: string;
        backgroundTextStyle: boolean;
        onReachBottomDistance: boolean;
        backgroundColorBottom: boolean;
        backgroundColorTop: boolean;
        navigationStyle: string;
    };
    qq: {
        navigationBarTitleText: string;
        navigationBarBackgroundColor: string;
        enablePullDownRefresh: string;
        list: string;
        text: string;
        iconPath: string;
        selectedIconPath: string;
        color: string;
    };
    jd: {
        navigationBarTitleText: string;
        navigationBarBackgroundColor: string;
        enablePullDownRefresh: string;
        list: string;
        text: string;
        iconPath: string;
        selectedIconPath: string;
        color: string;
    };
};
export declare const taroJsComponents = "@tarojs/components";
export declare const taroJsQuickAppComponents = "@tarojs/components-qa";
export declare const taroJsFramework = "@tarojs/taro";
export declare const taroJsRedux = "@tarojs/redux";
export declare const DEVICE_RATIO_NAME = "deviceRatio";
export declare const isWindows: boolean;
export declare const QUICKAPP_SPECIAL_COMPONENTS: Set<string>;
export declare enum META_TYPE {
    ENTRY = "ENTRY",
    PAGE = "PAGE",
    COMPONENT = "COMPONENT",
    NORMAL = "NORMAL",
    STATIC = "STATIC",
    CONFIG = "CONFIG"
}
export declare enum PARSE_AST_TYPE {
    ENTRY = "ENTRY",
    PAGE = "PAGE",
    COMPONENT = "COMPONENT",
    NORMAL = "NORMAL",
    STATIC = "STATIC",
    EXPORTS = "EXPORTS"
}
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
    REFERENCE = "reference"
}
export interface IProcessTypeMap {
    [key: string]: {
        name: string;
        color: string | chalk.Chalk;
    };
}
export declare const processTypeMap: IProcessTypeMap;
export declare enum FRAMEWORK_MAP {
    VUE = "vue",
    REACT = "react",
    NERV = "nerv"
}
