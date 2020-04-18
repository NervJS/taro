---
title: common
sidebar_label: common
id: version-2.1.1-common
original_id: common
---

## StandardProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>组件的唯一标示, 保持整个页面唯一</td>
    </tr>
    <tr>
      <td>className</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>同 <code>class</code>，在 React/Nerv 里一般使用 <code>className</code> 作为 <code>class</code> 的代称</td>
    </tr>
    <tr>
      <td>style</td>
      <td><code>string | CSSProperties</code></td>
      <td style="text-align:center">否</td>
      <td>组件的内联样式, 可以动态设置的内联样式</td>
    </tr>
    <tr>
      <td>key</td>
      <td><code>string | number</code></td>
      <td style="text-align:center">否</td>
      <td>如果列表中项目的位置会动态改变或者有新的项目添加到列表中，<br />需要使用 <code>wx:key</code> 来指定列表中项目的唯一的标识符。</td>
    </tr>
    <tr>
      <td>hidden</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>组件是否显示, 所有组件默认显示</td>
    </tr>
    <tr>
      <td>animation</td>
      <td><code>{ actions: object[]; }</code></td>
      <td style="text-align:center">否</td>
      <td>动画属性</td>
    </tr>
    <tr>
      <td>ref</td>
      <td><code>string | ((node: any) =&gt; any)</code></td>
      <td style="text-align:center">否</td>
      <td>引用</td>
    </tr>
  </tbody>
</table>

## FormItemProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>表单数据标识</td>
    </tr>
  </tbody>
</table>

## EventProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>onTouchStart</td>
      <td><code>(event: ITouchEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作开始</td>
    </tr>
    <tr>
      <td>onTouchMove</td>
      <td><code>(event: ITouchEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>手指触摸后移动</td>
    </tr>
    <tr>
      <td>onTouchCancel</td>
      <td><code>(event: ITouchEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作被打断，如来电提醒，弹窗</td>
    </tr>
    <tr>
      <td>onTouchEnd</td>
      <td><code>(event: ITouchEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作结束</td>
    </tr>
    <tr>
      <td>onClick</td>
      <td><code>(event: ITouchEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>手指触摸后马上离开</td>
    </tr>
    <tr>
      <td>onLongPress</td>
      <td><code>(event: CommonEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发</td>
    </tr>
    <tr>
      <td>onLongClick</td>
      <td><code>(event: CommonEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>手指触摸后，超过350ms再离开（推荐使用longpress事件代替）</td>
    </tr>
    <tr>
      <td>onTransitionEnd</td>
      <td><code>(event: CommonEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>会在 WXSS transition 或 Taro.createAnimation 动画结束后触发</td>
    </tr>
    <tr>
      <td>onAnimationStart</td>
      <td><code>(event: CommonEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>会在一个 WXSS animation 动画开始时触发</td>
    </tr>
    <tr>
      <td>onAnimationIteration</td>
      <td><code>(event: CommonEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>会在一个 WXSS animation 一次迭代结束时触发</td>
    </tr>
    <tr>
      <td>onAnimationEnd</td>
      <td><code>(event: CommonEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>会在一个 WXSS animation 动画完成时触发</td>
    </tr>
    <tr>
      <td>onTouchForceChange</td>
      <td><code>(event: CommonEvent) =&gt; any</code></td>
      <td style="text-align:center">否</td>
      <td>在支持 3D Touch 的 iPhone 设备，重按时会触发</td>
    </tr>
  </tbody>
</table>

## CommonEvent

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td>事件类型</td>
    </tr>
    <tr>
      <td>timeStamp</td>
      <td><code>number</code></td>
      <td>事件生成时的时间戳</td>
    </tr>
    <tr>
      <td>target</td>
      <td><code>Target</code></td>
      <td>触发事件的组件的一些属性值集合</td>
    </tr>
    <tr>
      <td>currentTarget</td>
      <td><code>currentTarget</code></td>
      <td>当前组件的一些属性值集合</td>
    </tr>
    <tr>
      <td>detail</td>
      <td><code>T</code></td>
      <td>额外的信息</td>
    </tr>
    <tr>
      <td>preventDefault</td>
      <td><code>() =&gt; void</code></td>
      <td>阻止元素发生默认的行为</td>
    </tr>
    <tr>
      <td>stopPropagation</td>
      <td><code>() =&gt; void</code></td>
      <td>阻止事件冒泡到父元素,阻止任何父事件处理程序被执行</td>
    </tr>
  </tbody>
</table>

## BaseEventOrig

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td>事件类型</td>
    </tr>
    <tr>
      <td>timeStamp</td>
      <td><code>number</code></td>
      <td>事件生成时的时间戳</td>
    </tr>
    <tr>
      <td>target</td>
      <td><code>Target</code></td>
      <td>触发事件的组件的一些属性值集合</td>
    </tr>
    <tr>
      <td>currentTarget</td>
      <td><code>currentTarget</code></td>
      <td>当前组件的一些属性值集合</td>
    </tr>
    <tr>
      <td>detail</td>
      <td><code>T</code></td>
      <td>额外的信息</td>
    </tr>
    <tr>
      <td>preventDefault</td>
      <td><code>() =&gt; void</code></td>
      <td>阻止元素发生默认的行为</td>
    </tr>
    <tr>
      <td>stopPropagation</td>
      <td><code>() =&gt; void</code></td>
      <td>阻止事件冒泡到父元素,阻止任何父事件处理程序被执行</td>
    </tr>
  </tbody>
</table>

## ITouchEvent

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>touches</td>
      <td><code>ITouch[]</code></td>
      <td>触摸事件，当前停留在屏幕中的触摸点信息的数组</td>
    </tr>
    <tr>
      <td>changedTouches</td>
      <td><code>CanvasTouch[]</code></td>
      <td>触摸事件，当前变化的触摸点信息的数组</td>
    </tr>
  </tbody>
</table>

## CanvasTouch

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>identifier</td>
      <td><code>number</code></td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

## ITouch

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>identifier</td>
      <td><code>number</code></td>
      <td>触摸点的标识符</td>
    </tr>
    <tr>
      <td>pageX</td>
      <td><code>number</code></td>
      <td>距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴</td>
    </tr>
    <tr>
      <td>pageY</td>
      <td><code>number</code></td>
      <td>距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴</td>
    </tr>
    <tr>
      <td>clientX</td>
      <td><code>number</code></td>
      <td>距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴</td>
    </tr>
    <tr>
      <td>clientY</td>
      <td><code>number</code></td>
      <td>距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴</td>
    </tr>
  </tbody>
</table>

## Target

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td><code>string</code></td>
      <td>事件源组件的id</td>
    </tr>
    <tr>
      <td>tagName</td>
      <td><code>string</code></td>
      <td>当前组件的类型</td>
    </tr>
    <tr>
      <td>dataset</td>
      <td><code>{ [key: string]: any; }</code></td>
      <td>事件源组件上由data-开头的自定义属性组成的集合</td>
    </tr>
  </tbody>
</table>

## netStatus

网络状态数据

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>videoBitrate</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
    </tr>
    <tr>
      <td>audioBitrate</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
    </tr>
    <tr>
      <td>videoFPS</td>
      <td><code>string | number</code></td>
      <td style="text-align:center">否</td>
    </tr>
    <tr>
      <td>videoGOP</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
    </tr>
    <tr>
      <td>netSpeed</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
    </tr>
    <tr>
      <td>netJitter</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
    </tr>
    <tr>
      <td>videoWidth</td>
      <td><code>string | number</code></td>
      <td style="text-align:center">否</td>
    </tr>
    <tr>
      <td>videoHeight</td>
      <td><code>string | number</code></td>
      <td style="text-align:center">否</td>
    </tr>
  </tbody>
</table>
