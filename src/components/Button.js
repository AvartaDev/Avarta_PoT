import React from 'react';
import styled, {css} from 'styled-components/native';
import t from 'prop-types';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {colors} from '@libs/style_helpers';

const _Button = styled(TouchableOpacity)`
  width: 100%;
  border-radius: 30px;
  padding: 15px 30px;
  ${a =>
    a.small &&
    css`
      border-radius: 25px;
      padding: 5px 30px;
    `}
`;

const ButtonText = styled(Text)`
  font-size: 18px;
  letter-spacing: 2px;
  font-weight: 500;
`;

const disabled = ({disabled}) =>
  disabled
    ? css`
        opacity: 0.5;
      `
    : '';

const noShadow = ({shadow}) =>
  shadow === false
    ? css`
        box-shadow: none;
      `
    : '';

const StyledPrimaryButton = styled(_Button)`
  background-color: ${colors('basic')};
  border-color: rgb(63, 172, 157);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.23);
  flex-direction: row;
  justify-content: center;
  ${disabled}
  ${noShadow}
`;

export const Button = ({text, onPress, textColor, style, ...props}) => {
  return (
    <StyledPrimaryButton style={[style]} onPress={onPress} {...props}>
      <ButtonText
        style={{color: textColor ? textColor : 'white', textAlign: 'center'}}>
        {text}
      </ButtonText>
    </StyledPrimaryButton>
  );
};

export const SpinnerButton = ({
  loading,
  text,
  onPress,
  textColor,
  style,
  ...props
}) => {
  return (
    <StyledPrimaryButton style={[style]} onPress={onPress} {...props}>
      {loading && <ActivityIndicator color="white" animating={loading} />}
      <ButtonText
        style={{color: textColor ? textColor : 'white', textAlign: 'center'}}>
        {text}
      </ButtonText>
    </StyledPrimaryButton>
  );
};

Button.propTypes = {
  text: t.oneOfType([t.node, t.string]).isRequired,
  onClick: t.func,
};

Button.defaultProps = {
  styles: {
    buttonContainerStyle: {},
    buttonTextStyle: {},
  },
  buttonText: '',
  onClick: () => {},
};

const StyledWhiteButton = styled(_Button)`
  background-color: white;
  box-shadow: 0 6px 3px rgba(0, 0, 0, 0.23);
  border-width: 1px;
  border-color: ${colors('_3')};
  ${noShadow}
`;

export const WhiteButton = ({text, onPress, ...props}) => {
  return (
    <StyledWhiteButton onPress={onPress} {...props}>
      <ButtonText style={{textAlign: 'center'}}>{text}</ButtonText>
    </StyledWhiteButton>
  );
};

WhiteButton.propTypes = {
  onPress: t.func,
  text: t.string.isRequired,
};

const StyledGhostButton = styled(_Button)`
  box-shadow: none;
  border-width: 0;
`;

const GhostButton = ({text, onPress, textStyle, ...props}) => {
  return (
    <StyledGhostButton onPress={onPress} {...props}>
      <ButtonText
        style={{fontWeight: '100', textAlign: 'center', ...textStyle}}>
        {text}
      </ButtonText>
    </StyledGhostButton>
  );
};

Button.White = WhiteButton;
Button.Ghost = GhostButton;
Button.Cancel = styled(GhostButton).attrs({
  textStyle: {color: 'crimson'},
})``;
Button.Apply = styled(GhostButton).attrs({
  textStyle: {color: 'green'},
})``;

export default Button;
