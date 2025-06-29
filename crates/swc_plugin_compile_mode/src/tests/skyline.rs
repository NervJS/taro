use super::{get_syntax_config, tr};
use swc_core::ecma::transforms::testing::test;

test!(
  get_syntax_config(),
  |_| tr(),
  should_support_list,
  r#"
    import { List as TaroList, ListItem as TaroListItem } from '@tarojs/components'
    const list = [1,2,3]
    function Index () {
        return (
          <TaroList 
            compileMode
            scrollY
            onScroll={() => {
                console.log("scroll");
            }}
            onItemDispose={(ev) => {
                console.log(`${ev.detail.index} disposed`);
            }}
            list={list}
            childCount={list.length}
            childHeight={100}
            style={{ height: "100vh" }}
            type="static"
          >
            {
                list.map(x => (
                        <TaroListItem key={x} style={{height: 100}}>
                            <View>{x}</View>
                        </TaroListItem>
                    )
                )
            }
          </TaroList>
        )
    }
    "#
);
