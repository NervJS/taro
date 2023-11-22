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
  should_loop_with_arrow_function_with_blockstmt_and_set_parent_dynamic_id,
  r#"
  function Index () {
      return (
        <View compileMode>
          <View>
            {list.map(item => {
              return <View>{item}</View>
            })}
          </View>
        </View>
      )
  }
  "#
);
