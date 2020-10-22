import { IPluginContext } from '@tarojs/service'
import { RecursiveTemplate, capitalize, toCamelCase } from '@tarojs/shared'
import { recursiveReplaceObjectKeys, printDevelopmentTip } from '../../util'

export class Template extends RecursiveTemplate {
  exportExpr = 'export default'
  supportXS = true
  Adapter = {
    if: 'a:if',
    else: 'a:else',
    elseif: 'a:elif',
    for: 'a:for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'a:key',
    xs: 'sjs',
    type: 'alipay'
  }

  buildXsTemplate () {
    return '<import-sjs name="xs" from="./utils.sjs" />'
  }

  replacePropName (name, value, compName) {
    if (value === 'eh') return name.replace('bind', 'on')
    if (compName === 'map' && value === 'i.polygons') {
      name = 'polygon'
    }
    return name
  }

  getEvents () {
    return {
      onTap: 'eh',
      onTouchMove: 'eh',
      onTouchEnd: 'eh',
      onTouchCancel: 'eh',
      onLongTap: 'eh'
    }
  }

  buildThirdPartyAttr (attrs: Set<string>) {
    return [...attrs].reduce((str, attr) => {
      if (attr.startsWith('@')) {
        return str + `on${capitalize(attr.slice(1))}="eh" `
      } else if (attr.startsWith('bind')) {
        return str + `${attr}="eh" `
      } else if (attr.startsWith('on')) {
        return str + `${attr}="eh" `
      }

      return str + `${attr}="{{ i.${toCamelCase(attr)} }}" `
    }, '')
  }

  modifyCompProps = (compName: string, target: Record<string, string>) => {
    if (compName === 'canvas') {
      return {
        ...target,
        width: '',
        height: ''
      }
    }
    return target
  }

  modifyLoopBody = (child: string, nodeName: string) => {
    if (nodeName === 'picker-view') {
      return `<picker-view-column>
        <view a:for="{{item.cn}}" a:key="id">
          ${child}
        </view>
      </picker-view-column>`
    }
    if (nodeName === 'swiper') {
      return `<swiper-item>
        <block a:for="{{item.cn}}" a:key="id">
          ${child}
        </block>
      </swiper-item>`
    }
    return child
  }

  modifyLoopContainer = (children: string, nodeName: string) => {
    if (nodeName === 'picker') {
      return `
  <view>${children}</view>
  `
    }
    return children
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column' || nodeName === 'swiper-item') return ''
    return res
  }
}

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'alipay',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath, outputPath } = ctx.paths
      const { npm, emptyDirectory } = ctx.helper
      emptyDirectory(outputPath)

      printDevelopmentTip('alipay')

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'my',
        fileType: {
          templ: '.axml',
          style: '.acss',
          config: '.json',
          script: '.js',
          xs: '.sjs'
        },
        isUseComponentBuildPage: false,
        template: new Template()
      }

      ctx.modifyMiniConfigs(({ configMap }) => {
        const replaceKeyMap = {
          navigationBarTitleText: 'defaultTitle',
          navigationBarBackgroundColor: 'titleBarColor',
          enablePullDownRefresh: 'pullRefresh',
          list: 'items',
          text: 'name',
          iconPath: 'icon',
          selectedIconPath: 'activeIcon',
          color: 'textColor'
        }
        Object.keys(configMap).forEach(key => {
          const item = configMap[key]
          if (item.content) {
            recursiveReplaceObjectKeys(item.content, replaceKeyMap)
          }
        })
      })

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)
    }
  })
}
