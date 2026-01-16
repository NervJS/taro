const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(item.p1,\'none\')}}" wx:for="{{i.cn}}" wx:key="sid"><text>index:</text><text>{{item.cn[0].cn[0].v}}</text><text>item:</text><text>{{item.cn[1].cn[0].v}}</text></view></view></template>';
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
