use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_with_function_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(function(item, index) {
              return (
                <View hoverClass={myClass}>
                  <Text>index:</Text>
                  <Text>{index}</Text>
                  <Text>item:</Text>
                  <Text>{item}</Text>
                </View>
              )
            })}
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_with_arrow_function_with_blockstmt,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(item => {
              return <View>{item}</View>
            })}
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_with_arrow_function_with_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(item => <View>{item}</View>)}
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_nested_loop,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(function(item, index) {
              return (
                <View hoverClass={myClass} key={index}>
                  <View>title: {item}</View>
                  <View>
                    {sublist.map(function(c) {
                      return <Text selectable={isSelectable}>content: {c}</Text>
                    })}
                  </View>
                </View>
              )
            })}
          </View>
        )
    }
    "#
);


test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_with_fragment,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(item => (
                <>
                    <View>title: {item.title}</View>
                    <View>content: {item.content}</View>
                </>
            ))}
          </View>
        )
    }
    "#
);


test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_be_wrapped_when_its_not_the_only_child,
    r#"
    function Index () {
        return (
          <View compileMode>
            <View>
              <View><View>{content}</View></View>
              {list.map(item => <View>{item}</View>)}
            </View>
            <View>
              <View>1</View>
              {list.map(item => <View hoverClass="myClass">{item}</View>)}
              <View>2<View hoverClass="myClass"></View></View>
            </View>
            <View>
              <View>1</View>
              {list.map(item => <View>{item}</View>)}
              <View>2<View hoverClass="myClass"></View></View>
              {list.map(item => <View>{item}</View>)}
            </View>
          </View>
        )
    }
    "#
);
