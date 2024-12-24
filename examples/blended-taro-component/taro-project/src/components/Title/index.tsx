import { View, Text } from "@tarojs/components";
import React from "react";

// src/Component.js
const Index = ({title}) => {
  return (
      <View>
        <Text className='title'>{title}</Text>
      </View>
  );
};

export default Index;