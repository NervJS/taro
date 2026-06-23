const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><image src="{{i.p3}}"></image></template>';
const TARO_TEMPLATES_f0t1 = '<template name="tmpl_0_f0t1"><view><text>{{i.cn[0].cn[0].v}}</text></view></template>';
function Index() {
    return <View>
            <Image src={mySrc} compileMode="f0t0" />
            <View compileMode="f0t1">
              <Text>{myText}</Text>
            </View>
          </View>;
}
