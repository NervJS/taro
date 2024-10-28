use swc_core::ecma::transforms::testing::test;

use super::{get_syntax_config, tr};

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_default_export_fn,
  r#"
    export default function Index () {
      function renderA () {
        return <View compileMode="subRenderFn"> ComponentA </View>
      }
        
      return (
        <View compileMode>
            {renderA()}
        </View>
      )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_default_export_arrow_fn,
  r#"
  export default () => {
    function renderA () {
      return <View compileMode="subRenderFn"> ComponentA </View>
    }
      
    return (
      <View compileMode>
          {renderA()}
      </View>
    )
  }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_export_arrow_fn,
  r#"
    export const ComponentA = () => {
      function renderA () {
        return <View compileMode="subRenderFn"> ComponentA </View>
      }
        
      return (
        <View compileMode>
            {renderA()}
        </View>
      )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_export_fn,
  r#"
    export function ComponentA () {
      function renderA () {
        return <View compileMode="subRenderFn"> ComponentA </View>
      }
        
      return (
        <View compileMode>
            {renderA()}
        </View>
      )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_fn,
  r#"
    function ComponentA () {
      function renderA () {
        return <View compileMode="subRenderFn"> ComponentA </View>
      }
        
      return (
        <View compileMode>
            {renderA()}
        </View>
      )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_arrow_fn,
  r#"
    const ComponentA = () => {
      function renderA () {
        return <View compileMode="subRenderFn"> ComponentA </View>
      }
        
      return (
        <View compileMode>
            {renderA()}
        </View>
      )
    }
    "#
);
