const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view>{{i.c[0].v}}<view>{{i.c[1].c[0].v}}</view><view>hello</view><view>{{i.c[2].c[0].v}}</view><template is="{{xs.a(c, i.c[3].n, l)}}" data="{{i:i.c[3],c:c+1,l:xs.f(l,i.c[3].n)}}" /></view></template>';
function Index() {
    return <View compileMode="f0t0">

            {content0}

            <MyContext.Provider value={{
        name: 'ben'
    }}>

              <View>{content1}</View>

              

              <View>{content2}</View>

              <MyContext.Consumer>

                {(value)=><View>name: {value.name}</View>}

              </MyContext.Consumer>

            </MyContext.Provider>

          </View>;
}
