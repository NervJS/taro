import { hooks } from "@tarojs/shared";

// declare const __TARO_FRAMEWORK__: string;

hooks.tap("initNativeApi", function (_taro) {});

export * from "./connect";
export * from "./context";
export * from "./hooks";
