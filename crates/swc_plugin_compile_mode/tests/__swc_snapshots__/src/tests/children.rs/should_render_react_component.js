const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><template is="{{xs.a(c, i.c[0].n, l)}}" data="{{i:i.c[0],c:c+1,l:xs.f(l,i.c[0].n)}}" /><template is="{{xs.a(c, i.c[1].n, l)}}" data="{{i:i.c[1],c:c+1,l:xs.f(l,i.c[1].n)}}" /><template is="{{xs.a(c, i.c[2].n, l)}}" data="{{i:i.c[2],c:c+1,l:xs.f(l,i.c[2].n)}}" /></view></template>'
function Index() {
    return <View compileMode="f0t0">
            <Foo/>
            <Foo title={myTitle} loading onClick={()=>{}}/>
            <UI.Title/>
          </View>;
}
