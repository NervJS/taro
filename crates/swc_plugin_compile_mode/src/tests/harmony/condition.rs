use super::{get_syntax_config, tr};
use swc_core::ecma::transforms::testing::test;

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

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_conditional_and_unkonw_component,
  r#"
  function Index () {
      return (
        <View compileMode>
          {condition ? <View hoverClass='test'>hello</View> : <UnKnow selectable>hello</UnKnow>}
        </View>
      )
  }
  "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_complex_condition,
  r#"
  function Index () {
      return (
        <View compileMode>
          {condition1 && <View onClick={() => condition2 && doSth()} />}
          <View>{condition1 && ident}</View>
          <View>{condition1 && obj.property}</View>
          <View>{condition1 && fn()}</View>
          {condition1 ? <View className={condition2 ? '' : ''} /> : <View/>}
          {condition1 ? <View>{condition2 ? <View/> : <View/>}</View> : <View/>}
        </View>
      )
  }
  "#
);
