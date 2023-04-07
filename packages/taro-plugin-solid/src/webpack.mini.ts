import { fs } from "@tarojs/helper";
import type { IPluginContext } from "@tarojs/service";

import type { Frameworks } from "./index";
import { getLoaderMeta } from "./loader-meta";

export function modifyMiniWebpackChain(
  ctx: IPluginContext,
  framework: Frameworks,
  chain
) {
  setAlias(ctx, framework, chain);
  setLoader(framework, chain);
}

function setAlias(ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig;
  const alias = chain.resolve.alias;

  [fs, framework, config];
  alias.set("@tarojs/components$", "@/components");
}

function setLoader(framework: Frameworks, chain) {
  chain.plugin("miniPlugin").tap((args) => {
    args[0].loaderMeta = getLoaderMeta(framework);
    return args;
  });
}
