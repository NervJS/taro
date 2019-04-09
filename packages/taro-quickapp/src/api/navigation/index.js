import {
  eventCenter
} from '@tarojs/taro'

function setNavigationBar (params) {
  eventCenter.trigger('TaroEvent:setNavigationBar', params)
  if (params.success) {
    params.success()
  }
}

export function setNavigationBarTitle (params) {
  setNavigationBar(params)
}

export function setNavigationBarColor (params) {
  setNavigationBar(params)
}

export default {
  setNavigationBarTitle,
  setNavigationBarColor
}
