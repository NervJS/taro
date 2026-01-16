const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><template is="{{xs.a(c, i.cn[0].nn, l)}}" data="{{i:i.cn[0],c:c+1,l:xs.f(l,i.cn[0].nn)}}" /><template is="{{xs.a(c, i.cn[1].nn, l)}}" data="{{i:i.cn[1],c:c+1,l:xs.f(l,i.cn[1].nn)}}" /></view></template>'
function Index() {
    return <View compileMode="f0t0">
            <comp />
            <comp type="primary" loading loading-text={loadingText} onMyevent={() => {}} />
          </View>;
}
