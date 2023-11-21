use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

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
  should_tag_dynmaic_id_if_node_is_not_static,
  r#"
  function Index () {
    return (
      <View compileMode>
        <View />
        <View className="test">
          <Image alt="占位符" src={src} />
        </View>
        <View>{aa && <View />}</View>
        <View>{aa ? <View /> : <Image src={src} />}</View>
        <View>{list.map(item => <View key={item.key} />)}</View>
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
