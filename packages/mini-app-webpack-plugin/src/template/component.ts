import { Shortcuts } from './shortcuts'

const styles = {
  style: `i.${Shortcuts.Style}`,
  class: `i.${Shortcuts.Class}`
}

const view = {
  ...styles
}

const image = {
  ...styles,
  src: `i.${Shortcuts.Src}`
}

const text = {
  ...styles,
  selectable: 'i.selectable',
  space: 'i.space',
  decode: 'i.decode'
}

export const standComponents = {
  view,
  image,
  text
}
