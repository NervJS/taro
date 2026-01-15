const { declare } = require('@babel/helper-plugin-utils')

const COMPONENT_LIST = 'List'
const COMPONENT_LIST_ITEM = 'ListItem'
const COMPONENT_LIST_BUILDER = 'ListBuilder'
const COMPONENT_SCROLL_VIEW = 'ScrollView'
const COMPONENT_VIEW = 'View'
const TARO_COMPONENTS = '@tarojs/components'

const SCROLL_VIEW_PROPS = [
  'scrollX',
  'scrollY',
  'scrollTop',
  'upperThresholdCount',
  'lowerThresholdCount',
  'scrollIntoView',
  'enableBackToTop',
  'showScrollbar',
  'onScroll',
  'onScrollStart',
  'onScrollEnd',
  'onScrollToUpper',
  'onScrollToLower',
  'compileMode',
  'className',
  'cacheExtent',
  'style',
  'id',
  'key',
]

const LIST_BUILDER_PROPS = ['padding', 'type', 'list', 'childCount', 'childHeight', 'onItemBuild', 'onItemDispose']

module.exports = declare((api) => {
  api.assertVersion(7)
  function hasTargetTaroComponent(state, target) {
    return state.taroComponentImports.has(target)
  }

  function getComponentLocalName(state, name, scope) {
    if (state.taroComponentImports.has(name)) {
      return state.taroComponentImports.get(name).localName
    }
    if (state.generatedImports.has(name)) {
      return state.generatedImports.get(name).localName
    }
    const programScope = scope.getProgramParent()
    // 始终生成唯一 ID，避免与用户代码或外部包导入的组件本地名冲突
    const newId = programScope.generateUidIdentifier(name)
    const record = { localName: newId.name, source: TARO_COMPONENTS }
    state.generatedImports.set(name, record)
    return record.localName
  }

  function pickAttrs(attrs, props) {
    const propSet = new Set(props)
    return attrs.filter((attr) => {
      const prop = attr.name.name
      return propSet.has(prop)
    })
  }

  return {
    name: 'plugin:transform-taro-components',
    visitor: {
      Program: {
        enter(_path, state) {
          // 每个文件单独维护状态，避免跨文件污染
          state.taroComponentImports = new Map()
          state.generatedImports = new Map()
        },
        exit(path, state) {
          const taroComponentImports = state.taroComponentImports
          if ([COMPONENT_LIST, COMPONENT_LIST_ITEM].some((component) => taroComponentImports.has(component))) {
            const collectedSpecifiers = []
            const remainingBody = []

            path.node.body.forEach((node) => {
              if (api.types.isImportDeclaration(node) && api.types.isStringLiteral(node.source)) {
                if (node.source.value === TARO_COMPONENTS) {
                  collectedSpecifiers.push(...node.specifiers.filter((specifier) => api.types.isImportSpecifier(specifier)))
                  return
                }
              }
              remainingBody.push(node)
            })

            // 重新生成 @tarojs/components 导入声明并插入到路径的开头，排除掉 List、ListItem，添加 ScrollView、ListBuilder、View 到 @tarojs/components 导入声明中
            const baseSpecifiers = collectedSpecifiers.filter((specifier) => {
              return !(
                api.types.isImportSpecifier(specifier) &&
                (specifier.imported?.name === COMPONENT_LIST || specifier.imported?.name === COMPONENT_LIST_ITEM)
              )
            })

            const specifierMap = new Map()
            baseSpecifiers.forEach((specifier) => {
              specifierMap.set(specifier.local.name, specifier)
            })

            // 保证重建的 @tarojs/components 导入不重复本地名，且补齐转换所需组件
            const ensureSpecifier = (localName, importedName) => {
              if (!specifierMap.has(localName)) {
                specifierMap.set(
                  localName,
                  api.types.importSpecifier(api.types.identifier(localName), api.types.identifier(importedName))
                )
              }
            }

            if (taroComponentImports.has(COMPONENT_LIST)) {
              const scrollViewLocalName = getComponentLocalName(state, COMPONENT_SCROLL_VIEW, path.scope)
              const listBuilderLocalName = getComponentLocalName(state, COMPONENT_LIST_BUILDER, path.scope)

              ensureSpecifier(scrollViewLocalName, COMPONENT_SCROLL_VIEW)
              ensureSpecifier(listBuilderLocalName, COMPONENT_LIST_BUILDER)
            }

            if (taroComponentImports.has(COMPONENT_LIST_ITEM)) {
              const viewLocalName = getComponentLocalName(state, COMPONENT_VIEW, path.scope)

              ensureSpecifier(viewLocalName, COMPONENT_VIEW)
            }

            const nextSpecifiers = Array.from(specifierMap.values())
            if (nextSpecifiers.length > 0) {
              remainingBody.unshift(
                api.types.importDeclaration(nextSpecifiers, api.types.stringLiteral(TARO_COMPONENTS))
              )
            }

            path.node.body = remainingBody
          }
        },
      },
      ImportDeclaration(path, state) {
        const { node } = path
        const { source, specifiers } = node
        if (api.types.isStringLiteral(source)) {
          const packageName = source.value

          specifiers.forEach((specifier) => {
            if (api.types.isImportSpecifier(specifier)) {
              // 导出名，import { List as TaroList} from '@tarojs/components', local.name = List
              const imported = specifier.imported || specifier.local
              // 别名，import { List as TaroList} from '@tarojs/components', local.name = TaroList
              const local = specifier.local

              // 收集组件导入信息
              if (packageName === TARO_COMPONENTS && !state.taroComponentImports.has(imported.name)) {
                state.taroComponentImports.set(imported.name, {
                  source: packageName,
                  importedName: imported.name,
                  localName: local.name,
                })
              }
            }
          })
        }
      },
      JSXElement(path, state) {
        const openingElement = path.node.openingElement
        if (openingElement.name && api.types.isJSXIdentifier(openingElement.name)) {
          const props = openingElement.attributes
          const children = path.node.children
          if (
            hasTargetTaroComponent(state, COMPONENT_LIST) &&
            openingElement.name.name === state.taroComponentImports.get(COMPONENT_LIST).localName
          ) {
            const scrollViewName = getComponentLocalName(state, COMPONENT_SCROLL_VIEW, path.scope)
            const listBuilderName = getComponentLocalName(state, COMPONENT_LIST_BUILDER, path.scope)

            // 创建 ScrollView 开始标签
            const scrollViewProps = pickAttrs(props, SCROLL_VIEW_PROPS)
            scrollViewProps.push(
              api.types.jsxAttribute(api.types.jsxIdentifier('type'), api.types.stringLiteral('custom'))
            )
            const scrollViewOpening = api.types.jsxOpeningElement(
              api.types.jsxIdentifier(scrollViewName),
              scrollViewProps,
              false
            )
            // 创建 ScrollView 闭合标签
            const scrollViewClosing = api.types.jsxClosingElement(api.types.jsxIdentifier(scrollViewName))
            // 创建 ListBuilder 开始标签
            const listBuilderOpening = api.types.jsxOpeningElement(
              api.types.jsxIdentifier(listBuilderName),
              pickAttrs(props, LIST_BUILDER_PROPS),
              false
            )
            // 创建 ListBuilder 闭合标签
            const listBuilderClosing = api.types.jsxClosingElement(api.types.jsxIdentifier(listBuilderName))

            // 创建 ListBuilder 元素，包含原 List 的子元素
            const listBuilderElement = api.types.jsxElement(listBuilderOpening, listBuilderClosing, children, false)

            // 创建最终的 ScrollView 元素，包含 ListBuilder 元素
            const scrollViewElement = api.types.jsxElement(
              scrollViewOpening,
              scrollViewClosing,
              [listBuilderElement],
              false
            )

            path.replaceWith(scrollViewElement)
          }

          if (
            hasTargetTaroComponent(state, COMPONENT_LIST_ITEM) &&
            openingElement.name.name === state.taroComponentImports.get(COMPONENT_LIST_ITEM).localName
          ) {
            const viewName = getComponentLocalName(state, COMPONENT_VIEW, path.scope)
            const viewOpening = api.types.jsxOpeningElement(api.types.jsxIdentifier(viewName), props, false)

            const viewClosing = api.types.jsxClosingElement(api.types.jsxIdentifier(viewName))

            const viewElement = api.types.jsxElement(viewOpening, viewClosing, path.node.children, false)

            path.replaceWith(viewElement)
          }
        }
      },
    },
  }
})
