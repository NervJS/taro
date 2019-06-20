const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '在小程序是保留关键字，请使用其他 props 名'

const reserveKeyWords = new Set([
  'class',
  'id'
])

// eslint-disable-next-line
const DEFAULT_Components_SET = new Set([
  'View',
  'ScrollView',
  'Swiper',
  'CoverImage',
  'CoverView',
  'Icon',
  'Text',
  'RichText',
  'Progress',
  'Button',
  'Checkbox',
  'Form',
  'Input',
  'Label',
  'Picker',
  'PickerView',
  'Radio',
  'RadioGroup',
  'CheckboxGroup',
  'Slider',
  'Switch',
  'Textarea',
  'Navigator',
  'Audio',
  'Image',
  'Video',
  'Camera',
  'LivePlayer',
  'LivePusher',
  'Map',
  'Canvas',
  'OpenData',
  'WebView',
  'SwiperItem',
  'Provider',
  'MovableArea',
  'MovableView'
])

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'props-reserve-keyword')
  },

  create (context) {
    return {
      JSXAttribute (node) {
        if (node.parent.type !== 'JSXOpeningElement') {
          return
        }
        const componentName = node.parent.name.name
        if (DEFAULT_Components_SET.has(componentName)) {
          return
        }
        const propKey = typeof node.name === 'object' ? node.name.name : node.name
        if (reserveKeyWords.has(propKey)) {
          context.report({
            message: `\`${propKey}\`` + ERROR_MESSAGE,
            node
          })
        }
      }
    }
  }
}
