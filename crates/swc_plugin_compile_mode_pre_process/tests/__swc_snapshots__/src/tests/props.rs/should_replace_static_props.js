export default function Index() {
    const list = [
        1,
        2,
        3
    ];
    function renderA(listA) {
        return <View> {listA.map((item, index)=>{
            return <View key={index}> {item} </View>;
        })} </View>;
    }
    return <View compileMode>

            {<View> {list.map((item, index)=>{
        return <View key={index}> {item} </View>;
    })} </View>}

        </View>;
}
