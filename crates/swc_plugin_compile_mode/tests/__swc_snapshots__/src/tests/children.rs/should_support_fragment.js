const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view>{{i.c[0].v}}<view>{{i.c[1].c[0].v}}</view><view>hello</view><view><view>{{i.c[2].c[0].c[0].v}}</view><view>hello!</view></view><view>{{i.c[3].c[0].v}}</view><view>{{i.c[4].c[0].v}}</view><view>{{i.c[5].c[0].v}}</view><view>hello!!</view><view>hello!!!</view><view>{{i.c[6].c[0].v}}</view></view></template>';
function Index() {
    return <View compileMode="f0t0">

            {content0}

            <>

              <View>{content1}</View>

              

              <View>

                <>

                  <View>{content2}</View>

                  

                </>

              </View>

              <View>{content3}</View>

            </>

            <View>{content4}</View>

            <>

              <View>{content5}</View>

            </>

            

            

            <View>{content6}</View>

          </View>;
}
