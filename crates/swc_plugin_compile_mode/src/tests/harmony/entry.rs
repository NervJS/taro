use super::{get_syntax_config, tr};
use swc_core::ecma::transforms::testing::test;

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_single_compile_mode,
  r#"
  function Index () {
    return (
      <View compileMode></View>
    )
  }
  "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_component_not_in_config,
  r#"
  function Index () {
    return (
      <View compileMode>
        <View><Slider /></View>
        <View><Test1 /></View>
      </View>
    )
  }
  "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_compile_child_node,
  r#"
  function Index () {
    return (
      <View compileMode>
        <View />
        <View>
          <Image />
        </View>
      </View>
    )
  }
  "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_multi_compile_mode,
  r#"
  function Index () {
    return (
      <View>
        <Image src={mySrc} compileMode />
        <View compileMode>
          <Text>{myText}</Text>
        </View>
      </View>
    )
  }
  "#
);
