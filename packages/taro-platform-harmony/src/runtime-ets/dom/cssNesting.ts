import { parseClasses } from '../utils'

import type { CSSProperties, ReactElement } from 'react'
// 抽出来的嵌套查询
// const __nesting_style__ = [
//   {
//     selectors: ['container', '>', 'hello', ' ', 'txt'],
//     declaration: {
//         _color: "#00F00F",
//       _fontSize: convertNumber2VP(40),
//     }
//   },
// ]
//
// function Index() {
//   return __combine_nesting_style__(jsx(TaroViewTagName, {
//     className: "container aaa",
//     style: calcDynamicStyle(__inner_style__(), "container", null),
//     children: [
//       jsx(TaroTextTagName, {
//         className: "txt cc",
//         style: calcDynamicStyle(__inner_style__(), "txt", null),
//         children: "Hello!"
//       }),
//       jsx(TaroViewTagName, {
//         className: "hello",
//         style: calcDynamicStyle(__inner_style__(), "hello", null),
//         children: [
//           jsx(TaroTextTagName, {
//             className: "txt",
//             style: calcDynamicStyle(__inner_style__(), "txt", null),
//             children: "wo2rld!"
//           }),
//           jsx(TaroTextTagName, {
//             className: "txt2",
//             style: calcDynamicStyle(__inner_style__(), "txt2", null),
//             children: "Hello wo2rld!"
//           })
//         ]
//       })
//     ]
//   }), __nesting_style__);
// }

type TMappingNode = {
  node: ReactElement
  children: TMapping
  descendants: TMapping
}

type TMapping = Record<string, TMappingNode>

type TSelectorNode = {
  mapping: TMapping
  node: ReactElement
}

export type NestingStyle = {
  node: ReactElement
  selectors: string[]
  declaration: Record<string, any>
}[]

// 构建映射表
function depthTraversal(root: ReactElement) {
  const class_mapping: TMapping = {}
  // 记录别名，防止冲突
  const selector_alias: Record<string, string[]> = {}
  // 统计重名次数：{ txt: 1, cc: 2 }
  const selector_alias_count: Record<string, number> = {}

  const traverse = (tree) => {
    const result: Record<string, TMapping> = {}
    if (tree && tree.props) {
      // 兜底适配：如果Taro组件被原封不动的再别的地方导出使用，导致无法在编译环境添加__hmStyle
      // import { View } from '../../../~/components'
      // hack：如果是taro节点，但是被赋予了__styleSheet，则走一下__styleSheet转__hmStyle
      if (tree.props.__styleSheet && typeof tree.type !== 'function') {
        tree.props.__hmStyle = Object.assign({}, tree.props.__hmStyle, tree.props.__styleSheet.value)
      }

      // 后代选择器
      const descendant_map = {
        node: tree,
        children: {},
        descendants: {}
      }

      if (tree.props.children) {
        // 遍历叶子节点
        if (tree.props.children instanceof Array) {
          for (let i = 0; i < tree.props.children.length; i++) {
            // 收集叶子节点所拥有的类名
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            processLeaf(tree.props.children[i], descendant_map)
          }
        } else if (typeof tree.props.children !== 'string') {
          // 收集叶子节点所拥有的类名
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          processLeaf(tree.props.children, descendant_map)
        }
      }
      // 拆分classnames
      const classnames = parseClasses(tree.props.className || '')
      for (let i = 0; i < classnames.length; i++) {
        const cls = classnames[i]
        let name = cls
        if (selector_alias_count[name]) {
          // 存在重名，需要使用别名替代
          const oldName = name
          name = `___${name}${selector_alias_count[oldName]}`
          selector_alias_count[oldName] = selector_alias_count[oldName] + 1
          selector_alias[oldName] ? selector_alias[oldName].push(name) : (selector_alias[oldName] = [name])
        }
        selector_alias_count[name] = 1

        class_mapping[name] = descendant_map
        result[name] = {
          ref: descendant_map,
          node: tree
        }
      }
    }
    return result
  }

  const processLeaf = (leaf, descendant_map: TMappingNode) => {
    if (!leaf) return

    const queue = [leaf]

    while (queue.length > 0) {
      const current = queue.shift()

      if (current instanceof Array) {
        for (let i = 0; i < current.length; i++) {
          queue.push(current[i])
        }
        continue
      }

      const leaf_map = traverse(current)
      if (!leaf_map) continue

      // 直接后代
      Object.assign(descendant_map.children, leaf_map)

      // 子孙后代
      const grandchild: (Record<string, TMapping> | TMapping)[] = [leaf_map]
      Object.keys(leaf_map).forEach(key => {
        const leaf_child_map = class_mapping[key]
        if (leaf_child_map?.descendants) {
          grandchild.push(leaf_child_map.descendants)
        }
      })
      Object.assign(descendant_map.descendants, ...grandchild)
    }
  }

  traverse(root)
  return {
    mapping: class_mapping,
    alias: selector_alias
  }
}

