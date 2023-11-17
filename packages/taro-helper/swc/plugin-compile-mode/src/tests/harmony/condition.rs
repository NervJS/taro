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