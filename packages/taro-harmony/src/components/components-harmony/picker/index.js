const DEFAULT_MODE = 'selector'
const DEFAULT_TYPE = 'text'
const MODE_TYPE_MAP = {
  selector: 'text',
  multiSelector: 'multi-text',
  time: 'time',
  date: 'date',
  datetime: 'datetime'
}

export default {
  props: [
    'id',
    'cls',
    'disabled',
    'mode',
    'range',
    'value',
    'selected',
    'rangeKey',
    'start',
    'end',
    'hours',
    'vibrate',
    'lunar',
    'lunarswitch'
  ],

  data () {
    const isArray = Array.isArray
    const range = isArray(this.range) ? this.range : []
    const type = MODE_TYPE_MAP[this.mode || DEFAULT_MODE] || DEFAULT_TYPE
    let rest = {}

    if (type === 'text') {
      let localRange = range
      const selected = Number(this.value) || 0
      if (this.rangeKey) {
        localRange = localRange.map(v => v[this.rangeKey])
      }
      // this.value代表的是下标，鸿蒙组件的value代表选择器的值
      const localValue = localRange[selected]
      rest = {
        localRange,
        localValue
      }
    }

    if (type === 'multi-text') {
      const columns = range.length
      const selected = isArray(this.value) ? this.value.map(v => Number(v)) : Array(columns).fill(0)
      let localRange = range
      if (this.rangeKey) {
        localRange = range.map(column => {
          return (column || []).map(v => v[this.rangeKey])
        })
      }
      const localValue = localRange.map((column, idx) => {
        return column[selected[idx]]
      })
      rest = {
        localRange,
        localValue,
        columns
      }
    }

    return {
      type,
      localValue: this.value,
      ...rest
    }
  },

  textChange (e) {
    const { newValue, newSelected } = e
    this.localValue = newValue
    this.$emit('change', { id: this.id, value: newSelected })
  },
  multiTextChange (e) {
    const { newValue, newSelected } = e
    this.localValue = newValue
    this.$emit('change', { id: this.id, value: newSelected })
  },
  multiTextColumnChange (e) {
    const { column, newSelected } = e
    this.$emit('columnchange', { id: this.id, column, value: newSelected })
  },
  timeChange (e) {
    const { hour, minute } = e
    this.localValue = padNumZero(hour) + ':' + padNumZero(minute)
    this.$emit('change', { id: this.id, value: this.localValue, hour, minute })
  },
  dateChange (e) {
    const { year, month, day } = e
    this.localValue = [year, padNumZero(month + 1), padNumZero(day)].join('-')
    this.$emit('change', { id: this.id, value: this.localValue, year, month, day })
  },
  datetimeChange (e) {
    const { year, month, day, hour, minute } = e
    this.localValue = [year, padNumZero(month + 1), padNumZero(day), padNumZero(hour), padNumZero(minute)].join('-')
    this.$emit('change', { id: this.id, value: this.localValue, year, month, day, hour, minute })
  },
  cancel () {
    this.$emit('cancel', { id: this.id })
  }
}

function padNumZero (num) {
  return num.toString().padStart(2, '0')
}
