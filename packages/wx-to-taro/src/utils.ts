import * as template from 'babel-template'
import * as t from 'babel-types'

export const buildTemplate = (str: string) => template(str)().expression as t.Expression

export function buildImportStatement (source: string, specifiers: string[] = [], defaultSpec?: string) {
  return t.importDeclaration(
    defaultSpec ? [defaultSpec, ...specifiers].map((spec, index) => {
      if (index === 0) {
        return t.importDefaultSpecifier(t.identifier(defaultSpec))
      }
      return t.importSpecifier(t.identifier(spec), t.identifier(spec))
    }) : specifiers.map(s => t.importSpecifier(t.identifier(s), t.identifier(s))),
    t.stringLiteral(source)
  )
}

// tslint:disable-next-line
export const DEFAULT_Component_SET = new Set<string>([
  'View',
  'ScrollView',
  'Swiper',
  'MovableView',
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
  'Ad'
])
