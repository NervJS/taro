import {
  AppInstance,
  Current,
  document,
  getPageInstance,
  injectPageInstance,
  Instance,
  PageLifeCycle,
  PageProps,
  ReactAppInstance,
  TaroNode,
} from "@tarojs/runtime";
import { hooks } from "@tarojs/shared";
import type { AppConfig } from "@tarojs/taro";
import { batch, createSignal, For } from "solid-js";

import { createComponent, render, h } from "@tarojs/solid";
import { PageContext } from "./context";
import {
  ensureIsArray,
  HOOKS_APP_ID,
  setDefaultDescriptor,
  setRouterParams,
} from "./utils";

type Component = (props?: any) => TaroNode;
export function setReconciler() {
  hooks.tap("getLifecycle", function (instance, lifecycle: string) {
    lifecycle = lifecycle.replace(/^on(Show|Hide)$/, "componentDid$1");
    return instance[lifecycle];
  });

  hooks.tap("modifyMpEvent", function (event) {
    event.type = event.type.replace(/-/g, "");
  });

  hooks.tap("batchedEventUpdates", function (cb) {
    batch(cb);
  });

  hooks.tap("mergePageInstance", function (prev, next) {
    if (!prev || !next) return;

    // 子组件使用 lifecycle hooks 注册了生命周期后，会存在 prev，里面是注册的生命周期回调。

    // prev 使用 Object.create(null) 创建，H5 的 fast-refresh 可能也会导致存在 prev，要排除这些意外产生的 prev
    if ("constructor" in prev) return;

    Object.keys(prev).forEach((item) => {
      const prevList = prev[item];
      const nextList = ensureIsArray<() => any>(next[item]);
      next[item] = nextList.concat(prevList);
    });
  });

  if (process.env.TARO_ENV === "h5") {
  }
}

/**
 * 桥接小程序 App 构造器和 React 渲染流程
 * @param App 用户编写的入口组件
 * @param react 框架
 * @param dom 框架渲染器
 * @param config 入口组件配置 app.config.js 的内容
 * @returns 传递给 App 构造器的对象 obj ：App(obj)
 */
export function createSolidApp(App: Component, config: AppConfig) {
  setReconciler();
  const [pages, setPages] = createSignal<any[]>([]);

  let appRef: ReactAppInstance;
  function getAppInstance() {
    return appRef;
  }

  const AppWrapper = () => {
    appRef = {} as unknown as ReactAppInstance;
    return createComponent(App, {
      children: createComponent(For as unknown as Component, {
        get each() {
          return pages();
        },
        children: ({ id, component }) => {
          const children = () =>
            createComponent(PageContext.Provider as unknown as Component, {
              value: id,
              children: () => {
                injectPageInstance(
                  { id: id, type: "page" } as unknown as Instance<PageProps>,
                  id
                );
                return createComponent(component, {
                  tid: id,
                });
              },
            });

          if (process.env.TARO_ENV === "h5") {
            return h("div", { id, className: "taro_page" }, children);
          } else {
            return h("root", { id }, children);
          }
        },
      }),
    });
  };

  function renderReactRoot() {
    let appId = "app";
    if (process.env.TARO_ENV === "h5") {
      appId = config?.appId || appId;
    }
    const container = document.getElementById(appId);
    render(AppWrapper, container);
  }

  if (process.env.TARO_ENV !== "h5") {
    renderReactRoot();
  }

  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.call("getMiniLifecycleImpl")!.app;

  const appObj: AppInstance = Object.create(
    {
      mount(component: Component, id: string, cb: () => void) {
        setPages((old) => [
          ...old,
          {
            id,
            component,
          },
        ]);
        batch(cb);
      },

      unmount(id: string, cb: () => void) {
        setPages(
          pages().filter((item) => {
            return item.id !== id;
          })
        );
        batch(cb);
      },
    },
    {
      config: setDefaultDescriptor({
        configurable: true,
        value: config,
      }),

      [ONLAUNCH]: setDefaultDescriptor({
        value(options) {
          setRouterParams(options);

          if (process.env.TARO_ENV === "h5") {
            // 由于 H5 路由初始化的时候会清除 app 下的 dom 元素，所以需要在路由初始化后执行 render
            renderReactRoot();
          }

          const onLaunch = () => {};

          onLaunch();
          triggerAppHook("onLaunch", options);
        },
      }),

      [ONSHOW]: setDefaultDescriptor({
        value(options) {
          setRouterParams(options);
          triggerAppHook("onShow", options);
        },
      }),

      [ONHIDE]: setDefaultDescriptor({
        value() {
          triggerAppHook("onHide");
        },
      }),

      onError: setDefaultDescriptor({
        value(error: string) {
          triggerAppHook("onError", error);
        },
      }),

      onPageNotFound: setDefaultDescriptor({
        value(res: unknown) {
          triggerAppHook("onPageNotFound", res);
        },
      }),
    }
  );

  function triggerAppHook(
    lifecycle: keyof PageLifeCycle | keyof AppInstance,
    ...option
  ) {
    const instance = getPageInstance(HOOKS_APP_ID);
    if (instance) {
      const app = getAppInstance();
      const func = hooks.call("getLifecycle", instance, lifecycle);
      if (Array.isArray(func)) {
        func.forEach((cb) => cb.apply(app, option));
      }
    }
  }

  Current.app = appObj;
  return appObj;
}