// 将嵌套样式与节点合并
function combineStyle(nestingStyle: NestingStyle, class_mapping: TMapping, alias: Record<string, string[]>) {
  const findElement = (selector_string, combinator_type, selector_mapping, remainder_selector, declaration) => {
    // 防止修改原数组
    if (selector_string instanceof Array) {
      selector_string = selector_string.slice()
    }
    let selector_list = [selector_string]
    const selector_nodes: TSelectorNode[] = []
    let shouldUseCombinations = false
    // 判断是否存在别名
    if (selector_string instanceof Array) {
      // 多类选择器类名，需要进行排列组合选择了，一对多的查找 ['a', 'b']，需要找出所有a和b都指向同一个node的节点
      selector_string.forEach((item, i) => {
        if (alias[item]) {
          selector_string[i] = [item, ...alias[item]]
        }
      })
      shouldUseCombinations = true
    } else if (alias[selector_string]) {
      selector_list = selector_list.concat(alias[selector_string])
    }

    for (let i = 0; i < selector_list.length; i++) {
      const selector = selector_list[i]
      if (selector instanceof Array) {
        let hitElements: any
        // 如果是数组，说明他是一个多类选择器：.a.b，我们需要搜索这两个类名都指向同一个node
        if (shouldUseCombinations) {
          hitElements = generateCombinations(selector, (combination) => {
            // combination 是组合后的选择器['parent', 'child']
            const _obj = findSendNode(combination, selector_mapping)
            if (_obj) return _obj
          })
        } else {
          hitElements = findSendNode(selector, selector_mapping)
        }
        // 找出最后搜寻出来的node
        if (hitElements) {
          let objs = [hitElements]
          objs = flattenArray(objs)
          objs.forEach(obj => {
            if (typeof obj.node.type === 'function') {
              // 自定义组件，往下传递需要搜寻的内容向里面搜寻
              const nestingData = {
                selectors: [selector_string, combinator_type, ...remainder_selector.slice()],
                declaration: declaration
              }
              obj.node.props.__nesting = obj.node.props.__nesting
                ? [...obj.node.props.__nesting, nestingData] : [nestingData]
            }
            selector_nodes.push({
              // @ts-ignore
              mapping: (obj.ref || obj)[combinator_type === ' > ' ? 'children' : 'descendants'],
              node: obj.node
            })
          })
        }
      } else {
        // 查询选择器的节点
        const object = selector_mapping[selector]
        if (object) {
          if (typeof object.node.type === 'function') {
            // 自定义组件，往下传递需要搜寻的内容向里面搜寻
            const nestingData = {
              selectors: [selector_string, combinator_type, ...remainder_selector.slice()],
              declaration: declaration
            }
            object.node.props.__nesting = object.node.props.__nesting
              ? [...object.node.props.__nesting, nestingData] : [nestingData]
          }
          selector_nodes.push({
            mapping: (object.ref || object)[combinator_type === ' > ' ? 'children' : 'descendants'],
            node: object.node
          })
        }
      }
    }
    return selector_nodes
  }
  const findSelector = (selectors: string[], current_mapping: any, declaration: any): TSelectorNode[] => {
    const workQueue: { selectors: string[], current_mapping: any }[] = [{ selectors, current_mapping }]
    let resultElements: TSelectorNode[] = []
    while (workQueue.length > 0) {
      const { selectors: currentSelectors, current_mapping: currentMapping } = workQueue.shift()!
      const new_selectors = currentSelectors.slice()
      const selector_string = new_selectors.shift()
      const combinator_type = new_selectors.shift()

      const _elements = findElement(selector_string, combinator_type, currentMapping, new_selectors, declaration)

      if (_elements.length) {
        if (new_selectors.length) {
          _elements.forEach(element => {
            workQueue.push({ selectors: new_selectors.slice(), current_mapping: element.mapping })
          })
        } else {
          resultElements = resultElements.concat(_elements)
        }
      }
    }

    return resultElements
  }
  if (nestingStyle && nestingStyle instanceof Array) {
    // 合并样式
    nestingStyle.forEach(({ selectors, declaration }) => {
      // 获取选中的节点列表
      const selectors_elements = findSelector(selectors, class_mapping, declaration)
      for (let i = 0; i < selectors_elements.length; i++) {
        const ele = selectors_elements[i].node
        if (ele && typeof ele !== 'function') {
          // 直接注入到__hmStyle
          // Hack: ReactElement会在dev模式下被冻结，所以在dev模式下，我们会将Object.freeze覆盖使其失效
          if (ele.props.__hmStyle) {
            ele.props.__hmStyle = Object.assign({}, ele.props.__hmStyle, declaration)
          } else {
            ele.props.__hmStyle = declaration
          }
        }
      }
    })
  }
}

