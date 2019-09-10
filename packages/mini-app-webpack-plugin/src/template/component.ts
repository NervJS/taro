import { Shortcuts } from './shortcuts'

const styles = {
  style: `i.${Shortcuts.Style}`,
  class: `i.${Shortcuts.Class}`
}

const events = {
  bindtap: 'eh'
}

const view = {
  ...styles,
  ...events
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

const input = {
  ...styles,
  bindinput: 'eh'
}

const button = {
  ...styles,
  ...events
}

export const standComponents = {
  view,
  image,
  text,
  button,
  input
}
