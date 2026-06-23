const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view>{{i.cn[0].v}}<view>{{i.cn[1].cn[0].v}}</view><view>hello</view><view><view>{{i.cn[2].cn[0].cn[0].v}}</view><view>hello!</view></view><view>{{i.cn[3].cn[0].v}}</view><view>{{i.cn[4].cn[0].v}}</view><view>{{i.cn[5].cn[0].v}}</view><view>hello!!</view><view>hello!!!</view><view>{{i.cn[6].cn[0].v}}</view></view></template>';
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
