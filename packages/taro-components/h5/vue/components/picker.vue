<template>
  <taro-picker-core
    :range.prop="range"
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
    'range': Array,
    'value': [Number, String, Array]
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
