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

import type { ReactElement } from 'react'

type TMappingNode = {
  children: TMapping
  descendants: TMapping
}

type TMapping = Record<string, TMappingNode>

type TSelectorNode = {
  mapping: TMapping
  node: ReactElement
}

export type NestingStyle = {
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
      const classnames = (tree.props.className || '').split(' ')
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
    // 判断是否存在别名
    if (alias[selector_string]) {
      selector_list = selector_list.concat(alias[selector_string])
    }

    for (let i = 0; i < selector_list.length; i++) {
      const selector = selector_list[i]
      // 查询选择器的节点
      const object = selector_mapping[selector]
      if (object) {
        selector_nodes.push({
          mapping: (object.ref || object)[combinator_type === ' > ' ? 'children' : 'descendants'],
          node: object.node
        })
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
          if (ele.props.style) {
            Object.assign(ele.props.style, declaration)
          } else {
            ele.props.style = declaration
          }
        }
      }
    })
  }
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
