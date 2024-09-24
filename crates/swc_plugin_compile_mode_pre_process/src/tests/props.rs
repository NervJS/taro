use swc_core::ecma::transforms::testing::test;

use super::{get_syntax_config, tr};

test!(
  get_syntax_config(),
  |_| tr(),
  should_replace_static_props,
  r#"
    export default function Index () {
      const list = [1, 2, 3];
      function renderA (listA) {
        return <View compileMode="subRenderFn"> {
            listA.map((item, index) => {
                return <View key={index}> {item} </View>
            })
        } </View>
      }
        
      return (
        <View compileMode>
            {renderA(list)}
        </View>
      )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_not_replace_dynamic_props,
  r#"
    export default function Index () {
      const list = [1, 2, 3];
      function renderA (listA) {
        return <View compileMode="subRenderFn"> {
            listA.map((item, index) => {
                return <View key={index}> {item} </View>
            })
        } </View>
      }
        
      return (
        <View compileMode>
            {renderA(list.map(item => item + 1))}
        </View>
      )
    }
    "#
);
