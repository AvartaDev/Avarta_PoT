//rename this later pls thx
import React from 'react';
import useTheme from "@hooks/useTheme";
import { Text } from "react-native-elements";


const BigText = (params) => {
  const { colors, gutter } = useTheme();

  const bigTextStyle = {
    color: colors.white,
    textAlign: 'center',
    marginTop: gutter.lg,
    fontWeight: 'bold',
    fontSize: 26,
  }
  return <Text style={bigTextStyle}>{params.text}</Text>
}

export default BigText