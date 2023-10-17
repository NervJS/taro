use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_static_jsx_being_shaked,
    r#"
    function Index () {
        return (
          <View compileMode>
            <Text>Hello World!</Text>
            <Text>Hello{T1}World{T2}!</Text>
            <View>
                <Text></Text>
            </View>
            <View style="color: red" hoverStopPropagation>
                <Text>Hello World!</Text>
            </View>
            <View style={myStyle}>
                <Text>Hello World!</Text>
            </View>
          </View>
        )
    }
    "#,
    r#"
    const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><text>Hello World!</text><text>Hello{{i.cn[0].cn[0].v}}World{{i.cn[0].cn[1].v}}!</text><view><text></text></view><view hover-stop-propagation="true" style="color: red"><text>Hello World!</text></view><view style="{{i.cn[1].st}}"><text>Hello World!</text></view></view></template>';
    function Index () {
        return <View compileMode="f0t0">
            
            <Text>{T1}{T2}</Text>
            
            
            <View style={myStyle}>
                
            </View>
          </View>
    }
    "#
);