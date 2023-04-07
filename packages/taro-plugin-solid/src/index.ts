import { fs } from "@tarojs/helper";
import type { IPluginContext } from "@tarojs/service";
import { isString } from "@tarojs/shared";

import { modifyH5WebpackChain } from "./webpack.h5";
import { modifyMiniWebpackChain } from "./webpack.mini";

import type { Plugin } from 'esbuild';

export type Frameworks = "solid";

export default (ctx: IPluginContext) => {
  const { framework } = ctx.initialConfig;

  if (framework !== "solid") return;

  ctx.modifyWebpackChain(({ chain }) => {
    // 通用
    chain.plugin("definePlugin").tap((args) => {
      const config = args[0];
      config.__TARO_FRAMEWORK__ = `"${framework}"`;
      return args;
    });

    if (process.env.TARO_ENV === "h5") {
      // H5
      modifyH5WebpackChain(ctx, framework, chain);
    } else {
      // 小程序
      modifyMiniWebpackChain(ctx, framework, chain);
    }
  });

  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return;

    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler,
      };
    }

    const { compiler } = opts;
    if (compiler.type === "webpack5") {
      // 提供给 webpack5 依赖预编译收集器的第三方依赖
      const deps = ["@tarojs/plugin-framework-react/dist/runtime"];
      compiler.prebundle ||= {};
      const prebundleOptions = compiler.prebundle;
      prebundleOptions.include ||= [];
      prebundleOptions.include = prebundleOptions.include.concat(deps);

      const taroSolidPlugin: Plugin = {
        name: "taroSolidPlugin",
        setup(build) {
          build.onLoad({ filter: /taro-h5[\\/]dist[\\/]index/ }, ({ path }) => {
            const content = fs.readFileSync(path).toString();
            return {
              contents: require("./api-loader")(content),
            };
          });
        },
      };

      prebundleOptions.esbuild ||= {};
      const esbuildConfig = prebundleOptions.esbuild;
      esbuildConfig.plugins ||= [];
      esbuildConfig.plugins.push(taroSolidPlugin)
    }
  });
};
