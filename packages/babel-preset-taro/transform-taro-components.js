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
  const componentImports = new Map()

  function hasTargetTaroComponent(target) {
    return componentImports.has(target) && componentImports.get(target).source === TARO_COMPONENTS
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
        exit(path) {
          if ([COMPONENT_LIST, COMPONENT_LIST_ITEM].some((component) => componentImports.has(component))) {
            const taroComponentsImportDeclIndex = path.node.body.findIndex((node) => {
              return (
                api.types.isImportDeclaration(node) &&
                api.types.isStringLiteral(node.source) &&
                node.source.value === TARO_COMPONENTS
              )
            })
            if (taroComponentsImportDeclIndex === -1) {
              return
            }
            const taroComponentsImportDecl = path.node.body[taroComponentsImportDeclIndex]
            path.node.body.splice(taroComponentsImportDeclIndex, 1)
            // 重新生成 @tarojs/components 导入声明并插入到路径的开头，排除掉 List、ListItem，添加 ScrollView、ListBuilder、View 到 @tarojs/components 导入声明中
            if (taroComponentsImportDecl) {
              const { specifiers } = taroComponentsImportDecl
              // 排除掉 List、ListItem
              const newSpecifiers = specifiers.filter((specifier) => {
                return !(
                  api.types.isImportSpecifier(specifier) &&
                  (specifier.imported?.name === COMPONENT_LIST || specifier.imported?.name === COMPONENT_LIST_ITEM)
                )
              })

              if (componentImports.has(COMPONENT_LIST)) {
                const scrollViewLocalName = componentImports.has(COMPONENT_SCROLL_VIEW)
                  ? componentImports.get(COMPONENT_SCROLL_VIEW).localName
                  : COMPONENT_SCROLL_VIEW

                const listBuilderLocalName = componentImports.has(COMPONENT_LIST_BUILDER)
                  ? componentImports.get(COMPONENT_LIST_BUILDER).localName
                  : COMPONENT_LIST_BUILDER

                if (!newSpecifiers.some((specifier) => specifier.imported?.name === scrollViewLocalName)) {
                  newSpecifiers.push(
                    api.types.importSpecifier(
                      api.types.identifier(scrollViewLocalName),
                      api.types.identifier(scrollViewLocalName)
                    )
                  )
                }

                if (!newSpecifiers.some((specifier) => specifier.imported?.name === listBuilderLocalName)) {
                  newSpecifiers.push(
                    api.types.importSpecifier(
                      api.types.identifier(listBuilderLocalName),
                      api.types.identifier(listBuilderLocalName)
                    )
                  )
                }
              }
              if (componentImports.has(COMPONENT_LIST_ITEM)) {
                const viewLocalName = componentImports.has(COMPONENT_VIEW)
                  ? componentImports.get(COMPONENT_VIEW).localName
                  : COMPONENT_VIEW

                if (!newSpecifiers.some((specifier) => specifier.imported?.name === viewLocalName)) {
                  newSpecifiers.push(
                    api.types.importSpecifier(api.types.identifier(viewLocalName), api.types.identifier(viewLocalName))
                  )
                }
              }

              path.node.body.unshift(
                api.types.importDeclaration(newSpecifiers, api.types.stringLiteral(TARO_COMPONENTS))
              )
            }
          }
        },
      },
      ImportDeclaration(path) {
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
              componentImports.set(imported.name, {
                source: packageName,
                importedName: imported.name,
                localName: local.name,
              })
            }
          })
        }
      },
      JSXElement(path) {
        const openingElement = path.node.openingElement
        if (openingElement.name && api.types.isJSXIdentifier(openingElement.name)) {
          const props = openingElement.attributes
          const children = path.node.children
          if (
            hasTargetTaroComponent(COMPONENT_LIST) &&
            openingElement.name.name === componentImports.get(COMPONENT_LIST).localName
          ) {
            // 创建 ScrollView 开始标签
            const scrollViewProps = pickAttrs(props, SCROLL_VIEW_PROPS)
            scrollViewProps.push(
              api.types.jsxAttribute(api.types.jsxIdentifier('type'), api.types.stringLiteral('custom'))
            )
            const scrollViewOpening = api.types.jsxOpeningElement(
              api.types.jsxIdentifier(COMPONENT_SCROLL_VIEW),
              scrollViewProps,
              false
            )
            // 创建 ScrollView 闭合标签
            const scrollViewClosing = api.types.jsxClosingElement(api.types.jsxIdentifier(COMPONENT_SCROLL_VIEW))
            // 创建 ListBuilder 开始标签
            const listBuilderOpening = api.types.jsxOpeningElement(
              api.types.jsxIdentifier(COMPONENT_LIST_BUILDER),
              pickAttrs(props, LIST_BUILDER_PROPS),
              false
            )
            // 创建 ListBuilder 闭合标签
            const listBuilderClosing = api.types.jsxClosingElement(api.types.jsxIdentifier(COMPONENT_LIST_BUILDER))

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
            hasTargetTaroComponent(COMPONENT_LIST_ITEM) &&
            openingElement.name.name === componentImports.get(COMPONENT_LIST_ITEM).localName
          ) {
            const viewOpening = api.types.jsxOpeningElement(api.types.jsxIdentifier(COMPONENT_VIEW), props, false)

            const viewClosing = api.types.jsxClosingElement(api.types.jsxIdentifier(COMPONENT_VIEW))

            const viewElement = api.types.jsxElement(viewOpening, viewClosing, path.node.children, false)

            path.replaceWith(viewElement)
          }
        }
      },
    },
  }
})
