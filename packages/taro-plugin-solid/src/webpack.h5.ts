import type { IPluginContext } from "@tarojs/service";
import { mergeWith } from 'lodash'

import type { Frameworks } from "./index";
import { getLoaderMeta } from "./loader-meta";

export function modifyH5WebpackChain(
  ctx: IPluginContext,
  framework: Frameworks,
  chain
) {
  setLoader(framework, chain);
  setPlugin(ctx, framework, chain);

  chain.merge({
    module: {
      rule: {
        "process-import-taro": {
          test: /taro-h5[\\/]dist[\\/]index/,
          loader: require.resolve("./api-loader"),
        },
      },
    },
  });
}


function setLoader(framework: Frameworks, chain) {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  chain.plugin('mainPlugin')
    .tap(args => {
      args[0].loaderMeta = mergeWith(
        getLoaderMeta(framework), args[0].loaderMeta, customizer
      )
      return args
    })
}

function setPlugin(_ctx: IPluginContext, _framework: Frameworks, _chain) {
  // const config = ctx.initialConfig;

  // @TODO 没有找到这个地方应该怎么做
}
