import { Component, ComponentInterface, Element, h } from "@stencil/core";


// https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
const UNUSED_DOCUMENT_NODE_TYPE = 0;

@Component({
  tag: 'taro-pull-to-refresh-content',
})
export class PullToRefreshContent implements ComponentInterface {

  @Element() el: HTMLElement;

  componentDidRender () {
    // 通过mock数据的方式阻止stencil的diff传播更新，可能会造成之前的document寻址方式出现问题
    // 想要解决这个问题还是推荐使用原生的web component进行重写
    // https://github.com/ionic-team/stencil/blob/13621c258e086dfbc949ccc0d64d3c0fee85144b/src/runtime/vdom/vdom-render.ts#L730
    Object.defineProperty(this.el, 'nodeType', {
      value: UNUSED_DOCUMENT_NODE_TYPE,
      writable: false,
    });
  }

  render() {
      return <slot />
  }
}
