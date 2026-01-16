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

export function handleStencilNodes (el: HTMLElement) {
  el?.childNodes?.forEach(item => {
    // Note: ['s-cn'] Content Reference Node
    if (item.nodeType === document.COMMENT_NODE && item['s-cn']) item['s-cn'] = false
    // Note: ['s-sr'] Is a slot reference node (渲染完成后禁用 slotRelocation 特性, 避免 Stencil 组件相互调用时内置排序与第三方 UI 框架冲突导致组件顺序混乱)
    if (item.nodeType !== document.COMMENT_NODE && item['s-sr']) item['s-sr'] = false
  })
}
