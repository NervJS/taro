const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.c[0].p1,\'none\')}}" wx:if="{{i.c[0].compileIf}}">{{i.c[0].c[0].v}}</view><view hover-class="{{xs.b(i.c[1].p1,\'none\')}}" wx:if="{{i.c[1].compileIf}}">{{i.c[1].c[0].v}}</view><view hover-class="{{xs.b(i.c[2].p1,\'none\')}}" wx:if="{{i.c[2].compileIf}}">{{i.c[2].c[0].v}}</view>{{i.c[3].v==="compileIgnore"?"":i.c[3].v}}<view bindtap="eh" data-s="{{i.c[4].s}}" id="{{i.c[4].s}}" wx:if="{{i.c[4].compileIf}}"></view><view wx:if="{{i.c[5].compileIf}}"><view wx:if="{{i.c[5].c[0].compileIf}}"><text>{{i.c[5].c[0].c[0].c[0].v}}</text></view></view><view hover-class="{{xs.b(i.c[6].p1,\'none\')}}"></view><view><block wx:if="{{i.c[7].c[0].compileIf}}">{{i.c[7].c[0].c[0].v}}</block></view><view><block wx:if="{{i.c[8].c[0].compileIf}}">{{i.c[8].c[0].c[0].v}}</block></view><view><block wx:if="{{i.c[9].c[0].compileIf}}">{{i.c[9].c[0].c[0].v}}</block></view></view></template>';
function Index() {
    return <View compileMode="f0t0">
            {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
            {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
            {condition1 && "condition2" && condition3 ? <View hoverClass={myClass} compileIf={condition1 && "condition2" && condition3}>{content}</View> : <View/>}
            {condition1 ? 'Hello' : "compileIgnore"}
            {condition1 ? <View onClick={()=>condition2 && doSth()} compileIf={condition1}/> : <View/>}
            {condition1 && condition2 ? <View compileIf={condition1 && condition2}>
                    {condition3 && condition4 ? <View compileIf={condition3 && condition4}>
                            <Text>{myText}</Text>
                        </View> : <View/>}
                </View> : <View/>}
            <View hoverClass={myClass}></View>
            <View>{condition1 ? <block compileIf={condition1}>{ident}</block> : <block/>}</View>
            <View>{condition1 ? <block compileIf={condition1}>{obj.property}</block> : <block/>}</View>
            <View>{condition1 ? <block compileIf={condition1}>{fn()}</block> : <block/>}</View>
          </View>;
}
