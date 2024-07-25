const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><template is="{{xs.a(c, i.c[0].n, l)}}" data="{{i:i.c[0],c:c+1,l:xs.f(l,i.c[0].n)}}" /><template is="{{xs.a(c, i.c[1].n, l)}}" data="{{i:i.c[1],c:c+1,l:xs.f(l,i.c[1].n)}}" /></view></template>'
function Index() {
    return <View compileMode="f0t0">
            <comp />
            <comp type="primary" loading loading-text={loadingText} onMyevent={() => {}} />
          </View>;
}
