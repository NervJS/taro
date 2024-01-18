use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_wxs_children,
    r#"
    function Index () {
        return (
          <View compileMode>
            <Script src="./logic.wxs" module="logic"></Script>
            <View>AA{logic.msg}BB</View>
            <View>{value}AA{logic.getMsg()}BB</View>
            <View>Name: {name}, Msg: {logic.getMsg(value1, 1, value2, 'sss', value3, true)}</View>
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_wxs_attributes,
    r#"
    function Index () {
        return (
          <View compileMode>
            <Script src="./logic.wxs" module="logic"></Script>
            <View hoverClass={logic.hoverClass}>A</View>
            <View hoverClass={logic.getHoverClass()}>B</View>
            <View className={myClass} hoverClass={logic.getHoverClass(value1, 1, value2, 'sss', value3, true)}>C</View>
          </View>
        )
    }
    "#
);
