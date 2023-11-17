use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_and_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {condition && <View hoverClass={myClass}>{content}</View>}
            {condition && (
                <View hoverClass={myClass}>{content}</View>
            )}
            {condition1 && "condition2" && condition3 && <View hoverClass={myClass}>{content}</View>}
            {condition1 && 'Hello'}
            <View hoverClass={myClass}></View>
          </View>
        )
    }
    "#
    // r#"
    // const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}" wx:if="{{i.cn[0].compileIf}}">{{i.cn[0].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[1].p1,\'none\')}}" wx:if="{{i.cn[1].compileIf}}">{{i.cn[1].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[2].p1,\'none\')}}" wx:if="{{i.cn[2].compileIf}}">{{i.cn[2].cn[0].v}}</view>{{i.cn[3].v==="compileIgnore"?"":i.cn[3].v}}<view hover-class="{{xs.b(i.cn[4].p1,\'none\')}}"></view></view></template>';
    // function Index () {
    //     return <View compileMode="f0t0">
    //         {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
    //         {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <View/>}
    //         {condition1 && "condition2" && condition3 ? <View hoverClass={myClass} compileIf={condition1 && "condition2" && condition3}>{content}</View> : <View/>}
    //         {condition1 ? 'Hello' : "compileIgnore"}
    //         <View hoverClass={myClass}></View>
    //       </View>
    // }
    // "#
);
test!(
    get_syntax_config(),
    |_| tr(),
    should_support_conditional_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {condition ? <View hoverClass={myClass}>{content}</View> : <Text selectable>hello</Text>}
            {condition1 ? condition2 ? <View>{a}</View> : <Text>{b}</Text> : <View>{c}</View>}
            {condition1 ? <View>{a}</View> : condition2 ? <View>{b}</View> : <Text>{c}</Text>}
            {condition1 ? <View>{a}</View> : (condition2 ? <View>{b}</View> : <Text>{c}</Text>)}
            {condition1 ? condition2 && <View>{a}</View> : <View>{b}</View>}
            {condition1 ? <View>{a}</View> : condition2 && <View>{b}</View>}
            {condition1 ? "someText" : 789 }
            <View hoverClass={myClass}></View>
          </View>
        )
    }
    "#
    // r#"
    // const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}" wx:if="{{i.cn[0].compileIf}}">{{i.cn[0].cn[0].v}}</view><text selectable="true" wx:else>hello</text><block wx:if="{{i.cn[1].compileIf}}"><view wx:if="{{i.cn[1].cn[0].compileIf}}">{{i.cn[1].cn[0].cn[0].v}}</view><text wx:else>{{i.cn[1].cn[0].cn[0].v}}</text></block><view wx:else>{{i.cn[1].cn[0].v}}</view><view wx:if="{{i.cn[2].compileIf}}">{{i.cn[2].cn[0].v}}</view><block wx:else><view wx:if="{{i.cn[2].cn[0].compileIf}}">{{i.cn[2].cn[0].cn[0].v}}</view><text wx:else>{{i.cn[2].cn[0].cn[0].v}}</text></block><view wx:if="{{i.cn[3].compileIf}}">{{i.cn[3].cn[0].v}}</view><block wx:else><view wx:if="{{i.cn[3].cn[0].compileIf}}">{{i.cn[3].cn[0].cn[0].v}}</view><text wx:else>{{i.cn[3].cn[0].cn[0].v}}</text></block><block wx:if="{{i.cn[4].compileIf}}"><view wx:if="{{i.cn[4].cn[0].compileIf}}">{{i.cn[4].cn[0].cn[0].v}}</view></block><view wx:else>{{i.cn[4].cn[0].v}}</view><view wx:if="{{i.cn[5].compileIf}}">{{i.cn[5].cn[0].v}}</view><block wx:else><view wx:if="{{i.cn[5].cn[0].compileIf}}">{{i.cn[5].cn[0].cn[0].v}}</view></block><block wx:if="{{i.cn[6].compileIf}}">{{i.cn[6].cn[0].v}}</block><block wx:else>{{i.cn[6].cn[0].v}}</block><view hover-class="{{xs.b(i.cn[7].p1,\'none\')}}"></view></view></template>';
    // function Index () {
    //     return <View compileMode="f0t0">
    //         {condition ? <View hoverClass={myClass} compileIf={condition}>{content}</View> : <Text></Text>}
    //         {condition1 ? <block compileIf={condition1}>{condition2 ? <View compileIf={condition2}>{a}</View> : <Text>{b}</Text>}</block> : <View>{c}</View>}
    //         {condition1 ? <View compileIf={condition1}>{a}</View> : <block>{condition2 ? <View compileIf={condition2}>{b}</View> : <Text>{c}</Text>}</block>}
    //         {condition1 ? <View compileIf={condition1}>{a}</View> : <block>{condition2 ? <View compileIf={condition2}>{b}</View> : <Text>{c}</Text>}</block>}
    //         {condition1 ? <block compileIf={condition1}>{condition2 ? <View compileIf={condition2}>{a}</View> : <View/>}</block> : <View>{b}</View>}
    //         {condition1 ? <View compileIf={condition1}>{a}</View> : <block>{condition2 ? <View compileIf={condition2}>{b}</View> : <View/>}</block>}
    //         {condition1 ? <block compileIf={condition1}>{"someText"}</block> : <block>{789}</block> }
    //         <View hoverClass={myClass}></View>
    //       </View>
    // }
    // "#
);