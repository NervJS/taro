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
    "#,
    r#"
    const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><image src="{{i.p3}}"></image></template>';
    const TARO_TEMPLATES_f0t1 = '<template name="tmpl_0_f0t1"><view><text>{{i.cn[0].cn[0].v}}</text></view></template>';
    function Index () {
        return <View>
            <Image src={mySrc} compileMode="f0t0" />
            <View compileMode="f0t1">
              <Text>{myText}</Text>
            </View>
          </View>
    }
    "#
);