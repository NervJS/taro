const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view bindtap="eh" data-sid="{{i.cn[0].sid}}" id="{{i.cn[0].sid}}"></view><view bindanimationstart="eh" data-sid="{{i.cn[1].sid}}" id="{{i.cn[1].uid}}"></view><image bindload="eh" data-sid="{{i.cn[2].sid}}" id="myImg"></image></view></template>';
function Index() {
    return <View compileMode="f0t0">
            <View onClick={handleViewClick}></View>
            <View onAnimationStart={() => {}} id={myId}></View>
            <Image onLoad={() => {}} />
          </View>
}
