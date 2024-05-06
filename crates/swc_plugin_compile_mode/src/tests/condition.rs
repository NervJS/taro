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
            {condition1 && <View onClick={() => condition2 && doSth()} />}
            {condition1 && condition2 && (
                <View>
                    {condition3 && condition4 && (
                        <View>
                            <Text>{myText}</Text>
                        </View>
                    )}
                </View>
            )}
            <View hoverClass={myClass}></View>
            <View>{condition1 && ident}</View>
            <View>{condition1 && obj.property}</View>
            <View>{condition1 && fn()}</View>
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
            {condition1 ? "someText" : 789}
            {condition1 ? <View className={condition2 ? '' : ''} /> : <View/>}
            {condition1 ? <View>{condition2 ? <View/> : <View/>}</View> : <View/>}
            <View hoverClass={myClass}></View>
          </View>
        )
    }
    "#
);
