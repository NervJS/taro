import { createOption } from '../utils'

const MODE_TYPE_MAP = {
  selector: 'text',
  multiSelector: 'multi-text',
  time: 'time',
  date: 'date',
  datetime: 'datetime'
}

export default createOption({
  props: [
    'id',
    'disabled',
    'mode',
    'range',
    'value',
    'start',
    'end',
    'hours',
    'containsecond',
    'indicatorprefix',
    'indicatorsuffix',
    'vibrate',
    'lunar',
    'lunarswitch',
    'cn'
  ],

  data () {
    const isArray = Array.isArray
    const hasRangeProp = Boolean(this.range)
    const hasModeProp = Boolean(this.mode)
    let range = isArray(this.range) ? this.range : []
    let type = hasModeProp ? MODE_TYPE_MAP[this.mode] || 'text' : null
    const children = (this.cn || []).filter(child => child.nn === 'picker-view-column')

    // 优先读取range属性，若无则解析子节点
    if (!hasRangeProp && ['text', 'multi-text', null].includes(type)) {
      range = recursiveGetCandidates(children)
    }
    // 若未指定type，则根据range类型来确定type
    if (type === null) {
      if (isMultiRange(range)) {
        type = range.length === 1 ? 'text' : 'multi-text'
        range = range.length === 1 ? range[0] : range
      } else {
        type = 'text'
      }
    }

    if (type === 'text') {
      const selected = this.value || 0
      return {
        type,
        localRange: range,
        selected
      }
    }

    if (type === 'multi-text') {
      const columns = range.length
      const selected = isArray(this.value) ? this.value : Array(columns).fill(0)
      return {
        type,
        localRange: range,
        selected,
        curSelected: selected,
        columns
      }
    }

    if (type === 'time') {
      return {
        type,
        selected: this.value || ''
      }
    }

    if (type === 'date') {
      return {
        type,
        selected: this.value || ''
      }
    }

    if (type === 'datetime') {
      return {
        type,
        selected: this.value || ''
      }
    }
  },

  textChange (e) {
    const { newSelected } = e
    this.$trigger('change', { value: newSelected })
  },
  multiTextColumnChange (e) {
    const { column, newSelected } = e
    this.curSelected[column] = newSelected
    this.$trigger('columnchange', { column, value: newSelected })
    this.$trigger('change', { value: this.curSelected })
  },
  timeChange (e) {
    const { hour, minute, second } = e
    const value = padNumZero(hour) + ':' + padNumZero(minute) + (this.containsecond ? ':' + padNumZero(second) : '')
    this.$trigger('change', { value, hour, minute, second })
  },
  dateChange (e) {
    const { year, month, day } = e
    const value = [year, padNumZero(month + 1), padNumZero(day)].join('-')
    this.$trigger('change', { value, year, month, day })
  },
  datetimeChange (e) {
    const { year, month, day, hour, minute } = e
    const value = [year, padNumZero(month + 1), padNumZero(day), padNumZero(hour), padNumZero(minute)].join('-')
    this.$trigger('change', { value, year, month, day, hour, minute })
  }
})

function isMultiRange (range = []) {
  return range.length > 0 && range.every(r => Array.isArray(r))
}

/**
 * 对<PickerViewColumn>组件的子节点递归收集候选词
 */
function recursiveGetCandidates (children = []) {
  if (children.length === 0) return []
  return children.map(child => getCandidatesDFS(child.cn || []))
}
/**
 * 以深度遍历方式收集候选词，最多遍历4层，优先查找左子树，直到读取到“#text”节点为止
 * eg：
 * <View>A</View> => A
 * <View><Text>A</Text><Text>B</Text></View> => A
 */
function getCandidatesDFS (children = []) {
  if (children.length === 0) return []

  const allowDepth = 4 // 最深遍历4层，避免无限制递归
  const trave = function (node, depth) {
    if (node.nn === '#text') {
      return node.v
    }
    if (depth > allowDepth) return ''
    if (node.cn) {
      return trave(node.cn[0], depth + 1) // 优先查找第一个孩子节点，这就要求开发者将候选词始终放在第一个节点中
    }
    return ''
  }

  return children.map(child => {
    return trave(child, 1)
  })
}

function padNumZero (num) {
  return num.toString().padStart(2, '0')
}
