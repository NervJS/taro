import { isWebPlatform } from '@tarojs/shared'
import { defineComponent } from 'vue'

const isWeb = isWebPlatform()

export default defineComponent({
  props: {
    height: {
      type: [String, Number],
      required: true
    },
    width: {
      type: [String, Number],
      required: true
    },
    column: Number,
    columnWidth: Number,
    item: {
      required: true
    },
    itemCount: {
      type: Number,
      required: true
    },
    itemData: {
      type: Array,
      required: true
    },
    itemKey: String,
    itemSize: {
      type: [Number, Function],
      required: true
    },
    position: {
      type: String,
      default: 'absolute'
    },
    initialScrollOffset: {
      type: Number,
      default: 0
    },
    overscanDistance: {
      type: Number,
      default: 50
    },
    placeholderCount: {
      type: Number,
      default: 0
    },
    useIsScrolling: {
      type: Boolean,
      default: false
    },
    enhanced: {
      type: Boolean,
      default: false
    },
    shouldResetStyleCacheOnItemSizeChange: {
      type: Boolean,
      default: true
    },
    outerElementType: {
      type: String,
      default: isWeb ? 'taro-scroll-view-core' : 'scroll-view'
    },
    innerElementType: {
      type: String,
      default: isWeb ? 'taro-view-core' : 'view'
    },
    itemElementType: {
      type: String,
      default: isWeb ? 'taro-view-core' : 'view'
    },
    outerTagName: String,
    innerTagName: String,
    itemTagName: String,
    outerRef: String,
    onScrollNative: Function,
    onItemsRendered: Function,
  },
  render () {
    console.warn('virtual-waterfall is not supported in vue.')
  }
})
