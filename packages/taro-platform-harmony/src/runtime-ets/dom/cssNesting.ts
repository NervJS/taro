import { parseClasses } from '../utils'

import type { ReactElement } from 'react'

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
        } else if (typeof tree.props.children !== 'string'){
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

    // 如果是个数组
    if (leaf instanceof Array) {
      for (let i = 0; i < leaf.length; i++) {
        processLeaf(leaf[i], descendant_map)
      }
    }

    const leaf_map = traverse(leaf)
    if (!leaf_map) return
    // 直接后代
    Object.assign(descendant_map.children, leaf_map)
    // 子孙后代
    Object.assign(descendant_map.descendants, leaf_map)
    const keys = Object.keys(leaf_map)
    for (let i = 0; i < keys.length; i++) {
      const leaf_child_map = class_mapping[keys[i]]
      if (leaf_child_map) {
        Object.assign(descendant_map.descendants, leaf_child_map.descendants)
      }
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

  const findElement = (selector_string, combinator_type, selector_mapping) => {
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
        let obj
        // 如果是数组，说明他是一个多类选择器：.a.b，我们需要搜索这两个类名都指向同一个node
        if (shouldUseCombinations) {
          obj = generateCombinations(selector, (combination) => {
            // combination 是组合后的选择器['parent', 'child']
            const _obj = findSendNode(combination, selector_mapping)
            if (_obj) return _obj
          })
        } else {
          obj = findSendNode(selector, selector_mapping)
        }
        // 找出最后搜寻出来的node
        if (obj) {
          selector_nodes.push({
            mapping: (obj.ref || obj)[combinator_type === ' > ' ? 'children' : 'descendants'],
            node: obj.node
          })
        }
      } else {
        // 查询选择器的节点
        const object = selector_mapping[selector]
        if (object) {
          selector_nodes.push({
            mapping: (object.ref || object)[combinator_type === ' > ' ? 'children' : 'descendants'],
            node: object.node
          })
        }
      }
    }
    return selector_nodes
  }
  const findSelector = (selectors, current_mapping): TSelectorNode[] => {
    const new_selectors = selectors.slice()
    const selector_string = new_selectors.shift()
    const combinator_type = new_selectors.shift()
    const _elements = findElement(selector_string, combinator_type, current_mapping)
    if (_elements.length) {
      if (new_selectors.length) {
        let elements: TSelectorNode[] = []
        _elements.forEach(element => {
          elements = elements.concat(findSelector(new_selectors.slice(), element.mapping))
        })
        return elements
      } else {
        return _elements
      }
    } else {
      return []
    }
  }
  if (nestingStyle && nestingStyle instanceof Array) {
    // 合并样式
    nestingStyle.forEach(({ selectors, declaration }) => {
      // 获取选中的节点列表
      const selectors_elements = findSelector(selectors, class_mapping)
      for (let i = 0; i < selectors_elements.length; i++) {
        const ele = selectors_elements[i].node
        if (ele) {
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
    for (let i = 0; i < currentArray.length; i++) {
      // 将当前元素添加到当前组合中
      currentCombination.push(currentArray[i])
      // 递归处理剩余的数组
      const shouldStop = generateCombinations(arrays.slice(1), cbFn, currentCombination)
      if (shouldStop) {
        return shouldStop
      }
      // 回溯，移除最后一个元素，尝试其他组合
      currentCombination.pop()
    }
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

// 合并嵌套样式
// 1、构建映射表，生成一份扁平的样式表结构
// 2、遍历嵌套样式，根据选择器查找节点，合并样式
export function __combine_nesting_style__(react_tree: ReactElement, styles: NestingStyle) {
  // 循环一遍，构建出一颗JSX映射表
  const { mapping, alias } = depthTraversal(react_tree)
  // 合并样式
  combineStyle(styles, mapping, alias)
  return react_tree
}
