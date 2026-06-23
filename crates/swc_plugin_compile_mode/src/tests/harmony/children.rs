use super::{get_syntax_config, tr};
use swc_core::ecma::transforms::testing::test;

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_render_fn,
  r#"
    function Index () {
        return (
          <View compileMode>
            <View>{renderHeader()}</View>
            <View>
              {renderHeader()}
              {normalFunc()}
            </View>
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
  should_render_react_component,
  r#"
    function Index () {
        return (
          <View compileMode>
            <Foo />
            <Foo title={myTitle} loading onClick={() => {}} />
          </View>
        )
    }
    "#
);

test!(
  get_syntax_config(),
  |_| tr(),
  should_render_complex_children,
  r#"
  function Index () {
    return (
      <View className="goods" compileMode>
        {showModal &&
          <View className={`regds ${isShow ? 'regds-qsl-anm' : ''} ${item.backurl ? 'regds-bg' : ''}`} onClick={goToDetail} style={{ backgroundImage: item.backurl ? `url(${item.backurl})` : `linear-gradient(to right, #fff, #fff), linear-gradient(225deg, rgba(${item.rgbvalue2},.28), rgba(${item.rgbvalue1},.28))` }}>
            <View className="regds-pimg">
              <Image style={{ zIndex: (item.mainurl ? !isPlay : true) ? 1 : 0 }} className={`regds-img ${dynamicPlay ? 'dynamic' : ''}`} src={imgbase_sku} />
              {haveIcon && <Image className="regds-img-icon" src={iconList.imgIcon.url1} style={{ width: `${iconList.imgIcon.width}rpx`, height: `${iconList.imgIcon.height}rpx` }} />}
            </View>
          </View>
        }
      </View>
    )
  }
  "#
);
