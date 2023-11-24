use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_render_fn,
    r#"
    function Index () {
        return (
          <View compileMode>
            <View>{renderHeader()}</View>
            <View>{this.methods.renderFooter()}</View>
            <View>{normalFunc()}</View>
          </View>
        )
    }
    "#
);
