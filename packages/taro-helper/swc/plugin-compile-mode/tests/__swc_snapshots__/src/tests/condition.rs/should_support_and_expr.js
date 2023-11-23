
const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}" wx:if="{{i.cn[0].compileIf}}">{{i.cn[0].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[1].p1,\'none\')}}" wx:if="{{i.cn[1].compileIf}}">{{i.cn[1].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[2].p1,\'none\')}}" wx:if="{{i.cn[2].compileIf}}">{{i.cn[2].cn[0].v}}</view>{{i.cn[3].v==="compileIgnore"?"":i.cn[3].v}}<view hover-class="{{xs.b(i.cn[4].p1,\'none\')}}"></view></view></template>';
function Index() {
    return <View compileMode="f0t0">
            {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
            {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
            {condition1 && "condition2" && condition3 ? <View hoverClass={myClass} compileIf={condition1 && "condition2" && condition3}>{content}</View> : <View/>}
            {condition1 ? 'Hello' : "compileIgnore"}
            <View hoverClass={myClass}></View>
          </View>;
}
