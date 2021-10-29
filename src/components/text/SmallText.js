//rename this later pls thx
import React from 'react';
import useTheme from "@hooks/useTheme";
import { Text } from "react-native-elements";


const SmallText = (params) => {
  const { colors, gutter } = useTheme();

  const smallTextStyle = {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  }
  return <Text style={smallTextStyle}>{params.text}</Text>
}

export default SmallText