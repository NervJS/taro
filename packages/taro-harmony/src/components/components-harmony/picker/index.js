import { createOption } from '../utils'

const DEFAULT_MODE = 'selector'
const DEFAULT_TYPE = 'text'
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
    'rangeKey',
    'start',
    'end',
    'hours',
    'containsecond',
    'vibrate',
    'lunar',
    'lunarswitch'
  ],

  data () {
    const isArray = Array.isArray
    const range = isArray(this.range) ? this.range : []
    const type = MODE_TYPE_MAP[this.mode || DEFAULT_MODE] || DEFAULT_TYPE

    if (type === 'text') {
      let localRange = range; const selected = this.value || 0
      if (this.rangeKey) {
        localRange = localRange.map(v => v[this.rangeKey])
      }
      // this.value代表的是下标，鸿蒙组件的value代表选择器的值
      const localValue = localRange[selected]
      return {
        type,
        localRange,
        localValue,
        selected
      }
    }

    if (type === 'multi-text') {
      const columns = range.length
      let localRange = range
      const selected = isArray(this.value) ? this.value : Array(columns).fill(0)
      if (this.rangeKey) {
        localRange = range.map(column => {
          return (column || []).map(v => v[this.rangeKey])
        })
      }
      const localValue = localRange.map((column, idx) => {
        return column[selected[idx]]
      })
      return {
        type,
        localRange,
        localValue,
        selected,
        columns
      }
    }

    if (type === 'time') {
      return {
        type,
        localValue: this.value,
        selected: this.value || ''
      }
    }

    if (type === 'date') {
      return {
        type,
        localValue: this.value,
        selected: this.value || ''
      }
    }

    if (type === 'datetime') {
      return {
        type,
        localValue: this.value,
        selected: this.value || ''
      }
    }
  },

  textChange (e) {
    const { newValue, newSelected } = e
    this.localValue = newValue
    this.$trigger('change', { value: newSelected })
  },
  multiTextChange (e) {
    const { newValue, newSelected } = e
    this.localValue = newValue
    this.$trigger('change', { value: newSelected })
  },
  multiTextColumnChange (e) {
    const { column, newSelected } = e
    this.$trigger('columnchange', { column, value: newSelected })
  },
  timeChange (e) {
    const { hour, minute, second } = e
    this.localValue = padNumZero(hour) + ':' + padNumZero(minute) + (this.containsecond ? ':' + padNumZero(second) : '')
    this.$trigger('change', { value: this.localValue, hour, minute, second })
  },
  dateChange (e) {
    const { year, month, day } = e
    this.localValue = [year, padNumZero(month + 1), padNumZero(day)].join('-')
    this.$trigger('change', { value: this.localValue, year, month, day })
  },
  datetimeChange (e) {
    const { year, month, day, hour, minute } = e
    this.localValue = [year, padNumZero(month + 1), padNumZero(day), padNumZero(hour), padNumZero(minute)].join('-')
    this.$trigger('change', { value: this.localValue, year, month, day, hour, minute })
  },
  cancel () {
    this.$trigger('cancel')
  }
})

function padNumZero (num) {
  return num.toString().padStart(2, '0')
}
