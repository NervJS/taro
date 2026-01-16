const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><block wx:for="{{i.cn}}" wx:key="sid"><view>title: {{item.cn[0].cn[0].v}}</view><view>content: {{item.cn[1].cn[0].v}}</view></block></view></template>';
function Index() {
    return <View compileMode="f0t0">
            {list.map((item) => <block>
                    <View>{item.title}</View>
                    <View>{item.content}</View>
                </block>)}
          </View>;
}
