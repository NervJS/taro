use swc_core::ecma::transforms::testing::test;
use super::{tr, get_syntax_config};

test!(
    get_syntax_config(),
    |_| tr(),
    should_support_and_expr,
    r#"
    function Index () {
        return (
          <View compileMode>
            {condition && <View hoverClass={myClass}>{content}</View>}
            {condition && (
                <View hoverClass={myClass}>{content}</View>
            )}
            {condition1 && "condition2" && condition3 && <View hoverClass={myClass}>{content}</View>}
            {condition1 && 'Hello'}
            {condition1 && <View onClick={() => condition2 && doSth()} />}
            {condition1 && condition2 && (
                <View>
                    {condition3 && condition4 && (
                        <View>
                            <Text>{myText}</Text>
                        </View>
                    )}
                </View>
            )}
            <View hoverClass={myClass}></View>
            <View>{condition1 && ident}</View>
            <View>{condition1 && obj.property}</View>
            <View>{condition1 && fn()}</View>
          </View>
        )
    }
    "#
);
test!(
    get_syntax_config(),
    |_| tr(),
    should_support_conditional_expr,
    r#"
    function Index () {
        const [list, setList] = useState([
            1,
            2,
            3,
            4,
            5
        ]);
        return <View compileMode>
        <View>
         {
          <View>
            {
              list.map((item) => {
                return <View>
                  <Text>hello world{item}</Text>
                </View>
              })
            }
            <Text>hello world</Text>
          </View>
        }
          </View>
          </View>;
    }
    "#
);
