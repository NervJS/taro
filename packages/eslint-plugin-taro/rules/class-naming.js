const { buildDocsMeta, isTaroComponent } = require('../utils/utils')
// eslint-disable-next-line
const DEFAULT_Components_SET = new Set([
  'View',
  'ScrollView',
  'Swiper',
  'CoverView',
  'CoverImage',
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
  'PickerViewColumn',
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
  'MovableArea',
  'MovableView',
  'FunctionalPageNavigator',
  'Ad',
  'Block',
  'Import',
  'OfficialAccount'
])

const ERROR_MESSAGE = '组件名不得与小程序内置组件名重复'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'class-naming')
  },

  create (context) {
    return {
      ClassDeclaration (node) {
        const id = node.id
        if (isTaroComponent(context, node) && id && DEFAULT_Components_SET.has(id.name)) {
          context.report({
            message: ERROR_MESSAGE,
            node: id
          })
        }
      }
    }
  }
}
