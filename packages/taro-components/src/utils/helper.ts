import Taro from '@tarojs/taro'

export function notSupport (name = '', instance = {}) {
  console.error(`H5 暂不支持 ${name} 组件！`)

  Taro.eventCenter.trigger('__taroNotSupport', {
    name,
    instance,
    type: 'component',
    category: 'temporarily',
  })
}
