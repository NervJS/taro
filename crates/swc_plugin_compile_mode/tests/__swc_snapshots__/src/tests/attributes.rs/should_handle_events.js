const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view bindtap="eh" data-s="{{i.c[0].s}}" id="{{i.c[0].s}}"></view><view bindanimationstart="eh" data-s="{{i.c[1].s}}" id="{{i.c[1].uid}}"></view><image bindload="eh" data-s="{{i.c[2].s}}" id="myImg"></image></view></template>';
function Index() {
    return <View compileMode="f0t0">
            <View onClick={handleViewClick}></View>
            <View onAnimationStart={() => {}} id={myId}></View>
            <Image onLoad={() => {}} />
          </View>
}
