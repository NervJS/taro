const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view wx:for="{{i.c}}" wx:key="s">{{item.c[0].v}}</view></view></template>';
function Index () {
    return <View compileMode="f0t0">
            {list.map(item => <View>{item}</View>)}
          </View>;
}
