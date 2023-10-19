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
            {this.state.condition && <View hoverClass={myClass}>{content}</View>}
            {this.state.condition && (
                <View hoverClass={myClass}>{content}</View>
            )}
            <View hoverClass={myClass}></View>
          </View>
        )
    }
    "#,
    r#"
    const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}" wx:if="{{i.cn[0].compileIf}}">{{i.cn[0].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[1].p1,\'none\')}}" wx:if="{{i.cn[1].compileIf}}">{{i.cn[1].cn[0].v}}</view><view hover-class="{{xs.b(i.cn[2].p1,\'none\')}}"></view></view></template>';
    function Index () {
        return <View compileMode="f0t0">
            {this.state.condition ? <View hoverClass={myClass} compileIf={this.state.condition}>{content}</View> : <View/>}
            {this.state.condition ? <View hoverClass={myClass} compileIf={this.state.condition}>{content}</View> : <View/>}
            <View hoverClass={myClass}></View>
          </View>
    }
    "#
);
test!(
    get_syntax_config(),
    |_| tr(),
    should_support_conditional_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {this.state.condition ? <View hoverClass={myClass}>{content}</View> : <View></View>}
            <View hoverClass={myClass}></View>
          </View>
        )
    }
    "#,
    r#"
    const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(i.cn[0].p1,\'none\')}}" wx:if="{{i.cn[0].compileIf}}">{{i.cn[0].cn[0].v}}</view><view wx:else></view><view hover-class="{{xs.b(i.cn[1].p1,\'none\')}}"></view></view></template>';
    function Index () {
        return <View compileMode="f0t0">
            {this.state.condition ? <View hoverClass={myClass} compileIf={this.state.condition}>{content}</View> : <View></View>}
            <View hoverClass={myClass}></View>
          </View>
    }
    "#
);