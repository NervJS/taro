const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(item.p1,\'none\')}}" wx:for="{{i.c}}" wx:key="s"><text>index:</text><text>{{item.c[0].c[0].v}}</text><text>item:</text><text>{{item.c[1].c[0].v}}</text></view></view></template>';
function Index() {
    return <View compileMode="f0t0">

            {list.map(function(item, index) {
        return <View hoverClass={myClass}>

                  

                  <Text>{index}</Text>

                  

                  <Text>{item}</Text>

                </View>;
    })}

          </View>;
}
