use swc_core::ecma::transforms::testing::test;

use super::{get_syntax_config, tr};

test!(
    get_syntax_config(),
    |_| tr(),
    should_do_nothing,
    r#"
    const a = () =>{
      const b = ()=>{
        const c = ()=>{}
      }
    }
    function Index () {
        return (
          <View>
            <Image src={mySrc} />
            <View>
              <Text>{myText}</Text>
            </View>
          </View>
        )
      }
    "#
);
