const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}" wx:if="{{i.cn[0].compileIf}}">{{i.cn[0].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[1].p1,\'none\')}}" wx:if="{{i.cn[1].compileIf}}">{{i.cn[1].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[2].p1,\'none\')}}" wx:if="{{i.cn[2].compileIf}}">{{i.cn[2].cn[0].v}}</view>{{i.cn[3].v==="compileIgnore"?"":i.cn[3].v}}<view bindtap="eh" data-sid="{{i.cn[4].sid}}" id="{{i.cn[4].sid}}" wx:if="{{i.cn[4].compileIf}}"></view><view hover-class="{{xs.b(i.cn[5].p1,\'none\')}}"></view><view><block wx:if="{{i.cn[6].cn[0].compileIf}}">{{i.cn[6].cn[0].cn[0].v}}</block></view><view><block wx:if="{{i.cn[7].cn[0].compileIf}}">{{i.cn[7].cn[0].cn[0].v}}</block></view><view><block wx:if="{{i.cn[8].cn[0].compileIf}}"></block></view></view></template>';
function Index() {
    return <View compileMode="f0t0">
            {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
            {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
            {condition1 && "condition2" && condition3 ? <View hoverClass={myClass} compileIf={condition1 && "condition2" && condition3}>{content}</View> : <View/>}
            {condition1 ? 'Hello' : "compileIgnore"}
            {condition1 ? <View onClick={()=>condition2 && doSth()} compileIf={condition1}/> : <View/>}
            <View hoverClass={myClass}></View>
            <View>{condition1 ? <block compileIf={condition1}>{ident}</block> : <block/>}</View>
            <View>{condition1 ? <block compileIf={condition1}>{obj.property}</block> : <block/>}</View>
            <View>{condition1 ? <block compileIf={condition1}>{fn()}</block> : <block/>}</View>
          </View>;
}
