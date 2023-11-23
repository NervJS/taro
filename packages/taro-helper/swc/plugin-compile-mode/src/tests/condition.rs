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
);
