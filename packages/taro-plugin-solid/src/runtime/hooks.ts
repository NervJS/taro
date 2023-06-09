import {
  AppInstance,
  Current,
  Func,
  getPageInstance,
  injectPageInstance,
  PageLifeCycle,
} from "@tarojs/runtime";
import { isArray, isFunction } from "@tarojs/shared";
import {
  createMemo,
  createRenderEffect,
  onCleanup,
  useContext,
} from "solid-js";
import { PageContext } from "./context";
import { HOOKS_APP_ID } from "./utils";

const createTaroHook = (lifecycle: keyof PageLifeCycle | keyof AppInstance) => {
  return (fn: Func) => {
    const context = useContext(PageContext);
    const id = context || HOOKS_APP_ID;

    createRenderEffect(() => {
      let inst = getPageInstance(id);
      let first = false;
      if (!inst) {
        first = true;
        inst = Object.create({
          id: id,
          type: "page",
        });
      }

      if (isFunction(inst![lifecycle])) {
        inst![lifecycle] = [inst?.[lifecycle], fn];
      } else {
        inst![lifecycle] = [...(inst![lifecycle] || []), fn];
      }

      if (first) {
        injectPageInstance(inst!, id);
      }

      onCleanup(() => {
        const list = inst![lifecycle];
        if (list === fn) {
          inst![lifecycle] = undefined;
        } else if (isArray(list)) {
          inst![lifecycle] = list.filter((item) => item !== fn);
        }
      });
    });
  };
};

/** LifeCycle */
export const useDidHide = createTaroHook("componentDidHide");
export const useDidShow = createTaroHook("componentDidShow");

/** App */
export const useError = createTaroHook("onError");
export const useLaunch = createTaroHook("onLaunch");
export const usePageNotFound = createTaroHook("onPageNotFound");

/** Page */
export const useLoad = createTaroHook("onLoad");
export const usePageScroll = createTaroHook("onPageScroll");
export const usePullDownRefresh = createTaroHook("onPullDownRefresh");
export const usePullIntercept = createTaroHook("onPullIntercept");
export const useReachBottom = createTaroHook("onReachBottom");
export const useResize = createTaroHook("onResize");
export const useUnload = createTaroHook("onUnload");

/** Mini-Program */
export const useAddToFavorites = createTaroHook("onAddToFavorites");
export const useOptionMenuClick = createTaroHook("onOptionMenuClick");
export const useSaveExitState = createTaroHook("onSaveExitState");
export const useShareAppMessage = createTaroHook("onShareAppMessage");
export const useShareTimeline = createTaroHook("onShareTimeline");
export const useTitleClick = createTaroHook("onTitleClick");

/** Router */
export const useReady = createTaroHook("onReady");
export const useRouter = (dynamic = false) => {
  return dynamic ? Current.router : createMemo(() => Current.router);
};
export const useTabItemTap = createTaroHook("onTabItemTap");

export const useScope = () => undefined;
