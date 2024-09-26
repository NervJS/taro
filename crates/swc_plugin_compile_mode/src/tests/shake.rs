use super::{get_syntax_config, tr};
use swc_core::ecma::transforms::testing::test;

test!(
  get_syntax_config(),
  |_| tr(),
  should_static_jsx_being_shaked,
  r#"
    function Index () {
        return (
          <View compileMode>
            <Text>Hello World!</Text>
            <Text>Hello{T1}World{T2}!</Text>
            <View>
                <Text></Text>
            </View>
            <View style="color: red" hoverStopPropagation>
                <Text>Hello World!</Text>
            </View>
            <View style={myStyle}>
                <Text>Hello World!</Text>
            </View>
          </View>
        )
    }
    "#
);
