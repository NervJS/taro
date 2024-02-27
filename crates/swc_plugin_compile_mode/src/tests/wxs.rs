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
            <View>Name: {name}, Msg: {logic.getMsg(null, value1, 1, value2, 'sss', value3, true)}</View>
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
            <View className={myClass} hoverClass={logic.getHoverClass(null, value1, 1, value2, 'sss', value3, true)}>C</View>
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_wxs_work_in_multi_compile_mode,
    r#"
    function Index () {
        return (
          <View>
            <View compileMode>
                <Script src="./penny.wxs" module="penny"></Script>
                <View hoverClass={penny.hoverClass}>A1</View>
                <View hoverClass={magic.hoverClass}>A2</View>
            </View>
            <View compileMode>
                <Script src="../xmls/magic.wxs" module="magic"></Script>
                <View hoverClass={magic.hoverClass}>B1</View>
                <View hoverClass={penny.hoverClass}>B2</View>
            </View>
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_wxs_events,
    r#"
    function Index () {
        return (
            <View compileMode>
                <Script src="./john.wxs" module="john"></Script>
                <View onTouchStart={john.touchstart} onTouchMove={john.touchmove} onTouchEnd={john.touchend} />
                <View hoverClass={cls} onTouchMove={john.touchmove} />
            </View>
        )
    }
    "#
);
