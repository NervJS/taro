<template>
  <taro-picker-core
    :mode='mode'
    :disabled='disabled'
    :range.prop="range"
    :range-key="rangeKey"
    :start="start"
    :end="end"
    :fields="fields"
    :name="name"
    @change="onChange"
    @columnchange="onColumnChange"
    @cancel="onCancel"
  >
    <slot />
  </taro-picker-core>
</template>

<script>
export default {
  name: 'taro-picker',
  props: {
    'mode': String,
    'disabled': Boolean,
    'range': Array,
    'rangeKey': String,
    'value': [Number, String, Array],
    'start': String,
    'end': String,
    'fields': String,
    'name': String
  },
  mounted () {
    this.$el.value = this.value
  },
  watch: {
    value (newVal) {
      this.$el.value = newVal
    }
  },
  methods: {
    onChange (e) {
      this.$emit('change', e)
    },
    onColumnChange (e) {
      this.$emit('columnchange', e)
    },
    onCancel (e) {
      this.$emit('cancel', e)
    }
  }
}
</script>