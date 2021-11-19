import React from 'react';
import styled, {css} from 'styled-components/native';
import {responsive, colors} from '@libs/style_helpers';
import {
  TextInput as TextInput_,
  View,
  Text,
  Picker as Picker_,
} from 'react-native';
import useTheme from '../hooks/useTheme';

const StyledInput = styled(TextInput_)`
  border-width: 0.5px;
  border-color: ${colors('white')};
  margin-bottom: 15px;
  border-radius: 7px;
  background-color: ${colors('white')};
  font-size: ${responsive([12, 16])}px;
  padding: ${responsive([15, 18])}px ${responsive([15, 15])}px;
  color: #000;
`;

StyledInput.defaultProps = {
  editable: true,
};

export const TextInput = props => {
  return (
    <StyledInput
      autoCapitalize="none"
      backgroundColor="#f3f3f3"
      marginTop="1%"
      placeholderTextColor="#000"
      {...props}
    />
  );
};

export const LabelInput = ({label, ...props}) => {
  const {colors} = useTheme();
  return (
    <View>
      <Text
        style={{
          marginBottom: 5,
          fontSize: 14,
          color: colors.white,
          textTransform: 'capitalize',
        }}>
        {label}
      </Text>
      <TextInput {...props} />
    </View>
  );
};
