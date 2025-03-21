const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><template is="{{xs.a(c, i.nn, l)}}" data="{{i:i,c:c+1,l:xs.f(l,i.nn)}}"  /></template>';
import { List as TaroList, ListItem as TaroListItem } from '@tarojs/components';
const list = [
    1,
    2,
    3
];
function Index() {
    return <scroll-view compileMode="f0t0" scrollY onScroll={()=>{
        console.log("scroll");
    }} style={{
        height: "100vh"
    }} type="custom"><list-builder onItemDispose={(ev)=>{
        console.log(`${ev.detail.index} disposed`);
    }} list={list} childCount={list.length} childHeight={100} type="static" className="list-builder">

            {list.map((x)=><view key={x} style={{
            height: 100
        }} slotItem="item" className="list-item">

                            <View>{x}</View>

                        </view>)}

          </list-builder></scroll-view>;
}
