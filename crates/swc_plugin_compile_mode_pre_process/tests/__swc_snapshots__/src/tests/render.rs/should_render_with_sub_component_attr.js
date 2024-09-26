export default function Index() {
    function renderB() {
        return <View> ComponentB </View>;
    }
    function renderA() {
        return <View>

        <View>ComponentA</View>

        {renderB()}

       </View>;
    }
    return <View>

          <View compileMode>

            {<View>

        <View>ComponentA</View>

        {renderB()}

       </View>}

            {renderB()}

          </View>

        </View>;
}
