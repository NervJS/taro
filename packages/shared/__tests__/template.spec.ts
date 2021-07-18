import { RecursiveTemplate } from '../src/template'

describe('shared template', () => {
  describe('RecursiveTemplate', () => {
    const recursiveTemplate = new RecursiveTemplate()

    it('#buildFlattenView', async () => {
      const template1 = recursiveTemplate.buildFlattenView(0)
      const expect1 = '<template is="{{xs.e(0)}}" data="{{{i:item}}}" />'

      expect(template1).toBe(expect1)

      const template2 = recursiveTemplate.buildFlattenView(2)
      const expect2 =
`<view s-if="{{item.nn==='view'&&(item.st||item.cl)}}" hover-class="{{xs.b(item.hoverClass,'none')}}" hover-stop-propagation="{{xs.b(item.hoverStopPropagation,false)}}" hover-start-time="{{xs.b(item.hoverStartTime,50)}}" hover-stay-time="{{xs.b(item.hoverStayTime,400)}}" animation="{{item.animation}}" bindtouchstart="eh" bindtouchmove="eh" bindtouchend="eh" bindtouchcancel="eh" bindlongtap="eh" bindanimationstart="eh" bindanimationiteration="eh" bindanimationend="eh" bindtransitionend="eh" style="{{item.st}}" class="{{item.cl}}" bindtap="eh" id="{{item.uid}}">
  <block s-for="{{item.cn}}" s-key="uid">
    <view s-if="{{item.nn==='view'&&(item.st||item.cl)}}" hover-class="{{xs.b(item.hoverClass,'none')}}" hover-stop-propagation="{{xs.b(item.hoverStopPropagation,false)}}" hover-start-time="{{xs.b(item.hoverStartTime,50)}}" hover-stay-time="{{xs.b(item.hoverStayTime,400)}}" animation="{{item.animation}}" bindtouchstart="eh" bindtouchmove="eh" bindtouchend="eh" bindtouchcancel="eh" bindlongtap="eh" bindanimationstart="eh" bindanimationiteration="eh" bindanimationend="eh" bindtransitionend="eh" style="{{item.st}}" class="{{item.cl}}" bindtap="eh" id="{{item.uid}}">
      <block s-for="{{item.cn}}" s-key="uid">
        <template is="{{xs.e(0)}}" data="{{{i:item}}}" />
      </block>
    </view>
    <block s-else>
      <template is="{{xs.e(0)}}" data="{{{i:item}}}" />
    </block>
  </block>
</view>
<block s-else>
  <template is="{{xs.e(0)}}" data="{{{i:item}}}" />
</block>`

      expect(template2).toBe(expect2)
    })
  })
})
