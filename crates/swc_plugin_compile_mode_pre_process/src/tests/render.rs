use swc_core::ecma::transforms::testing::test;

use super::{get_syntax_config, tr};

test!(
  get_syntax_config(),
  |_| tr(),
  should_render_with_sub_component_attr,
  r#"
    export default function Index () {
      function renderB () {
        return <View> ComponentB </View>
      }
    
     function renderA () {
       return <View compileMode="subRenderFn">
        <View>ComponentA</View>
        {renderB()}
       </View>
      }
    
      return (
        <View>
          <View compileMode>
            {renderA()}
            {renderB()}
          </View>
        </View>
      )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_render_with_recursion,
  r#"
    export default function Index () {
      function renderB () {
        return <View compileMode="subRenderFn"> ComponentB </View>
      }
    
      function renderC () {
        return <View compileMode="subRenderFn">
          <View>ComponentC</View>
          {renderB()}
          {renderA()}
        </View>
      }

      function renderD () {
        return <View compileMode="subRenderFn">
          <View>ComponentD</View>
          {renderB()}
        </View>
      }

     function renderA () {
       return <View compileMode="subRenderFn">
        <View>ComponentA</View>
        {renderB()}
       </View>
      }
    
      return (
        <View>
          <View compileMode>
            {renderA()}
            {renderB()}
            {renderC()}
            {renderD()}
          </View>
        </View>
      )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_not_render_with_circle_recursion,
  r#"
    export default function Index () {
      function renderB () {
        return <View compileMode="subRenderFn"> 
        <View>ComponentB </View>
        {renderA()}
        </View>
      }
    
      function renderC () {
        return <View compileMode="subRenderFn">
          <View>ComponentC</View>
          {renderA()}
        </View>
      }

      function renderD () {
        return <View compileMode="subRenderFn">
          <View>ComponentD</View>
          {renderC()}
        </View>
      }

     function renderA () {
       return <View compileMode="subRenderFn">
        <View>ComponentA</View>
        {renderB()}
       </View>
      }
    
      return (
        <View>
          <View compileMode>
            {renderA()}
            {renderB()}
            {renderC()}
            {renderD()}
          </View>
        </View>
      )
    }
    "#
);