// 排列组合选择器，找出符合的组合
// let arrayA = [1, 2, 3];
// let arrayB = [4, 5, 6];
// let arrayC = 'abc'
// let result = generateCombinations([arrayA, arrayB, arrayC], (combination) => { if (combination[0] == 3 ) { return combination }})
// console.log(result)  => [3, 4, "abc"]
function generateCombinations (arrays: (string[] | string)[], cbFn, currentCombination: (string[] | string)[] = []) {
  if (arrays.length === 0) {
    // 当所有数组都被处理完时，将当前组合添加到结果中
    return cbFn(currentCombination.slice())
  }
  // 取出当前数组
  const currentArray = arrays[0]
  if (currentArray instanceof Array) {
    // 遍历当前数组的每个元素
    const eles: TMappingNode[] = []
    for (let i = 0; i < currentArray.length; i++) {
      // 将当前元素添加到当前组合中
      currentCombination.push(currentArray[i])
      // 递归处理剩余的数组
      const shouldStop = generateCombinations(arrays.slice(1), cbFn, currentCombination)
      if (shouldStop) {
        eles.push(shouldStop)
      }
      // 回溯，移除最后一个元素，尝试其他组合
      currentCombination.pop()
    }
    return eles
  } else {
    // 如果不是数组，直接将当前元素添加到当前组合中
    currentCombination.push(currentArray)
    // 递归处理剩余的数组
    const shouldStop = generateCombinations(arrays.slice(1), cbFn, currentCombination)
    if (shouldStop) {
      return shouldStop
    }
    // 回溯，移除最后一个元素，尝试其他组合
    currentCombination.pop()
  }
  return false
}

// 多类选择器辅助函数：.a.b => 这里的.a .b其实都是指向同一个node
// 匹配寻找所有选择器都指向同一个node
function findSendNode (selectorArr: string[], selector_mapping: TMapping) {
  let obj: any = null
  for (let i = 0; i < selectorArr.length; i++) {
    // 查询选择器的节点
    const object = selector_mapping[selectorArr[i]]
    if (object) {
      if (!obj) { obj = object }
      if (object.node === obj.node) continue
    }
    obj = null
    break
  }
  return obj
}

function insertParentStyle(data: {key: string, value: CSSProperties}, class_mapping: TMapping, alias: Record<string, string[]>) {
  const { key, value } = data
  key.split(' ').forEach(key => {
    let classnames = [key]
    if (alias[key]) {
      classnames = classnames.concat(alias[key])
    }
    classnames.forEach(name => {
      if (class_mapping[name]) {
        // 插入样式
        const ele = class_mapping[key].node
        if (ele) {
          // 直接注入到__hmStyle
          // Hack: ReactElement会在dev模式下被冻结，所以在dev模式下，我们会将Object.freeze覆盖使其失效
          if (ele.props.__hmStyle) {
            ele.props.__hmStyle = Object.assign({}, ele.props.__hmStyle, value)
          } else {
            ele.props.__hmStyle = value
          }
        }
      }
    })
  })
}

// 合并嵌套样式
// 1、构建映射表，生成一份扁平的样式表结构
// 2、遍历嵌套样式，根据选择器查找节点，合并样式
export function __combine_nesting_style__(react_tree: ReactElement, styles: NestingStyle | null = null) {
  if (react_tree) {
    let newStyle = styles
    const parentProps: {
      __styleSheet?: {key: string, value: CSSProperties}
      __nesting?: NestingStyle
    } = // @ts-ignore
    react_tree._owner?.pendingProps // Hack：取出父组件的props，考虑版本问题，取的内部属性，可能会有问题

    if (newStyle || (parentProps && (parentProps.__styleSheet || parentProps.__nesting))) {
      // 1、循环一遍，构建出一颗JSX映射表
      const { mapping, alias } = depthTraversal(react_tree)
      if (parentProps) {
        // 2、如果自定义节点，则增加合成__stylesheet步骤，将父节点的样式合并到当前节点
        if (parentProps.__styleSheet) {
          insertParentStyle(parentProps.__styleSheet, mapping, alias)
          // @ts-ignore
          parentProps.__styleSheet = null // 释放内存
        }
        // 3、如果自定节点，存在需要往下查询的嵌套样式，需要合并到子组件
        if (parentProps.__nesting) {
          newStyle = (newStyle || []).concat(parentProps.__nesting)
          // @ts-ignore
          parentProps.__nesting = null // 释放内存
        }
      }
      // 4、合并嵌套样式样式
      if (newStyle && newStyle.length) {
        combineStyle(newStyle, mapping, alias)
      }
    }
  }
  return react_tree
}

// 拍平数组
function flattenArray(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flattenArray(val) : val)
  }, [])
}
