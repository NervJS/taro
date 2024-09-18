use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

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
