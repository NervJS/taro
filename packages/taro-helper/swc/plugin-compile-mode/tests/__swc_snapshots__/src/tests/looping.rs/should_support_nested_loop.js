const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view hover-class="{{xs.b(item.p1,\'none\')}}" wx:for="{{i.cn}}" wx:key="sid"><view>title: {{item.cn[0].cn[0].v}}</view><view><text selectable="{{xs.b(item.p1,!1)}}" wx:for="{{item.cn[1].cn}}" wx:key="sid">content: {{item.cn[0].v}}</text></view></view></view></template>';
function Index() {
    return <View compileMode="f0t0">
            {list.map(function(item, index) {
              return <View hoverClass={myClass} key={index}>
                  <View>{item}</View>
                  <View>
                    {sublist.map(function(c) {
                      return <Text selectable={isSelectable}>{c}</Text>
                    })}
                  </View>
                </View>
            })}
          </View>;
}
