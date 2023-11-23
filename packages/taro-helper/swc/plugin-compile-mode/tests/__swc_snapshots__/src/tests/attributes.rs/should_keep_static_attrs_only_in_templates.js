const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><image class="my_img" lazy-load="true" src="https://taro.com/x.png"></image></view></template>';
function Index() {
    return <View compileMode="f0t0">

            <Image key="image" ref={myRefCb}/>

          </View>;
}
