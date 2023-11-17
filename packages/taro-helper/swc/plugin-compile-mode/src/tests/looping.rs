use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_with_function_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(function(item, index) {
              return (
                <View hoverClass={myClass}>
                  <Text>index:</Text>
                  <Text>{index}</Text>
                  <Text>item:</Text>
                  <Text>{item}</Text>
                </View>
              )
            })}
          </View>
        )
    }
    "#
    // r#"
    // const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(item.p1,\'none\')}}" wx:for="{{i.cn}}" wx:key="sid"><text>index:</text><text>{{item.cn[0].cn[0].v}}</text><text>item:</text><text>{{item.cn[1].cn[0].v}}</text></view></view></template>';
    // function Index () {
    //     return <View compileMode="f0t0">
    //         {list.map(function(item, index) {
    //           return <View hoverClass={myClass}>
                  
    //               <Text>{index}</Text>
                  
    //               <Text>{item}</Text>
    //             </View>
    //         })}
    //       </View>
    // }
    // "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_with_arrow_function_with_blockstmt,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(item => {
              return <View>{item}</View>
            })}
          </View>
        )
    }
    "#
    // r#"
    // const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view wx:for="{{i.cn}}" wx:key="sid">{{item.cn[0].v}}</view></view></template>';
    // function Index () {
    //     return <View compileMode="f0t0">
    //         {list.map(item => {
    //           return <View>{item}</View>
    //         })}
    //       </View>
    // }
    // "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_loop_with_arrow_function_with_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(item => <View>{item}</View>)}
          </View>
        )
    }
    "#
    // r#"
    // const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view wx:for="{{i.cn}}" wx:key="sid">{{item.cn[0].v}}</view></view></template>';
    // function Index () {
    //     return <View compileMode="f0t0">
    //         {list.map(item => <View>{item}</View>)}
    //       </View>
    // }
    // "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_nested_loop,
    r#"
    function Index () {
        return (
          <View compileMode>
            {list.map(function(item, index) {
              return (
                <View hoverClass={myClass} key={index}>
                  <View>title: {item}</View>
                  <View>
                    {sublist.map(function(c) {
                      return <Text selectable={isSelectable}>content: {c}</Text>
                    })}
                  </View>
                </View>
              )
            })}
          </View>
        )
    }
    "#
    // r#"
    // const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(item.p1,\'none\')}}" wx:for="{{i.cn}}" wx:key="sid"><view>title: {{item.cn[0].cn[0].v}}</view><view><text selectable="{{xs.b(item.p1,!1)}}" wx:for="{{item.cn[1].cn}}" wx:key="sid">content: {{item.cn[0].v}}</text></view></view></view></template>';
    // function Index () {
    //     return <View compileMode="f0t0">
    //         {list.map(function(item, index) {
    //           return <View hoverClass={myClass} key={index}>
    //               <View>{item}</View>
    //               <View>
    //                 {sublist.map(function(c) {
    //                   return <Text selectable={isSelectable}>{c}</Text>
    //                 })}
    //               </View>
    //             </View>
    //         })}
    //       </View>
    // }
    // "#
);