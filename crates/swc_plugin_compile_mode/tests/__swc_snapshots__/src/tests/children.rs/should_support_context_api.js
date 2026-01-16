const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view>{{i.cn[0].v}}<view>{{i.cn[1].cn[0].v}}</view><view>hello</view><view>{{i.cn[2].cn[0].v}}</view><template is="{{xs.a(c, i.cn[3].nn, l)}}" data="{{i:i.cn[3],c:c+1,l:xs.f(l,i.cn[3].nn)}}" /></view></template>';
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
