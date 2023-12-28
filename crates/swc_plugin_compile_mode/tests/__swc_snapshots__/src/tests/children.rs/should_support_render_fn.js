const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view><template is="{{xs.a(c, i.cn[0].cn[0].nn, l)}}" data="{{i:i.cn[0].cn[0],c:c+1,l:xs.f(l,i.cn[0].cn[0].nn)}}" /></view><view><template is="{{xs.a(c, i.cn[1].cn[0].nn, l)}}" data="{{i:i.cn[1].cn[0],c:c+1,l:xs.f(l,i.cn[1].cn[0].nn)}}" /></view><view>{{i.cn[2].cn[0].v}}</view></view></template>';
function Index() {
    return <View compileMode="f0t0">
            <View>{renderHeader()}</View>
            <View>{this.methods.renderFooter()}</View>
            <View>{normalFunc()}</View>
          </View>;
}
