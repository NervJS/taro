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
       return <View compileModeSubComponent>
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
        return <View compileModeSubComponent> ComponentB </View>
      }
    
      function renderC () {
        return <View compileModeSubComponent>
          <View>ComponentC</View>
          {renderB()}
          {renderA()}
        </View>
      }

      function renderD () {
        return <View compileModeSubComponent>
          <View>ComponentD</View>
          {renderB()}
        </View>
      }

     function renderA () {
       return <View compileModeSubComponent>
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
        return <View compileModeSubComponent> 
        <View>ComponentB </View>
        {renderA()}
        </View>
      }
    
      function renderC () {
        return <View compileModeSubComponent>
          <View>ComponentC</View>
          {renderA()}
          {renderD()}
        </View>
      }

      function renderD () {
        return <View compileModeSubComponent>
          <View>ComponentD</View>
          {renderC()}
        </View>
      }

     function renderA () {
       return <View compileModeSubComponent>
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
