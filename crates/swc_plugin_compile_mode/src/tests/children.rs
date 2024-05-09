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

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_fragment,
    r#"
    function Index () {
        return (
          <View compileMode>
            {content0}
            <>
              <View>{content1}</View>
              <View>hello</View>
              <View>
                <>
                  <View>{content2}</View>
                  <View>hello!</View>
                </>
              </View>
              <View>{content3}</View>
            </>
            <View>{content4}</View>
            <>
              <View>{content5}</View>
            </>
            <>
              <View>hello!!</View>
            </>
            <View>hello!!!</View>
            <View>{content6}</View>
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_context_api,
    r#"
    function Index () {
        return (
          <View compileMode>
            {content0}
            <MyContext.Provider value={{name:'ben'}}>
              <View>{content1}</View>
              <View>hello</View>
              <View>{content2}</View>
              <MyContext.Consumer>
                {value => <View>name: {value.name}</View>}
              </MyContext.Consumer>
            </MyContext.Provider>
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_render_react_component,
    r#"
    function Index () {
        return (
          <View compileMode>
            <Foo />
            <Foo title={myTitle} loading onClick={() => {}} />
            <UI.Title />
          </View>
        )
    }
    "#
);

test!(
    get_syntax_config(),
    |_| tr(),
    should_render_native_component,
    r#"
    function Index () {
        return (
          <View compileMode>
            <comp />
            <comp type="primary" loading loading-text={loadingText} onMyevent={() => {}} />
          </View>
        )
    }
    "#
);
