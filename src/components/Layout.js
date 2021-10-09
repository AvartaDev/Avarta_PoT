import React from 'react';
import t from 'prop-types';
import styled from 'styled-components';
import {SafeAreaView, StatusBar} from 'react-native';
import useTheme from '@hooks/useTheme';
import {Header as Header_} from 'react-native-elements';
export const Header = props => {
  const {gutter, colors, height} = useTheme();

  return (
    <Header_
      {...props}
      containerStyle={[
        {
          backgroundColor: colors.primary_background,
          paddingHorizontal: gutter.SPACING,
          height: height.Header,
          paddingTop: 0,
        },
        props.containerStyle,
      ]}
    />
  );
};

export const BgView = ({children, style}) => {
  const {colors} = useTheme();
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors.primary_background, ...style}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {children}
    </SafeAreaView>
  );
};

BgView.propTypes = {
  children: t.node.isRequired,
};

export const Flex = styled.View``;

Flex.Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
