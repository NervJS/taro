import { stacks } from './stack'
import { history } from './history'

interface Option {
  url: string
  success?: Function
  fail?: Function
  complete?: Function
}

export function navigateTo (option: Option) {
  const { url } = option
  history.push(url)
}

export function redirectTo (option: Option) {
  const { url } = option
  history.replace(url)
}

export function navigateBack (_: Option) {
  history.goBack()
}

export function switchTab (option: Option) {
  navigateTo(option)
}

export function reLaunch (option: Option) {
  redirectTo(option)
}

export function getCurrentPages () {
  return stacks
}
