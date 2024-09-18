const TARO_TEMPLATES_f0t0 = '<template name="tmpl_0_f0t0"><view><view><view><view>{{i.cn[0].cn[0].cn[0].cn[0].v}}</view></view><block><view wx:for="{{i.cn[0].cn[1].cn}}" wx:key="sid">{{item.cn[0].v}}</view></block></view><view><view>1</view><view hover-class="myClass" wx:for="{{i.cn[1].cn}}" wx:key="sid">{{item.cn[0].v}}</view><view>2<view hover-class="myClass"></view></view></view><view><view>1</view><block><view wx:for="{{i.cn[2].cn[0].cn}}" wx:key="sid">{{item.cn[0].v}}</view></block><view>2<view hover-class="myClass"></view></view><block><view wx:for="{{i.cn[2].cn[1].cn}}" wx:key="sid">{{item.cn[0].v}}</view></block></view></view></template>';
function Index() {
    return <View compileMode="f0t0">

            <View>

              <View><View>{content}</View></View>

              <block>{list.map((item)=><View>{item}</View>)}</block>

            </View>

            <View>

              

              {list.map((item)=><View>{item}</View>)}

              

            </View>

            <View>

              

              <block>{list.map((item)=><View>{item}</View>)}</block>

              

              <block>{list.map((item)=><View>{item}</View>)}</block>

            </View>

          </View>;
}
